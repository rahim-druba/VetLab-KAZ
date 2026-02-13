import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TRANSLATIONS } from '../constants';
import { useAuth } from '../lib/AuthContext';

type View = 'login' | 'register' | 'forgot';

const Cabinet: React.FC = () => {
  const [view, setView] = useState<View>('login');
  const [lang, setLang] = useState(localStorage.getItem('vetlab_lang') || 'KZ');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { user, signIn, signUp, signOut, resetPassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleLangChange = () => setLang(localStorage.getItem('vetlab_lang') || 'KZ');
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  useEffect(() => {
    if (user) navigate('/cabinet/dashboard', { replace: true });
  }, [user, navigate]);

  const t = TRANSLATIONS[lang];

  const clearMessage = () => setMessage(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessage();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setMessage({ type: 'error', text: error.message });
      return;
    }
    navigate('/cabinet/dashboard');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessage();
    if (password !== repeatPassword) {
      setMessage({ type: 'error', text: t.repeatPasswordError || 'Passwords do not match.' });
      return;
    }
    if (password.length < 6) {
      setMessage({ type: 'error', text: t.passwordMinError || 'Password must be at least 6 characters.' });
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password, { firstName, lastName, phone });
    setLoading(false);
    if (error) {
      setMessage({ type: 'error', text: error.message });
      return;
    }
    setMessage({ type: 'success', text: t.registerSuccess || 'Check your email to confirm your account.' });
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessage();
    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);
    if (error) {
      setMessage({ type: 'error', text: error.message });
      return;
    }
    setMessage({ type: 'success', text: t.forgotSuccess || 'Check your email for the password reset link.' });
  };

  if (user) return null;

  return (
    <div className="min-h-screen bg-[#f0f7ff]">
      <section className="bg-secondary py-12 text-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-white/70 text-sm font-semibold uppercase tracking-wider mb-2">
            {t.home} / {t.cabinet}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{t.cabinet}</h1>
        </div>
      </section>

      <section className="max-w-md mx-auto px-6 py-16">
        {view === 'login' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8">
            <h2 className="text-xl font-bold text-secondary mb-6">{t.signIn}</h2>
            {message && (
              <div className={`mb-6 p-4 rounded-lg text-sm ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                {message.text}
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">{t.email}</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-secondary/30 focus:border-secondary outline-none transition-all"
                  placeholder={t.email}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">{t.password}</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-secondary/30 focus:border-secondary outline-none transition-all"
                  placeholder={t.password}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-secondary focus:ring-secondary"
                />
                <label htmlFor="remember" className="text-sm text-slate-600">{t.rememberMe}</label>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-secondary text-white py-3.5 rounded-lg font-semibold hover:bg-secondary/90 transition-all disabled:opacity-70"
              >
                {loading ? t.loading || 'Loading…' : t.signIn}
              </button>
              <button
                type="button"
                onClick={() => { setView('forgot'); clearMessage(); }}
                className="w-full text-center text-sm text-accent hover:underline"
              >
                {t.lostPassword}
              </button>
            </form>
          </div>
        )}

        {view === 'register' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8">
            <h2 className="text-xl font-bold text-secondary mb-6">{t.signUp}</h2>
            {message && (
              <div className={`mb-6 p-4 rounded-lg text-sm ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                {message.text}
              </div>
            )}
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">{t.firstName} *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-secondary/30 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">{t.lastName} *</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-secondary/30 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">{t.contactPhone} *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-secondary/30 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">{t.email} *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-secondary/30 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">{t.password} *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-secondary/30 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">{t.repeatPassword} *</label>
                <input
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-secondary/30 outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-secondary text-white py-3.5 rounded-lg font-semibold hover:bg-secondary/90 transition-all disabled:opacity-70"
              >
                {loading ? t.loading || 'Loading…' : t.signUp}
              </button>
            </form>
          </div>
        )}

        {view === 'forgot' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8">
            <h2 className="text-xl font-bold text-secondary mb-2">{t.lostPassword}</h2>
            <p className="text-slate-600 text-sm mb-6">{t.forgotHint}</p>
            {message && (
              <div className={`mb-6 p-4 rounded-lg text-sm ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                {message.text}
              </div>
            )}
            <form onSubmit={handleForgot} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">{t.email}</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-secondary/30 focus:border-secondary outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-secondary text-white py-3.5 rounded-lg font-semibold hover:bg-secondary/90 transition-all disabled:opacity-70"
              >
                {loading ? t.loading || 'Loading…' : t.sendResetLink}
              </button>
              <button
                type="button"
                onClick={() => { setView('login'); clearMessage(); }}
                className="w-full text-center text-sm text-accent hover:underline"
              >
                {t.backToLogin}
              </button>
            </form>
          </div>
        )}

        <p className="text-center mt-8 text-slate-500 text-sm">
          {view === 'login' ? (
            <>
              {t.noAccount}{' '}
              <button type="button" onClick={() => { setView('register'); clearMessage(); }} className="text-accent font-semibold hover:underline">
                {t.signUp}
              </button>
            </>
          ) : view === 'register' ? (
            <>
              {t.haveAccount}{' '}
              <button type="button" onClick={() => { setView('login'); clearMessage(); }} className="text-accent font-semibold hover:underline">
                {t.signIn}
              </button>
            </>
          ) : null}
        </p>
      </section>
    </div>
  );
};

export default Cabinet;
