
import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { NEWS_ARTICLES, TRANSLATIONS } from '../constants';
import { ArrowLeft, Calendar, Share2 } from 'lucide-react';
import oieAccreditationImage from '../BG/a-high-end-professional-commemorative-photograph-o.jpeg';
import geneticTestingImage from '../BG/a-high-end-professional-commercial-photograph-show.jpeg';
import partnershipImage from '../BG/a-high-end-professional-commercial-photograph-illu.jpeg';

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [lang, setLang] = useState(localStorage.getItem('vetlab_lang') || 'KZ');

  useEffect(() => {
    const handleLangChange = () => setLang(localStorage.getItem('vetlab_lang') || 'KZ');
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  const t = TRANSLATIONS[lang] as Record<string, string>;
  const article = NEWS_ARTICLES.find(a => a.id === id);

  if (!article) return <Navigate to="/news" />;

  const titleKey = `news${article.id}Title`;
  const dateKey = `news${article.id}Date`;
  const summaryKey = `news${article.id}Summary`;
  const title = t[titleKey] ?? article.title;
  const date = t[dateKey] ?? article.date;
  const summary = t[summaryKey] ?? article.summary;

  return (
    <div className="min-h-screen pb-24 bg-[#f0f7ff]">
      {/* Header - Navy/White: enough padding so title is never covered by content below */}
      <section className="bg-secondary py-12 pb-10 text-white">
        <div className="max-w-4xl mx-auto px-4">
          <Link to="/news" className="inline-flex items-center gap-2 text-accent mb-8 sm:mb-12 font-black text-[10px] uppercase tracking-widest hover:text-white hover:underline transition-colors">
            <ArrowLeft size={16} /> {t.backToNews}
          </Link>
          <div className="flex items-center gap-4 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6 sm:mb-8">
            <Calendar size={16} className="text-accent" /> {date}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight pb-2">{title}</h1>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 pt-6 sm:pt-8">
        <div className="relative p-3 bg-white rounded-[3.5rem] shadow-2xl mb-16">
          <img src={article.id === '1' ? oieAccreditationImage : article.id === '2' ? geneticTestingImage : article.id === '3' ? partnershipImage : article.image} className="w-full h-[550px] object-cover rounded-[3rem] shadow-sm grayscale-[0.2]" alt={title} />
        </div>
        
        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-12 mb-20">
          <p className="text-xl font-black text-secondary uppercase tracking-tight leading-relaxed">{summary}</p>
          <div className="h-0.5 w-32 bg-accent"></div>
          <p className="text-lg font-medium uppercase tracking-wide leading-relaxed">
            {t.newsNetworkCommitment}
          </p>
          <div className="bg-white p-14 rounded-[3rem] border border-slate-200 space-y-8">
            <h4 className="text-2xl font-black text-secondary uppercase tracking-tight">{t.clinicalStandards}</h4>
            <p className="text-[11px] font-black uppercase tracking-widest leading-relaxed text-slate-500">
              {t.newsMedicalTeamTraining}
            </p>
          </div>
        </div>

        <div className="pt-16 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-10">
          <button className="flex items-center gap-4 text-secondary font-black text-[11px] uppercase tracking-widest hover:text-accent hover:scale-[1.02] active:scale-[0.98] transition-all group">
            <Share2 size={20} className="text-accent group-hover:scale-110 transition-transform" /> {t.shareDoc}
          </button>
          <Link to="/contacts" className="bg-secondary text-white px-6 py-3 rounded-md font-black text-[10px] uppercase tracking-[0.25em] shadow-lg shadow-secondary/20 hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all">
            {t.contactAdmin}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
