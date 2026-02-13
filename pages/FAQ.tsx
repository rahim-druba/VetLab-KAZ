import React, { useState, useEffect } from 'react';
import { TRANSLATIONS } from '../constants';
import { Plus, Minus, MessageCircle, Send, Loader2 } from 'lucide-react';
import { chatWithGemini } from '../lib/geminiApi';

const FAQ_SYSTEM = 'You are VetLab Kaz FAQ assistant. Answer in 2–3 short sentences. Topics: veterinary lab services, sample submission, OIE protocols, opening hours, contact. If unsure, suggest visiting the Contact page. Be concise and professional.';

const FAQ_KEYS = [{ q: 'faqQ1', a: 'faqA1' }, { q: 'faqQ2', a: 'faqA2' }, { q: 'faqQ3', a: 'faqA3' }];

const FAQ: React.FC = () => {
  const [lang, setLang] = useState(localStorage.getItem('vetlab_lang') || 'KZ');
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [faqAsk, setFaqAsk] = useState('');
  const [faqReply, setFaqReply] = useState('');
  const [faqLoading, setFaqLoading] = useState(false);

  useEffect(() => {
    const h = () => setLang(localStorage.getItem('vetlab_lang') || 'KZ');
    window.addEventListener('languageChange', h);
    return () => window.removeEventListener('languageChange', h);
  }, []);

  const t = TRANSLATIONS[lang] as Record<string, string>;

  const askFaq = async () => {
    const q = faqAsk.trim();
    if (!q || faqLoading) return;
    setFaqLoading(true);
    setFaqReply('');
    try {
      const result = await chatWithGemini({
        model: 'llama-3.3-70b-versatile',
        contents: [{ role: 'user', parts: [{ text: q }] }],
        config: { systemInstruction: FAQ_SYSTEM, temperature: 0.3 },
      });
      setFaqReply(result.error || result.text || 'Please try again.');
    } catch {
      setFaqReply('Service temporarily unavailable. Try the Contact page.');
    } finally {
      setFaqLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-32 bg-[#f0f7ff]">
      {/* Header - Navy/White */}
      <section className="bg-secondary py-8 sm:py-12 text-white text-center border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">{t.faqPageTitle}</h1>
          <p className="text-white/80 text-base">
            {t.faqPageSub}
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="space-y-4">
          {FAQ_KEYS.map((item, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden group hover:border-secondary/30 hover:shadow-md transition-all min-h-[72px]">
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white active:scale-[0.995] transition-all gap-4 min-h-[72px]"
              >
                <span className="text-base font-semibold text-secondary uppercase tracking-tight leading-snug text-left">{t[item.q]}</span>
                <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all group-hover:scale-105 ${openIndex === i ? 'bg-secondary text-white shadow-lg' : 'bg-slate-50 text-secondary border border-slate-200'}`}>
                  {openIndex === i ? <Minus size={18} /> : <Plus size={18} />}
                </div>
              </button>
              {openIndex === i && (
                <div className="px-6 pb-6 animate-in slide-in-from-top-4 duration-300">
                  <div className="w-12 h-0.5 bg-accent mb-4" />
                  <p className="text-slate-600 text-sm font-medium leading-relaxed uppercase tracking-wide">
                    {t[item.a]}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Ask – not in the list */}
        <div className="mt-10 sm:mt-16 p-6 sm:p-8 rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle size={22} className="text-[#1a3f71] shrink-0" />
            <h2 className="text-lg font-bold text-[#1a3f71]">{t.faqAskNotListed}</h2>
          </div>
          <p className="text-slate-600 text-sm mb-4">{t.faqAskPlaceholder}</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={faqAsk}
              onChange={(e) => setFaqAsk(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && askFaq()}
              placeholder={t.faqAskExample}
              className="flex-1 min-w-0 rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-[#d5af34] outline-none"
            />
            <button
              type="button"
              onClick={askFaq}
              disabled={faqLoading}
              className="bg-[#1a3f71] text-white px-5 py-3 rounded-xl font-semibold hover:bg-slate-800 disabled:opacity-60 flex items-center justify-center gap-2 shrink-0"
            >
              {faqLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />} {t.patientAsk}
            </button>
          </div>
          {faqReply && (
            <div className="mt-4 p-4 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm">
              {faqReply}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default FAQ;
