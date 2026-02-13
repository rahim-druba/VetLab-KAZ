
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import AppointmentModal from './AppointmentModal';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lang, setLang] = useState('EN');
  const location = useLocation();

  const handleLanguageChange = (l: string) => {
    setLang(l);
    // In a real app, this would trigger i18n change
    console.log(`Language switched to ${l}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Bar - Only Languages */}
      <div className="bg-slate-50 text-secondary py-1.5 border-b border-slate-200 px-4 text-[10px] hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-end items-center font-bold tracking-widest uppercase">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => handleLanguageChange('KZ')} 
              className={`transition-colors px-2 py-0.5 rounded ${lang === 'KZ' ? 'bg-secondary text-white' : 'text-slate-400 hover:text-secondary'}`}
            >
              KZ
            </button>
            <button 
              onClick={() => handleLanguageChange('EN')} 
              className={`transition-colors px-2 py-0.5 rounded ${lang === 'EN' ? 'bg-secondary text-white' : 'text-slate-400 hover:text-secondary'}`}
            >
              EN
            </button>
            <button 
              onClick={() => handleLanguageChange('RU')} 
              className={`transition-colors px-2 py-0.5 rounded ${lang === 'RU' ? 'bg-secondary text-white' : 'text-slate-400 hover:text-secondary'}`}
            >
              RU
            </button>
          </div>
        </div>
      </div>

      {/* Main Nav - VetLab Branding */}
      <nav className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-3">
                <div className="bg-secondary p-2.5 rounded-lg text-accent font-black text-2xl shadow-sm">VET</div>
                <div className="flex flex-col">
                  <span className="text-xl font-black text-secondary leading-none tracking-tight">VETLAB KAZAKHSTAN</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-[0.3em] font-black">Advanced Veterinary Lab</span>
                </div>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden xl:flex items-center space-x-8">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:text-accent relative group ${
                    location.pathname === item.path ? 'text-secondary' : 'text-slate-500'
                  }`}
                >
                  {item.label}
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full ${location.pathname === item.path ? 'w-full' : ''}`}></span>
                </Link>
              ))}
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-secondary text-white px-8 py-3 rounded-md text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md"
              >
                Intake Request
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="xl:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-secondary hover:text-accent transition-colors"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="xl:hidden bg-white border-t border-slate-100 py-6">
            <div className="px-6 space-y-4">
              <div className="flex gap-4 mb-6 border-b border-slate-100 pb-4">
                {['KZ', 'EN', 'RU'].map(l => (
                  <button 
                    key={l}
                    onClick={() => handleLanguageChange(l)} 
                    className={`text-[11px] font-black px-4 py-2 rounded ${lang === l ? 'bg-secondary text-white' : 'text-slate-400'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block py-3 text-sm font-black uppercase tracking-widest ${
                    location.pathname === item.path ? 'text-accent' : 'text-secondary'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsModalOpen(true);
                }}
                className="block w-full text-center bg-secondary text-white px-4 py-4 rounded-lg text-xs font-black uppercase tracking-widest mt-6"
              >
                Submit Inquiry
              </button>
            </div>
          </div>
        )}
      </nav>

      <AppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </header>
  );
};

export default Header;
