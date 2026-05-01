'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  Calendar, 
  Building2, 
  MoreVertical,
  Loader2,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useTenantStore } from '@/store/tenant.store';
import { useAuthStore } from '@/store/auth.store';
import AddTenantModal from '@/components/tenants/AddTenantModal';
import { clsx } from 'clsx';
import { format } from 'date-fns';

export default function TenantsPage() {
  const { tenants, loading, fetchTenants, deleteTenant } = useTenantStore();
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const canManage = user?.role === 'ADMIN' || user?.role === 'PM';

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.unit?.unitNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: 'Total Occupants', value: tenants.length, icon: Users, color: 'text-primary' },
    { label: 'Active Leases', value: tenants.filter(t => t.status === 'ACTIVE').length, icon: ShieldCheck, color: 'text-emerald-500' },
    { label: 'Pending Apps', value: tenants.filter(t => t.status === 'PENDING').length, icon: Clock, color: 'text-amber-500' },
    { label: 'Lease Alerts', value: 0, icon: AlertCircle, color: 'text-status-error' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-in fade-in duration-700">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase underline decoration-primary decoration-4 underline-offset-8">Tenant Directory</h1>
            <p className="text-white/20 mt-4 font-bold italic uppercase tracking-widest text-[10px]">Occupancy Intelligence • Relationship Management</p>
          </div>
          {canManage && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-4 bg-primary text-white rounded-[1.5rem] font-black italic uppercase text-xs tracking-[0.2em] hover:brightness-110 transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)] flex items-center gap-3 border border-primary/20"
            >
              <UserPlus className="w-5 h-5" /> Onboard Tenant
            </button>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={stat.label} className="bg-surface/40 p-8 rounded-[2.5rem] border border-white/[0.03] shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className={clsx("w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/[0.05] shadow-inner transition-all group-hover:scale-110", stat.color)}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-white/5 group-hover:text-white/20 transition-all" />
                </div>
                <p className="text-white/20 text-[10px] font-black uppercase tracking-widest italic mb-2">{stat.label}</p>
                <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-4">
          <div className="flex-1 max-w-md relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Filter by name, email, or unit..."
              className="w-full bg-surface/40 border border-white/[0.05] rounded-2xl py-4 pl-12 pr-6 text-xs font-bold text-white italic placeholder:text-white/10 outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="px-5 py-3 bg-white/[0.02] border border-white/[0.05] rounded-xl text-[10px] font-black text-white/40 uppercase tracking-widest italic flex items-center gap-2 hover:bg-white/[0.05] transition-all">
              <Filter className="w-3.5 h-3.5" /> All Status
            </button>
          </div>
        </div>

        {/* Tenant Grid */}
        {loading ? (
          <div className="py-40 flex flex-col items-center justify-center opacity-20">
            <Loader2 className="w-12 h-12 animate-spin mb-6" />
            <p className="text-[10px] font-black uppercase tracking-widest italic">Syncing Occupant Data...</p>
          </div>
        ) : filteredTenants.length === 0 ? (
          <div className="bg-surface/30 rounded-[3rem] border border-white/[0.03] p-24 text-center opacity-40">
            <Users className="w-16 h-16 mx-auto mb-6 text-white/10" />
            <p className="text-[10px] font-black uppercase tracking-widest italic">No active occupants matching search parameters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
            {filteredTenants.map((tenant) => (
              <div key={tenant.id} className="group bg-surface/40 rounded-[2.5rem] border border-white/[0.03] hover:border-primary/30 transition-all duration-500 overflow-hidden shadow-2xl relative p-8">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-start justify-between mb-8 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-2xl font-black text-white/20 italic group-hover:text-primary transition-all shadow-inner overflow-hidden">
                       <span className="relative z-10">{tenant.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white italic uppercase tracking-tighter group-hover:text-primary transition-colors">{tenant.name}</h3>
                      <span className={clsx(
                        "inline-block px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest italic border mt-2",
                        tenant.status === 'ACTIVE' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                        tenant.status === 'PENDING' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                        "bg-white/5 text-white/20 border-white/10"
                      )}>
                        {tenant.status}
                      </span>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-white/5 rounded-xl text-white/10 hover:text-white transition-all">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6 relative z-10">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/[0.03]">
                      <p className="text-[8px] text-white/20 font-black uppercase tracking-widest mb-1 italic flex items-center gap-2">
                        <Building2 className="w-3 h-3 text-primary" /> Asset Segment
                      </p>
                      <p className="text-xs font-black text-white italic uppercase tracking-tighter">{tenant.unit?.unitNumber || 'UNASSIGNED'}</p>
                    </div>
                    <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/[0.03]">
                      <p className="text-[8px] text-white/20 font-black uppercase tracking-widest mb-1 italic flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-primary" /> Lease Cycle
                      </p>
                      <p className="text-[10px] font-black text-white italic uppercase tracking-tighter">Ends {format(new Date(tenant.leaseEnd), 'MMM yyyy')}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-white/30 group-hover:text-white/60 transition-colors">
                      <Mail className="w-4 h-4" />
                      <span className="text-[10px] font-bold italic lowercase">{tenant.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/30 group-hover:text-white/60 transition-colors">
                      <Phone className="w-4 h-4" />
                      <span className="text-[10px] font-bold italic tracking-widest">{tenant.phone}</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/[0.03] flex items-center justify-between">
                    <div>
                      <p className="text-[8px] text-white/10 font-black uppercase tracking-widest mb-1 italic">Monthly Obligation</p>
                      <p className="text-xl font-black text-white italic tracking-tighter">${Number(tenant.rentAmount).toLocaleString()}</p>
                    </div>
                    <button className="px-4 py-2 bg-white/[0.05] hover:bg-white/[0.1] rounded-xl text-[9px] font-black text-white uppercase tracking-widest italic transition-all border border-white/5 shadow-lg">
                      Full Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <AddTenantModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </DashboardLayout>
  );
}
