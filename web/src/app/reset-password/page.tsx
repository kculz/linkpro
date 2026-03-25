'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Building2, Loader2, Eye, EyeOff, CheckCircle, ArrowLeft, Key, Lock } from 'lucide-react';
import { authService } from '@/services/auth.service';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) setError('Invalid or missing reset token. Please request a new link.');
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await authService.resetPassword(token, form.password);
      setSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || 'Reset failed. Link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColor = ['', 'bg-red-200', 'bg-amber-200', 'bg-blue-200', 'bg-emerald-500'];

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar / Marketing */}
      <div className="relative hidden md:flex md:w-1/2 lg:w-[55%] bg-slate-900 p-16 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <Image
            src="/images/apartment-pool.png"
            alt="LinkPro Access"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-900/80 to-transparent" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <Link href="/" className="flex items-center gap-2 mb-20 text-white">
            <div className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/20">
              <Building2 className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-semibold tracking-tight">LinkPro</span>
          </Link>

          <h2 className="text-4xl lg:text-5xl font-light text-white leading-tight mb-8">
            Restoring <br /> <span className="font-medium italic text-primary">absolute</span> control.
          </h2>
          <p className="text-slate-400 text-lg max-w-sm leading-relaxed mb-12">
            Your portfolio requires steady hands. We ensure you are back in command with a more secure access point.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                <Lock className="w-5 h-5" />
              </div>
              <p className="text-slate-300 text-sm font-medium italic">Hardened encryption standards.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                <Key className="w-5 h-5" />
              </div>
              <p className="text-slate-300 text-sm font-medium italic">Complete session re-validation.</p>
            </div>
          </div>
        </motion.div>

        <div className="relative z-10 pt-10 border-t border-white/10 text-xs text-slate-500 font-medium tracking-widest uppercase">
          New Credentials Active
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16 lg:p-24 relative bg-white md:bg-transparent">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          {success ? (
            <div className="text-center">
              <div className="flex justify-center mb-10">
                <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-center shadow-sm">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h1 className="text-3xl font-light text-slate-900 mb-4">Credentials Secured</h1>
              <p className="text-slate-500 text-sm leading-relaxed mb-10 italic font-medium">
                Your password has been successfully updated. We are redirecting you to the portal shortly...
              </p>
              <Link href="/login" className="text-slate-900 font-bold text-sm underline underline-offset-8 decoration-slate-200">
                Go to Portal Now
              </Link>
            </div>
          ) : (
            <>
              <header className="mb-10">
                <h1 className="text-3xl font-light text-slate-900 mb-2 leading-tight">Securing Access</h1>
                <p className="text-slate-400 text-sm italic font-medium">Please define a new, strong password for your LinkPro account.</p>
              </header>

              {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-sm italic">{error}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">New Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="••••••••"
                      required
                      minLength={8}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder-slate-300 outline-none focus:bg-white focus:border-slate-900 transition-all font-medium"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {form.password && (
                    <div className="flex items-center justify-between pt-1 px-1">
                      <div className="flex gap-1 flex-1 max-w-[120px]">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColor[strength] : 'bg-slate-100'}`} />
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{strengthLabel[strength]}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Confirm Password</label>
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    required
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder-slate-300 outline-none focus:bg-white focus:border-slate-900 transition-all font-medium"
                  />
                  {form.confirmPassword && form.password !== form.confirmPassword && (
                    <p className="text-[10px] text-red-400 font-medium italic mt-1">Passwords do not match</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !token}
                  className="w-full py-4 bg-slate-900 text-white font-semibold rounded-2xl hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Personal Portal Access'}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center"><Loader2 className="w-8 h-8 text-slate-300 animate-spin" /></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
