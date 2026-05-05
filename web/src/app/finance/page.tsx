'use client';

import { useEffect, useMemo } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  DollarSign, TrendingUp, Clock, AlertCircle, CheckCircle2,
  ArrowUpRight, ArrowDownRight, Building2, Loader2, Calendar,
  CreditCard, MoreVertical, PieChart, BarChart3, Activity
} from 'lucide-react';
import { useTransactionStore } from '@/store/transaction.store';
import { clsx } from 'clsx';
import { format } from 'date-fns';

/* ── SVG Chart helpers ─────────────────────────────── */

const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#F43F5E', '#8B5CF6'];
const TYPE_COLORS: Record<string, string> = {
  RENT: '#3B82F6', DEPOSIT: '#10B981', MAINTENANCE: '#F59E0B', OTHER: '#8B5CF6'
};

function RevenueAreaChart({ data }: { data: { month: string; paid: number; total: number }[] }) {
  if (!data.length) return <EmptyChart label="No revenue data" />;
  const maxVal = Math.max(...data.map(d => d.total), 1);
  const W = 600, H = 200, padX = 40, padY = 20;
  const cW = W - padX * 2, cH = H - padY * 2;

  const toX = (i: number) => padX + (i / (data.length - 1 || 1)) * cW;
  const toY = (v: number) => padY + cH - (v / maxVal) * cH;

  const paidLine = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(d.paid)}`).join(' ');
  const paidArea = `${paidLine} L${toX(data.length - 1)},${H - padY} L${toX(0)},${H - padY} Z`;

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map(f => {
    const v = Math.round(maxVal * f);
    const y = toY(v);
    return { y, label: v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}` };
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
        </linearGradient>
      </defs>
      {gridLines.map(g => (
        <g key={g.y}>
          <line x1={padX} y1={g.y} x2={W - padX} y2={g.y} stroke="rgba(255,255,255,0.04)" />
          <text x={padX - 6} y={g.y + 3} textAnchor="end" fill="rgba(255,255,255,0.15)" fontSize="8" fontWeight="bold">{g.label}</text>
        </g>
      ))}
      <path d={paidArea} fill="url(#areaGrad)" />
      <path d={paidLine} fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={toX(i)} cy={toY(d.paid)} r="3.5" fill="#3B82F6" stroke="#020617" strokeWidth="2" />
          <text x={toX(i)} y={H - 4} textAnchor="middle" fill="rgba(255,255,255,0.15)" fontSize="7" fontWeight="bold">
            {d.month.slice(5)}
          </text>
        </g>
      ))}
    </svg>
  );
}

function DonutChart({ data }: { data: { type: string; amount: number }[] }) {
  if (!data.length) return <EmptyChart label="No type data" />;
  const total = data.reduce((s, d) => s + d.amount, 0) || 1;
  const R = 60, r = 40, cx = 80, cy = 80;
  let cum = 0;

  const arcs = data.map((d) => {
    const frac = d.amount / total;
    const start = cum * Math.PI * 2 - Math.PI / 2;
    cum += frac;
    const end = cum * Math.PI * 2 - Math.PI / 2;
    const large = frac > 0.5 ? 1 : 0;
    const path = [
      `M${cx + R * Math.cos(start)},${cy + R * Math.sin(start)}`,
      `A${R},${R} 0 ${large} 1 ${cx + R * Math.cos(end)},${cy + R * Math.sin(end)}`,
      `L${cx + r * Math.cos(end)},${cy + r * Math.sin(end)}`,
      `A${r},${r} 0 ${large} 0 ${cx + r * Math.cos(start)},${cy + r * Math.sin(start)}`,
      'Z'
    ].join(' ');
    return { ...d, path, color: TYPE_COLORS[d.type] || '#64748B', pct: Math.round(frac * 100) };
  });

  return (
    <div className="flex items-center gap-8">
      <svg viewBox="0 0 160 160" className="w-40 h-40 shrink-0">
        {arcs.map((a, i) => <path key={i} d={a.path} fill={a.color} opacity="0.85" className="hover:opacity-100 transition-opacity" />)}
        <text x={cx} y={cy - 4} textAnchor="middle" fill="white" fontSize="14" fontWeight="900" fontStyle="italic">${(total / 1000).toFixed(1)}k</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="6" fontWeight="900" letterSpacing="2">COLLECTED</text>
      </svg>
      <div className="space-y-3 flex-1">
        {arcs.map((a, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: a.color }} />
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic flex-1">{a.type}</span>
            <span className="text-xs font-black text-white italic">{a.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PropertyBars({ data }: { data: { name: string; revenue: number; occupiedUnits: number; totalUnits: number }[] }) {
  if (!data.length) return <EmptyChart label="No property data" />;
  const maxRev = Math.max(...data.map(d => d.revenue), 1);
  return (
    <div className="space-y-5">
      {data.map((p, i) => (
        <div key={i}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-white italic uppercase tracking-tighter truncate max-w-[60%]">{p.name}</span>
            <div className="flex items-center gap-3">
              <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">{p.occupiedUnits}/{p.totalUnits} units</span>
              <span className="text-xs font-black text-white italic">${(p.revenue / 1000).toFixed(1)}k</span>
            </div>
          </div>
          <div className="w-full bg-white/[0.03] rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${(p.revenue / maxRev) * 100}%`, backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function CollectionRateBars({ data }: { data: { month: string; rate: number }[] }) {
  if (!data.length) return <EmptyChart label="No collection data" />;
  return (
    <div className="flex items-end gap-2 h-24">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-[8px] font-black text-white/30 italic">{d.rate}%</span>
          <div className="w-full bg-white/[0.03] rounded-t-lg overflow-hidden relative" style={{ height: '100%' }}>
            <div
              className="absolute bottom-0 w-full rounded-t-lg transition-all duration-1000"
              style={{
                height: `${d.rate}%`,
                backgroundColor: d.rate >= 90 ? '#10B981' : d.rate >= 70 ? '#3B82F6' : '#F59E0B'
              }}
            />
          </div>
          <span className="text-[7px] font-bold text-white/15 uppercase">{d.month.slice(5)}</span>
        </div>
      ))}
    </div>
  );
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="py-12 flex flex-col items-center justify-center opacity-10">
      <Activity className="w-8 h-8 mb-2" />
      <p className="text-[9px] font-black uppercase tracking-widest italic">{label}</p>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────── */

export default function FinancePage() {
  const { financeIntel, loading, fetchFinanceIntel, updateTransaction } = useTransactionStore();

  useEffect(() => { fetchFinanceIntel(); }, [fetchFinanceIntel]);

  const intel = financeIntel;
  const collectionAvg = useMemo(() => {
    if (!intel?.collectionRate?.length) return 0;
    return Math.round(intel.collectionRate.reduce((s, c) => s + c.rate, 0) / intel.collectionRate.length * 10) / 10;
  }, [intel]);

  const statCards = [
    { label: 'Total Revenue', value: `$${(intel?.totalRevenue || 0).toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-500', trend: '+12%', trendUp: true },
    { label: 'Pending Collections', value: `$${(intel?.pendingRevenue || 0).toLocaleString()}`, icon: Clock, color: 'text-amber-500', trend: 'Active', trendUp: false },
    { label: 'Overdue Arrears', value: `$${(intel?.overdueRevenue || 0).toLocaleString()}`, icon: AlertCircle, color: 'text-status-error', trend: 'At Risk', trendUp: false },
    { label: 'Collection Rate', value: `${collectionAvg}%`, icon: CheckCircle2, color: 'text-primary', trend: 'Avg 6mo', trendUp: true },
  ];

  if (loading && !intel) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] opacity-20">
          <Loader2 className="w-16 h-16 animate-spin mb-6 text-primary" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] italic">Compiling Financial Intelligence...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-in fade-in duration-700">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase underline decoration-primary decoration-4 underline-offset-8">Financial Intelligence</h1>
            <p className="text-white/20 mt-4 font-bold italic uppercase tracking-widest text-[10px]">Cash Flow Analysis • Portfolio Yield • Revenue Tracking</p>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-4 bg-surface/40 border border-white/[0.03] text-white/40 hover:text-white rounded-2xl font-black italic uppercase text-[10px] tracking-widest transition-all flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Q2 2026
            </button>
            <button className="px-8 py-4 bg-primary text-white rounded-[1.5rem] font-black italic uppercase text-xs tracking-[0.2em] hover:brightness-110 transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)] flex items-center gap-3 border border-primary/20">
              <DollarSign className="w-5 h-5" /> Record Entry
            </button>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {statCards.map((stat) => (
            <div key={stat.label} className="bg-surface/40 p-8 rounded-[2.5rem] border border-white/[0.03] shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className={clsx("w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/[0.05] shadow-inner transition-all group-hover:scale-110", stat.color)}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="text-[10px] font-black text-white/10 uppercase italic tracking-widest flex items-center gap-1">
                    {stat.trend} {stat.trendUp ? <ArrowUpRight className="w-3 h-3 text-emerald-500" /> : <ArrowDownRight className="w-3 h-3 text-amber-500" />}
                  </div>
                </div>
                <p className="text-white/20 text-[10px] font-black uppercase tracking-widest italic mb-2">{stat.label}</p>
                <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue Trend — 2 cols */}
          <div className="lg:col-span-2 bg-surface/30 border border-white/[0.03] rounded-[3rem] p-8 backdrop-blur-md">
            <div className="flex items-center gap-4 mb-8 px-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
              <h3 className="font-black text-white text-[10px] uppercase tracking-[0.25em] italic">Revenue Flow — 12 Months</h3>
            </div>
            <div className="h-52">
              <RevenueAreaChart data={intel?.monthlyTrend || []} />
            </div>
          </div>

          {/* Donut */}
          <div className="bg-surface/30 border border-white/[0.03] rounded-[3rem] p-8 backdrop-blur-md">
            <div className="flex items-center gap-4 mb-8 px-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
              <h3 className="font-black text-white text-[10px] uppercase tracking-[0.25em] italic">Revenue Composition</h3>
            </div>
            <DonutChart data={intel?.revenueByType || []} />
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Yield */}
          <div className="lg:col-span-2 bg-surface/30 border border-white/[0.03] rounded-[3rem] p-8 backdrop-blur-md">
            <div className="flex items-center gap-4 mb-8 px-2">
              <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
              <h3 className="font-black text-white text-[10px] uppercase tracking-[0.25em] italic">Property Yield Ranking</h3>
            </div>
            <PropertyBars data={intel?.revenueByProperty || []} />
          </div>

          {/* Cash Flow + Collection */}
          <div className="space-y-8">
            {/* Cash Flow */}
            <div className="bg-surface/30 border border-white/[0.03] rounded-[3rem] p-8 backdrop-blur-md">
              <div className="flex items-center gap-4 mb-6 px-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                <h3 className="font-black text-white text-[10px] uppercase tracking-[0.25em] italic">Cash Flow</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[9px] font-black text-emerald-500/60 uppercase tracking-widest italic">Income</span>
                    <span className="text-xs font-black text-white italic">${((intel?.cashFlow?.income || 0) / 1000).toFixed(1)}k</span>
                  </div>
                  <div className="w-full bg-white/[0.03] rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-emerald-500/70 rounded-full transition-all duration-1000" style={{
                      width: `${intel?.cashFlow ? (intel.cashFlow.income / Math.max(intel.cashFlow.income, intel.cashFlow.expenses, 1)) * 100 : 0}%`
                    }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[9px] font-black text-status-error/60 uppercase tracking-widest italic">Expenses</span>
                    <span className="text-xs font-black text-white italic">${((intel?.cashFlow?.expenses || 0) / 1000).toFixed(1)}k</span>
                  </div>
                  <div className="w-full bg-white/[0.03] rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-status-error/70 rounded-full transition-all duration-1000" style={{
                      width: `${intel?.cashFlow ? (intel.cashFlow.expenses / Math.max(intel.cashFlow.income, intel.cashFlow.expenses, 1)) * 100 : 0}%`
                    }} />
                  </div>
                </div>
                <div className="pt-3 border-t border-white/[0.03] flex justify-between items-center">
                  <span className="text-[9px] font-black text-white/20 uppercase tracking-widest italic">Net Cash Flow</span>
                  <span className={clsx("text-sm font-black italic", (intel?.cashFlow?.netCashFlow || 0) >= 0 ? 'text-emerald-500' : 'text-status-error')}>
                    {(intel?.cashFlow?.netCashFlow || 0) >= 0 ? '+' : ''}${((intel?.cashFlow?.netCashFlow || 0) / 1000).toFixed(1)}k
                  </span>
                </div>
              </div>
            </div>

            {/* Collection Rate */}
            <div className="bg-surface/30 border border-white/[0.03] rounded-[3rem] p-8 backdrop-blur-md">
              <div className="flex items-center gap-4 mb-6 px-2">
                <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                <h3 className="font-black text-white text-[10px] uppercase tracking-[0.25em] italic">Collection Rate</h3>
              </div>
              <CollectionRateBars data={intel?.collectionRate || []} />
            </div>
          </div>
        </div>

        {/* Transaction Feed */}
        <div className="bg-surface/30 border border-white/[0.03] rounded-[3rem] p-8 backdrop-blur-md pb-20">
          <div className="flex items-center justify-between mb-10 px-4">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
              <h3 className="font-black text-white text-[10px] uppercase tracking-[0.25em] italic">Live Transaction Feed</h3>
            </div>
            <span className="text-[9px] font-black text-white/10 uppercase tracking-widest italic">Last 15 Entries</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.03]">
                  <th className="pb-6 px-6 text-[10px] font-black text-white/10 uppercase tracking-[0.3em] italic">Asset</th>
                  <th className="pb-6 px-6 text-[10px] font-black text-white/10 uppercase tracking-[0.3em] italic">Occupant</th>
                  <th className="pb-6 px-6 text-[10px] font-black text-white/10 uppercase tracking-[0.3em] italic">Type</th>
                  <th className="pb-6 px-6 text-[10px] font-black text-white/10 uppercase tracking-[0.3em] italic">Date</th>
                  <th className="pb-6 px-6 text-[10px] font-black text-white/10 uppercase tracking-[0.3em] italic">Amount</th>
                  <th className="pb-6 px-6 text-[10px] font-black text-white/10 uppercase tracking-[0.3em] italic text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.01]">
                {(intel?.recentTransactions || []).map((tx) => (
                  <tr key={tx.id} className="group hover:bg-white/[0.01] transition-all">
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center border border-white/[0.05] text-white/20 group-hover:text-primary transition-all">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-white italic uppercase tracking-tighter">{tx.property?.name}</p>
                          <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest mt-1">Unit {tx.unit?.unitNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <p className="text-xs font-black text-white italic uppercase tracking-tighter">{tx.tenant?.name}</p>
                      <p className="text-[9px] text-white/20 font-bold italic lowercase mt-1">{tx.tenant?.email}</p>
                    </td>
                    <td className="py-6 px-6">
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic bg-white/5 px-2 py-1 rounded-md">{tx.type}</span>
                    </td>
                    <td className="py-6 px-6">
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">{format(new Date(tx.dueDate), 'MMM dd, yyyy')}</p>
                    </td>
                    <td className="py-6 px-6">
                      <p className="text-sm font-black text-white italic tracking-tighter">${Number(tx.amount).toLocaleString()}</p>
                    </td>
                    <td className="py-6 px-6 text-right">
                      <div className="flex items-center justify-end gap-4">
                        <span className={clsx(
                          "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest italic border",
                          tx.status === 'PAID' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                          tx.status === 'PENDING' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                          tx.status === 'OVERDUE' ? "bg-status-error/10 text-status-error border-status-error/20" :
                          "bg-white/5 text-white/20 border-white/10"
                        )}>
                          {tx.status}
                        </span>
                        {tx.status !== 'PAID' && (
                          <button
                            onClick={() => updateTransaction(tx.id, { status: 'PAID', paidDate: new Date().toISOString() })}
                            className="p-2 hover:bg-emerald-500/10 rounded-xl text-white/5 hover:text-emerald-500 transition-all"
                            title="Confirm Payment"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-2 hover:bg-white/5 rounded-xl text-white/5 hover:text-white transition-all">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
