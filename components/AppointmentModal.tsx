import React, { useState, useEffect } from 'react';
import { X, Send, Phone, User, PawPrint, Calendar, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import { addAppointmentToCache } from '../lib/appointmentsCache';
import { TRANSLATIONS } from '../constants';

const SERVICE_OPTION_KEYS = [
  'serviceGeneralCheckup',
  'serviceVaccination',
  'serviceLabWork',
  'serviceSurgeryConsultation',
  'serviceEmergencyVisit',
  'serviceOther',
] as const;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AppointmentModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [lang, setLang] = useState(localStorage.getItem('vetlab_lang') || 'KZ');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ownerName, setOwnerName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [petName, setPetName] = useState('');
  const [petDetails, setPetDetails] = useState('');
  const [department, setDepartment] = useState(SERVICE_OPTION_KEYS[0]);

  useEffect(() => {
    const handleLangChange = () => setLang(localStorage.getItem('vetlab_lang') || 'KZ');
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  const t = TRANSLATIONS[lang];

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const petInfo = [petName, petDetails].filter(Boolean).join(' — ') || null;
      const row: Record<string, unknown> = {
        full_name: ownerName,
        contact_phone: contactPhone,
        department,
        notes: petInfo,
        ...(user?.id && { user_id: user.id }),
        ...(user?.email && { email: user.email }),
      };
      const { error: err } = await supabase.from('appointments').insert(row);
      if (err) throw err;
      if (user?.id) {
        addAppointmentToCache(user.id, {
          full_name: ownerName,
          contact_phone: contactPhone,
          department,
          notes: petInfo,
          owner_name: ownerName,
          pet_name: petName || null,
          pet_details: petDetails || null,
        });
      }
      setSubmitted(true);
      setOwnerName('');
      setContactPhone('');
      setPetName('');
      setPetDetails('');
      setDepartment(SERVICE_OPTION_KEYS[0]);
      window.dispatchEvent(new Event('appointmentsUpdated'));
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.submitError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:px-4 overflow-y-auto">
      <div
        className="absolute inset-0 bg-secondary/70 backdrop-blur-sm transition-opacity cursor-pointer hover:bg-secondary/75"
        onClick={onClose}
      ></div>

      <div className="relative bg-white w-full max-w-md max-h-[90vh] overflow-y-auto rounded-lg shadow-xl animate-in zoom-in-95 duration-200 border border-slate-200 my-auto">
        <div className="bg-secondary px-5 py-4 text-white flex justify-between items-center">
          <div className="space-y-0.5">
            <h3 className="text-xl font-bold">{t.appointmentModalTitle}</h3>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">{t.petAndOwnerInfo}</p>
          </div>
          <button onClick={onClose} className="hover:bg-white/10 active:scale-95 p-1.5 rounded-md transition-all text-white">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 bg-white">
          {submitted ? (
            <div className="text-center space-y-4 py-6">
              <div className="w-14 h-14 bg-primary text-accent rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={28} />
              </div>
              <h4 className="text-xl font-bold text-secondary">{t.requestReceived}</h4>
              <p className="text-slate-500 font-medium text-base leading-relaxed">
                {t.requestReceivedSub}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</p>
              )}
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <User size={11} className="text-accent" /> {t.petOwnerName}
                </label>
                <input
                  required
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2.5 hover:border-slate-300 focus:ring-1 focus:ring-accent focus:border-accent outline-none font-bold text-secondary text-sm transition-all"
                  placeholder={t.placeholderFullName}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Phone size={11} className="text-accent" /> {t.contactNumber}
                </label>
                <input
                  required
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2.5 hover:border-slate-300 focus:ring-1 focus:ring-accent focus:border-accent outline-none font-bold text-secondary text-sm transition-all"
                  placeholder={t.placeholderPhone}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <PawPrint size={11} className="text-accent" /> {t.petName}
                </label>
                <input
                  type="text"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2.5 hover:border-slate-300 focus:ring-1 focus:ring-accent focus:border-accent outline-none font-bold text-secondary text-sm transition-all"
                  placeholder={t.placeholderPetName}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <PawPrint size={11} className="text-accent" /> {t.petDetails}
                </label>
                <input
                  type="text"
                  value={petDetails}
                  onChange={(e) => setPetDetails(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2.5 hover:border-slate-300 focus:ring-1 focus:ring-accent focus:border-accent outline-none font-bold text-secondary text-sm transition-all"
                  placeholder={t.placeholderPetDetails}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Calendar size={11} className="text-accent" /> {t.service}
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as typeof SERVICE_OPTION_KEYS[number])}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2.5 hover:border-slate-300 focus:ring-1 focus:ring-accent focus:border-accent outline-none font-bold text-secondary text-sm transition-all appearance-none cursor-pointer"
                >
                  {SERVICE_OPTION_KEYS.map((key) => (
                    <option key={key} value={key}>{t[key]}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-secondary text-white py-3 rounded-md font-black text-sm uppercase tracking-[0.2em] hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
              >
                {loading ? t.sending : t.sendRequest} <Send size={14} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;
