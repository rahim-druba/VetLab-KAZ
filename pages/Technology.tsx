import React, { useState, useEffect } from 'react';
import { INSTRUMENTS, TRANSLATIONS } from '../constants';
import { Zap, Activity, Info, Search, Loader2, ExternalLink } from 'lucide-react';
import { getApiErrorMessage } from '../lib/apiKey';
import { AI_MODELS } from '../lib/aiModels';
import { chatWithGemini } from '../lib/geminiApi';
import heroImage from '../BG/a-futuristic-veterinary-diagnostic-laboratory-inte.jpeg';
import img1st from '../BG/1st.jpeg';
import img2nd from '../BG/2nd.jpeg';
import img3rd from '../BG/3rd.jpeg';

const TECH_IMAGES = [img1st, img2nd, img3rd];

type HardwareMessage = { role: 'user' | 'assistant'; content: string; links?: { title?: string; uri?: string }[] };

const Technology: React.FC = () => {
  const [lang, setLang] = useState(localStorage.getItem('vetlab_lang') || 'KZ');
  const [hardwareQuery, setHardwareQuery] = useState('');
  const [hardwareMessages, setHardwareMessages] = useState<HardwareMessage[]>([]);
  const [hardwareLoading, setHardwareLoading] = useState(false);

  useEffect(() => {
    const handleLangChange = () => setLang(localStorage.getItem('vetlab_lang') || 'KZ');
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  const t = TRANSLATIONS[lang];

  const askHardwareAdvisor = async () => {
    const q = hardwareQuery.trim();
    if (!q || hardwareLoading) return;

    setHardwareMessages((prev) => [...prev, { role: 'user', content: q }]);
    setHardwareQuery('');
    setHardwareLoading(true);

    const offlineMsg = 'The Hardware Advisor is currently offline. Please try again later.';

    try {
      const result = await chatWithGemini({
        model: AI_MODELS.hardwareAdvisor,
        contents: [{ role: 'user', parts: [{ text: q }] }],
        config: {
          systemInstruction: 'You are a lab equipment and hardware advisor. Answer questions about laboratory instruments, diagnostic devices, and veterinary lab equipment. When asked about prices or specific models (e.g. Bio-Rad CFX Opus 96), give typical price ranges or known list prices where you know them, and always suggest checking the manufacturer website or authorized retailers for current pricing. Be concise and professional.',
          temperature: 0.4,
        },
      });

      const text = result.error ? (result.error || offlineMsg) : (result.text ?? offlineMsg);
      setHardwareMessages((prev) => [...prev, { role: 'assistant', content: text }]);
    } catch (err: unknown) {
      setHardwareMessages((prev) => [...prev, { role: 'assistant', content: getApiErrorMessage(err, offlineMsg) }]);
    } finally {
      setHardwareLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f7ff]">
      {/* Hero - futuristic lab image with gradient overlay (same as About/Services) */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden border-b border-slate-200">
        <img
          src={heroImage}
          alt={t.techHeroAlt}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-secondary/60 via-secondary/40 to-secondary/25"
          aria-hidden
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 text-white text-center md:text-left">
          <div className="max-w-4xl space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{t.techTitle}</h1>
            <p className="text-white/90 text-base md:text-lg max-w-2xl font-medium tracking-wide uppercase">
              {t.techSub}
            </p>
          </div>
        </div>
      </section>

      {/* Instruments Showcase - same card & image style as Services/Innovation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-10 sm:space-y-16">
        {['Pcr', 'Hemo', 'Bio'].map((key, index) => (
          <div key={INSTRUMENTS[index].id} className={`flex flex-col lg:flex-row gap-8 sm:gap-12 lg:gap-20 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
            <div className="lg:w-1/2 space-y-10">
              <div className="inline-block bg-white text-secondary border border-slate-200 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-secondary/10">
                {t[`tech${key}Type`]} 0{index + 1}
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-secondary leading-tight uppercase tracking-tight">{t[`tech${key}Name`]}</h2>
              <p className="text-slate-600 text-base leading-relaxed">
                {t[`tech${key}Desc`]}
              </p>
              <div className="space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-semibold text-secondary text-xs flex items-center gap-2">
                  <Zap size={16} className="text-accent" /> {t.techKeySpecs}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-2 text-secondary font-medium text-sm bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:border-accent hover:shadow-md transition-all">
                      <Activity size={14} className="text-accent shrink-0" /> {t[`tech${key}Spec${i}`]}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 relative p-4 group">
              <div className="relative w-full aspect-[4/3] rounded-[15px] overflow-hidden shadow-md transition-transform duration-500 group-hover:scale-[1.02]">
                <img
                  src={TECH_IMAGES[index] ?? TECH_IMAGES[0]}
                  className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  alt={t[`tech${key}Name`]}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/30 to-transparent pointer-events-none" aria-hidden />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Hardware Advisor – Google Search Grounding */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden shadow-lg">
          <div className="bg-secondary text-white p-6 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Search size={24} className="text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">{t.techHardwareAdvisor}</h2>
              <p className="text-white/80 text-sm">{t.techHardwareAdvisorSub}</p>
            </div>
          </div>
          <div className="p-6 space-y-4 max-h-[420px] overflow-y-auto">
            {hardwareMessages.length === 0 && (
              <p className="text-slate-500 text-sm">{t.techHardwareExample}</p>
            )}
            {hardwareMessages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${
                    msg.role === 'user' ? 'bg-secondary text-white rounded-tr-none' : 'bg-white border border-slate-200 text-secondary rounded-tl-none'
                  }`}
                >
                  {msg.content}
                </div>
                {msg.links && msg.links.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2 max-w-[85%]">
                    {msg.links.map((link, j) => (
                      <a
                        key={j}
                        href={link.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                      >
                        <ExternalLink size={12} /> {link.title || link.uri}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {hardwareLoading && (
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Loader2 size={18} className="animate-spin" /> {t.techSearchingWeb}
              </div>
            )}
          </div>
          <div className="p-4 border-t bg-white flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={hardwareQuery}
              onChange={(e) => setHardwareQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && askHardwareAdvisor()}
              placeholder={t.techHardwarePlaceholder}
              className="flex-1 min-w-0 rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none"
            />
            <button
              type="button"
              onClick={askHardwareAdvisor}
              disabled={hardwareLoading}
              className="bg-secondary text-white px-5 py-3 rounded-xl font-semibold hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <Search size={18} /> {t.techAsk}
            </button>
          </div>
        </div>
      </section>

      {/* OIE Standards Section - same card style */}
      <section className="bg-white py-12 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12 group">
          <div className="w-20 h-20 bg-white text-secondary rounded-xl border border-slate-200 flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-slate-100 group-hover:bg-secondary group-hover:text-white transition-all duration-300">
            <Info size={36} className="text-accent" />
          </div>
          <div className="space-y-4 flex-1">
            <h4 className="text-xl font-bold text-secondary">{t.techStandardizedValidation}</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              {t.techStandardizedValidationDesc}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Technology;
