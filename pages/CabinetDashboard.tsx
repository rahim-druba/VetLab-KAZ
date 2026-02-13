import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Calendar, FileText } from 'lucide-react';
import { TRANSLATIONS } from '../constants';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';
import { getCachedAppointments, mergeAndSort } from '../lib/appointmentsCache';

const CabinetDashboard: React.FC = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const [lang, setLang] = useState(localStorage.getItem('vetlab_lang') || 'KZ');
  const [appointments, setAppointments] = useState<Array<{
    id: string;
    full_name: string;
    contact_phone: string;
    department: string;
    created_at: string;
    notes?: string | null;
    owner_name?: string | null;
    pet_name?: string | null;
    pet_details?: string | null;
  }>>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleLangChange = () => setLang(localStorage.getItem('vetlab_lang') || 'KZ');
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/cabinet', { replace: true });
      return;
    }
  }, [user, authLoading, navigate]);

  const fetchAppointments = React.useCallback(async () => {
    if (!user) return;
    const { data: fromDb } = await supabase
      .from('appointments')
      .select('id, full_name, contact_phone, department, created_at, notes, owner_name, pet_name, pet_details')
      .order('created_at', { ascending: false })
      .limit(20);
    const fromCache = getCachedAppointments(user.id);
    const merged = mergeAndSort(fromDb || [], fromCache);
    setAppointments(merged);
  }, [user]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  useEffect(() => {
    const onUpdated = () => fetchAppointments();
    window.addEventListener('appointmentsUpdated', onUpdated);
    return () => window.removeEventListener('appointmentsUpdated', onUpdated);
  }, [fetchAppointments]);

  const t = TRANSLATIONS[lang];

  const handleSignOut = async () => {
    await signOut();
    navigate('/cabinet');
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#f0f7ff] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary" />
      </div>
    );
  }

  const meta = user.user_metadata || {};
  const displayName = [meta.firstName, meta.lastName].filter(Boolean).join(' ') || user.email?.split('@')[0] || t.user;

  return (
    <div className="min-h-screen bg-[#f0f7ff]">
      <section className="bg-secondary py-12 text-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
          <div>
            <p className="text-white/70 text-sm font-semibold uppercase tracking-wider mb-2">{t.home} / {t.cabinet}</p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{t.cabinet}</h1>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          >
            <LogOut size={18} /> {t.signOut}
          </button>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-secondary text-accent rounded-xl flex items-center justify-center">
                <User size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-secondary">{t.myProfile}</h2>
                <p className="text-slate-500 text-sm">{displayName}</p>
              </div>
            </div>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-slate-500 font-medium">{t.email}</dt>
                <dd className="font-semibold text-secondary">{user.email}</dd>
              </div>
              {meta.phone && (
                <div>
                  <dt className="text-slate-500 font-medium">{t.contactPhone}</dt>
                  <dd className="font-semibold text-secondary">{meta.phone}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-secondary text-accent rounded-xl flex items-center justify-center">
                <Calendar size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-secondary">{t.myAppointments}</h2>
                <p className="text-slate-500 text-sm">{appointments.length} {t.requests}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('openAppointmentModal'))}
              className="inline-flex items-center gap-2 bg-secondary text-white px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-secondary/90 transition-all"
            >
              {t.appointment}
            </button>
          </div>
        </div>

        <div className="mt-12">
            <h2 className="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
              <FileText size={22} /> {t.recentRequests}
            </h2>
            {appointments.length > 0 ? (
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-slate-600">{t.owner}</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-600">{t.pet}</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-600">{t.contactPhone}</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-600">{t.service}</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-600">{t.date}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((a) => (
                      <tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-medium text-secondary">{a.owner_name ?? a.full_name}</td>
                        <td className="py-3 px-4 text-slate-600">
                          {a.pet_name ? (a.pet_details ? `${a.pet_name} — ${a.pet_details}` : a.pet_name) : (a.pet_details || a.notes || '—')}
                        </td>
                        <td className="py-3 px-4 text-slate-600">{a.contact_phone}</td>
                        <td className="py-3 px-4 text-slate-600">{(t as Record<string, string>)[a.department] ?? a.department}</td>
                        <td className="py-3 px-4 text-slate-500">{new Date(a.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-slate-500 text-sm py-6">{t.noAppointmentsYet}</p>
            )}
          </div>

        <div className="mt-12 text-center">
          <Link to="/" className="text-accent font-semibold hover:underline">
            ← {t.backToHome}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CabinetDashboard;
