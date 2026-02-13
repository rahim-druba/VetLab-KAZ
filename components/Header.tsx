
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { NAV_ITEMS, TRANSLATIONS } from '../constants';
import { useAuth } from '../lib/AuthContext';
import AppointmentModal from './AppointmentModal';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [innovationDropdownOpen, setInnovationDropdownOpen] = useState(false);
  const [rightCabinetOpen, setRightCabinetOpen] = useState(false);
  const [lang, setLang] = useState(localStorage.getItem('vetlab_lang') || 'KZ');
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const aboutDropdownRef = useRef<HTMLDivElement>(null);
  const innovationDropdownRef = useRef<HTMLDivElement>(null);
  const rightCabinetRef = useRef<HTMLDivElement>(null);

  const isAboutSection = (path: string) => path === '/about' || path === '/doctors' || path === '/faq' || path === '/contacts';
  const isInnovationSection = (path: string) => path === '/innovation' || path === '/publications' || path === '/technology';

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) setLangDropdownOpen(false);
      if (aboutDropdownRef.current && !aboutDropdownRef.current.contains(e.target as Node)) setAboutDropdownOpen(false);
      if (innovationDropdownRef.current && !innovationDropdownRef.current.contains(e.target as Node)) setInnovationDropdownOpen(false);
      if (rightCabinetRef.current && !rightCabinetRef.current.contains(e.target as Node)) setRightCabinetOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  useEffect(() => {
    const openModal = () => setIsModalOpen(true);
    window.addEventListener('openAppointmentModal', openModal);
    return () => window.removeEventListener('openAppointmentModal', openModal);
  }, []);

  const handleLanguageChange = (l: string) => {
    setLang(l);
    localStorage.setItem('vetlab_lang', l);
    window.dispatchEvent(new Event('languageChange'));
    setLangDropdownOpen(false);
  };

  const t = TRANSLATIONS[lang];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 shadow-sm">
      <nav className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 w-full min-w-0">
        <div className="flex justify-between items-center min-h-14 py-2 gap-4">
          {/* Logo Area - Compacted */}
          <div className="flex items-center shrink-0">
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <div className="bg-white border border-slate-100 w-9 h-9 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all">
                <span className="text-accent font-black text-sm tracking-tighter">VL</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-secondary leading-none whitespace-nowrap group-hover:text-accent transition-colors">VETLAB KAZ</span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu - two lines allowed so nav never overlaps logo; gap between logo and nav */}
          <div className="hidden xl:flex items-center flex-1 justify-end gap-4 min-w-0 ml-4 xl:ml-6">
            <div className="flex flex-wrap items-center justify-end content-center gap-x-2 gap-y-1 xl:gap-x-3 2xl:gap-x-4">
              {NAV_ITEMS.map((item) => {
                if (item.path === '/doctors' || item.path === '/faq' || item.path === '/contacts' || item.path === '/cabinet') return null;
                if (item.path === '/publications' || item.path === '/technology') return null;
                if (item.path === '/about') {
                  return (
                    <div key={item.path} className="relative" ref={aboutDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
                        className={`text-sm font-semibold transition-all hover:text-accent relative py-2 whitespace-nowrap group ${
                          isAboutSection(location.pathname) ? 'text-secondary' : 'text-slate-400'
                        }`}
                      >
                        {t[item.label] || item.label}
                        <span className={`absolute bottom-0 left-0 h-0.5 bg-accent transition-all duration-300 ${isAboutSection(location.pathname) ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                      </button>
                      {aboutDropdownOpen && (
                        <div className="absolute left-0 top-full mt-1 py-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                          <Link to="/about" onClick={() => setAboutDropdownOpen(false)} className={`block w-full text-left px-4 py-2 text-sm font-semibold transition-colors ${location.pathname === '/about' ? 'bg-secondary text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                            {t.about}
                          </Link>
                          <Link to="/doctors" onClick={() => setAboutDropdownOpen(false)} className={`block w-full text-left px-4 py-2 text-sm font-semibold transition-colors ${location.pathname === '/doctors' ? 'bg-secondary text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                            {t.specialists}
                          </Link>
                          <Link to="/faq" onClick={() => setAboutDropdownOpen(false)} className={`block w-full text-left px-4 py-2 text-sm font-semibold transition-colors ${location.pathname === '/faq' ? 'bg-secondary text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                            {t.faq}
                          </Link>
                          <Link to="/contacts" onClick={() => setAboutDropdownOpen(false)} className={`block w-full text-left px-4 py-2 text-sm font-semibold transition-colors ${location.pathname === '/contacts' ? 'bg-secondary text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                            {t.contacts}
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                }
                if (item.path === '/innovation') {
                  return (
                    <div key={item.path} className="relative" ref={innovationDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setInnovationDropdownOpen(!innovationDropdownOpen)}
                        className={`text-sm font-semibold transition-all hover:text-accent relative py-2 whitespace-nowrap group ${
                          isInnovationSection(location.pathname) ? 'text-secondary' : 'text-slate-400'
                        }`}
                      >
                        {t[item.label] || item.label}
                        <span className={`absolute bottom-0 left-0 h-0.5 bg-accent transition-all duration-300 ${isInnovationSection(location.pathname) ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                      </button>
                      {innovationDropdownOpen && (
                        <div className="absolute left-0 top-full mt-1 py-1 min-w-[280px] w-max max-w-[90vw] bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                          <Link to="/innovation" onClick={() => setInnovationDropdownOpen(false)} className={`block w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors ${location.pathname === '/innovation' ? 'bg-secondary text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                            {t.innovation}
                          </Link>
                          <Link to="/publications" onClick={() => setInnovationDropdownOpen(false)} className={`block w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap ${location.pathname === '/publications' ? 'bg-secondary text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                            {t.publicationsResearch}
                          </Link>
                          <Link to="/technology" onClick={() => setInnovationDropdownOpen(false)} className={`block w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors ${location.pathname === '/technology' ? 'bg-secondary text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                            {t.technology}
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`text-sm font-semibold transition-all hover:text-accent relative py-2 group text-left leading-tight whitespace-nowrap ${
                      location.pathname === item.path ? 'text-secondary' : 'text-slate-400'
                    }`}
                  >
                    {t[item.label] || item.label}
                    <span className={`absolute bottom-0 left-0 h-0.5 bg-accent transition-all duration-300 ${location.pathname === item.path ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                  </Link>
                );
              })}
            </div>

            {/* Right Side Actions - Compacted */}
            <div className="flex items-center gap-3 2xl:gap-4 ml-2 pl-4 border-l border-slate-100 shrink-0">
              <div className="relative" ref={langDropdownRef}>
                <button
                  type="button"
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="p-2 rounded-lg text-slate-500 hover:text-secondary hover:bg-slate-100 transition-all"
                  title="Language"
                  aria-label="Select language"
                >
                  <Globe size={20} />
                </button>
                {langDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 py-1 w-28 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                    {['KZ', 'EN', 'RU'].map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => handleLanguageChange(l)}
                        className={`w-full text-left px-4 py-2 text-sm font-semibold transition-colors ${
                          lang === l ? 'bg-secondary text-white' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative" ref={rightCabinetRef}>
                <button
                  type="button"
                  onClick={() => setRightCabinetOpen(!rightCabinetOpen)}
                  className="bg-secondary text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-accent hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shadow-secondary/5 whitespace-nowrap"
                >
                  {user ? t.dashboardLabel : t.signIn}
                </button>
                {rightCabinetOpen && (
                  <div className="absolute right-0 top-full mt-1 py-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                    {user ? (
                      <Link to="/cabinet" onClick={() => setRightCabinetOpen(false)} className={`block w-full text-left px-4 py-2 text-sm font-semibold transition-colors ${location.pathname === '/cabinet' ? 'bg-secondary text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                        {t.cabinetLabel}
                      </Link>
                    ) : (
                      <>
                        <Link to="/cabinet" onClick={() => setRightCabinetOpen(false)} className="block w-full text-left px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                          {t.signIn}
                        </Link>
                        <Link to="/cabinet" onClick={() => setRightCabinetOpen(false)} className={`block w-full text-left px-4 py-2 text-sm font-semibold transition-colors ${location.pathname === '/cabinet' ? 'bg-secondary text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                          {t.cabinetLabel}
                        </Link>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => { setRightCabinetOpen(false); setIsModalOpen(true); }}
                      className="block w-full text-left px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      {t.appointment}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="xl:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-secondary hover:text-accent hover:scale-110 p-2 transition-all"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="xl:hidden bg-white border-t border-slate-50 py-6 sm:py-8 animate-in slide-in-from-top-4 duration-300 max-h-[85vh] overflow-y-auto">
            <div className="px-4 sm:px-6 space-y-6">
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {NAV_ITEMS.map((item) => {
                  if (item.path === '/doctors' || item.path === '/faq' || item.path === '/contacts' || item.path === '/cabinet') return null;
                  if (item.path === '/publications' || item.path === '/technology') return null;
                  if (item.path === '/about') {
                    return (
                      <React.Fragment key={item.path}>
                        <Link to="/about" onClick={() => setIsOpen(false)} className={`block py-4 px-5 rounded-xl text-sm font-black uppercase tracking-widest border border-transparent transition-all active:scale-[0.98] ${location.pathname === '/about' ? 'bg-primary text-secondary border-primary shadow-inner' : 'text-slate-500 hover:bg-slate-50 hover:border-slate-100'}`}>
                          {t.about}
                        </Link>
                        <Link to="/doctors" onClick={() => setIsOpen(false)} className={`block py-4 px-5 rounded-xl text-sm font-black uppercase tracking-widest border border-transparent transition-all active:scale-[0.98] ${location.pathname === '/doctors' ? 'bg-primary text-secondary border-primary shadow-inner' : 'text-slate-500 hover:bg-slate-50 hover:border-slate-100'}`}>
                          {t.specialists}
                        </Link>
                        <Link to="/faq" onClick={() => setIsOpen(false)} className={`block py-4 px-5 rounded-xl text-sm font-black uppercase tracking-widest border border-transparent transition-all active:scale-[0.98] ${location.pathname === '/faq' ? 'bg-primary text-secondary border-primary shadow-inner' : 'text-slate-500 hover:bg-slate-50 hover:border-slate-100'}`}>
                          {t.faq}
                        </Link>
                        <Link to="/contacts" onClick={() => setIsOpen(false)} className={`block py-4 px-5 rounded-xl text-sm font-black uppercase tracking-widest border border-transparent transition-all active:scale-[0.98] ${location.pathname === '/contacts' ? 'bg-primary text-secondary border-primary shadow-inner' : 'text-slate-500 hover:bg-slate-50 hover:border-slate-100'}`}>
                          {t.contacts}
                        </Link>
                      </React.Fragment>
                    );
                  }
                  if (item.path === '/innovation') {
                    return (
                      <React.Fragment key={item.path}>
                        <Link to="/innovation" onClick={() => setIsOpen(false)} className={`block py-4 px-5 rounded-xl text-sm font-black uppercase tracking-widest border border-transparent transition-all active:scale-[0.98] ${location.pathname === '/innovation' ? 'bg-primary text-secondary border-primary shadow-inner' : 'text-slate-500 hover:bg-slate-50 hover:border-slate-100'}`}>
                          {t.innovation}
                        </Link>
                        <Link to="/publications" onClick={() => setIsOpen(false)} className={`block py-4 px-5 rounded-xl text-sm font-black uppercase tracking-widest border border-transparent transition-all active:scale-[0.98] col-span-2 ${location.pathname === '/publications' ? 'bg-primary text-secondary border-primary shadow-inner' : 'text-slate-500 hover:bg-slate-50 hover:border-slate-100'}`}>
                          {t.publicationsResearchL1} {t.publicationsResearchL2}
                        </Link>
                        <Link to="/technology" onClick={() => setIsOpen(false)} className={`block py-4 px-5 rounded-xl text-sm font-black uppercase tracking-widest border border-transparent transition-all active:scale-[0.98] ${location.pathname === '/technology' ? 'bg-primary text-secondary border-primary shadow-inner' : 'text-slate-500 hover:bg-slate-50 hover:border-slate-100'}`}>
                          {t.technology}
                        </Link>
                      </React.Fragment>
                    );
                  }
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`block py-4 px-5 rounded-xl text-sm font-black uppercase tracking-widest border border-transparent transition-all active:scale-[0.98] ${
                        location.pathname === item.path ? 'bg-primary text-secondary border-primary shadow-inner' : 'text-slate-500 hover:bg-slate-50 hover:border-slate-100'
                      }`}
                    >
                      {t[item.label] || item.label}
                    </Link>
                  );
                })}
              </div>
              
              <div className="pt-6 border-t border-slate-100 flex flex-col gap-4">
                <div className="flex items-center justify-center gap-2">
                  <Globe size={20} className="text-slate-400 shrink-0" />
                  <div className="flex gap-2">
                    {['KZ', 'EN', 'RU'].map(l => (
                      <button
                        key={l}
                        onClick={() => handleLanguageChange(l)}
                        className={`text-xs font-black px-5 py-3 rounded-xl border transition-all active:scale-[0.95] ${
                          lang === l
                            ? 'bg-secondary text-white border-secondary shadow-lg'
                            : 'text-slate-400 border-slate-100 hover:border-slate-300'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                {user ? (
                  <>
                    <Link to="/cabinet/dashboard" onClick={() => setIsOpen(false)} className="w-full text-center bg-white text-secondary border border-slate-200 py-5 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-primary transition-all block">
                      {t.dashboardLabel}
                    </Link>
                    <Link to="/cabinet" onClick={() => setIsOpen(false)} className="w-full text-center bg-white text-secondary border border-slate-200 py-5 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-primary transition-all block">
                      {t.cabinetLabel}
                    </Link>
                  </>
                ) : (
                  <Link to="/cabinet" onClick={() => setIsOpen(false)} className="w-full text-center bg-white text-secondary border border-slate-200 py-5 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-primary transition-all block">
                    {t.signIn}
                  </Link>
                )}
                <button
                  onClick={() => { setIsOpen(false); setIsModalOpen(true); }}
                  className="w-full text-center bg-secondary text-white py-5 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-accent hover:scale-[1.02] transition-all shadow-2xl"
                >
                  {t.appointment}
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <AppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </header>
  );
};

export default Header;
