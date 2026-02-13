import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

const PrivacyPage: React.FC = () => {
  const [lang, setLang] = useState(localStorage.getItem('vetlab_lang') || 'KZ');

  useEffect(() => {
    const h = () => setLang(localStorage.getItem('vetlab_lang') || 'KZ');
    window.addEventListener('languageChange', h);
    return () => window.removeEventListener('languageChange', h);
  }, []);

  const t = TRANSLATIONS[lang] as Record<string, string>;

  return (
    <div className="min-h-screen bg-[#f0f7ff]">
      <section className="bg-secondary text-white py-12 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-white/90 hover:text-accent font-semibold text-sm mb-6 transition-colors">
            <ChevronLeft size={18} /> {t?.home ?? 'Home'}
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t?.privacy ?? 'Privacy Policy'}</h1>
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-8 md:p-10 space-y-6 text-slate-600 leading-relaxed">
          <p>
            {t?.privacyIntro}
          </p>
          <h2 className="text-secondary font-bold text-lg mt-8">{t?.privacyInfoWeCollect}</h2>
          <p>{t?.privacyInfoWeCollectDesc}</p>
          <h2 className="text-secondary font-bold text-lg mt-8">{t?.privacyUseOfInfo}</h2>
          <p>{t?.privacyUseOfInfoDesc}</p>
          <h2 className="text-secondary font-bold text-lg mt-8">{t?.privacySecurity}</h2>
          <p>{t?.privacySecurityDesc}</p>
          <p className="text-sm text-slate-500 mt-10">{t?.privacyMockNote}</p>
        </div>
        <div className="mt-8">
          <Link to="/" className="inline-flex items-center gap-2 text-secondary hover:text-accent font-semibold text-sm">
            <ChevronLeft size={16} /> {t?.home ?? 'Home'}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPage;
