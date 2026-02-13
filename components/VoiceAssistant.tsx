import React, { useState, useRef, useEffect } from 'react';
import { Mic, X, Send, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { TRANSLATIONS } from '../constants';

type Message = { role: 'user' | 'assistant'; content: string };

const VoiceAssistant: React.FC = () => {
  const [lang, setLang] = useState(localStorage.getItem('vetlab_lang') || 'KZ');
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>(() => [
    { role: 'assistant', content: TRANSLATIONS[localStorage.getItem('vetlab_lang') || 'KZ'].welcomeVoice },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = () => setLang(localStorage.getItem('vetlab_lang') || 'KZ');
    window.addEventListener('languageChange', h);
    return () => window.removeEventListener('languageChange', h);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const t = TRANSLATIONS[lang];

  const apiKey = import.meta.env.VITE_API_KEY;

  const handleSend = async () => {
    if (!input.trim() || isLoading || !apiKey) return;
    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [{ role: 'user', parts: [{ text: userMsg }] }],
        config: {
          systemInstruction:
            "You are the voice assistant for VetLab Kaz veterinary laboratory. Reply in 2–4 short sentences, as if speaking. Be warm and professional. Cover: lab services, specimen protocols, and directing users to the website or contact. Do not give medical treatment advice; recommend a full diagnostic panel and a licensed veterinarian.",
          temperature: 0.6,
        },
      });

      const text = response.text ?? t.sorryCouldNotProcess;
      setMessages((prev) => [...prev, { role: 'assistant', content: text }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: t.troubleConnecting },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed left-10 z-[60]" style={{ bottom: '25px' }}>
      {isOpen ? (
        <div className="bg-white rounded-[2rem] shadow-2xl w-80 md:w-96 flex flex-col overflow-hidden border border-slate-200 animate-in slide-in-from-bottom-6 duration-300">
          <div className="bg-primary text-secondary p-6 flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <Mic size={20} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xs uppercase tracking-widest text-secondary">{t.voiceAssistant}</span>
                <span className="text-[10px] text-accent font-black uppercase tracking-widest">VetLab Kaz</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="hover:bg-secondary/10 active:scale-95 p-2 rounded-xl transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <div ref={scrollRef} className="h-96 overflow-y-auto p-6 space-y-6 bg-slate-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-5 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-wide leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-primary text-secondary rounded-tr-none'
                      : 'bg-white text-secondary border border-slate-100 rounded-tl-none'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white px-5 py-3.5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                  <Loader2 className="animate-spin text-accent" size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Listening...</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t bg-white flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t.placeholderAskAnything}
              className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-bold text-secondary hover:border-slate-200 focus:ring-1 focus:ring-accent outline-none transition-all"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={isLoading}
              className="bg-primary text-secondary p-3 rounded-xl hover:bg-secondary hover:text-white hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-md"
            >
              <Send size={20} className="text-accent" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="bg-primary text-secondary p-5 rounded-full hover:scale-110 active:scale-95 transition-all border border-secondary/20 shadow-md"
        >
          <Mic size={32} className="text-accent" />
        </button>
      )}
    </div>
  );
};

export default VoiceAssistant;
