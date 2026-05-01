'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  TrendingUp, 
  BarChart3, 
  PieChart as PieChartIcon, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight, 
  Loader2,
  Filter,
  Calendar,
  Building2,
  Wrench,
  Target,
  Zap
} from 'lucide-react';
import { getPortfolioAnalytics } from '@/services/analyticsService';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stats = await getPortfolioAnalytics();
        setData(stats);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !data) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-40">
          <Loader2 className="w-12 h-12 animate-spin text-primary opacity-50" />
          <p className="text-white/20 mt-6 font-black italic uppercase tracking-widest text-[10px]">Processing Strategic Intelligence...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Mock revenue data for the chart if real data is sparse
  const revenueData = [4500, 5200, 4800, 6100, 5800, 7200];
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'];
  const maxRevenue = Math.max(...revenueData);

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-in fade-in duration-700 pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase underline decoration-primary decoration-4 underline-offset-8">Intelligence Center</h1>
            <p className="text-white/20 mt-4 font-bold italic uppercase tracking-widest text-[10px]">Strategic Analytics • Portfolio Performance Matrix</p>
          </div>
          <div className="flex gap-4">
             <button className="px-6 py-4 bg-surface/40 border border-white/[0.03] text-white/40 hover:text-white rounded-2xl font-black italic uppercase text-[10px] tracking-widest transition-all flex items-center gap-2">
              <Calendar className="w-4 h-4" /> 2026 FISCAL
            </button>
            <button className="px-8 py-4 bg-primary text-white rounded-[1.5rem] font-black italic uppercase text-xs tracking-[0.2em] hover:brightness-110 transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)] flex items-center gap-3 border border-primary/20">
              <Zap className="w-5 h-5" /> Generate Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue Flow Chart */}
          <div className="lg:col-span-2 bg-surface/40 rounded-[3rem] border border-white/[0.03] p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/[0.01] pointer-events-none" />
            <div className="flex items-center justify-between mb-16">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                <h3 className="font-black text-white text-[10px] uppercase tracking-[0.25em] italic">Revenue Flow Intelligence</h3>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-[8px] font-black text-white/20 uppercase tracking-widest italic">Growth Index</p>
                  <p className="text-xl font-black text-emerald-500 italic flex items-center gap-2 justify-end">
                    +18.4% <ArrowUpRight className="w-4 h-4" />
                  </p>
                </div>
              </div>
            </div>

            {/* Custom SVG Line Chart */}
            <div className="relative h-64 flex items-end justify-between px-4">
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(59,130,246,0.2)" />
                    <stop offset="100%" stopColor="rgba(59,130,246,0)" />
                  </linearGradient>
                </defs>
                <motion.path
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  d={`M ${revenueData.map((val, i) => `${(i / (revenueData.length - 1)) * 100}% ${(1 - val / maxRevenue) * 100}%`).join(' L ')}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-primary"
                  style={{ vectorEffect: 'non-scaling-stroke' }}
                />
                <motion.path
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 1 }}
                  d={`M ${revenueData.map((val, i) => `${(i / (revenueData.length - 1)) * 100}% ${(1 - val / maxRevenue) * 100}%`).join(' L ')} L 100% 100% L 0% 100% Z`}
                  fill="url(#chartGradient)"
                />
              </svg>
              
              {revenueData.map((val, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center group/point">
                  <div className="w-3 h-3 rounded-full bg-primary border-4 border-surface shadow-2xl group-hover/point:scale-150 transition-transform cursor-pointer" />
                  <p className="mt-4 text-[9px] font-black text-white/10 uppercase tracking-widest italic group-hover/point:text-white transition-colors">{months[i]}</p>
                  <div className="absolute bottom-12 bg-white/5 backdrop-blur-xl border border-white/10 px-3 py-1 rounded-lg opacity-0 group-hover/point:opacity-100 transition-opacity pointer-events-none">
                    <p className="text-[10px] font-black text-white italic">${val.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Pulse */}
          <div className="bg-surface/40 rounded-[3rem] border border-white/[0.03] p-10 shadow-2xl relative overflow-hidden group">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
              <h3 className="font-black text-white text-[10px] uppercase tracking-[0.25em] italic">Operational Pulse</h3>
            </div>

            <div className="space-y-8">
              {data.maintenanceDist.map((item: any) => (
                <div key={item.category} className="space-y-3">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest italic">
                    <span className="text-white/20">{item.category}</span>
                    <span className="text-white">{item.count} Incidents</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.count / 10) * 100}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="bg-amber-500 h-full rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                    />
                  </div>
                </div>
              ))}
              
              <div className="pt-10 border-t border-white/[0.03] text-center">
                 <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-emerald-500/20 relative">
                    <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin duration-[3000ms]" />
                    <p className="text-xl font-black text-white italic">94%</p>
                 </div>
                 <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] italic mt-4">Resolution Velocity</p>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-surface/40 rounded-[3rem] border border-white/[0.03] p-10 shadow-2xl">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                <h3 className="font-black text-white text-[10px] uppercase tracking-[0.25em] italic">Asset Yield Leaderboard</h3>
              </div>
              <BarChart3 className="w-5 h-5 text-white/10" />
            </div>

            <div className="space-y-6">
              {data.propertyYields.map((prop: any, i: number) => (
                <div key={prop.name} className="flex items-center justify-between p-6 rounded-[2rem] bg-white/[0.02] border border-white/[0.03] group hover:bg-white/5 hover:border-primary/20 transition-all">
                  <div className="flex items-center gap-6">
                    <span className="text-2xl font-black text-white/5 group-hover:text-primary transition-colors italic">0{i+1}</span>
                    <div>
                      <p className="text-xs font-black text-white uppercase italic tracking-tighter">{prop.name}</p>
                      <p className="text-[9px] text-white/20 font-black uppercase tracking-widest mt-1">{prop.occupiedUnits}/{prop.totalUnits} Units Occupied</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-white italic tracking-tighter">${Number(prop.monthlyIncome).toLocaleString()}</p>
                    <p className="text-[8px] text-emerald-500 font-black uppercase tracking-widest mt-1">Monthly Yield</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface/40 rounded-[3rem] border border-white/[0.03] p-10 shadow-2xl">
             <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                <h3 className="font-black text-white text-[10px] uppercase tracking-[0.25em] italic">Tactical Deployment Status</h3>
              </div>
              <PieChartIcon className="w-5 h-5 text-white/10" />
            </div>

            <div className="grid grid-cols-2 gap-8 h-full items-center">
              <div className="relative aspect-square flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="50%" cy="50%" r="40%" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                  <motion.circle 
                    cx="50%" cy="50%" r="40%" fill="transparent" 
                    stroke="#3b82f6" strokeWidth="12" strokeDasharray="251" 
                    initial={{ strokeDashoffset: 251 }}
                    animate={{ strokeDashoffset: 60 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                  />
                  <motion.circle 
                    cx="50%" cy="50%" r="40%" fill="transparent" 
                    stroke="#10b981" strokeWidth="12" strokeDasharray="251" 
                    initial={{ strokeDashoffset: 251 }}
                    animate={{ strokeDashoffset: 180 }}
                    transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <p className="text-3xl font-black text-white italic">72%</p>
                   <p className="text-[8px] font-black text-white/20 uppercase tracking-widest italic">Velocity</p>
                </div>
              </div>

              <div className="space-y-6">
                {data.projectDist.map((item: any) => (
                   <div key={item.status} className="flex items-center gap-4">
                      <div className={clsx(
                        "w-3 h-3 rounded-sm",
                        item.status === 'COMPLETED' ? "bg-emerald-500" : "bg-primary"
                      )} />
                      <div>
                        <p className="text-[10px] font-black text-white uppercase italic tracking-tighter">{item.status}</p>
                        <p className="text-[8px] text-white/20 font-black uppercase tracking-widest mt-1">{item.count} Projects</p>
                      </div>
                   </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
