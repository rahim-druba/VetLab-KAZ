/**
 * Netlify serverless function: same behavior as Vite dev server /api/chat.
 * Prefers Groq (free); falls back to Gemini (required when tools/function calling are used).
 * Set GROQ_API_KEY and/or VITE_API_KEY (or GEMINI_API_KEY) in Netlify env.
 */

const GROQ_CHAT_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

function toGroqMessages(
  contents: { role: string; parts?: { text?: string }[] }[],
  systemInstruction?: string
): { role: string; content: string }[] {
  const out: { role: string; content: string }[] = [];
  if (systemInstruction && typeof systemInstruction === 'string') {
    out.push({ role: 'system', content: systemInstruction });
  }
  for (const c of contents || []) {
    const textPart = c.parts?.find((p) => p != null && typeof (p as { text?: string }).text === 'string');
    const text = textPart ? (textPart as { text: string }).text : '';
    if (!text) continue;
    const role = c.role === 'model' ? 'assistant' : c.role;
    if (role === 'user' || role === 'assistant') out.push({ role, content: text });
  }
  return out;
}

export interface NetlifyEvent {
  httpMethod: string;
  path: string;
  body: string | null;
  headers: Record<string, string | undefined>;
}

export interface NetlifyContext {
  [key: string]: unknown;
}

export async function handler(
  event: NetlifyEvent,
  _context: NetlifyContext
): Promise<{ statusCode: number; headers: Record<string, string>; body: string }> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const send = (statusCode: number, data: Record<string, unknown>) => ({
    statusCode,
    headers,
    body: JSON.stringify(data),
  });

  let parsed: { contents?: unknown[]; config?: { systemInstruction?: string; temperature?: number }; model?: string; tools?: unknown; toolConfig?: unknown };
  try {
    parsed = JSON.parse(event.body || '{}');
  } catch {
    return send(400, { error: 'Invalid JSON body' });
  }

  const { contents = [], config, model, tools, toolConfig } = parsed;
  const groqKey = process.env.GROQ_API_KEY;
  const geminiKey = process.env.VITE_API_KEY || process.env.GEMINI_API_KEY;

  const needsGemini = tools != null || toolConfig != null;

  if (geminiKey && (needsGemini || !groqKey)) {
    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: geminiKey });
      const fullConfig = { ...(config || {}), ...(tools != null && { tools }), ...(toolConfig != null && { toolConfig }) };
      const response = await ai.models.generateContent({
        model: model || 'gemini-2.5-flash',
        contents: Array.isArray(contents) ? contents : [],
        config: fullConfig,
      });
      const text = response.text ?? '';
      const functionCalls = response.functionCalls;
      return send(200, { text, functionCalls: functionCalls ?? undefined });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const is429 = /429|RESOURCE_EXHAUSTED|quota exceeded|rate limit/i.test(msg);
      return send(500, { error: is429 ? 'Rate limit reached. Please wait a minute and try again.' : msg });
    }
  }

  if (groqKey && !needsGemini) {
    const messages = toGroqMessages(Array.isArray(contents) ? contents : [], config?.systemInstruction);
    if (messages.length === 0) {
      return send(400, { error: 'No valid messages. Send at least one user message.' });
    }
    try {
      const groqRes = await fetch(GROQ_CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${groqKey}` },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages,
          temperature: typeof config?.temperature === 'number' ? config.temperature : 0.5,
        }),
      });
      const groqData = (await groqRes.json()) as {
        choices?: { message?: { content?: string } }[];
        error?: { message?: string };
      };
      if (groqRes.status === 429 && geminiKey) {
        try {
          const { GoogleGenAI } = await import('@google/genai');
          const ai = new GoogleGenAI({ apiKey: geminiKey });
          const fullConfig = { ...(config || {}), ...(tools != null && { tools }), ...(toolConfig != null && { toolConfig }) };
          const response = await ai.models.generateContent({
            model: model || 'gemini-2.5-flash',
            contents: Array.isArray(contents) ? contents : [],
            config: fullConfig,
          });
          const text = response.text ?? '';
          const functionCalls = response.functionCalls;
          return send(200, { text, functionCalls: functionCalls ?? undefined });
        } catch (geminiErr) {
          const msg = geminiErr instanceof Error ? geminiErr.message : String(geminiErr);
          return send(500, { error: /429|quota/i.test(msg) ? 'Rate limit reached. Please wait a minute and try again.' : msg });
        }
      }
      if (!groqRes.ok) {
        const errMsg = groqData?.error?.message || groqRes.statusText || `Groq error ${groqRes.status}`;
        return send(500, { error: errMsg });
      }
      const text = groqData?.choices?.[0]?.message?.content ?? '';
      return send(200, { text });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return send(500, { error: msg });
    }
  }

  return send(500, {
    error:
      'Missing API key. In Netlify: set GROQ_API_KEY (console.groq.com) or VITE_API_KEY / GEMINI_API_KEY (aistudio.google.com), then redeploy.',
  });
}
