import React, { useState, useEffect } from 'react';
import { DOCTORS, TRANSLATIONS } from '../constants';
import { ShieldCheck, Mail, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '../BG/a-high-end-professional-group-portrait-of-a-medica.jpeg';
import perImage from '../BG/a-high-quality-realistic-portrait-of-a-kazakh-vete (4).jpeg';
import persImage from '../BG/pers.jpeg';
import persoImage from '../BG/perso.jpeg';

const TEAM_IMAGES = [perImage, persImage, persoImage];

const Doctors: React.FC = () => {
  const [lang, setLang] = useState(localStorage.getItem('vetlab_lang') || 'KZ');
  useEffect(() => {
    const h = () => setLang(localStorage.getItem('vetlab_lang') || 'KZ');
    window.addEventListener('languageChange', h);
    return () => window.removeEventListener('languageChange', h);
  }, []);
  const t = TRANSLATIONS[lang] as Record<string, string>;

  return (
    <div className="min-h-screen pb-32 bg-[#f0f7ff]">
      {/* Hero - group portrait with gradient overlay */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden border-b border-slate-200">
        <img
          src={heroImage}
          alt={t.doctorsPageTitle}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-secondary/60 via-secondary/40 to-secondary/25"
          aria-hidden
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 text-white text-center">
          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">{t.doctorsBoardSub}</h1>
            <p className="text-white/90 text-base md:text-lg">
              {t.doctorsBoardSub2}
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12">
          {DOCTORS.map((doc, index) => (
            <div key={doc.id} className="flex flex-col md:flex-row gap-6 sm:gap-10 bg-white p-6 sm:p-10 rounded-2xl sm:rounded-[2.5rem] border border-slate-200 hover:border-accent hover:bg-white hover:shadow-2xl transition-all group">
              <div className="w-full md:w-64 aspect-[4/5] overflow-hidden rounded-2xl shrink-0 border-4 border-white shadow-lg max-w-sm mx-auto md:max-w-none">
                <img src={doc.image || TEAM_IMAGES[index - 3]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" alt={doc.name} />
              </div>
              <div className="flex flex-col justify-between py-2">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-accent text-[10px] font-black uppercase tracking-[0.2em] group-hover:scale-105 origin-left transition-transform">
                    <ShieldCheck size={16} /> {t.accreditedSpecialist}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-secondary uppercase tracking-tight leading-none group-hover:text-accent transition-colors">{doc.name}</h3>
                  <p className="text-slate-500 font-black text-[11px] uppercase tracking-[0.15em]">{t[`doctor${doc.id}Specialty`]}</p>
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                      {t[`doctor${doc.id}Experience`]}
                    </div>
                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-relaxed">
                      {t[`doctor${doc.id}Education`]}
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 mt-12">
                  <Link to="/contacts" className="bg-secondary text-white hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] px-8 py-4 rounded-md font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-3 shadow-xl">
                    <Calendar size={16} className="text-accent" /> {t.consultNow}
                  </Link>
                  <button className="p-4 bg-white border border-slate-100 rounded-md text-secondary hover:text-accent hover:border-accent hover:scale-110 active:scale-[0.9] transition-all shadow-sm">
                    <Mail size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Doctors;
