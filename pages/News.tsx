
import React, { useState, useEffect } from 'react';
import { NEWS_ARTICLES, TRANSLATIONS } from '../constants';
import { Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '../BG/a-wide-angle-high-end-architectural-and-interior-p.jpeg';
import oieAccreditationImage from '../BG/a-high-end-professional-commemorative-photograph-o.jpeg';
import geneticTestingImage from '../BG/a-high-end-professional-commercial-photograph-show.jpeg';
import partnershipImage from '../BG/a-high-end-professional-commercial-photograph-illu.jpeg';

const NEWS_KEYS = [
  { titleKey: 'news1Title', dateKey: 'news1Date', summaryKey: 'news1Summary' },
  { titleKey: 'news2Title', dateKey: 'news2Date', summaryKey: 'news2Summary' },
  { titleKey: 'news3Title', dateKey: 'news3Date', summaryKey: 'news3Summary' },
];

const News: React.FC = () => {
  const [lang, setLang] = useState(localStorage.getItem('vetlab_lang') || 'KZ');
  useEffect(() => {
    const h = () => setLang(localStorage.getItem('vetlab_lang') || 'KZ');
    window.addEventListener('languageChange', h);
    return () => window.removeEventListener('languageChange', h);
  }, []);
  const t = TRANSLATIONS[lang] as Record<string, string>;

  return (
    <div className="min-h-screen pb-24 bg-[#f0f7ff]">
      {/* Hero - architectural/interior image with gradient overlay (same as other pages) */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden border-b border-slate-200">
        <img
          src={heroImage}
          alt={t.newsPressTitle}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-secondary/60 via-secondary/40 to-secondary/25"
          aria-hidden
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 text-white text-center md:text-left">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">{t.newsPressSub}</h1>
            <p className="text-white/90 text-base md:text-lg font-medium tracking-wide">
              {t.newsPressSub2}
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-12">
          {NEWS_ARTICLES.map((article, i) => {
            const keys = NEWS_KEYS[i];
            return (
            <Link 
              key={article.id} 
              to={`/news/${article.id}`} 
              className="group flex flex-col bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:border-secondary/20 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.99] transition-all duration-500 block"
            >
              <div className="h-48 sm:h-64 overflow-hidden relative">
                <img src={article.id === '1' ? oieAccreditationImage : article.id === '2' ? geneticTestingImage : article.id === '3' ? partnershipImage : article.image} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" alt={t[keys.titleKey]} />
                <div className="absolute inset-0 bg-secondary/10 group-hover:bg-transparent transition-all" aria-hidden />
              </div>
              <div className="p-5 sm:p-8 lg:p-10 flex-grow flex flex-col justify-between space-y-4 sm:space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">
                    <Calendar size={14} className="text-accent" /> {t[keys.dateKey]}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-secondary mb-4 uppercase tracking-tight leading-tight group-hover:text-accent transition-colors">{t[keys.titleKey]}</h3>
                  <p className="text-slate-500 text-xs font-medium leading-relaxed uppercase tracking-wide line-clamp-2">{t[keys.summaryKey]}</p>
                </div>
                <div className="flex items-center gap-2 text-secondary font-black text-[10px] uppercase tracking-[0.2em] pt-6 border-t border-slate-50 group-hover:text-accent">
                  {t.fullArticle} <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          );})}
        </div>
      </section>
    </div>
  );
};

export default News;
