/**
 * Frontend API for Gemini: calls our server /api/chat so the API key stays on the server.
 * Use this instead of @google/genai in the browser for generateContent.
 */

export type ChatRequest = {
  model: string;
  contents: { role: 'user' | 'model'; parts: unknown[] }[];
  config?: {
    systemInstruction?: string;
    temperature?: number;
    tools?: unknown[];
    toolConfig?: unknown;
  };
};

export type ChatResponse = {
  text?: string;
  functionCalls?: Array<{ name?: string; args?: Record<string, unknown>; id?: string }>;
  error?: string;
};

/** Coerce server error to a string so the UI never shows [object Object]. */
function toErrorString(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && 'message' in value && typeof (value as { message: unknown }).message === 'string') return (value as { message: string }).message;
  return String(value);
}

/** Show a short message for rate-limit errors instead of raw API JSON. */
function friendlyErrorMessage(errorStr: string): string {
  if (/429|RESOURCE_EXHAUSTED|quota exceeded|rate limit|retry in \d/i.test(errorStr)) {
    return 'Rate limit reached. The free tier allows 5 requests per minute. Please wait about a minute and try again.';
  }
  return errorStr;
}

/**
 * Send a single generateContent request via the server. No API key needed in the browser.
 */
export async function chatWithGemini(req: ChatRequest): Promise<ChatResponse> {
  let res: Response;
  try {
    res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: req.model,
        contents: req.contents,
        config: req.config,
        tools: req.config?.tools,
        toolConfig: req.config?.toolConfig,
      }),
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Network error. Is the dev server running?' };
  }
  let data: ChatResponse & { error?: unknown };
  try {
    data = (await res.json()) as ChatResponse & { error?: unknown };
  } catch {
    return { error: `Server error ${res.status}. Response was not JSON.` };
  }
  if (!res.ok) {
    const raw = toErrorString(data.error) || `Server error ${res.status}`;
    return { error: friendlyErrorMessage(raw) };
  }
  return {
    text: data.text,
    functionCalls: data.functionCalls,
    ...(data.error != null && { error: friendlyErrorMessage(toErrorString(data.error)) }),
  };
}
