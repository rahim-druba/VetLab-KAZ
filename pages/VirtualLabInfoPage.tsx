import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, FileCheck, Cpu, Users } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

const INFO_CONFIG: Record<string, { titleKey: string; contentKey: string; icon: typeof FileCheck }> = {
  protocol: { titleKey: 'protocolPageTitle', contentKey: 'protocolPageContent', icon: FileCheck },
  hardware: { titleKey: 'hardwarePageTitle', contentKey: 'hardwarePageContent', icon: Cpu },
  interpretation: { titleKey: 'interpretationPageTitle', contentKey: 'interpretationPageContent', icon: Users }
};

const VirtualLabInfoPage: React.FC = () => {
  const [lang, setLang] = useState(localStorage.getItem('vetlab_lang') || 'KZ');
  const { infoType } = useParams<{ infoType: string }>();

  useEffect(() => {
    const h = () => setLang(localStorage.getItem('vetlab_lang') || 'KZ');
    window.addEventListener('languageChange', h);
    return () => window.removeEventListener('languageChange', h);
  }, []);

  const t = TRANSLATIONS[lang] as Record<string, string>;
  const info = infoType ? INFO_CONFIG[infoType] : null;

  if (!info) {
    return (
      <div className="min-h-screen bg-[#f0f7ff] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-secondary mb-4">{t?.noPublicationsFound ?? 'Not found'}</h1>
          <Link to="/virtual-lab" className="text-secondary hover:text-accent font-semibold">
            ← {t?.goBack ?? 'Go back'}
          </Link>
        </div>
      </div>
    );
  }

  const Icon = info.icon;

  return (
    <div className="min-h-screen bg-[#f0f7ff] selection:bg-accent selection:text-secondary">
      <section className="bg-secondary text-white py-16 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4">
          <Link to="/virtual-lab" className="inline-flex items-center gap-2 text-white/90 hover:text-accent font-semibold text-sm mb-6 transition-colors">
            <ChevronLeft size={18} /> {t?.backToDepts ?? 'Back'}
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
              <Icon className="text-accent" size={28} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t[info.titleKey]}</h1>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-8 md:p-10">
          <p className="text-slate-600 leading-relaxed">{t[info.contentKey]}</p>
        </div>
        <div className="mt-8 text-center">
          <Link to="/virtual-lab" className="inline-flex items-center gap-2 bg-secondary text-white hover:bg-secondary/90 px-6 py-3 rounded-xl font-semibold text-sm transition-all">
            <ChevronLeft size={16} /> {t?.backToVirtualLab ?? 'Back to Virtual Lab'}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default VirtualLabInfoPage;
