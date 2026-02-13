
import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { SERVICES, TRANSLATIONS, MOCK_TREATMENTS } from '../constants';
import { CheckCircle2, ArrowLeft, Calendar, Shield } from 'lucide-react';

const DEPARTMENT_IDS = ['diagnostics', 'research', 'consultation', 'laboratory'];

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [lang, setLang] = useState(localStorage.getItem('vetlab_lang') || 'KZ');
  
  useEffect(() => {
    const handleLangChange = () => setLang(localStorage.getItem('vetlab_lang') || 'KZ');
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  const t = TRANSLATIONS[lang];
  const service = SERVICES.find(s => s.id === id);
  const mockData = id && DEPARTMENT_IDS.includes(id) ? (MOCK_TREATMENTS[lang]?.[id] ?? MOCK_TREATMENTS.EN[id]) : null;

  if (!service) return <Navigate to="/services" />;

  return (
    <div className="min-h-screen pb-24 bg-[#f0f7ff]">
      {/* Header - Navy/White */}
      <section className="bg-secondary py-8 sm:py-12 text-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Link to="/services" className="inline-flex items-center gap-2 text-accent mb-8 sm:mb-12 hover:text-white hover:underline transition-colors font-black text-[10px] uppercase tracking-widest">
            <ArrowLeft size={16} /> {t.backToDepts}
          </Link>
          <div className="flex flex-col md:flex-row gap-6 sm:gap-12 items-end">
            <div className="flex-grow space-y-4 min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">{service.title}</h1>
              <p className="text-white/70 text-base sm:text-xl max-w-2xl font-medium tracking-wide uppercase">{service.description}</p>
            </div>
            <Link to="/contacts" className="bg-white text-secondary px-6 py-3 rounded-md font-black text-xs uppercase tracking-widest hover:bg-accent hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 shadow-lg">
              <Calendar size={18} className="text-accent" /> {t.bookSession}
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-20">
        <div className="lg:col-span-2 space-y-10 sm:space-y-16 min-w-0">
          <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl sm:text-3xl font-black text-secondary uppercase tracking-tight mb-6 sm:mb-8">{t.overview}</h2>
            <p className="text-slate-600 text-lg leading-relaxed font-medium uppercase tracking-wide">
              {service.fullContent}
            </p>
          </div>

          <div className="space-y-8">
            <h3 className="text-2xl font-black text-secondary uppercase tracking-tight">{t.techFeatures}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {service.features.map((feature, i) => (
                <div key={i} className="flex gap-4 bg-white p-5 sm:p-8 rounded-xl border border-slate-200 hover:border-accent hover:shadow-md transition-all">
                  <CheckCircle2 className="text-accent shrink-0" size={24} />
                  <span className="text-secondary font-black text-[11px] uppercase tracking-widest leading-relaxed">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {mockData && (
            <div className="space-y-6 pt-8 border-t border-slate-200">
              <h3 className="text-2xl font-black text-accent uppercase tracking-tight">{t.mockTreatmentDetails}</h3>
              <ul className="space-y-3">
                {mockData.bullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600">
                    <div className="w-2 h-2 rounded-full bg-accent shrink-0 mt-1.5" />
                    <span className="text-sm font-medium leading-relaxed">{bullet}</span>
                  </li>
                ))}
              </ul>
              <p className="text-slate-500 text-xs font-semibold italic">{mockData.note}</p>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="bg-white p-10 rounded-2xl border border-slate-100 shadow-xl space-y-8">
            <div className="w-14 h-14 bg-white text-accent rounded-xl border border-slate-200 flex items-center justify-center">
              <Shield size={28} />
            </div>
            <h4 className="text-xl font-black text-secondary uppercase tracking-tight">{t.standards}</h4>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">
              Using certified B.Braun consumables and strict monitoring to ensure 100% procedure safety.
            </p>
            <ul className="space-y-4">
              {service.details.map((d, i) => (
                <li key={i} className="text-[10px] font-black text-secondary flex items-center gap-3 uppercase tracking-widest">
                  <div className="w-2 h-2 bg-accent rounded-full" /> {d}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-secondary text-white p-10 rounded-[10px] space-y-8 shadow-2xl">
            <h4 className="text-xl font-black uppercase tracking-tight text-white">{t.consultation}</h4>
            <p className="text-white/60 text-[10px] font-black uppercase tracking-widest leading-relaxed">Discuss your individual treatment plan with our leading specialists.</p>
            <Link to="/contacts" className="block w-full text-center bg-white text-secondary py-5 rounded-md font-black text-[11px] uppercase tracking-[0.2em] hover:bg-accent hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all">
              {t.requestCallback}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;
