import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const GROQ_CHAT_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

/** Build Groq messages from our contents + systemInstruction (no tools). */
function toGroqMessages(contents: { role: string; parts?: { text?: string; functionCall?: unknown; functionResponse?: unknown }[] }[], systemInstruction?: string): { role: string; content: string }[] {
  const out: { role: string; content: string }[] = [];
  if (systemInstruction && typeof systemInstruction === 'string') out.push({ role: 'system', content: systemInstruction });
  for (const c of contents || []) {
    const textPart = c.parts?.find((p: { text?: string }) => p != null && typeof (p as { text?: string }).text === 'string');
    const text = textPart ? (textPart as { text: string }).text : '';
    if (!text) continue;
    const role = c.role === 'model' ? 'assistant' : c.role;
    if (role === 'user' || role === 'assistant') out.push({ role, content: text });
  }
  return out;
}

/** Server-side chat: prefer Groq (free, high limits); fallback to Gemini. POST /api/chat. */
function chatApiPlugin(env: Record<string, string>) {
  return {
    name: 'chat-api',
    configureServer(server: { middlewares: { use: (fn: (req: import('http').IncomingMessage, res: import('http').ServerResponse, next: () => void) => void) => void } }) {
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'POST' || !req.url?.startsWith('/api/chat')) return next();
        let body = '';
        req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
        req.on('end', async () => {
          const sendError = (msg: string) => {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: msg }));
          };
          try {
            const parsed = JSON.parse(body || '{}');
            const { contents, config } = parsed;
            const groqKey = env.GROQ_API_KEY || process.env.GROQ_API_KEY;
            const geminiKey = env.VITE_API_KEY || env.GEMINI_API_KEY || process.env.VITE_API_KEY || process.env.GEMINI_API_KEY;

            if (groqKey) {
              const messages = toGroqMessages(Array.isArray(contents) ? contents : [], config?.systemInstruction);
              if (messages.length === 0) {
                sendError('No valid messages. Send at least one user message.');
                return;
              }
              const groqRes = await fetch(GROQ_CHAT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${groqKey}` },
                body: JSON.stringify({
                  model: GROQ_MODEL,
                  messages,
                  temperature: typeof config?.temperature === 'number' ? config.temperature : 0.5,
                }),
              });
              const groqData = (await groqRes.json()) as { choices?: { message?: { content?: string } }[]; error?: { message?: string } };
              if (!groqRes.ok) {
                const errMsg = groqData?.error?.message || groqRes.statusText || `Groq error ${groqRes.status}`;
                sendError(errMsg);
                return;
              }
              const text = groqData?.choices?.[0]?.message?.content ?? '';
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ text }));
              return;
            }

            if (geminiKey) {
              const { GoogleGenAI } = await import('@google/genai');
              const ai = new GoogleGenAI({ apiKey: geminiKey });
              const { model, tools, toolConfig } = parsed;
              const fullConfig = { ...(config || {}), ...(tools != null && { tools }), ...(toolConfig != null && { toolConfig }) };
              const response = await ai.models.generateContent({
                model: model || 'gemini-2.5-flash',
                contents: Array.isArray(contents) ? contents : [],
                config: fullConfig,
              });
              const text = response.text ?? '';
              const functionCalls = response.functionCalls;
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ text, functionCalls: functionCalls ?? undefined }));
              return;
            }

            sendError('Missing API key. Set GROQ_API_KEY (recommended, free at console.groq.com) or VITE_API_KEY in .env and restart.');
          } catch (err) {
            const errMsg = err instanceof Error ? err.message : String(err);
            const errCause = err instanceof Error && err.cause instanceof Error ? err.cause.message : '';
            const full = errCause ? `${errMsg}: ${errCause}` : errMsg;
            const is429 = /429|RESOURCE_EXHAUSTED|quota exceeded|rate limit/i.test(full);
            const friendly = is429 ? 'Rate limit reached. Please wait a minute and try again.' : (full || 'Unknown server error');
            sendError(friendly);
          }
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api/gemini': {
            target: 'https://generativelanguage.googleapis.com',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/gemini/, ''),
          },
        },
      },
      plugins: [react(), chatApiPlugin(env)],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY ?? env.VITE_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY ?? env.VITE_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
