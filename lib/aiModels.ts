/**
 * Central config for Gemini models used by VetLab AI agents.
 * Use stable model names so all features work reliably.
 * Update here when newer models (e.g. gemini-3-*) become available.
 */
export const AI_MODELS = {
  /** Diagnostic chat + function calling (findSpecialists) */
  diagnosticChat: 'gemini-2.5-flash',
  /** Hardware Advisor (no search tool for API compatibility) */
  hardwareAdvisor: 'gemini-2.5-flash',
  /** Protocol Expert (OIE standards) */
  protocolExpert: 'gemini-2.5-flash',
  /** Live Voice API (native audio) */
  liveVoice: 'gemini-2.5-flash-native-audio-preview-12-2025',
} as const;
