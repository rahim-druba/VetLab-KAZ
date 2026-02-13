import React, { useState, useEffect } from 'react';
import { SOLUTIONS_DATA, TRANSLATIONS } from '../constants';
import { FlaskConical, Share2, Truck, ArrowRight, CheckCircle2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '../BG/a-modern-veterinary-reference-laboratory-supportin.jpeg';
import trustImage from '../BG/a-modern-veterinary-diagnostic-laboratory-represen.jpeg';

const SOLUTIONS_KEYS = [
  { titleKey: 'solRefLabTitle', descKey: 'solRefLabDesc', featureKeys: ['solFeature1_1', 'solFeature1_2', 'solFeature1_3', 'solFeature1_4'] },
  { titleKey: 'solClinicTitle', descKey: 'solClinicDesc', featureKeys: ['solFeature2_1', 'solFeature2_2', 'solFeature2_3', 'solFeature2_4'] },
  { titleKey: 'solLogisticsTitle', descKey: 'solLogisticsDesc', featureKeys: ['solFeature3_1', 'solFeature3_2', 'solFeature3_3', 'solFeature3_4'] },
];

const Solutions: React.FC = () => {
  const [lang, setLang] = useState(localStorage.getItem('vetlab_lang') || 'KZ');
  const [learnMoreIndex, setLearnMoreIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleLangChange = () => setLang(localStorage.getItem('vetlab_lang') || 'KZ');
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  const t = TRANSLATIONS[lang] as Record<string, string>;

  const IconMap: Record<string, any> = {
    FlaskConical: FlaskConical,
    Share2: Share2,
    Truck: Truck
  };

  return (
    <div className="min-h-screen bg-[#f0f7ff]">
      {/* Hero - reference laboratory image with gradient overlay (same as About/Services) */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden border-b border-slate-200">
        <img
          src={heroImage}
          alt={t.solHeroAlt}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-secondary/60 via-secondary/40 to-secondary/25"
          aria-hidden
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 text-white text-center md:text-left">
          <div className="max-w-3xl space-y-4 sm:space-y-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight">{t.solutionsTitle}</h1>
            <p className="text-white/90 text-base md:text-lg leading-relaxed">
              {t.solutionsSub}
            </p>
            <Link to="/contacts" className="inline-flex bg-accent text-white px-6 py-3 rounded-md font-black text-xs uppercase tracking-widest hover:bg-white hover:text-secondary hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl">
              {t.partnerProgram}
            </Link>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {SOLUTIONS_DATA.map((item, i) => {
            const Icon = IconMap[item.icon];
            const keys = SOLUTIONS_KEYS[i];
            return (
              <div key={i} className="bg-white p-6 sm:p-8 lg:p-12 rounded-2xl sm:rounded-[2.5rem] border border-slate-200 flex flex-col justify-between hover:shadow-2xl hover:border-accent/30 hover:scale-[1.01] transition-all group">
                <div className="space-y-8">
                  <div className="w-16 h-16 bg-secondary text-accent rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-secondary uppercase tracking-tight leading-tight">{t[keys.titleKey]}</h3>
                  <p className="text-slate-600 text-base leading-relaxed">{t[keys.descKey]}</p>
                  <div className="space-y-4 pt-6">
                    {keys.featureKeys.map((fk, j) => (
                      <div key={j} className="flex items-center gap-3 text-secondary font-black text-[10px] uppercase tracking-widest">
                        <CheckCircle2 size={16} className="text-accent" /> {t[fk]}
                      </div>
                    ))}
                  </div>
                </div>
                <button type="button" onClick={() => setLearnMoreIndex(i)} className="mt-8 sm:mt-12 flex items-center gap-2 text-secondary font-black text-[11px] uppercase tracking-widest group-hover:text-accent hover:underline transition-colors text-left">
                  {t.solLearnMore} <ArrowRight size={18} />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Learn More mock modal */}
      {learnMoreIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 overflow-y-auto" onClick={() => setLearnMoreIndex(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-4 sm:p-8 border border-slate-200 my-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-black text-secondary uppercase tracking-tight">{t[SOLUTIONS_KEYS[learnMoreIndex].titleKey]}</h3>
              <button type="button" onClick={() => setLearnMoreIndex(null)} className="p-2 text-slate-400 hover:text-secondary" aria-label="Close"><X size={24} /></button>
            </div>
            <p className="text-slate-600 leading-relaxed mb-6">{t[SOLUTIONS_KEYS[learnMoreIndex].descKey]}</p>
            <p className="text-slate-500 text-sm italic mb-6">This is a demo. In production, you would see full details or be directed to contact or a dedicated page.</p>
            <Link to="/contacts" className="inline-flex items-center gap-2 bg-secondary text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-accent transition-colors">
              {t.contactUs} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      )}

      {/* Trust Section - same light UI as other pages, clearly above footer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 pb-16 sm:pb-24 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-24 items-center">
        <div className="space-y-6 sm:space-y-10">
          <div className="space-y-4">
            <h2 className="text-accent font-black uppercase tracking-[0.5em] text-xs">{t.solProfessionalNetwork}</h2>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-secondary leading-tight">{t.solNetworkSub}</h3>
          </div>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
            {t.solTrustText}
          </p>
          <div className="grid grid-cols-2 gap-4 sm:gap-8">
            <div className="border-l-4 border-accent pl-6">
              <div className="text-2xl font-black text-secondary mb-1">24h</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t.solRefTurnaround}</div>
            </div>
            <div className="border-l-4 border-accent pl-6">
              <div className="text-2xl font-black text-secondary mb-1">99.9%</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t.solAccuracyRate}</div>
            </div>
          </div>
        </div>
        <div className="relative group p-4">
          <div className="relative z-10 w-full aspect-[4/3] rounded-[15px] overflow-hidden shadow-md transition-transform duration-500 group-hover:scale-[1.02]">
            <img 
              src={trustImage}
              className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              alt={t.solTrustAlt}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/30 to-transparent pointer-events-none" aria-hidden />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Solutions;
