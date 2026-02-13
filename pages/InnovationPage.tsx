
import React, { useState, useEffect } from 'react';
import { TRANSLATIONS } from '../constants';
import { Cpu, Globe, Target, ShieldCheck } from 'lucide-react';
import heroImage from '../BG/a-futuristic-veterinary-diagnostics-laboratory-rep.jpeg';

const InnovationPage: React.FC = () => {
  const [lang, setLang] = useState(localStorage.getItem('vetlab_lang') || 'KZ');

  useEffect(() => {
    const handleLangChange = () => setLang(localStorage.getItem('vetlab_lang') || 'KZ');
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  const t = TRANSLATIONS[lang] as Record<string, string>;

  return (
    <div className="min-h-screen bg-[#f0f7ff]">
      {/* Sleek Hero */}
      <section className="bg-[#f0f7ff] py-10 sm:py-16 relative overflow-hidden border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
          <div className="space-y-6 sm:space-y-10">
            <div className="inline-flex items-center gap-3 bg-white px-4 sm:px-6 py-2 rounded-full border border-slate-200 shadow-sm">
              <Cpu className="text-accent animate-spin-slow shrink-0" size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary">{t.heroTag}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-secondary leading-tight">
              {t.innovationHeroTitle}
            </h1>
            <p className="text-slate-500 text-base sm:text-xl font-medium uppercase tracking-wide leading-relaxed border-l-4 border-accent pl-4 sm:pl-8">
              {t.innovationHeroSub}
            </p>
          </div>
          <div className="relative w-full max-w-xl mx-auto aspect-[4/3] group p-4">
            <div className="relative w-full h-full rounded-[15px] overflow-hidden shadow-md transition-transform duration-500 group-hover:scale-[1.02]">
              <img 
                src={heroImage}
                className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                alt={t.innovationFuturisticAlt}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/30 to-transparent pointer-events-none" aria-hidden />
            </div>
          </div>
        </div>
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] pointer-events-none"></div>
      </section>

      {/* Pillars Section - standard size */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
          {[
            { titleKey: 'innovationAiPathology', descKey: 'innovationAiPathologyDesc', icon: Target },
            { titleKey: 'innovationRemoteMonitoring', descKey: 'innovationRemoteMonitoringDesc', icon: Globe },
            { titleKey: 'innovationSustainableLabs', descKey: 'innovationSustainableLabsDesc', icon: ShieldCheck },
          ].map((pillar, i) => (
            <div key={i} className="space-y-4 group p-5 rounded-xl hover:bg-secondary transition-all duration-300">
              <div className="w-14 h-14 bg-white text-secondary rounded-xl border border-slate-200 flex items-center justify-center transition-all duration-300 group-hover:bg-white/20 group-hover:border-white/40 group-hover:scale-105 shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-slate-100">
                <pillar.icon size={24} className="text-secondary group-hover:text-white transition-colors" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-secondary uppercase tracking-tight group-hover:text-white transition-colors">{t[pillar.titleKey]}</h3>
                <p className="text-slate-500 font-medium leading-relaxed text-xs uppercase tracking-wide group-hover:text-white/90 transition-colors">
                  {t[pillar.descKey]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Deep Tech Feature - same light UI as other pages */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-24 items-center">
        <div className="order-2 lg:order-1 relative group p-4">
          <div className="relative w-full h-full rounded-[15px] overflow-hidden shadow-md transition-transform duration-500 group-hover:scale-[1.02] aspect-[4/5]">
            <img 
              src="https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&q=80&w=1200" 
              className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
              alt="Deep Tech" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/30 to-transparent pointer-events-none" aria-hidden />
          </div>
        </div>
        <div className="order-1 lg:order-2 space-y-10">
          <div className="space-y-4">
            <h2 className="text-accent font-black uppercase tracking-[0.5em] text-xs">{t.innovationQuantumLeap}</h2>
            <h3 className="text-2xl md:text-3xl font-bold text-secondary leading-tight">{t.innovationGenomicTriage}</h3>
            <p className="text-slate-600 text-base leading-relaxed font-medium">
              {t.innovationGenomicTriageDesc}
            </p>
          </div>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-3 h-3 bg-accent rounded-full shrink-0 group-hover:scale-125 transition-transform" />
                <span className="text-secondary font-semibold uppercase tracking-wide text-sm">{t[`innovationSpec${i}`]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default InnovationPage;
