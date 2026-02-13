import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TRANSLATIONS } from '../constants';
import { Microscope, Dna, Activity, ArrowRight, Eye } from 'lucide-react';
import heroImage from '../BG/a-futuristic-digital-twin-of-a-veterinary-diagnost.jpeg';
import biochemistryImage from '../BG/a-high-tech-veterinary-biochemistry-laboratory-foc.jpeg';
import molecularSuiteImage from '../BG/a-cutting-edge-veterinary-molecular-laboratory-fea.jpeg';
import histologyWingImage from '../BG/a-state-of-the-art-veterinary-histology-laboratory.jpeg';

const VirtualLabPage: React.FC = () => {
  const [lang, setLang] = useState(localStorage.getItem('vetlab_lang') || 'KZ');
  const [activeStation, setActiveStation] = useState(0);

  useEffect(() => {
    const handleLangChange = () => setLang(localStorage.getItem('vetlab_lang') || 'KZ');
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  const t = TRANSLATIONS[lang];

  const STATIONS = [
    { slug: 'molecular-suite', titleKey: 'stationMolecularSuiteTitle', descKey: 'stationMolecularSuiteDesc', icon: Dna, image: molecularSuiteImage },
    { slug: 'biochemistry-deck', titleKey: 'stationBiochemistryDeckTitle', descKey: 'stationBiochemistryDeckDesc', icon: Activity, image: biochemistryImage },
    { slug: 'histology-wing', titleKey: 'stationHistologyWingTitle', descKey: 'stationHistologyWingDesc', icon: Microscope, image: histologyWingImage }
  ];

  return (
    <div className="min-h-screen bg-[#f0f7ff] selection:bg-accent selection:text-secondary">
      {/* Hero - same settings as About/Services: image + blue gradient overlay */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden border-b border-slate-200">
        <img
          src={heroImage}
          alt="Futuristic digital twin of a veterinary diagnostic lab"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-secondary/60 via-secondary/40 to-secondary/25"
          aria-hidden
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 text-white text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{t.virtualLabTitle}</h1>
          <p className="text-white/90 text-base md:text-lg max-w-2xl font-medium tracking-wide">
            {t.virtualLabSub}
          </p>
        </div>
      </section>

      {/* Interactive Explorer - same light UI as other pages */}
      <section className="max-w-7xl mx-auto px-4 py-16 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Station Selection */}
          <div className="lg:col-span-4 space-y-4">
            {STATIONS.map((station, i) => (
              <Link
                key={i}
                to={`/virtual-lab/station/${station.slug}`}
                onMouseEnter={() => setActiveStation(i)}
                className={`w-full group text-left p-6 rounded-xl border transition-all duration-300 flex items-center justify-between active:scale-[0.99] block ${
                  activeStation === i 
                    ? 'bg-secondary border-secondary text-white shadow-lg' 
                    : 'bg-white border-slate-200 text-secondary hover:border-accent hover:bg-slate-50 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-4">
                  <station.icon size={22} className={activeStation === i ? 'text-accent' : 'text-slate-400 group-hover:text-accent'} />
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Station 0{i + 1}</span>
                    <h3 className="text-base font-bold uppercase tracking-tight">{t[station.titleKey]}</h3>
                  </div>
                </div>
                <div className={`p-2 rounded-full transition-all ${activeStation === i ? 'bg-accent text-secondary' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-100'}`}>
                  <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>

          {/* Station Detail Display */}
          <div className="lg:col-span-8 relative">
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-md">
              <div className="aspect-video relative overflow-hidden group">
                <img 
                  src={STATIONS[activeStation].image} 
                  className="w-full h-full object-cover grayscale-[0.15] transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105" 
                  alt={t[STATIONS[activeStation].titleKey]} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/30 to-transparent pointer-events-none" aria-hidden />
                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end z-10">
                  <div className="space-y-2">
                    <h4 className="text-xl md:text-2xl font-bold text-white leading-tight">{t[STATIONS[activeStation].titleKey]}</h4>
                    <p className="text-white/90 font-medium text-sm leading-relaxed max-w-lg">
                      {t[STATIONS[activeStation].descKey]}
                    </p>
                  </div>
                  <Link to={`/virtual-lab/station/${STATIONS[activeStation].slug}`} className="bg-accent text-secondary p-4 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg inline-flex">
                    <Eye size={20} />
                  </Link>
                </div>
              </div>
              
              <div className="p-8 grid grid-cols-2 md:grid-cols-3 gap-6 bg-slate-50/50 border-t border-slate-100">
                <Link to="/virtual-lab/info/protocol" className="space-y-1 block p-3 -m-3 rounded-lg hover:bg-white/60 transition-colors">
                  <span className="text-accent text-[10px] font-bold uppercase tracking-wider">{t.protocolLabel}</span>
                  <p className="font-semibold text-secondary text-sm">{t.oieCompliance}</p>
                </Link>
                <Link to="/virtual-lab/info/hardware" className="space-y-1 block p-3 -m-3 rounded-lg hover:bg-white/60 transition-colors">
                  <span className="text-accent text-[10px] font-bold uppercase tracking-wider">{t.hardwareLabel}</span>
                  <p className="font-semibold text-secondary text-sm">{t.bbraunIntegrated}</p>
                </Link>
                <Link to="/virtual-lab/info/interpretation" className="space-y-1 block p-3 -m-3 rounded-lg hover:bg-white/60 transition-colors">
                  <span className="text-accent text-[10px] font-bold uppercase tracking-wider">{t.interpretationLabel}</span>
                  <p className="font-semibold text-secondary text-sm">{t.certifiedDVM}</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VirtualLabPage;
