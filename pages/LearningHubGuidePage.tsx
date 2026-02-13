import React, { useState, useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ChevronLeft, FileText } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

const GUIDE_SLUGS: Record<string, boolean> = { 'avian-pathology': true };

const LearningHubGuidePage: React.FC = () => {
  const [lang, setLang] = useState(localStorage.getItem('vetlab_lang') || 'KZ');
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    const h = () => setLang(localStorage.getItem('vetlab_lang') || 'KZ');
    window.addEventListener('languageChange', h);
    return () => window.removeEventListener('languageChange', h);
  }, []);

  const t = TRANSLATIONS[lang] as Record<string, string>;

  if (!slug || !GUIDE_SLUGS[slug]) {
    return <Navigate to="/learning-hub" replace />;
  }

  return (
    <div className="min-h-screen bg-[#f0f7ff] pb-24">
      <section className="bg-secondary text-white py-8 sm:py-12 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link to="/learning-hub" className="inline-flex items-center gap-2 text-white/90 hover:text-accent font-semibold text-sm mb-4 sm:mb-6 transition-colors">
            <ChevronLeft size={18} /> {t.backToAcademy}
          </Link>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <FileText className="text-accent" size={28} />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">{t.guideAvianTitle}</h1>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-md overflow-hidden">
          <div className="p-5 sm:p-8 md:p-10 space-y-6 sm:space-y-8">
            <p className="text-slate-600 leading-relaxed">{t.guideAvianIntro}</p>
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-black text-secondary uppercase tracking-tight mb-2">{t.guideAvianSec1Title}</h2>
                <p className="text-slate-600 leading-relaxed">{t.guideAvianSec1Content}</p>
              </div>
              <div>
                <h2 className="text-lg font-black text-secondary uppercase tracking-tight mb-2">{t.guideAvianSec2Title}</h2>
                <p className="text-slate-600 leading-relaxed">{t.guideAvianSec2Content}</p>
              </div>
              <div>
                <h2 className="text-lg font-black text-secondary uppercase tracking-tight mb-2">{t.guideAvianSec3Title}</h2>
                <p className="text-slate-600 leading-relaxed">{t.guideAvianSec3Content}</p>
              </div>
              <div>
                <h2 className="text-lg font-black text-secondary uppercase tracking-tight mb-2">{t.guideAvianSec4Title}</h2>
                <p className="text-slate-600 leading-relaxed">{t.guideAvianSec4Content}</p>
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium italic border-t border-slate-100 pt-6">{t.guideAvianNote}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LearningHubGuidePage;
