import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { GoogleGenAI, FunctionCallingConfigMode, Modality } from '@google/genai';
import type { Message } from '../types';
import { DOCTORS, TRANSLATIONS } from '../constants';
import { getApiKey, getApiErrorMessage, getGenAIOptions } from '../lib/apiKey';
import { AI_MODELS } from '../lib/aiModels';
import { chatWithGemini } from '../lib/geminiApi';
import { encodeBase64, decodeBase64, PCMPlaybackQueue } from '../lib/audioUtils';

const SYSTEM_INSTRUCTION = 'You are the VetLab Diagnostic Agent. Expert in specimen protocols and pathology. For questions about specialists or the team, suggest visiting the VetLab Kaz team page or contacting the central office.';

function findSpecialists(query: string): { name: string; specialty: string; experience: string; education: string }[] {
  const q = query.toLowerCase().trim();
  if (!q) return DOCTORS.map((d) => ({ name: d.name, specialty: d.specialty, experience: d.experience, education: d.education }));
  return DOCTORS.filter(
    (d) =>
      d.specialty.toLowerCase().includes(q) ||
      d.name.toLowerCase().includes(q) ||
      d.education.toLowerCase().includes(q)
  ).map((d) => ({ name: d.name, specialty: d.specialty, experience: d.experience, education: d.education }));
}

const findSpecialistsDeclaration = {
  name: 'findSpecialists',
  description: 'Search VetLab Kaz specialists by specialty, name, or education. Use when the user asks about the team, who to contact, or a specific area (e.g. pathology, molecular, biochemistry).',
  parametersJsonSchema: {
    type: 'object',
    properties: { query: { type: 'string', description: 'Search query for specialty or area (e.g. pathology, molecular)' } },
    required: ['query'],
  },
};

const Assistant: React.FC = () => {
  const [lang, setLang] = useState(localStorage.getItem('vetlab_lang') || 'KZ');
  const [isOpen, setIsOpen] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>(() => [
    { role: 'assistant', content: TRANSLATIONS[localStorage.getItem('vetlab_lang') || 'KZ'].welcomeAssistant },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [voiceConnecting, setVoiceConnecting] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const liveSessionRef = useRef<Awaited<ReturnType<GoogleGenAI['live']['connect']>> | null>(null);
  const playbackQueueRef = useRef<PCMPlaybackQueue | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const h = () => setLang(localStorage.getItem('vetlab_lang') || 'KZ');
    window.addEventListener('languageChange', h);
    return () => window.removeEventListener('languageChange', h);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    return () => {
      liveSessionRef.current?.close();
      playbackQueueRef.current?.close();
      mediaStreamRef.current?.getTracks?.().forEach((t) => t.stop());
    };
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      let contents: { role: 'user' | 'model'; parts: unknown[] }[] = [{ role: 'user', parts: [{ text: userMsg }] }];
      const config = {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.5,
        tools: [{ functionDeclarations: [findSpecialistsDeclaration] }],
        toolConfig: {
          functionCallingConfig: {
            mode: FunctionCallingConfigMode.ANY,
            allowedFunctionNames: ['findSpecialists'],
          },
        },
      };

      let result = await chatWithGemini({
        model: AI_MODELS.diagnosticChat,
        contents,
        config,
      });

      while (result.functionCalls?.length) {
        const call = result.functionCalls[0];
        const query = typeof call.args?.query === 'string' ? call.args.query : '';
        const results = findSpecialists(query);
        contents = [
          ...contents,
          { role: 'model', parts: [{ functionCall: { name: call.name, args: call.args, id: call.id } }] },
          { role: 'user', parts: [{ functionResponse: { id: call.id, name: call.name!, response: { specialists: results } } }] },
        ];
        result = await chatWithGemini({
          model: AI_MODELS.diagnosticChat,
          contents,
          config,
        });
      }

      const text = result.error ? (result.error || t.offlineMessage) : (result.text ?? t.offlineMessage);
      setMessages((prev) => [...prev, { role: 'assistant', content: text }]);
    } catch (err: unknown) {
      setMessages((prev) => [...prev, { role: 'assistant', content: getApiErrorMessage(err, t.offlineMessage) }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startVoice = async () => {
    const apiKey = getApiKey();
    if (!apiKey) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Please set VITE_API_KEY in .env to use Voice Mode.' }]);
      return;
    }
    setVoiceConnecting(true);
    try {
      const ai = new GoogleGenAI(getGenAIOptions(apiKey));
      const playbackQueue = new PCMPlaybackQueue(24000);
      playbackQueueRef.current = playbackQueue;

      const session = await ai.live.connect({
        model: AI_MODELS.liveVoice,
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: { role: 'user', parts: [{ text: SYSTEM_INSTRUCTION }] },
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } },
          },
        },
        callbacks: {
          onopen: () => setVoiceActive(true),
          onclose: () => { setVoiceActive(false); liveSessionRef.current = null; },
          onerror: () => setVoiceActive(false),
          onmessage: (e: { serverContent?: { modelTurn?: { parts?: { inlineData?: { data?: string; mimeType?: string } }[] } } }) => {
            const parts = e.serverContent?.modelTurn?.parts;
            if (!parts) return;
            for (const part of parts) {
              const blob = part.inlineData;
              if (blob?.data && blob.mimeType?.startsWith('audio/')) {
                const bytes = decodeBase64(blob.data);
                playbackQueue.playPCM(bytes.buffer);
              }
            }
          },
        },
      });

      liveSessionRef.current = session;

      // Microphone: 16 kHz mono for input
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { sampleRate: 16000, channelCount: 1 } });
      mediaStreamRef.current = stream;
      const ctx = new AudioContext({ sampleRate: 16000 });
      const source = ctx.createMediaStreamSource(stream);
      const processor = ctx.createScriptProcessor(4096, 1, 1);
      source.connect(processor);
      processor.connect(ctx.destination);
      processor.onaudioprocess = (ev) => {
        const input = ev.inputBuffer.getChannelData(0);
        const pcm = new Int16Array(input.length);
        for (let i = 0; i < input.length; i++) pcm[i] = Math.max(-32768, Math.min(32767, input[i] * 32768));
        const base64 = encodeBase64(new Uint8Array(pcm.buffer));
        try {
          session.sendRealtimeInput({ audio: { mimeType: 'audio/pcm;rate=16000', data: base64 } });
        } catch (_) {}
      };
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: t.offlineMessage }]);
    } finally {
      setVoiceConnecting(false);
    }
  };

  const stopVoice = () => {
    liveSessionRef.current?.close();
    playbackQueueRef.current?.close();
    mediaStreamRef.current?.getTracks?.().forEach((t) => t.stop());
    mediaStreamRef.current = null;
    setVoiceActive(false);
  };

  return (
    <div className="fixed right-10 z-[60]" style={{ bottom: '25px' }}>
      {isOpen ? (
        <div className="bg-white rounded-[2rem] shadow-2xl w-80 md:w-96 flex flex-col overflow-hidden border border-slate-200 animate-in slide-in-from-bottom-6 duration-300">
          <div className="bg-[#1a3f71] text-white p-6 flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-black text-[#1a3f71]">V</div>
              <div className="flex flex-col">
                <span className="font-black text-xs uppercase tracking-widest text-white">{t.vetlabAssistant}</span>
                <span className="text-[10px] text-[#d5af34] font-black uppercase tracking-widest">{t.scientificAi}</span>
              </div>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} className="hover:bg-white/10 active:scale-95 p-2 rounded-xl transition-all">
              <X size={20} />
            </button>
          </div>

          <div ref={scrollRef} className="h-96 overflow-y-auto p-6 space-y-6 bg-[#f0f7ff]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-5 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-wide leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-[#1a3f71] text-white rounded-tr-none'
                      : 'bg-white text-[#1a3f71] border border-slate-100 rounded-tl-none'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white px-5 py-3.5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                  <Loader2 className="animate-spin text-[#d5af34]" size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.analyzing}</span>
                </div>
              </div>
            )}
          </div>

          {!voiceActive && (
            <div className="p-6 border-t bg-white flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={t.placeholderAskDiagnostics}
                className="flex-1 bg-[#f0f7ff] border border-slate-100 rounded-xl px-4 py-3 text-xs font-bold text-[#1a3f71] hover:border-slate-200 focus:ring-1 focus:ring-[#d5af34] outline-none transition-all"
              />
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={isLoading}
                className="bg-[#1a3f71] text-white p-3 rounded-xl hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-md"
              >
                <Send size={20} className="text-[#d5af34]" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="bg-[#1a3f71] text-white p-5 rounded-full hover:scale-110 active:scale-95 transition-all group border border-white/20"
        >
          <MessageCircle size={32} className="text-white group-hover:rotate-12 transition-transform" />
        </button>
      )}
    </div>
  );
};

export default Assistant;
