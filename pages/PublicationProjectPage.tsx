import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { TRANSLATIONS } from '../constants';
import { VETLAB_PROJECTS } from '../config/publicationsConfig';

const PublicationProjectPage: React.FC = () => {
  const [lang, setLang] = useState(localStorage.getItem('vetlab_lang') || 'KZ');
  const { id } = useParams();
  const project = VETLAB_PROJECTS.find((p) => p.id === id);

  useEffect(() => {
    const h = () => setLang(localStorage.getItem('vetlab_lang') || 'KZ');
    window.addEventListener('languageChange', h);
    return () => window.removeEventListener('languageChange', h);
  }, []);

  const t = TRANSLATIONS[lang] as Record<string, string>;

  if (!project) {
    return (
      <div className="bg-[#f4f7fa] min-h-screen py-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-black text-secondary uppercase mb-4">
            {t.noPublicationsFound}
          </h1>
          <Link to="/publications" className="text-secondary hover:text-accent font-bold">
            ← {t.goBack}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f4f7fa] min-h-screen py-12 animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/publications" className="inline-flex items-center gap-2 text-secondary hover:text-accent font-bold mb-8 transition-colors">
          <ChevronLeft size={18} /> {t.goBack}
        </Link>

        <article className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          <div className="aspect-[16/9] w-full overflow-hidden bg-slate-100">
            <img src={project.imageUrl} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-secondary text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
                {t.vetlabBadge}
              </span>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  project.status === 'Done' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}
              >
                {project.status === 'Done' ? t.done : t.ongoing}
              </span>
            </div>
            <p className="text-sm text-slate-500 font-bold mb-2">{project.year}</p>
            <h1 className="text-2xl md:text-3xl font-extrabold text-secondary mb-6 uppercase tracking-tight">
              {t[project.titleKey] ?? project.titleKey}
            </h1>
            <p className="text-slate-600 leading-relaxed">
              {t[project.briefKey] ?? project.briefKey}
            </p>
            <p className="mt-6 text-sm text-slate-500">
              {t.projectDetailNote}
            </p>
          </div>
        </article>
      </div>
    </div>
  );
};

export default PublicationProjectPage;
