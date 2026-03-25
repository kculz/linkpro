'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Building2, Loader2, ArrowLeft, Mail, CheckCircle, ShieldAlert, History } from 'lucide-react';
import { authService } from '@/services/auth.service';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar / Marketing */}
      <div className="relative hidden md:flex md:w-1/2 lg:w-[55%] bg-slate-900 p-16 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 opacity-40 grayscale-[0.5]">
          <Image 
            src="/images/renovation-site.png" 
            alt="LinkPro Security" 
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
            Protecting your <br /> <span className="font-medium italic text-primary">legacy</span>.
          </h2>
          <p className="text-slate-400 text-lg max-w-sm leading-relaxed mb-12">
            Security is the cornerstone of LinkPro. We ensure your access is restored swiftly and safely.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <p className="text-slate-300 text-sm font-medium italic">Encrypted recovery protocols.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                <History className="w-5 h-5" />
              </div>
              <p className="text-slate-300 text-sm font-medium italic">Multi-factor identity checks.</p>
            </div>
          </div>
        </motion.div>

        <div className="relative z-10 pt-10 border-t border-white/10 text-xs text-slate-500 font-medium tracking-widest uppercase">
          Safe & Secure Restore
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16 lg:p-24 relative bg-white md:bg-transparent">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <Link href="/login" className="flex items-center gap-2 text-slate-400 hover:text-slate-900 text-sm mb-10 transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>

          {!sent ? (
            <>
              <header className="mb-10">
                <h1 className="text-3xl font-light text-slate-900 mb-2 leading-tight">Access Recovery</h1>
                <p className="text-slate-400 text-sm font-medium italic">We will send a secure link to reset your password.</p>
              </header>

              {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-sm italic">{error}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Registered Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder-slate-300 outline-none focus:bg-white focus:border-slate-900 transition-all font-medium"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-slate-900 text-white font-semibold rounded-2xl hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Request Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="flex justify-center mb-10">
                <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-center shadow-sm">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h1 className="text-3xl font-light text-slate-900 mb-4">Request Sent</h1>
              <p className="text-slate-500 text-sm leading-relaxed mb-10 italic font-medium">
                If <span className="font-bold text-slate-900 not-italic">{email}</span> is registered with LinkPro, a recovery link will arrive shortly.
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-slate-400 text-sm font-medium hover:text-slate-900 transition-colors"
              >
                Try a different email
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
