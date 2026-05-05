'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  Users, UserPlus, Shield, Mail, Phone, Trash2, 
  MoreVertical, Loader2, CheckCircle2, AlertTriangle,
  UserCheck, ShieldCheck, CreditCard, Wrench, Search
} from 'lucide-react';
import { useTeamStore } from '@/store/team.store';
import { useAuthStore } from '@/store/auth.store';
import AddEmployeeModal from '@/components/team/AddEmployeeModal';
import { clsx } from 'clsx';
import { format } from 'date-fns';

const ROLE_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  OWNER: { label: 'Owner', color: 'text-status-error border-status-error/20 bg-status-error/5', icon: ShieldCheck },
  ADMIN: { label: 'Admin', color: 'text-primary border-primary/20 bg-primary/5', icon: UserCheck },
  MANAGER: { label: 'Manager', color: 'text-amber-500 border-amber-500/20 bg-amber-500/5', icon: Shield },
  ACCOUNTANT: { label: 'Accountant', color: 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5', icon: CreditCard },
  MAINTENANCE: { label: 'Maintenance', color: 'text-indigo-400 border-indigo-400/20 bg-indigo-400/5', icon: Wrench },
  CLIENT: { label: 'Client', color: 'text-white/40 border-white/10 bg-white/5', icon: Users },
  TENANT: { label: 'Tenant', color: 'text-white/20 border-white/5 bg-white/5', icon: Users },
};

export default function TeamPage() {
  const { members, loading, fetchTeam, removeMember, updateRole } = useTeamStore();
  const { user: currentUser } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const canManage = currentUser?.role === 'OWNER' || currentUser?.role === 'ADMIN';

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-in fade-in duration-700">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase underline decoration-primary decoration-4 underline-offset-8">Team Intelligence</h1>
            <p className="text-white/20 mt-4 font-bold italic uppercase tracking-widest text-[10px]">Personnel Management • Secure Access Control</p>
          </div>
          {canManage && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-4 bg-primary text-white rounded-[1.5rem] font-black italic uppercase text-xs tracking-[0.2em] hover:brightness-110 transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)] flex items-center gap-3 border border-primary/20"
            >
              <UserPlus className="w-5 h-5" /> Add Personnel
            </button>
          )}
        </div>

        {/* Stats & Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-4">
          <div className="flex items-center gap-8">
             <div className="flex flex-col">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest italic mb-1">Total Active</p>
                <p className="text-2xl font-black text-white italic tracking-tighter">{members.length} MEMBERS</p>
             </div>
             <div className="w-px h-10 bg-white/5" />
             <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {members.slice(0, 5).map(m => (
                    <div key={m.id} className="w-10 h-10 rounded-full border-2 border-background bg-surface/50 flex items-center justify-center text-[10px] font-black italic uppercase text-white/40">
                      {m.avatar ? <img src={m.avatar} className="w-full h-full rounded-full object-cover" /> : getInitials(m.name)}
                    </div>
                  ))}
                  {members.length > 5 && (
                    <div className="w-10 h-10 rounded-full border-2 border-background bg-primary/20 flex items-center justify-center text-[10px] font-black italic uppercase text-primary">
                      +{members.length - 5}
                    </div>
                  )}
                </div>
             </div>
          </div>
          
          <div className="flex-1 max-w-md relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name, email or role..."
              className="w-full bg-surface/40 border border-white/[0.05] rounded-2xl py-4 pl-12 pr-6 text-xs font-bold text-white italic placeholder:text-white/10 outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Members List */}
        {loading ? (
          <div className="py-40 flex flex-col items-center justify-center opacity-20">
            <Loader2 className="w-12 h-12 animate-spin mb-6" />
            <p className="text-[10px] font-black uppercase tracking-widest italic">Synchronizing Team Data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
            {filteredMembers.map((member) => {
              const config = ROLE_CONFIG[member.role] || ROLE_CONFIG.CLIENT;
              const RoleIcon = config.icon;
              const isSelf = currentUser?.id === member.id;
              
              return (
                <div key={member.id} className="group bg-surface/40 rounded-[2.5rem] border border-white/[0.03] hover:border-primary/30 transition-all duration-500 overflow-hidden shadow-2xl relative p-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex items-start justify-between mb-8 relative z-10">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/[0.05] shadow-inner text-white/20 text-xl font-black italic overflow-hidden">
                        {member.avatar ? <img src={member.avatar} className="w-full h-full object-cover" /> : getInitials(member.name)}
                      </div>
                      <div className={clsx(
                        "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-background flex items-center justify-center",
                        member.isVerified ? "bg-emerald-500" : "bg-status-error"
                      )}>
                        <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                      </div>
                    </div>
                    
                    {canManage && !isSelf && member.role !== 'OWNER' && (
                      <button 
                        onClick={() => removeMember(member.id)}
                        className="p-2.5 hover:bg-status-error/10 rounded-xl text-white/5 hover:text-status-error transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-6 relative z-10">
                    <div>
                      <h4 className="text-xl font-black text-white italic uppercase tracking-tighter group-hover:text-primary transition-colors truncate">{member.name} {isSelf && "(YOU)"}</h4>
                      <p className="text-[10px] text-white/20 font-bold italic lowercase mt-1">{member.email}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className={clsx("px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] italic border flex items-center gap-2", config.color)}>
                        <RoleIcon className="w-3 h-3" />
                        {config.label}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/[0.03] space-y-3">
                      <div className="flex items-center gap-3 text-white/20 group-hover:text-white/40 transition-colors">
                        <Mail className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-black uppercase tracking-widest italic">{member.email}</span>
                      </div>
                      {member.phone && (
                        <div className="flex items-center gap-3 text-white/20 group-hover:text-white/40 transition-colors">
                          <Phone className="w-3.5 h-3.5" />
                          <span className="text-[9px] font-black uppercase tracking-widest italic">{member.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 flex items-center justify-between text-[8px] font-black uppercase tracking-widest italic text-white/10">
                      <span>Joined {format(new Date(member.createdAt), 'MMM yyyy')}</span>
                      {canManage && !isSelf && member.role !== 'OWNER' && (
                        <select 
                          className="bg-transparent border-none outline-none text-primary hover:text-white transition-colors cursor-pointer"
                          value={member.role}
                          onChange={(e) => updateRole(member.id, e.target.value)}
                        >
                          <option value="ADMIN">Promote to Admin</option>
                          <option value="MANAGER">Set as Manager</option>
                          <option value="ACCOUNTANT">Set as Accountant</option>
                          <option value="MAINTENANCE">Set as Maintenance</option>
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <AddEmployeeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </DashboardLayout>
  );
}
