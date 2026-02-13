import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { TRANSLATIONS, MOCK_TREATMENTS } from '../constants';

const PartnersTreatmentPage: React.FC = () => {
  const [lang, setLang] = useState(localStorage.getItem('vetlab_lang') || 'KZ');

  useEffect(() => {
    const handleLangChange = () => setLang(localStorage.getItem('vetlab_lang') || 'KZ');
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  const t = TRANSLATIONS[lang];
  const data = MOCK_TREATMENTS[lang]?.partners ?? MOCK_TREATMENTS.EN.partners;

  return (
    <div className="min-h-screen pb-24 bg-[#f0f7ff]">
      <section className="bg-secondary py-8 sm:py-12 text-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Link to="/services" className="inline-flex items-center gap-2 text-accent mb-8 sm:mb-12 hover:text-white hover:underline transition-colors font-black text-[10px] uppercase tracking-widest">
            <ArrowLeft size={16} /> {t.backToDepts}
          </Link>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">{t.partners}</h1>
          <p className="text-white/80 text-lg mt-2 font-medium">{t.partnersMockTitle}</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-5 sm:p-8 md:p-10 space-y-6 sm:space-y-8">
          <h2 className="text-xl font-black text-accent uppercase tracking-tight">{t.mockTreatmentDetails}</h2>
          <ul className="space-y-3">
            {data.bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-600">
                <div className="w-2 h-2 rounded-full bg-accent shrink-0 mt-1.5" />
                <span className="text-sm font-medium leading-relaxed">{bullet}</span>
              </li>
            ))}
          </ul>
          <p className="text-slate-500 text-xs font-semibold italic">{data.note}</p>
          {data.partnerList && data.partnerList.length > 0 && (
            <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-3">
              {data.partnerList.map((name) => (
                <span key={name} className="bg-[#d8b648] text-white px-4 py-2 rounded-lg font-bold text-sm">
                  {name}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PartnersTreatmentPage;
