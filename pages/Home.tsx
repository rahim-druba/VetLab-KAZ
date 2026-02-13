
import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, Zap, Microscope, FlaskConical, Clock, Award, FileText, Cpu, MessageCircle, Loader2, RefreshCw, FileEdit, Wrench, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TRANSLATIONS } from '../constants';
import AppointmentModal from '../components/AppointmentModal';
import { chatWithGemini } from '../lib/geminiApi';
import heroImageOriginal from '../BG/a-modern-veterinary-laboratory-interior-with-veter (1).jpeg';
import heroImage1 from '../BG/a-professional-and-compassionate-scene-inside-a-gl (1).jpeg';
import heroImage2 from '../BG/a-high-quality-realistic-photograph-of-a-veterinar.jpg';
import innovationImage from '../BG/a-high-quality-realistic-photograph-of-a-modern-ve (6).jpeg';

const HERO_IMAGES = [
  { src: heroImageOriginal, altKey: 'heroAlt1' },
  { src: heroImage1, altKey: 'heroAlt2' },
  { src: heroImage2, altKey: 'heroAlt3' },
];
const HERO_INTERVAL_MS = 5 * 1000; // 5 seconds

const INTAKE_SYSTEM = 'You are VetLab Kaz intake assistant. Reply in 1–2 short sentences. Suggest the right next step: book an appointment, Patient Resources (sample prep), Technology (equipment), or Contact us. Be friendly and direct.';

const Home: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lang, setLang] = useState(localStorage.getItem('vetlab_lang') || 'KZ');
  const [heroIndex, setHeroIndex] = useState(0);
  const [intakeQuery, setIntakeQuery] = useState('');
  const [intakeReply, setIntakeReply] = useState('');
  const [intakeLoading, setIntakeLoading] = useState(false);

  const runIntakeGuide = async (q: string) => {
    const text = q.trim();
    if (!text || intakeLoading) return;
    setIntakeLoading(true);
    setIntakeReply('');
    try {
      const result = await chatWithGemini({
        model: 'llama-3.3-70b-versatile',
        contents: [{ role: 'user', parts: [{ text }] }],
        config: { systemInstruction: INTAKE_SYSTEM, temperature: 0.4 },
      });
      setIntakeReply(result.error || result.text || t.pleaseTryAgain);
    } catch {
      setIntakeReply(t.serviceTemporarilyUnavailable);
    } finally {
      setIntakeLoading(false);
    }
  };

  useEffect(() => {
    const handleLangChange = () => setLang(localStorage.getItem('vetlab_lang') || 'KZ');
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, HERO_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  const t = TRANSLATIONS[lang];

  // Highlight the end of the title for visual impact
  const titleWords = t.heroTitle.split(' ');
  const splitIndex = titleWords.length > 3 ? titleWords.length - 2 : titleWords.length - 1;
  const firstPart = titleWords.slice(0, splitIndex).join(' ');
  const lastPart = titleWords.slice(splitIndex).join(' ');

  return (
    <div className="space-y-0 pb-16 overflow-hidden min-h-screen bg-[#f0f7ff]">
      {/* Hero Section */}
      <section className="w-full min-h-0 flex flex-col lg:flex-row lg:items-center pt-6 sm:pt-8 lg:pt-10 lg:min-h-[70vh]">
        {/* Left column: vertically centered with hero image */}
        <div className="flex-1 flex items-center justify-center lg:justify-end px-6 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-10 lg:py-12">
          <div className="w-full max-w-xl">
            <div className="p-0 flex flex-col items-start text-left">
              {/* Block 1: Badge + Headline – same left edge */}
              <div className="w-full space-y-5 mb-7">
                <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-amber-50 border border-amber-200 text-secondary font-semibold text-sm uppercase tracking-wider">
                  <Cpu size={18} className="text-accent shrink-0" />
                  <span>{t.heroTag}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                  <span className="block text-secondary">{firstPart}</span>
                  <span className="block text-accent">{lastPart}{lastPart.endsWith('.') ? '' : '.'}</span>
                </h1>
              </div>
              {/* Block 2: Statement – accent bar aligned left */}
              <p className="w-full text-xs md:text-sm text-secondary/90 leading-relaxed font-medium uppercase tracking-wide border-l-4 border-accent pl-6 mb-7">
                {t.heroSub}
              </p>
              {/* Block 3: Primary CTAs – left-aligned row */}
              <div className="w-full flex flex-col sm:flex-row gap-3 mb-6">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-accent text-white hover:bg-accent/90 px-6 py-3 rounded-lg font-semibold text-base transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  {t.appointment} <ArrowRight size={18} className="text-white" />
                </button>
                <Link
                  to="/about"
                  className="bg-white text-secondary border border-slate-200 hover:bg-slate-50 px-6 py-3 rounded-lg font-semibold text-base transition-all text-center"
                >
                  {t.about}
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* Right column: hero image carousel */}
        <div className="flex-1 flex flex-col items-center justify-center lg:justify-start px-6 sm:px-8 lg:px-12 xl:px-16 py-6 lg:py-10 pb-8">
          <div className="w-full max-w-2xl aspect-[4/3] bg-slate-200 rounded-lg overflow-hidden flex items-center justify-center relative">
            {HERO_IMAGES.map((img, i) => (
              <img
                key={i}
                src={img.src}
                alt={t[img.altKey]}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === heroIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              />
            ))}
          </div>
          <div className="flex gap-2 mt-4" aria-label={t.heroImageIndicators}>
            {HERO_IMAGES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setHeroIndex(i)}
                aria-current={i === heroIndex}
                className={`rounded-full transition-all duration-300 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${
                  i === heroIndex
                    ? 'w-6 h-2.5 bg-secondary'
                    : 'w-2.5 h-2.5 bg-slate-300 hover:bg-secondary/70'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Innovation Section */}
      <section className="w-full py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-accent font-semibold uppercase tracking-widest text-xs">{t.innovation}</h2>
              <h3 className="text-2xl md:text-3xl font-bold text-secondary leading-tight">{t.scientificPrecisionForLife}</h3>
              <p className="text-slate-600 text-base md:text-lg leading-relaxed">
                {t.innovationParagraph}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { titleKey: 'oieTech', icon: Zap, descKey: 'oieTechDesc' },
                { titleKey: 'qualityControl', icon: ShieldCheck, descKey: 'qualityControlDesc' },
              ].map((item, i) => (
                <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col items-start text-left hover:border-secondary/20 hover:-translate-y-0.5 hover:shadow-md transition-all shadow-sm">
                  <item.icon className="text-accent mb-3" size={22} />
                  <h4 className="text-xl font-bold text-secondary mb-1.5">{t[item.titleKey]}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{t[item.descKey]}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative group p-4 w-full max-w-md mx-auto aspect-square translate-x-[40px]">
            <img 
              src={innovationImage} 
              className="rounded-full aspect-square object-cover w-full h-full shadow-xl grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-700"
              alt={t.modernVetLabAlt}
            />
          </div>
        </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="w-full py-16">
        <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-accent font-semibold uppercase tracking-widest text-xs mb-2">{t.ourServices}</h2>
          <h3 className="text-2xl md:text-3xl font-bold text-secondary leading-tight">{t.comprehensiveDiagnosticSolutions}</h3>
          <p className="text-slate-600 text-base mt-3 max-w-2xl mx-auto">{t.servicesIntro}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Microscope, titleKey: 'molecularDiagnostics', descKey: 'molecularDiagnosticsDesc', link: '/services' },
            { icon: FlaskConical, titleKey: 'clinicalBiochemistry', descKey: 'clinicalBiochemistryDesc', link: '/services' },
            { icon: FileText, titleKey: 'pathologyHistology', descKey: 'pathologyHistologyDesc', link: '/services' },
          ].map((item, i) => (
            <Link key={i} to={item.link} className="bg-white p-6 rounded-xl border border-slate-200 hover:border-accent hover:shadow-lg transition-all group">
              <item.icon className="text-accent mb-4 group-hover:scale-110 transition-transform" size={28} />
              <h4 className="text-xl font-bold text-secondary mb-2">{t[item.titleKey]}</h4>
              <p className="text-slate-600 text-sm leading-relaxed">{t[item.descKey]}</p>
              <span className="inline-flex items-center gap-1 text-accent font-semibold text-sm mt-3 group-hover:gap-2 transition-all">
                {t.learnMore} <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/services" className="inline-flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-md font-semibold text-sm hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all">
            {t.viewAllServices} <ArrowRight size={16} />
          </Link>
        </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="w-full py-16 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-accent font-semibold uppercase tracking-widest text-xs mb-2">{t.whyVetLabKaz}</h2>
            <h3 className="text-2xl md:text-3xl font-bold text-secondary leading-tight">{t.trustedByClinics}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Clock, titleKey: 'rapidTurnaround', descKey: 'rapidTurnaroundDesc' },
              { icon: Award, titleKey: 'oieCompliant', descKey: 'oieCompliantDesc' },
              { icon: ShieldCheck, titleKey: 'qualityAssured', descKey: 'qualityAssuredDesc' },
            ].map((item, i) => (
              <div key={i} className="group text-center p-6 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-14 h-14 bg-secondary text-accent rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <item.icon size={24} />
                </div>
                <h4 className="text-lg font-bold text-secondary mb-2">{t[item.titleKey]}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{t[item.descKey]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specimen Submission CTA */}
      <section className="w-full py-16">
        <div className="max-w-7xl mx-auto px-4">
        <div className="bg-secondary rounded-2xl p-8 md:p-12 text-white text-center">
          <h3 className="text-2xl font-bold mb-3">{t.readyToSubmitSpecimens}</h3>
          <p className="text-white/80 text-base max-w-2xl mx-auto mb-6">
            {t.readyToSubmitSpecimensSub}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contacts" className="inline-flex items-center justify-center gap-2 bg-accent text-white px-6 py-3 rounded-md font-semibold text-sm hover:bg-accent/90 hover:scale-[1.02] active:scale-[0.98] transition-all">
              {t.contactLabTeam} <ArrowRight size={16} className="text-white" />
            </Link>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/30 text-white px-6 py-3 rounded-md font-semibold text-sm hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {t.scheduleAppointment}
            </button>
          </div>
        </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="w-full py-16 pb-8">
        <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link to="/technology" className="p-4 rounded-xl bg-white border border-slate-200 hover:border-accent hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all text-center block">
            <span className="text-sm font-semibold text-secondary">{t.technologyShort}</span>
            <p className="text-xs text-slate-500 mt-1">{t.ourInstrumentation}</p>
          </Link>
          <Link to="/learning-hub" className="p-4 rounded-xl bg-white border border-slate-200 hover:border-accent hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all text-center block">
            <span className="text-sm font-semibold text-secondary">{t.learningHub}</span>
            <p className="text-xs text-slate-500 mt-1">{t.trainingAndResources}</p>
          </Link>
          <Link to="/news" className="p-4 rounded-xl bg-white border border-slate-200 hover:border-accent hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all text-center block">
            <span className="text-sm font-semibold text-secondary">{t.news}</span>
            <p className="text-xs text-slate-500 mt-1">{t.latestUpdates}</p>
          </Link>
          <Link to="/contacts" className="p-4 rounded-xl bg-white border border-slate-200 hover:border-accent hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all text-center block">
            <span className="text-sm font-semibold text-secondary">{t.contactShort}</span>
            <p className="text-xs text-slate-500 mt-1">{t.getInTouch}</p>
          </Link>
        </div>
        </div>
      </section>

      {/* Quick Actions – bottom of page, close to footer */}
      <section className="w-full py-10 sm:py-12 bg-[#f0f7ff] border-t border-slate-200/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-secondary leading-tight mb-2">{t.quickActions}</h2>
            <p className="text-slate-600 text-sm text-center max-w-xl mx-auto">{t.chooseOneOrType}</p>
            <RefreshCw className="text-secondary shrink-0 inline-block mt-2" size={18} aria-hidden />
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              { key: 'bookATest', icon: FileEdit },
              { key: 'samplePrepHelp', icon: FlaskConical },
              { key: 'equipmentTechnology', icon: Wrench },
              { key: 'contactTheLab', icon: Phone },
            ].map(({ key, icon: Icon }, i) => (
              <button
                key={key}
                onClick={() => runIntakeGuide(t[key])}
                disabled={intakeLoading}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-60 ${
                  i === 0
                    ? 'bg-accent text-white hover:bg-accent/90'
                    : 'bg-white border border-slate-200 text-secondary hover:bg-secondary hover:text-white hover:border-secondary'
                }`}
              >
                <Icon size={16} className="shrink-0" />
                {t[key]}
              </button>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={intakeQuery}
              onChange={(e) => setIntakeQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runIntakeGuide(intakeQuery)}
              placeholder={t.placeholderQuestion}
              className="flex-1 min-w-0 h-12 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none"
            />
            <button
              type="button"
              onClick={() => runIntakeGuide(intakeQuery)}
              disabled={intakeLoading}
              className="h-12 bg-secondary text-white px-5 rounded-lg font-semibold text-sm hover:bg-slate-800 disabled:opacity-60 flex items-center justify-center gap-2 shrink-0"
            >
              {intakeLoading ? <Loader2 size={18} className="animate-spin" /> : t.ask}
            </button>
          </div>
          {intakeReply && (
            <div className="mt-4 p-4 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm">
              {intakeReply}
              <div className="flex flex-wrap gap-2 mt-3">
                <Link to="/contacts" className="text-accent font-semibold text-xs hover:underline">{t.contactShort}</Link>
                <Link to="/patients" className="text-accent font-semibold text-xs hover:underline">{t.patientResourcesShort}</Link>
                <Link to="/technology" className="text-accent font-semibold text-xs hover:underline">{t.technologyShort}</Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <AppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Home;
