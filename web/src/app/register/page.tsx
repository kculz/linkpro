'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Building2, Loader2, CheckCircle, ArrowLeft, Paintbrush, Shield, Eye, EyeOff } from 'lucide-react';
import { authService } from '@/services/auth.service';

type Step = 'details' | 'otp';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('details');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.register(form);
      setStep('otp');
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.verifyEmail(form.email, otp);
      router.push('/login?verified=1');
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || 'Invalid OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    await authService.sendOtp(form.email);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar / Marketing */}
      <div className="relative hidden md:flex md:w-1/2 lg:w-[55%] bg-slate-900 p-16 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <Image 
            src="/images/commercial-office.png" 
            alt="LinkPro Estate Management" 
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
            Managed <br /> <span className="font-medium italic text-primary">longevity</span> for your estate.
          </h2>
          <p className="text-slate-400 text-lg max-w-sm leading-relaxed mb-12">
            Join a select group of visionary owners who prioritize precision management and in-house excellence.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                <Paintbrush className="w-5 h-5" />
              </div>
              <p className="text-slate-300 text-sm font-medium italic">Bespoke renovations that increase value.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                <Shield className="w-5 h-5" />
              </div>
              <p className="text-slate-300 text-sm font-medium italic">Proactive protection of your assets.</p>
            </div>
          </div>
        </motion.div>

        <div className="relative z-10 pt-10 border-t border-white/10 flex justify-between items-center text-xs text-slate-500 font-medium tracking-widest uppercase">
          <span>&copy; {new Date().getFullYear()} LinkPro</span>
          <span>Quality Above All Else</span>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16 lg:p-24 relative bg-white md:bg-transparent">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="flex md:hidden items-center gap-2 mb-12">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <Building2 className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-slate-900">LinkPro</span>
          </div>

          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-slate-900 text-sm mb-10 transition-colors w-fit underline-offset-4 decoration-slate-200">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          {step === 'details' ? (
            <>
              <header className="mb-10">
                <h1 className="text-3xl font-light text-slate-900 mb-2 leading-tight tracking-tight">Register as Owner</h1>
                <p className="text-slate-400 text-sm italic font-medium">Bespoke management for your properties.</p>
              </header>

              {error && <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-sm italic">{error}</div>}

              <form onSubmit={handleRegister} className="space-y-6">
                {[
                  { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Alex Morgan' },
                  { label: 'Email Address', key: 'email', type: 'email', placeholder: 'you@example.com' },
                  { label: 'Phone Number', key: 'phone', type: 'tel', placeholder: '+1 234 567 890' },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key} className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
                    <input
                      type={type}
                      value={form[key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      placeholder={placeholder}
                      required={key !== 'phone'}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder-slate-300 outline-none focus:bg-white focus:border-slate-900 transition-all font-medium"
                    />
                  </div>
                ))}

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Secure Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="••••••••"
                      required
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder-slate-300 outline-none focus:bg-white focus:border-slate-900 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
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
                  disabled={loading || (form.confirmPassword !== '' && form.password !== form.confirmPassword)}
                  className="w-full py-4 bg-slate-900 text-white font-semibold rounded-2xl hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Register Your Interest'}
                </button>
              </form>
            </>
          ) : (
            <>
              <button onClick={() => setStep('details')} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 text-sm mb-10 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Go back
              </button>
              
              <header className="mb-10">
                <h1 className="text-3xl font-light text-slate-900 mb-2 leading-tight">Identity Verification</h1>
                <p className="text-slate-400 text-sm font-medium italic">A 6-digit code has been sent to {form.email}.</p>
              </header>

              {error && <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-sm italic">{error}</div>}

              <form onSubmit={handleVerifyOtp} className="space-y-6 text-center">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  required
                  className="w-full px-4 py-6 bg-slate-50 border border-slate-100 rounded-3xl text-slate-900 text-center text-4xl tracking-[1.5rem] placeholder-slate-200 outline-none focus:bg-white focus:border-slate-900 transition-all font-light"
                />
                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="w-full py-4 bg-slate-900 text-white font-semibold rounded-2xl hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Registration'}
                </button>
              </form>

              <p className="text-center text-sm text-slate-400 mt-10 italic font-medium">
                Didn’t receive it?{' '}
                <button onClick={handleResend} className="text-slate-900 font-semibold hover:underline decoration-slate-200">Resend Code</button>
              </p>
            </>
          )}

          <footer className="mt-12 pt-8 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-400 italic">
              Already a partner?{' '}
              <Link href="/login" className="text-slate-900 font-semibold hover:underline underline-offset-4">Sign in to Portal</Link>
            </p>
          </footer>
        </motion.div>
      </div>
    </div>
  );
}
