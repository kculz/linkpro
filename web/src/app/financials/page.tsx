'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  CheckCircle2, 
  Filter, 
  Search, 
  MoreVertical,
  Loader2,
  Building2,
  Calendar,
  CreditCard,
  AlertCircle
} from 'lucide-react';
import { useTransactionStore } from '@/store/transaction.store';
import { clsx } from 'clsx';
import { format } from 'date-fns';

export default function FinancialsPage() {
  const { transactions, stats, loading, fetchTransactions, fetchStats, updateTransaction } = useTransactionStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTransactions();
    fetchStats();
  }, [fetchTransactions, fetchStats]);

  const filteredTransactions = transactions.filter(tx => 
    tx.tenant?.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tx.property?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statCards = [
    { label: 'Total Revenue', value: stats?.totalRevenue || 0, icon: TrendingUp, color: 'text-emerald-500', trend: '+12%' },
    { label: 'Pending Collections', value: stats?.pendingRevenue || 0, icon: Clock, color: 'text-amber-500', trend: '8 invoices' },
    { label: 'Overdue Arrears', value: stats?.overdueRevenue || 0, icon: AlertCircle, color: 'text-status-error', trend: '-3%' },
    { label: 'Collection Rate', value: '94%', icon: CheckCircle2, color: 'text-primary', trend: 'Stable' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-in fade-in duration-700">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase underline decoration-primary decoration-4 underline-offset-8">Revenue Intelligence</h1>
            <p className="text-white/20 mt-4 font-bold italic uppercase tracking-widest text-[10px]">Financial Operations • Portfolio Yield Analysis</p>
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {statCards.map((stat, i) => (
            <div key={stat.label} className="bg-surface/40 p-8 rounded-[2.5rem] border border-white/[0.03] shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className={clsx("w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/[0.05] shadow-inner transition-all group-hover:scale-110", stat.color)}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="text-[10px] font-black text-white/10 uppercase italic tracking-widest flex items-center gap-1">
                    {stat.trend} {stat.trend.includes('+') ? <ArrowUpRight className="w-3 h-3 text-emerald-500" /> : <ArrowDownRight className="w-3 h-3 text-status-error" />}
                  </div>
                </div>
                <p className="text-white/20 text-[10px] font-black uppercase tracking-widest italic mb-2">{stat.label}</p>
                <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">
                  {typeof stat.value === 'number' ? `$${stat.value.toLocaleString()}` : stat.value}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Filters & Ledger */}
        <div className="bg-surface/30 border border-white/[0.03] rounded-[3rem] p-8 backdrop-blur-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 px-4">
            <div className="flex-1 max-w-md relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Filter ledger by tenant or asset..."
                className="w-full bg-white/[0.02] border border-white/[0.05] rounded-2xl py-4 pl-12 pr-6 text-xs font-bold text-white italic placeholder:text-white/10 outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="px-5 py-3 bg-white/[0.02] border border-white/[0.05] rounded-xl text-[10px] font-black text-white/40 uppercase tracking-widest italic flex items-center gap-2 hover:bg-white/[0.05] transition-all">
                <Filter className="w-3.5 h-3.5" /> All Types
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-40 flex flex-col items-center justify-center opacity-20">
              <Loader2 className="w-12 h-12 animate-spin mb-6" />
              <p className="text-[10px] font-black uppercase tracking-widest italic">Syncing Revenue Ledger...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.03]">
                    <th className="pb-6 px-6 text-[10px] font-black text-white/10 uppercase tracking-[0.3em] italic">Operational Item</th>
                    <th className="pb-6 px-6 text-[10px] font-black text-white/10 uppercase tracking-[0.3em] italic">Occupant</th>
                    <th className="pb-6 px-6 text-[10px] font-black text-white/10 uppercase tracking-[0.3em] italic">Category</th>
                    <th className="pb-6 px-6 text-[10px] font-black text-white/10 uppercase tracking-[0.3em] italic">Due Date</th>
                    <th className="pb-6 px-6 text-[10px] font-black text-white/10 uppercase tracking-[0.3em] italic">Quantum</th>
                    <th className="pb-6 px-6 text-[10px] font-black text-white/10 uppercase tracking-[0.3em] italic text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.01]">
                  {filteredTransactions.map((tx) => (
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
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
