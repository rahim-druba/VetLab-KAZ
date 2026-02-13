import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SERVICES, TRANSLATIONS } from '../constants';
import { ArrowRight, CheckCircle } from 'lucide-react';
import heroImage from '../BG/a-state-of-the-art-nephrology-and-hemodialysis-cli.jpeg';
import img111 from '../BG/111.jpeg';
import img222 from '../BG/222.jpeg';
import img333 from '../BG/333.jpeg';
import img444 from '../BG/444.jpeg';

const SERVICE_IMAGES = [img111, img222, img333, img444];

const Services: React.FC = () => {
  const [lang, setLang] = useState(localStorage.getItem('vetlab_lang') || 'KZ');

  useEffect(() => {
    const handleLangChange = () => setLang(localStorage.getItem('vetlab_lang') || 'KZ');
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  const t = TRANSLATIONS[lang] as Record<string, string>;
  const serviceTitleKey = (id: string) => `service${id.charAt(0).toUpperCase() + id.slice(1)}Title`;
  const serviceDescKey = (id: string) => `service${id.charAt(0).toUpperCase() + id.slice(1)}Description`;
  const serviceDetailKey = (id: string, i: number) => `service${id.charAt(0).toUpperCase() + id.slice(1)}Detail${i + 1}`;

  return (
    <div className="min-h-screen bg-[#f0f7ff]">
      {/* Hero - nephrology/hemodialysis image with blue gradient overlay (same as About) */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden border-b border-slate-200">
        <img
          src={heroImage}
          alt="State-of-the-art nephrology and hemodialysis clinic"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-secondary/60 via-secondary/40 to-secondary/25"
          aria-hidden
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 text-white text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{t.clinicalServices}</h1>
          <p className="text-white/90 text-base md:text-lg max-w-2xl font-medium tracking-wide">
            {t.servicesSub}
          </p>
        </div>
      </section>

      {/* List - Light Blue Environment */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-10 sm:space-y-16">
        {SERVICES.map((service, index) => (
          <div key={service.id} className={`flex flex-col lg:flex-row gap-8 sm:gap-12 lg:gap-20 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
            <div className="lg:w-1/2 space-y-6 sm:space-y-10">
              <Link to={`/services/${service.id}`} className="inline-block bg-white text-secondary border border-slate-200 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-secondary/10 hover:border-accent hover:bg-white transition-colors">
                {t.department} 0{index + 1}
              </Link>
              <Link to={`/services/${service.id}`} className="block group">
                <h2 className="text-xl font-bold text-secondary leading-tight uppercase tracking-tight group-hover:text-accent transition-colors">{t[serviceTitleKey(service.id)]}</h2>
              </Link>
              <p className="text-slate-600 text-base leading-relaxed">
                {t[serviceDescKey(service.id)]}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.details.map((_, i) => (
                  <Link key={i} to={`/services/${service.id}`} className="flex items-center gap-4 text-secondary bg-white p-5 rounded-xl border border-slate-200 hover:border-accent hover:bg-white transition-all shadow-sm">
                    <CheckCircle className="text-accent shrink-0" size={20} />
                    <span className="text-xs font-black uppercase tracking-widest">{t[serviceDetailKey(service.id, i)]}</span>
                  </Link>
                ))}
              </div>
              <Link to={`/services/${service.id}`} className="inline-flex bg-secondary text-white hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] px-5 py-2.5 rounded-md font-semibold text-sm transition-all items-center gap-2">
                {t.details} <ArrowRight size={18} className="text-accent" />
              </Link>
            </div>
            <div className="lg:w-1/2 relative p-2 sm:p-4 group w-full">
              <div className="relative w-full min-h-[280px] sm:min-h-[350px] lg:h-[450px] rounded-[15px] overflow-hidden shadow-md transition-transform duration-500 group-hover:scale-[1.02]">
                <img 
                  src={SERVICE_IMAGES[index] ?? SERVICE_IMAGES[0]} 
                  className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  alt={t[serviceTitleKey(service.id)]}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/30 to-transparent pointer-events-none" aria-hidden />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Partners Section */}
      <section className="py-8 sm:py-12 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16 space-y-4">
            <h2 className="text-secondary text-[11px] font-black uppercase tracking-[0.5em]">{t.partners}</h2>
            <h3 className="text-2xl sm:text-3xl font-black text-secondary uppercase tracking-tight">{t.certified}</h3>
          </div>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {['B.BRAUN', 'FRESENIUS', 'BAXTER', 'NIKKISO'].map((name) => (
              <Link key={name} to="/services/partners" className="bg-[#d8b648] py-4 px-6 rounded-lg inline-flex items-center justify-center font-bold text-white text-sm border border-[#d8b648] tracking-tight shadow-[0_1px_3px_rgba(0,0,0,0.1)] hover:shadow-md hover:brightness-110 hover:-translate-y-0.5 transition-all min-w-0">
                {name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
