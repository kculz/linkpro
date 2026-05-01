'use client';

import { useEffect, useState, use } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  Building2, 
  MapPin, 
  Users, 
  TrendingUp, 
  ArrowLeft, 
  Clock, 
  DollarSign, 
  Wrench, 
  FileText,
  Loader2,
  Calendar,
  CheckCircle2,
  LayoutGrid,
  ChevronRight,
  ArrowUpRight,
  User,
  MoreVertical
} from 'lucide-react';
import Link from 'next/link';
import { getUnitById } from '@/services/propertyService';
import { formatDistanceToNow, format } from 'date-fns';
import { clsx } from 'clsx';

export default function UnitDetailPage({ params }: { params: Promise<{ id: string; unitId: string }> }) {
  const { id, unitId } = use(params);
  const [unit, setUnit] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnit = async () => {
      try {
        const data = await getUnitById(unitId);
        setUnit(data);
      } catch (err) {
        console.error('Failed to fetch unit details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUnit();
  }, [unitId]);

  if (loading || !unit) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-40">
          <Loader2 className="w-12 h-12 animate-spin text-primary opacity-50" />
          <p className="text-white/20 mt-6 font-black italic uppercase tracking-widest text-[10px]">Scanning Unit Matrix...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-in fade-in duration-700">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-6">
            <Link 
              href={`/properties/${id}`} 
              className="group flex items-center gap-3 text-white/20 hover:text-primary transition-all font-black text-[10px] uppercase tracking-[0.3em] w-fit italic"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" /> Back to Asset
            </Link>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-[2rem] bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-white/20 shadow-inner">
                <span className="text-3xl font-black italic">{unit.unitNumber.slice(0, 2)}</span>
              </div>
              <div>
                <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase underline decoration-primary decoration-4 underline-offset-8 mb-4">Unit {unit.unitNumber}</h1>
                <div className="flex items-center gap-4 text-white/20">
                  <span className="text-[10px] font-black flex items-center gap-2 uppercase tracking-widest italic">
                    <Building2 className="w-4 h-4 text-primary" /> {unit.property?.name}
                  </span>
                  <span className="text-white/5 font-black">/ / /</span>
                  <span className="text-[10px] font-black px-3 py-1 bg-white/5 border border-white/10 rounded-lg uppercase tracking-widest italic text-white/40">{unit.type}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
             <span className={clsx(
                "px-8 py-4 rounded-[1.5rem] font-black italic uppercase text-xs tracking-widest border transition-all flex items-center gap-3 shadow-2xl",
                unit.status === 'OCCUPIED' ? "bg-status-success/10 border-status-success/20 text-status-success" : "bg-primary/10 border-primary/20 text-primary"
              )}>
                {unit.status}
              </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Monthly Yield', value: `$${Number(unit.rent).toLocaleString()}`, icon: DollarSign, color: 'text-emerald-500' },
            { label: 'Total Revenue', value: `$${(unit.transactions?.reduce((acc: number, t: any) => acc + (t.status === 'PAID' ? Number(t.amount) : 0), 0) || 0).toLocaleString()}`, icon: TrendingUp, color: 'text-primary' },
            { label: 'Pending Repairs', value: unit.maintenanceRequests?.filter((r: any) => r.status === 'OPEN').length || 0, icon: Wrench, color: 'text-amber-500' },
            { label: 'Tenancy Length', value: unit.tenant ? '8 Months' : 'N/A', icon: Clock, color: 'text-indigo-500' },
          ].map((stat) => (
            <div key={stat.label} className="bg-surface/40 p-8 rounded-[2.5rem] border border-white/[0.03] shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/[0.01] pointer-events-none" />
              <div className="relative z-10 flex items-center gap-6">
                <div className={clsx("w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/[0.05] shadow-inner transition-all group-hover:scale-110", stat.color)}>
                  <stat.icon className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-white/20 text-[10px] font-black uppercase tracking-widest italic mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">{stat.value}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Occupant & Maintenance History */}
          <div className="lg:col-span-2 space-y-8">
            {/* Occupant Intel */}
            <div className="bg-surface/40 rounded-[3rem] border border-white/[0.03] overflow-hidden shadow-2xl backdrop-blur-md relative group">
              <div className="absolute inset-0 bg-primary/[0.01] pointer-events-none" />
              <div className="p-10 border-b border-white/[0.03] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                  <h3 className="font-black text-white text-[10px] uppercase tracking-[0.25em] italic">Occupant Intel</h3>
                </div>
                <button className="text-[10px] font-black text-primary hover:text-white transition-colors uppercase tracking-widest italic flex items-center gap-2 group/btn">
                  Manage Lease <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
              
              <div className="p-10">
                {unit.tenant ? (
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-[2rem] bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-white/20 shadow-inner">
                        <User className="w-10 h-10" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter">{unit.tenant.name}</h4>
                        <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest mt-2 italic">{unit.tenant.email} • {unit.tenant.phone}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                       <div className="p-6 bg-white/[0.02] rounded-[2rem] border border-white/[0.03] shadow-inner text-center">
                          <p className="text-[8px] text-white/20 font-black uppercase tracking-widest mb-1 italic">Lease Start</p>
                          <p className="text-sm font-black text-white italic">{format(new Date(unit.tenant.leaseStart), 'MMM dd, yyyy')}</p>
                       </div>
                       <div className="p-6 bg-white/[0.02] rounded-[2rem] border border-white/[0.03] shadow-inner text-center">
                          <p className="text-[8px] text-white/20 font-black uppercase tracking-widest mb-1 italic">Lease End</p>
                          <p className="text-sm font-black text-white italic">{format(new Date(unit.tenant.leaseEnd), 'MMM dd, yyyy')}</p>
                       </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-20 text-center opacity-10">
                    <Users className="w-16 h-16 mx-auto mb-6" />
                    <p className="text-[10px] font-black uppercase tracking-widest italic">Asset currently vacant</p>
                  </div>
                )}
              </div>
            </div>

            {/* Maintenance History */}
            <div className="bg-surface/40 rounded-[3rem] border border-white/[0.03] overflow-hidden shadow-2xl backdrop-blur-md relative group">
              <div className="p-10 border-b border-white/[0.03] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
                  <h3 className="font-black text-white text-[10px] uppercase tracking-[0.25em] italic">Maintenance History</h3>
                </div>
                <Link href="/maintenance" className="text-[10px] font-black text-white/20 hover:text-white transition-colors uppercase tracking-widest italic">View All</Link>
              </div>
              
              <div className="divide-y divide-white/[0.02]">
                {unit.maintenanceRequests?.length > 0 ? (
                  unit.maintenanceRequests.map((req: any) => (
                    <div key={req.id} className="p-8 flex items-center justify-between hover:bg-white/[0.02] transition-all group/item">
                      <div className="flex items-center gap-6">
                        <div className={clsx(
                          "w-12 h-12 rounded-xl bg-white/[0.03] flex items-center justify-center border border-white/[0.05] transition-all",
                          req.status === 'OPEN' ? "text-amber-500" : "text-emerald-500"
                        )}>
                          <Wrench className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-black text-white italic uppercase tracking-tighter text-sm">{req.title}</p>
                          <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest mt-1 italic">{req.category} • {formatDistanceToNow(new Date(req.createdAt), { addSuffix: true })}</p>
                        </div>
                      </div>
                      <span className={clsx(
                        "px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest italic border",
                        req.status === 'OPEN' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      )}>
                        {req.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center opacity-10">
                    <p className="text-[10px] font-black uppercase tracking-widest italic">No historical repairs logged</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Revenue Ledger & Documents */}
          <div className="space-y-8">
            <div className="bg-surface/40 rounded-[3rem] p-10 border border-white/[0.03] shadow-2xl backdrop-blur-md">
              <h3 className="font-black text-white text-[10px] uppercase tracking-[0.2em] italic mb-10 flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-emerald-500" /> Revenue Ledger
              </h3>
              <div className="space-y-6">
                {unit.transactions?.length > 0 ? (
                  unit.transactions.slice(0, 5).map((tx: any) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.03]">
                      <div>
                        <p className="text-[10px] font-black text-white italic uppercase">{tx.type}</p>
                        <p className="text-[8px] text-white/20 font-bold uppercase tracking-widest mt-1">{format(new Date(tx.dueDate), 'MMM dd')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-white italic">${Number(tx.amount).toLocaleString()}</p>
                        <span className={clsx(
                          "text-[7px] font-black uppercase tracking-widest italic",
                          tx.status === 'PAID' ? "text-emerald-500" : "text-amber-500"
                        )}>
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-[8px] font-black text-white/5 uppercase italic py-10">No financial activity</p>
                )}
                <Link href="/financials" className="block text-center text-[9px] font-black text-primary hover:text-white transition-colors uppercase tracking-widest italic mt-4 underline decoration-primary/30 underline-offset-4">Full Statement</Link>
              </div>
            </div>

            <div className="bg-surface/40 rounded-[3rem] p-10 border border-white/[0.03] shadow-2xl backdrop-blur-md">
              <h3 className="font-black text-white text-[10px] uppercase tracking-[0.2em] italic mb-10 flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary" /> Asset Artifacts
              </h3>
              <div className="space-y-4">
                {unit.documents?.length > 0 ? (
                  unit.documents.map((doc: any) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.03] group/doc cursor-pointer hover:border-primary/30 transition-all">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-white/20 group-hover/doc:text-primary transition-colors" />
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-tighter truncate max-w-[120px]">{doc.name}</span>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-white/5 group-hover/doc:text-primary transition-all" />
                    </div>
                  ))
                ) : (
                  <p className="text-center text-[8px] font-black text-white/5 uppercase italic py-10">No artifacts deposited</p>
                )}
                <Link href="/documents" className="block text-center text-[9px] font-black text-white/20 hover:text-white transition-colors uppercase tracking-widest italic mt-4">Open Vault</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
