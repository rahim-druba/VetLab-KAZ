
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react';
import { CLINIC_INFO, NAV_ITEMS, TRANSLATIONS } from '../constants';

const Footer: React.FC = () => {
  const [lang, setLang] = useState(localStorage.getItem('vetlab_lang') || 'KZ');

  useEffect(() => {
    const handleLangChange = () => setLang(localStorage.getItem('vetlab_lang') || 'KZ');
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  const t = TRANSLATIONS[lang];

  return (
    <footer className="bg-secondary text-white pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2 group hover:opacity-90 transition-all">
              <div className="bg-white p-1 rounded-md text-secondary font-bold text-xs shadow-sm group-hover:shadow group-hover:scale-105 transition-all">VL</div>
              <span className="text-sm font-bold text-white group-hover:text-accent transition-colors">VETLAB KAZ</span>
            </Link>
            <p className="text-white/70 text-[11px] leading-relaxed font-medium uppercase tracking-wider">
              {t.footerDesc}
            </p>
            <div className="flex gap-2">
              <a href="#" className="p-1 bg-white/10 rounded hover:bg-accent hover:text-secondary hover:scale-110 active:scale-95 transition-all" aria-label="Instagram">
                <Instagram size={14} />
              </a>
              <a href="#" className="p-1 bg-white/10 rounded hover:bg-accent hover:text-secondary hover:scale-110 active:scale-95 transition-all" aria-label="Facebook">
                <Facebook size={14} />
              </a>
            </div>
          </div>

          {/* Sitemap - Updated to 2 columns */}
          <div className="lg:col-span-1">
            <h4 className="text-white text-[11px] font-semibold uppercase tracking-wider mb-4 border-b border-white/10 pb-1.5">{t.explore}</h4>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="text-xs font-medium text-white/80 hover:text-accent hover:underline transition-colors uppercase tracking-wide inline-block">
                    {item.label === 'publicationsResearch' ? (
                      <>
                        <span className="block">{t.publicationsResearchL1}</span>
                        <span className="block">{t.publicationsResearchL2}</span>
                      </>
                    ) : (
                      <span className="whitespace-nowrap">{t[item.label] || item.label}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Expertise */}
          <div>
            <h4 className="text-white text-[11px] font-semibold uppercase tracking-wider mb-4 border-b border-white/10 pb-1.5">{t.expertise}</h4>
            <ul className="space-y-2 text-xs font-medium text-white/80 uppercase tracking-wide">
              <li><Link to="/services" className="hover:text-accent hover:underline transition-colors">{t.molecularDiagnostics}</Link></li>
              <li><Link to="/services" className="hover:text-accent hover:underline transition-colors">{t.geneticPathology}</Link></li>
              <li><Link to="/services" className="hover:text-accent hover:underline transition-colors">{t.viralResearch}</Link></li>
              <li><Link to="/services" className="hover:text-accent hover:underline transition-colors">{t.resources}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-[11px] font-semibold uppercase tracking-wider mb-4 border-b border-white/10 pb-1.5">{t.contactHq}</h4>
            <ul className="space-y-2">
              <li className="flex gap-2">
                <MapPin className="text-accent shrink-0 mt-0.5" size={12} />
                <Link to="/contacts" className="text-xs font-medium text-white/90 leading-snug uppercase tracking-wide hover:text-accent transition-colors">{CLINIC_INFO.address}</Link>
              </li>
              <li className="flex gap-2">
                <Phone className="text-accent shrink-0 mt-0.5" size={12} />
                <a href={`tel:${CLINIC_INFO.phone.replace(/\s/g, '')}`} className="text-xs font-medium text-white/90 tracking-wide hover:text-accent transition-colors">{CLINIC_INFO.phone}</a>
              </li>
              <li className="flex gap-2">
                <Mail className="text-accent shrink-0 mt-0.5" size={12} />
                <a href={`mailto:${CLINIC_INFO.email}`} className="text-xs font-medium text-white/90 tracking-wide uppercase hover:text-accent transition-colors break-all">{CLINIC_INFO.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-4 flex flex-col md:flex-row justify-between items-center gap-3 text-[11px] font-medium uppercase tracking-wide text-white/50">
          <p>© {new Date().getFullYear()} VetLab Kaz. {t.rights}</p>
          <div className="flex gap-8">
            <Link to="/privacy" className="hover:text-white hover:underline transition-colors">{t.privacy}</Link>
            <Link to="/terms" className="hover:text-white hover:underline transition-colors">{t.terms}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
