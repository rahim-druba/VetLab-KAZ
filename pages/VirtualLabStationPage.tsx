import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, Dna, Activity, Microscope } from 'lucide-react';
import { TRANSLATIONS } from '../constants';
import molecularSuiteImage from '../BG/a-cutting-edge-veterinary-molecular-laboratory-fea.jpeg';
import biochemistryImage from '../BG/a-high-tech-veterinary-biochemistry-laboratory-foc.jpeg';
import histologyWingImage from '../BG/a-state-of-the-art-veterinary-histology-laboratory.jpeg';

const STATION_KEYS: Record<string, { titleKey: string; descKey: string; longDescKey: string; image: string; icon: typeof Dna }> = {
  'molecular-suite': { titleKey: 'stationMolecularSuiteTitle', descKey: 'stationMolecularSuiteDesc', longDescKey: 'stationMolecularSuiteLongDesc', image: molecularSuiteImage, icon: Dna },
  'biochemistry-deck': { titleKey: 'stationBiochemistryDeckTitle', descKey: 'stationBiochemistryDeckDesc', longDescKey: 'stationBiochemistryDeckLongDesc', image: biochemistryImage, icon: Activity },
  'histology-wing': { titleKey: 'stationHistologyWingTitle', descKey: 'stationHistologyWingDesc', longDescKey: 'stationHistologyWingLongDesc', image: histologyWingImage, icon: Microscope }
};

const VirtualLabStationPage: React.FC = () => {
  const [lang, setLang] = useState(localStorage.getItem('vetlab_lang') || 'KZ');
  const { stationId } = useParams<{ stationId: string }>();

  useEffect(() => {
    const h = () => setLang(localStorage.getItem('vetlab_lang') || 'KZ');
    window.addEventListener('languageChange', h);
    return () => window.removeEventListener('languageChange', h);
  }, []);

  const t = TRANSLATIONS[lang] as Record<string, string>;
  const stationMeta = stationId ? STATION_KEYS[stationId] : null;

  if (!stationMeta) {
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

  const Icon = stationMeta.icon;

  return (
    <div className="min-h-screen bg-[#f0f7ff] selection:bg-accent selection:text-secondary">
      <section className="relative min-h-[40vh] flex items-center overflow-hidden border-b border-slate-200">
        <img src={stationMeta.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/70 via-secondary/40 to-secondary/20" aria-hidden />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 w-full">
          <Link to="/virtual-lab" className="inline-flex items-center gap-2 text-white/90 hover:text-accent font-semibold text-sm mb-6 transition-colors">
            <ChevronLeft size={18} /> {t?.backToDepts ?? 'Back'}
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
              <Icon className="text-accent" size={28} />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tight">{t[stationMeta.titleKey]}</h1>
              <p className="text-white/90 text-sm md:text-base mt-1 max-w-2xl">{t[stationMeta.descKey]}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-md overflow-hidden">
          <div className="p-8 md:p-10">
            <h2 className="text-accent text-xs font-black uppercase tracking-widest mb-4">{t?.overview ?? 'Overview'}</h2>
            <p className="text-slate-600 leading-relaxed">{t[stationMeta.longDescKey]}</p>
            <div className="mt-10 pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <span className="text-accent text-[10px] font-bold uppercase tracking-wider">{t.protocolLabel}</span>
                <p className="font-semibold text-secondary text-sm">{t.oieCompliance}</p>
              </div>
              <div className="space-y-1">
                <span className="text-accent text-[10px] font-bold uppercase tracking-wider">{t.hardwareLabel}</span>
                <p className="font-semibold text-secondary text-sm">{t.bbraunIntegrated}</p>
              </div>
              <div className="space-y-1">
                <span className="text-accent text-[10px] font-bold uppercase tracking-wider">{t.interpretationLabel}</span>
                <p className="font-semibold text-secondary text-sm">{t.certifiedDVM}</p>
              </div>
            </div>
          </div>
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

export default VirtualLabStationPage;
