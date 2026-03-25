'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Building2, Eye, EyeOff, Loader2, ArrowLeft, BarChart3, ShieldCheck } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await authService.login({ email, password });
      const { user, accessToken, refreshToken } = data.data;
      setAuth(user, accessToken, refreshToken);
      router.push('/dashboard');
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar / Marketing */}
      <div className="relative hidden md:flex md:w-1/2 lg:w-[55%] bg-slate-900 p-16 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <Image 
            src="/images/apartment-pool.png" 
            alt="LinkPro Luxury Portfolio" 
            fill
            className="object-cover transition-transform duration-[10s] hover:scale-105"
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
            Your dashboard is <br /> <span className="font-medium italic">waiting</span>.
          </h2>
          <p className="text-slate-400 text-lg max-w-sm leading-relaxed mb-12">
            Revisit your portfolio’s performance and oversee all active development projects in one quiet, unified space.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                <BarChart3 className="w-5 h-5" />
              </div>
              <p className="text-slate-300 text-sm font-medium italic">Real-time occupancy and growth metrics.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <p className="text-slate-300 text-sm font-medium italic">Enterprise-grade security for your data.</p>
            </div>
          </div>
        </motion.div>

        <div className="relative z-10 pt-10 border-t border-white/10 flex justify-between items-center text-xs text-slate-500 font-medium tracking-widest uppercase">
          <span>&copy; {new Date().getFullYear()} LinkPro</span>
          <span>Excellence in Precision</span>
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

          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-slate-900 text-sm mb-10 transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <header className="mb-10">
            <h1 className="text-3xl font-light text-slate-900 mb-2 leading-tight">Welcome Back</h1>
            <p className="text-slate-400 text-sm italic font-medium">Continue managing your excellence.</p>
          </header>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-sm italic">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@morgan.com"
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder-slate-300 outline-none focus:bg-white focus:border-slate-900 transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Password</label>
                <Link href="/forgot-password" title="forgot-password" className="text-[11px] font-bold text-primary hover:text-primary underline-offset-4 tracking-widest uppercase">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-slate-900 text-white font-semibold rounded-2xl hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In to Portal'}
            </button>
          </form>

          <footer className="mt-12 pt-8 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-400 italic">
              New owner?{' '}
              <Link href="/register" className="text-slate-900 font-semibold hover:underline">Register your interest</Link>
            </p>
          </footer>
        </motion.div>
      </div>
    </div>
  );
}
