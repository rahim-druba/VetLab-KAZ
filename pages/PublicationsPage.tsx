import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ChevronRight, ExternalLink, FilePlus, Lightbulb } from 'lucide-react';
import { TRANSLATIONS } from '../constants';
import {
  VETLAB_PROJECTS,
  GLOBAL_ARTICLES,
  type SourceFilter,
  type VetLabStatus,
  type GlobalType,
} from '../config/publicationsConfig';

const STATUS_OPTIONS_VETLAB: VetLabStatus[] = ['Done', 'Ongoing'];
const TYPE_OPTIONS_GLOBAL: GlobalType[] = [
  'Clinical Study',
  'Diagnostic Innovation',
  'Laboratory Techniques',
];

const PublicationsPage: React.FC = () => {
  const [lang, setLang] = useState(localStorage.getItem('vetlab_lang') || 'KZ');
  const navigate = useNavigate();
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('vetlab');
  const [statusTypeFilter, setStatusTypeFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [displayCount, setDisplayCount] = useState(8);

  useEffect(() => {
    const h = () => setLang(localStorage.getItem('vetlab_lang') || 'KZ');
    window.addEventListener('languageChange', h);
    return () => window.removeEventListener('languageChange', h);
  }, []);

  const t = TRANSLATIONS[lang] as Record<string, string>;
  const statusOptions =
    sourceFilter === 'vetlab'
      ? STATUS_OPTIONS_VETLAB
      : TYPE_OPTIONS_GLOBAL;

  const filteredVetLab = useMemo(() => {
    return VETLAB_PROJECTS.filter((p) => {
      const matchesStatus =
        !statusTypeFilter || p.status === statusTypeFilter;
      const title = t[p.titleKey] ?? '';
      const brief = t[p.briefKey] ?? '';
      const matchesSearch =
        !searchQuery.trim() ||
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        brief.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [sourceFilter, statusTypeFilter, searchQuery, lang]);

  const filteredGlobal = useMemo(() => {
    return GLOBAL_ARTICLES.filter((a) => {
      const matchesType =
        !statusTypeFilter || (a.type && a.type === statusTypeFilter);
      const title = t[a.titleKey] ?? '';
      const summary = t[a.summaryKey] ?? '';
      const tagTexts = (a.tagKeys || []).map((tk) => t[tk] ?? '').join(' ');
      const matchesSearch =
        !searchQuery.trim() ||
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tagTexts.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [sourceFilter, statusTypeFilter, searchQuery, lang]);

  const showVetLab = sourceFilter === 'vetlab';
  const items = showVetLab ? filteredVetLab : filteredGlobal;
  const displayedItems = items.slice(0, displayCount);
  const hasMore = items.length > displayCount;

  const getStatusLabel = (s: string) => {
    if (s === 'Done') return t.done;
    if (s === 'Ongoing') return t.ongoing;
    if (s === 'Clinical Study') return t.clinicalStudy;
    if (s === 'Diagnostic Innovation') return t.diagnosticInnovation;
    if (s === 'Laboratory Techniques') return t.labTechniques;
    return s;
  };

  return (
    <div className="bg-[#f4f7fa] min-h-screen py-12 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex mb-8 text-sm text-slate-500" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link to="/" className="hover:text-accent transition-colors">
                {t.home}
              </Link>
            </li>
            <li>
              <ChevronRight size={14} className="text-accent" />
            </li>
            <li className="font-semibold text-slate-800">
              {t.publicationsResearch}
            </li>
          </ol>
        </nav>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-secondary mb-4 uppercase tracking-tight">
              {t.publicationsResearch}
            </h1>
            <p className="text-lg text-slate-600 max-w-3xl font-light">
              {t.publicationsSub}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            {showVetLab && (
              <button
                onClick={() => navigate('/contacts')}
                className="inline-flex items-center gap-2 bg-secondary hover:bg-accent text-white hover:text-secondary font-black px-5 py-2.5 rounded-[15px] uppercase text-xs tracking-wider transition-all shadow-md"
              >
                <FilePlus size={16} />
                {t.submitResearchProposal}
              </button>
            )}
            {!showVetLab && (
              <button
                onClick={() => navigate('/contacts')}
                className="inline-flex items-center gap-2 bg-white border-2 border-secondary text-secondary hover:bg-secondary hover:text-white font-black px-5 py-2.5 rounded-[15px] uppercase text-xs tracking-wider transition-all"
              >
                <Lightbulb size={16} />
                {t.addResearchSuggestion}
              </button>
            )}
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-[15px] shadow-sm mb-10 border border-slate-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1.5">
                {t.source}
              </label>
              <select
                value={sourceFilter}
                onChange={(e) => {
                  setSourceFilter(e.target.value as SourceFilter);
                  setStatusTypeFilter('');
                }}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all hover:border-slate-300"
              >
                <option value="vetlab">{t.vetlabProjects}</option>
                <option value="global">{t.globalResearch}</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1.5">
                {t.statusType}
              </label>
              <select
                value={statusTypeFilter}
                onChange={(e) => setStatusTypeFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all hover:border-slate-300"
              >
                <option value="">{t.select}</option>
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {getStatusLabel(opt)}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2 lg:col-span-1 lg:col-start-4">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1.5">
                &nbsp;
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" size={18} />
                <input
                  type="text"
                  placeholder={t.searchPublications}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {displayedItems.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
              {showVetLab &&
                displayedItems.map((project: (typeof VETLAB_PROJECTS)[0]) => (
                  <article
                    key={project.id}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col border border-slate-200 group min-h-[400px]"
                  >
                    <Link
                      to={`/publications/project/${project.id}`}
                      className="block aspect-[16/9] w-full overflow-hidden bg-slate-100 shrink-0"
                    >
                      <img
                        src={project.imageUrl}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                    <div className="p-6 flex-grow flex flex-col min-h-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="bg-secondary text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
                          {t.vetlabBadge}
                        </span>
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${
                            project.status === 'Done'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {project.status === 'Done' ? t.done : t.ongoing}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-bold mb-1">{project.year}</p>
                      <h2 className="text-base font-bold text-secondary mb-3 group-hover:text-accent transition-colors line-clamp-2 uppercase tracking-tight leading-tight">
                        <Link to={`/publications/project/${project.id}`} className="hover:text-accent transition-colors">
                          {t[project.titleKey] ?? project.titleKey}
                        </Link>
                      </h2>
                      <p className="text-slate-600 text-sm mb-4 line-clamp-3 leading-relaxed font-light flex-grow">
                        {t[project.briefKey] ?? project.briefKey}
                      </p>
                      <Link
                        to={`/publications/project/${project.id}`}
                        className="inline-flex items-center gap-2 text-secondary hover:text-accent font-black text-sm uppercase tracking-wider transition-colors mt-auto"
                      >
                        {t.viewDetails}
                        <ChevronRight size={16} />
                      </Link>
                    </div>
                  </article>
                ))}

              {!showVetLab &&
                displayedItems.map((article: (typeof GLOBAL_ARTICLES)[0]) => (
                  <article
                    key={article.id}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col border border-slate-200 group min-h-[400px]"
                  >
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block aspect-[16/9] w-full overflow-hidden bg-slate-100 shrink-0"
                    >
                      <img
                        src={article.imageUrl}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </a>
                    <div className="p-6 flex-grow flex flex-col min-h-0">
                      <p className="text-xs text-slate-400 font-bold mb-1">{article.authors}, {article.year}</p>
                      <p className="text-xs text-slate-500 mb-2">
                        {t[article.journalKey] ?? article.journalKey}
                      </p>
                      <h2 className="text-base font-bold text-secondary mb-3 group-hover:text-accent transition-colors line-clamp-2 uppercase tracking-tight leading-tight">
                        <a href={article.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                          {t[article.titleKey] ?? article.titleKey}
                        </a>
                      </h2>
                      <p className="text-slate-600 text-sm mb-4 line-clamp-3 leading-relaxed font-light flex-grow">
                        {t[article.summaryKey] ?? article.summaryKey}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tagKeys.map((tagKey) => (
                          <span key={tagKey} className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                            {t[tagKey] ?? tagKey}
                          </span>
                        ))}
                      </div>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-secondary hover:text-accent font-black text-sm uppercase tracking-wider transition-colors mt-auto"
                      >
                        {t.readFullArticle}
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </article>
                ))}
            </div>

            {hasMore && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={() => setDisplayCount((c) => c + 6)}
                  className="px-8 py-3 bg-white border-2 border-secondary text-secondary hover:bg-secondary hover:text-white font-black rounded-xl uppercase text-sm tracking-wider transition-all"
                >
                  {t.loadMore}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-inner border border-slate-200">
            <Search size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-secondary uppercase">
              {t.noPublicationsFound}
            </h3>
            <p className="text-slate-500 mt-2 font-light">
              {t.tryAdjustingFilters}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicationsPage;
