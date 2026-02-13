
import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Globe } from 'lucide-react';
import { CLINIC_INFO, TRANSLATIONS } from '../constants';
import heroImage from '../BG/a-high-end-professional-architectural-photograph-o.jpeg';
import { supabase } from '../lib/supabase';

const Contacts: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [patientName, setPatientName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [message, setMessage] = useState('');
  const [lang, setLang] = useState(localStorage.getItem('vetlab_lang') || 'KZ');

  useEffect(() => {
    const handleLangChange = () => setLang(localStorage.getItem('vetlab_lang') || 'KZ');
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  const t = TRANSLATIONS[lang] as Record<string, string>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error: err } = await supabase.from('contact_inquiries').insert({
        patient_name: patientName,
        contact_phone: contactPhone,
        message,
      });
      if (err) throw err;
      setSubmitted(true);
      setPatientName('');
      setContactPhone('');
      setMessage('');
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f7ff]">
      {/* Hero - professional architectural image with gradient overlay (same as other pages) */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden border-b border-slate-200">
        <img
          src={heroImage}
          alt={t.contactsArchAlt}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-secondary/60 via-secondary/40 to-secondary/25"
          aria-hidden
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 text-white text-center md:text-left">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">{t.contactsLocationsTitle}</h1>
            <p className="text-white/90 text-base md:text-lg max-w-2xl font-medium tracking-wide uppercase">
              {t.contactsLocationsSub}
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col gap-6 sm:gap-8">
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-secondary uppercase tracking-tight">{t.contactsRegionalHubs}</h2>
            <div className="space-y-4">
              {CLINIC_INFO.branches.map((branch, i) => (
                <div key={i} className="group p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-secondary/30 hover:shadow-md transition-all">
                  <h4 className="text-base font-bold text-secondary uppercase tracking-tight mb-3">{i === 0 ? t.contactsAlmatyName : t.contactsAstanaName}</h4>
                  <div className="space-y-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    <div className="flex gap-2 items-center">
                      <MapPin className="text-accent shrink-0" size={14} />
                      {i === 0 ? t.contactsAlmatyAddress : t.contactsAstanaAddress}
                    </div>
                    <div className="flex gap-2 items-center">
                      <Phone className="text-accent shrink-0" size={14} />
                      {branch.phone}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-secondary text-white p-5 rounded-xl space-y-3 shadow-md">
              <h4 className="font-bold flex items-center gap-2 text-white text-[10px] uppercase tracking-wider">
                <Globe size={14} className="text-accent shrink-0" /> {t.contactsCorporateInfo}
              </h4>
              <div className="text-[10px] font-semibold uppercase tracking-wider space-y-2 text-white/90">
                <p className="flex items-center gap-2">
                  <span className="opacity-70">{t.contactsDigitalLabel}</span> {CLINIC_INFO.email}
                </p>
                <p className="flex items-center gap-2">
                  <span className="opacity-70">{t.contactsProtocolLabel}</span> {CLINIC_INFO.hours}
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-slate-100">
              <h3 className="text-xl font-bold text-secondary uppercase tracking-tight mb-6">{t.contactsSubmitInquiry}</h3>
              {submitted ? (
                <div className="bg-white border border-slate-200 p-6 rounded-xl text-center space-y-4">
                  <div className="w-14 h-14 bg-secondary text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold shadow-md">✓</div>
                  <h4 className="text-xl font-bold text-secondary uppercase tracking-tight">{t.requestLogged}</h4>
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">{t.requestSub}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2">{error}</p>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t.patientName}</label>
                      <input required type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium text-secondary hover:border-slate-300 focus:ring-2 focus:ring-secondary/30 outline-none transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t.contactPhone}</label>
                      <input required type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium text-secondary hover:border-slate-300 focus:ring-2 focus:ring-secondary/30 outline-none transition-all" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t.message}</label>
                    <textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium text-secondary hover:border-slate-300 focus:ring-2 focus:ring-secondary/30 outline-none transition-all resize-y min-h-[100px]"></textarea>
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-secondary text-white py-3 rounded-lg font-semibold text-xs uppercase tracking-wider hover:bg-slate-800 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none">
                    {loading ? 'Sending…' : t.submit} <Send size={16} className="text-accent" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="h-[280px] sm:h-[400px] md:h-[500px] lg:h-[600px] w-full relative grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
        <iframe 
          title="Clinic Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2906.7725458045517!2d76.8837332!3d43.2351473!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38836ec3b91a7e6b%3A0xc487d602388e6a1e!2zUm96eWJha2l5ZXZhIDIzMCwgQWxtYXR5IDUwMDAwMA!5e0!3m2!1sen!2skz!4v1700000000000!5m2!1sen!2skz" 
          className="absolute inset-0 w-full h-full border-0"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default Contacts;
