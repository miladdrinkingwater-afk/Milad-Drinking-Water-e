import React, { useState } from 'react';
import { authService } from '../services/authService';
import { AdminUser, Language } from '../types';
import { Lock, Mail, ShieldAlert, ArrowRight, CheckCircle2, Droplets } from 'lucide-react';

interface AdminLoginPageProps {
  lang: Language;
  onLoginSuccess: (user: AdminUser) => void;
  onBackToWebsite: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  lang,
  onLoginSuccess,
  onBackToWebsite,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);
    setError(null);

    const res = await authService.login(email, password);
    setLoading(false);

    if (res.success && res.user) {
      onLoginSuccess(res.user);
    } else {
      setError(res.error || (lang === 'bn' ? 'লগইন ব্যর্থ হয়েছে।' : 'Login failed.'));
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError(lang === 'bn' ? 'অনুগ্রহ করে ইমেইল অ্যাড্রেস দিন' : 'Please enter your email address');
      return;
    }

    setLoading(true);
    setError(null);
    const res = await authService.sendPasswordReset(email);
    setLoading(false);
    setResetMessage(res.message);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-white p-1.5 mx-auto shadow-xl flex items-center justify-center mb-4">
            <img src="/logo.png" alt="Milad Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            MILAD DRINKING WATER
          </h1>
          <p className="text-xs text-sky-400 font-bold uppercase tracking-widest mt-1">
            {lang === 'bn' ? 'অ্যাডমিন ও বিজনেস ম্যানেজমেন্ট পোর্টাল' : 'Business Management Portal'}
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          
          <div className="mb-6 pb-4 border-b border-slate-800">
            <h2 className="text-base font-bold text-white">
              {showForgotPassword
                ? (lang === 'bn' ? 'পাসওয়ার্ড রিসেট' : 'Reset Password')
                : (lang === 'bn' ? 'কর্তৃপক্ষ লগইন' : 'Authorized Sign In')}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {showForgotPassword
                ? (lang === 'bn' ? 'আপনার অ্যাকাউন্টের নিবন্ধিত ইমেইল লিখুন' : 'Enter registered admin email')
                : (lang === 'bn' ? 'সিস্টেম অ্যাক্সেস করতে আপনার পরিচয় দিন' : 'Enter administrative credentials')}
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs font-medium flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {resetMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{resetMessage}</span>
            </div>
          )}

          {!showForgotPassword ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {lang === 'bn' ? 'অ্যাডমিন ইমেইল' : 'Admin Email'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="miladdrinkingwater@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none text-sm transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    {lang === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-[11px] text-sky-400 hover:text-sky-300 transition"
                  >
                    {lang === 'bn' ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot password?'}
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none text-sm transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-slate-950 font-extrabold text-sm shadow-lg shadow-sky-500/20 transition flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <span>{lang === 'bn' ? 'যাচাই করা হচ্ছে...' : 'Verifying...'}</span>
                ) : (
                  <>
                    <span>{lang === 'bn' ? 'লগইন করুন' : 'Sign In to Dashboard'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {lang === 'bn' ? 'নিবন্ধিত ইমেইল' : 'Registered Email'}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="miladdrinkingwater@gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none text-sm transition"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition"
                >
                  {loading ? 'Sending...' : (lang === 'bn' ? 'রিসেট লিংক পাঠান' : 'Send Reset Link')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-bold transition"
                >
                  {lang === 'bn' ? 'ফিরে যান' : 'Back'}
                </button>
              </div>
            </form>
          )}

          {/* Back to Home action */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <button
              onClick={onBackToWebsite}
              className="text-xs text-slate-400 hover:text-white transition"
            >
              ← {lang === 'bn' ? 'মূল ওয়েবসাইটে ফিরে যান' : 'Back to Public Website'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
