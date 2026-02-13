
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Target, Award, Globe } from 'lucide-react';
import { TRANSLATIONS } from '../constants';
import heroImage from '../BG/a-modern-high-tech-renal-clinic-in-kazakhstan-show.jpeg';
import excellenceImage from '../BG/a-high-end-professional-architectural-and-medical-.jpeg';

const About: React.FC = () => {
  const [lang, setLang] = useState(localStorage.getItem('vetlab_lang') || 'KZ');

  useEffect(() => {
    const handleLangChange = () => setLang(localStorage.getItem('vetlab_lang') || 'KZ');
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  const t = TRANSLATIONS[lang];

  return (
    <div className="min-h-screen space-y-16 pb-16 bg-[#f0f7ff]">
      {/* Hero - clinic image with blue gradient overlay */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden border-b border-slate-200">
        <img
          src={heroImage}
          alt={t.modernRenalClinicAlt}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-secondary/60 via-secondary/40 to-secondary/25"
          aria-hidden
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 text-white text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4">{t.philosophy}</h1>
          <p className="text-white/90 text-base md:text-lg max-w-2xl font-medium tracking-wide uppercase">
            {t.philosophySub}
          </p>
        </div>
      </section>

      {/* Values - Business Scientific */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-24 items-center">
        <div className="space-y-8 sm:space-y-12">
          <div className="space-y-4">
            <h2 className="text-accent text-xs font-black uppercase tracking-[0.5em]">{t.dna}</h2>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-secondary leading-tight">{t.excellence}</h3>
          </div>
          <div className="space-y-6 sm:space-y-10">
            {[
              { icon: Target, title: t.accuracy, desc: t.accuracyDesc },
              { icon: Award, title: t.techLead, desc: t.techLeadDesc },
              { icon: ShieldCheck, title: t.safety, desc: t.safetyDesc },
            ].map((item, i) => (
              <div key={i} className="flex gap-6 group">
                <div className="w-16 h-16 bg-white text-secondary rounded-xl border border-slate-200 flex items-center justify-center shrink-0 group-hover:bg-secondary group-hover:text-white transition-all duration-300 shadow-sm">
                  <item.icon size={28} className="group-hover:text-accent" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-secondary text-xl">{item.title}</h4>
                  <p className="text-slate-600 text-base leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative w-full max-w-xl mx-auto aspect-[4/3] mt-[10px] group p-4">
          <div className="relative w-full h-full rounded-xl overflow-hidden transition-transform duration-500 group-hover:scale-[1.02] shadow-md">
            <img 
              src={excellenceImage}
              className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              alt={t.standardsOfExcellenceAlt}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/30 to-transparent pointer-events-none" aria-hidden />
          </div>
        </div>
      </section>

      {/* Growth History */}
      <section className="py-16 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-accent text-xs font-black uppercase tracking-[0.5em]">{t.timeline}</h2>
            <h3 className="text-4xl md:text-5xl font-black text-secondary uppercase tracking-tight">{t.growth}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { year: '2015', eventKey: 'timelineEvent2015' },
              { year: '2018', eventKey: 'timelineEvent2018' },
              { year: '2022', eventKey: 'timelineEvent2022' },
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-md hover:bg-secondary hover:border-secondary transition-all duration-300 group min-h-[120px] flex flex-col justify-center">
                <div className="text-secondary font-bold text-base mb-1.5 group-hover:text-white transition-colors tracking-tight">{item.year}</div>
                <p className="text-slate-500 font-semibold text-xs uppercase tracking-wide leading-relaxed group-hover:text-white/70">
                  {t[item.eventKey]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="space-y-4 mb-10">
          <h2 className="text-accent text-xs font-black uppercase tracking-[0.5em]">{t.ourTeam}</h2>
          <h3 className="text-2xl md:text-3xl font-bold text-secondary leading-tight">{t.dedicatedSpecialists}</h3>
        </div>
        <p className="text-slate-600 text-base leading-relaxed max-w-3xl">
          {t.ourTeamDesc}
        </p>
      </section>

      {/* FAQ */}
      <section className="py-16 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="space-y-4 mb-10">
            <h2 className="text-accent text-xs font-black uppercase tracking-[0.5em]">{t.faq}</h2>
            <h3 className="text-2xl md:text-3xl font-bold text-secondary leading-tight">{t.frequentlyAskedQuestions}</h3>
          </div>
          <div className="space-y-6 max-w-3xl">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-md">
              <h4 className="font-bold text-secondary text-xl mb-2">{t.whatServicesDoYouOffer}</h4>
              <p className="text-slate-600 text-base leading-relaxed">{t.whatServicesDoYouOfferAnswer}</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-md">
              <h4 className="font-bold text-secondary text-xl mb-2">{t.howCanIGetInTouch}</h4>
              <p className="text-slate-600 text-base leading-relaxed">{t.howCanIGetInTouchAnswer}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="space-y-4 mb-10">
          <h2 className="text-accent text-xs font-black uppercase tracking-[0.5em]">{t.contactInformation}</h2>
          <h3 className="text-2xl md:text-3xl font-bold text-secondary leading-tight">{t.getInTouch}</h3>
        </div>
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-md max-w-2xl">
          <p className="text-slate-600 text-base leading-relaxed mb-4">
            {t.forAppointmentsAndInquiries}
          </p>
          <p className="text-secondary font-semibold text-base">{t.vetlabKazAdvanced}</p>
        </div>
      </section>
    </div>
  );
};

export default About;
