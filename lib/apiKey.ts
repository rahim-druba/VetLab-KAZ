/**
 * Resolve API key for GoogleGenAI client.
 * Prefers process.env.API_KEY (Node/server); falls back to import.meta.env.VITE_API_KEY (Vite frontend).
 */
export function getApiKey(): string {
  if (typeof process !== 'undefined' && process.env?.API_KEY) {
    return String(process.env.API_KEY);
  }
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_KEY) {
    return String(import.meta.env.VITE_API_KEY);
  }
  return '';
}

/** Options for GoogleGenAI: in dev use proxy to avoid CORS. */
export function getGenAIOptions(apiKey: string): { apiKey: string; httpOptions?: { baseUrl: string } } {
  const opts: { apiKey: string; httpOptions?: { baseUrl: string } } = { apiKey };
  if (import.meta.env.DEV && typeof window !== 'undefined') {
    opts.httpOptions = { baseUrl: window.location.origin + '/api/gemini' };
  }
  return opts;
}

/** User-friendly message for API errors (4xx/5xx) and network errors. Use after catch. Always returns a string, never [object Object]. */
export function getApiErrorMessage(err: unknown, defaultOffline: string): string {
  const status = (err as { status?: number })?.status;
  if (status === 401 || status === 403) return 'Invalid or missing API key. Check VITE_API_KEY in .env and restart the dev server.';
  if (status && status >= 400 && status < 600) return defaultOffline;
  let msg: string;
  if (err instanceof Error) {
    msg = err.message;
  } else if (err && typeof err === 'object' && 'message' in err && typeof (err as { message: unknown }).message === 'string') {
    msg = (err as { message: string }).message;
  } else {
    msg = String(err);
  }
  if (/^\[object Object\]$/i.test(msg)) return defaultOffline;
  if (/failed to fetch|network error|typeerror/i.test(msg)) return 'Network error. Restart the dev server (npm run dev) and try again.';
  return msg || defaultOffline;
}
