import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TRANSLATIONS } from '../constants';
import { VETLAB_PROJECTS, GLOBAL_ARTICLES } from '../config/publicationsConfig';
import { Play, FileText, BookOpen, Filter, Download, ExternalLink, ChevronRight, X } from 'lucide-react';
import heroImage from '../BG/a-modern-veterinary-professional-academy-environme.jpeg';
import featuredCourseImage from '../BG/a-professional-veterinary-education-setting-showca.jpeg';

type ResourceFilter = 'all' | 'webinars' | 'scientific' | 'protocols';

/** Academy resources: keys for translation; videoId, demoUrl, or guideSlug for action. */
const ACADEMY_RESOURCES = [
  {
    typeKey: 'typeWebinar',
    titleKey: 'hubWebinarTitle',
    dateKey: 'hubWebinarDate',
    durationKey: 'hubWebinarDuration',
    videoId: 'vy5ByrwfMZY',
    videoTitleKey: 'hubWebinarVideoTitle',
    demoUrl: 'https://www.youtube.com/watch?v=vy5ByrwfMZY',
  },
  {
    typeKey: 'typeWhitePaper',
    titleKey: 'hubWhitePaperTitle',
    dateKey: 'hubWhitePaperDate',
    durationKey: 'hubWhitePaperDuration',
    demoUrl: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0161005',
  },
  {
    typeKey: 'typeGuide',
    titleKey: 'hubGuideTitle',
    dateKey: 'hubGuideDate',
    durationKey: 'hubGuideDuration',
    guideSlug: 'avian-pathology',
  },
  {
    typeKey: 'typeCaseStudy',
    titleKey: 'hubCaseStudyTitle',
    dateKey: 'hubCaseStudyDate',
    durationKey: 'hubCaseStudyDuration',
    demoUrl: 'https://bmcvetres.biomedcentral.com/articles/10.1186/s12917-021-02783-3',
  },
];

const LearningHubPage: React.FC = () => {
  const [lang, setLang] = useState(localStorage.getItem('vetlab_lang') || 'KZ');
  const [resourceFilter, setResourceFilter] = useState<ResourceFilter>('all');
  const [videoModal, setVideoModal] = useState<{ videoId: string; title: string } | null>(null);
  const [enrollDemoOpen, setEnrollDemoOpen] = useState(false);

  useEffect(() => {
    const handleLangChange = () => setLang(localStorage.getItem('vetlab_lang') || 'KZ');
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  const t = TRANSLATIONS[lang] as Record<string, string>;

  const filteredAcademyResources = useMemo(() => {
    if (resourceFilter === 'all') return ACADEMY_RESOURCES;
    if (resourceFilter === 'webinars') return ACADEMY_RESOURCES.filter((r) => r.typeKey === 'typeWebinar');
    if (resourceFilter === 'protocols') return ACADEMY_RESOURCES.filter((r) => r.typeKey === 'typeGuide');
    return [];
  }, [resourceFilter]);

  const showScientificPapers = resourceFilter === 'scientific';
  const scientificItems = useMemo(() => {
    const vetlab = VETLAB_PROJECTS.map((p) => ({ kind: 'vetlab' as const, ...p }));
    const global = GLOBAL_ARTICLES.map((a) => ({ kind: 'global' as const, ...a }));
    return [...vetlab, ...global];
  }, []);

  return (
    <div className="min-h-screen bg-[#f0f7ff]">
      {/* Hero - same as About/Services/Virtual: image + blue gradient overlay */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden border-b border-slate-200">
        <img
          src={heroImage}
          alt="Modern veterinary professional academy environment"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-secondary/60 via-secondary/40 to-secondary/25"
          aria-hidden
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 w-full">
          <div className="max-w-3xl space-y-4 sm:space-y-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">{t.learningHubTitle}</h1>
            <p className="text-white/90 text-base md:text-lg font-medium tracking-wide">
              {t.learningHubSub}
            </p>
          </div>
        </div>
      </section>

      {/* Resource Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 pb-20 sm:pb-32">
        <div className="flex flex-col gap-8 sm:gap-12">
          {/* Filters Bar */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl flex flex-wrap gap-3 sm:gap-4 items-center justify-between border border-slate-100">
            <div className="flex flex-wrap gap-2 sm:gap-4">
              {([
                ['all', 'allResources'],
                ['webinars', 'webinars'],
                ['scientific', 'scientificPapers'],
                ['protocols', 'protocols'],
              ] as const).map(([value, labelKey]) => (
                <button
                  key={value}
                  onClick={() => setResourceFilter(value)}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-[0.98] ${resourceFilter === value ? 'bg-secondary text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
                >
                  {t[labelKey]}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 text-secondary font-black text-[10px] uppercase tracking-widest hover:text-accent transition-colors active:scale-[0.98]">
              <Filter size={16} /> {t.advancedFilter}
            </button>
          </div>

          {/* Grid: Academy resources (All / Webinars / Protocols) – each card opens demo/video */}
          {!showScientificPapers && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {filteredAcademyResources.map((res, i) => {
                const hasVideo = 'videoId' in res && res.videoId;
                const hasGuide = 'guideSlug' in res && res.guideSlug;
                const hasDemo = 'demoUrl' in res && res.demoUrl;
                const isWebinar = res.typeKey === 'typeWebinar';
                const cardContent = (
                  <>
                    <div className="space-y-6">
                      <div className="flex justify-between items-start">
                        <div className="p-4 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] bg-blue-50 text-blue-600">
                          {isWebinar ? <Play size={20} fill="currentColor" /> : <FileText size={20} />}
                        </div>
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{t[res.dateKey]}</span>
                      </div>
                      <div className="space-y-3">
                        <span className="text-accent text-[10px] font-black uppercase tracking-[0.3em]">{t[res.typeKey]}</span>
                        <h3 className="text-xl font-black text-secondary uppercase tracking-tight leading-tight group-hover:text-accent transition-colors">
                          {t[res.titleKey]}
                        </h3>
                      </div>
                    </div>
                    <div className="pt-8 mt-8 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t[res.durationKey]}</span>
                      {hasVideo && (
                        <span className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] px-4 py-2 rounded-lg bg-slate-50 text-secondary font-bold text-xs uppercase tracking-wider group-hover:bg-secondary group-hover:text-white transition-colors">
                          {t.watchDemo}
                        </span>
                      )}
                      {(hasDemo || hasGuide) && !hasVideo && (
                        <span className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg bg-slate-50 text-secondary group-hover:bg-secondary group-hover:text-white transition-colors shrink-0">
                          <ExternalLink size={18} />
                        </span>
                      )}
                    </div>
                  </>
                );
                if (hasVideo) {
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setVideoModal({ videoId: res.videoId, title: t[res.videoTitleKey] ?? t[res.titleKey] })}
                      className="w-full text-left bg-white rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-10 border border-slate-100 shadow-sm hover:shadow-2xl hover:border-accent/20 hover:scale-[1.02] active:scale-[0.99] transition-all group flex flex-col justify-between min-w-0"
                    >
                      {cardContent}
                    </button>
                  );
                }
                if (hasGuide) {
                  return (
                    <Link
                      key={i}
                      to={`/learning-hub/guide/${res.guideSlug}`}
                      className="bg-white rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-10 border border-slate-100 shadow-sm hover:shadow-2xl hover:border-accent/20 hover:scale-[1.02] active:scale-[0.99] transition-all group flex flex-col justify-between block min-w-0"
                    >
                      {cardContent}
                    </Link>
                  );
                }
                if (hasDemo) {
                  return (
                    <a
                      key={i}
                      href={res.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-10 border border-slate-100 shadow-sm hover:shadow-2xl hover:border-accent/20 hover:scale-[1.02] active:scale-[0.99] transition-all group flex flex-col justify-between block min-w-0"
                    >
                      {cardContent}
                    </a>
                  );
                }
                return (
                  <div key={i} className="bg-white rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-10 border border-slate-100 shadow-sm group flex flex-col justify-between min-w-0">
                    {cardContent}
                  </div>
                );
              })}
            </div>
          )}

          {/* Video modal – webinar demo */}
          {videoModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 overflow-y-auto" onClick={() => setVideoModal(null)}>
              <div className="relative w-full max-w-[95vw] sm:max-w-4xl bg-secondary rounded-2xl overflow-hidden shadow-2xl my-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-4 py-3 bg-secondary border-b border-white/10">
                  <span className="text-white font-bold text-sm uppercase tracking-wide truncate pr-4">{videoModal.title}</span>
                  <button type="button" onClick={() => setVideoModal(null)} className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors" aria-label="Close">
                    <X size={24} />
                  </button>
                </div>
                <div className="aspect-video bg-black">
                  <iframe
                    title={videoModal.title}
                    src={`https://www.youtube.com/embed/${videoModal.videoId}?autoplay=1`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Enroll demo modal */}
          {enrollDemoOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 overflow-y-auto" onClick={() => setEnrollDemoOpen(false)}>
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-4 sm:p-8 border border-slate-200 my-auto" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg sm:text-xl font-black text-secondary uppercase tracking-tight mb-2">{t.enrollDemoTitle}</h3>
                <p className="text-slate-600 text-sm mb-6">{t.enrollDemoText}</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/contacts" className="flex-1 text-center bg-secondary text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-accent transition-all">{t.contactUs}</Link>
                  <button type="button" onClick={() => setEnrollDemoOpen(false)} className="px-4 py-3 border border-slate-200 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50">{t.close}</button>
                </div>
              </div>
            </div>
          )}

          {/* Grid: Publication & Research results when Scientific Papers is selected */}
          {showScientificPapers && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {scientificItems.map((item) => {
                if (item.kind === 'vetlab') {
                  const project = item;
                  return (
                    <Link
                      key={`v-${project.id}`}
                      to={`/publications/project/${project.id}`}
                      className="bg-white rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-10 border border-slate-100 shadow-sm hover:shadow-2xl hover:border-accent/20 hover:scale-[1.02] active:scale-[0.99] transition-all group flex flex-col justify-between min-w-0"
                    >
                      <div className="space-y-6">
                        <div className="flex justify-between items-start">
                          <div className="p-4 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] bg-blue-50 text-blue-600">
                            <FileText size={20} />
                          </div>
                          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{project.year}</span>
                        </div>
                        <div className="space-y-3">
                          <span className="text-accent text-[10px] font-black uppercase tracking-[0.3em]">{t.vetlabBadge ?? 'VetLab Project'}</span>
                          <h3 className="text-xl font-black text-secondary uppercase tracking-tight leading-tight group-hover:text-accent transition-colors line-clamp-2">
                            {t[project.titleKey] ?? project.titleKey}
                          </h3>
                        </div>
                      </div>
                      <div className="pt-8 mt-8 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{project.status}</span>
                        <span className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg bg-slate-50 text-secondary group-hover:bg-secondary group-hover:text-white transition-colors shrink-0">
                          <ChevronRight size={18} />
                        </span>
                      </div>
                    </Link>
                  );
                }
                const article = item;
                return (
                  <a
                    key={`g-${article.id}`}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-10 border border-slate-100 shadow-sm hover:shadow-2xl hover:border-accent/20 hover:scale-[1.02] active:scale-[0.99] transition-all group flex flex-col justify-between min-w-0"
                  >
                    <div className="space-y-6">
                      <div className="flex justify-between items-start">
                        <div className="p-4 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] bg-blue-50 text-blue-600">
                          <FileText size={20} />
                        </div>
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{article.year}</span>
                      </div>
                      <div className="space-y-3">
                        <span className="text-accent text-[10px] font-black uppercase tracking-[0.3em]">{t.globalResearch ?? 'Research'}</span>
                        <h3 className="text-xl font-black text-secondary uppercase tracking-tight leading-tight group-hover:text-accent transition-colors line-clamp-2">
                          {t[article.titleKey] ?? article.titleKey}
                        </h3>
                      </div>
                    </div>
                    <div className="pt-8 mt-8 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate max-w-[60%]">{article.authors}</span>
                      <span className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg bg-slate-50 text-secondary group-hover:bg-secondary group-hover:text-white transition-colors shrink-0">
                        <ExternalLink size={18} />
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          )}

          {/* Featured Academy Card */}
          <div className="bg-secondary rounded-2xl sm:rounded-[3.5rem] p-8 sm:p-12 lg:p-16 text-white relative overflow-hidden group">
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-20">
              <div className="lg:w-1/2 space-y-4 sm:space-y-8">
                <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-accent/30">
                  {t.featuredCourse}
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight">{t.featuredCourseTitle}</h2>
                <p className="text-white/60 text-lg font-medium leading-relaxed uppercase tracking-wide">
                  {t.featuredCourseDesc}
                </p>
                <button type="button" onClick={() => setEnrollDemoOpen(true)} className="bg-white text-secondary px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-accent hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg flex items-center gap-2">
                  {t.enrollNow} <BookOpen size={20} />
                </button>
              </div>
              <div className="lg:w-1/2 relative">
                <div className="absolute -inset-4 bg-accent/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                <img 
                  src={featuredCourseImage}
                  className="rounded-[3rem] shadow-2xl grayscale transition-all duration-700 group-hover:grayscale-0 relative z-10" 
                  alt="Professional veterinary education setting" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LearningHubPage;
