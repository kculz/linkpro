'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  Wrench, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  PlayCircle,
  MoreVertical,
  Loader2,
  Building2,
  User,
  ArrowUpRight
} from 'lucide-react';
import { useMaintenanceStore } from '@/store/maintenance.store';
import { useAuthStore } from '@/store/auth.store';
import LogMaintenanceModal from '@/components/maintenance/LogMaintenanceModal';
import { clsx } from 'clsx';
import { useSocket } from '@/hooks/useSocket';
import { formatDistanceToNow } from 'date-fns';

const COLUMNS = [
  { id: 'OPEN', label: 'Open Intel', color: 'text-status-error', icon: AlertTriangle },
  { id: 'IN_PROGRESS', label: 'Active Repairs', color: 'text-amber-500', icon: PlayCircle },
  { id: 'RESOLVED', label: 'Resolved Assets', color: 'text-emerald-500', icon: CheckCircle2 },
  { id: 'CLOSED', label: 'Decommissioned', color: 'text-white/20', icon: Clock },
];

export default function MaintenancePage() {
  const { requests, loading, fetchRequests, updateRequest } = useMaintenanceStore();
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const canManage = user?.role === 'ADMIN' || user?.role === 'PM';

  // Real-time synchronization
  useSocket();

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const filteredRequests = requests.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.property?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.unit?.unitNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-in fade-in duration-700">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase underline decoration-primary decoration-4 underline-offset-8">Maintenance Operations</h1>
            <p className="text-white/20 mt-4 font-bold italic uppercase tracking-widest text-[10px]">Tactical Repairs • Asset Integrity Management</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 bg-primary text-white rounded-[1.5rem] font-black italic uppercase text-xs tracking-[0.2em] hover:brightness-110 transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)] flex items-center gap-3 border border-primary/20"
          >
            <Plus className="w-5 h-5" /> Log Intelligence
          </button>
        </div>

        {/* Search & Stats */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-4">
          <div className="flex-1 max-w-md relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Filter by asset or issue..."
              className="w-full bg-surface/40 border border-white/[0.05] rounded-2xl py-4 pl-12 pr-6 text-xs font-bold text-white italic placeholder:text-white/10 outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end">
              <p className="text-[8px] font-black text-white/20 uppercase tracking-widest italic">Open Tickets</p>
              <p className="text-xl font-black text-white italic">{requests.filter(r => r.status === 'OPEN').length}</p>
            </div>
            <div className="w-px h-8 bg-white/5" />
            <div className="flex flex-col items-end">
              <p className="text-[8px] font-black text-white/20 uppercase tracking-widest italic">Efficiency</p>
              <p className="text-xl font-black text-emerald-500 italic">94%</p>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        {loading ? (
          <div className="py-40 flex flex-col items-center justify-center opacity-20">
            <Loader2 className="w-12 h-12 animate-spin mb-6" />
            <p className="text-[10px] font-black uppercase tracking-widest italic">Scanning Operational Status...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pb-20">
            {COLUMNS.map((col) => (
              <div key={col.id} className="space-y-6">
                <div className="flex items-center justify-between px-4">
                  <div className="flex items-center gap-3">
                    <col.icon className={clsx("w-4 h-4", col.color)} />
                    <h3 className={clsx("font-black text-[10px] uppercase tracking-[0.25em] italic", col.color)}>{col.label}</h3>
                  </div>
                  <span className="text-[10px] font-black text-white/5 uppercase tracking-widest italic">{filteredRequests.filter(r => r.status === col.id).length}</span>
                </div>

                <div className="flex flex-col gap-6 min-h-[600px] rounded-[3rem] bg-surface/20 p-4 border border-white/[0.03] shadow-inner backdrop-blur-sm">
                  {filteredRequests.filter(r => r.status === col.id).map((request) => (
                    <div key={request.id} className="group bg-surface/40 p-6 rounded-[2.5rem] border border-white/[0.03] shadow-xl hover:border-primary/30 transition-all cursor-pointer relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl rounded-full -mr-12 -mt-12 opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="flex items-start justify-between mb-6 relative z-10">
                        <span className={clsx(
                          "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest italic border",
                          request.priority === 'URGENT' ? "bg-status-error/10 text-status-error border-status-error/20 animate-pulse" :
                          request.priority === 'HIGH' ? "bg-status-warning/10 text-status-warning border-status-warning/20" :
                          "bg-primary/10 text-primary border-primary/20"
                        )}>
                          {request.priority}
                        </span>
                        {canManage && (
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              className="p-1.5 hover:bg-primary/10 rounded-lg text-white/10 hover:text-primary transition-all"
                              onClick={() => {
                                const nextStatusMap: Record<string, string> = {
                                  'OPEN': 'IN_PROGRESS',
                                  'IN_PROGRESS': 'RESOLVED',
                                  'RESOLVED': 'CLOSED',
                                };
                                const nextStatus = nextStatusMap[request.status];
                                if (nextStatus) updateRequest(request.id, { status: nextStatus as any });
                              }}
                            >
                              <PlayCircle className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      <h4 className="font-black text-white text-xs italic uppercase tracking-tighter mb-4 leading-relaxed group-hover:text-primary transition-colors">{request.title}</h4>
                      
                      <div className="space-y-4 relative z-10">
                        <div className="flex items-center gap-3 text-white/20">
                          <Building2 className="w-3 h-3 text-primary" />
                          <span className="text-[9px] font-black uppercase tracking-widest italic">{request.property?.name} • Unit {request.unit?.unitNumber}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-white/10 group-hover:text-white/30 transition-colors">
                            <User className="w-3 h-3" />
                            <span className="text-[9px] font-bold italic lowercase">{request.tenant?.name || 'SYSTEM_REPORT'}</span>
                          </div>
                          <p className="text-[8px] font-black text-white/5 uppercase italic">{formatDistanceToNow(new Date(request.createdAt), { addSuffix: true }).replace('about ', '')}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredRequests.filter(r => r.status === col.id).length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/[0.02] rounded-[2.5rem] py-12 opacity-10">
                      <p className="text-[8px] font-black uppercase tracking-[0.3em] italic">No active intel</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <LogMaintenanceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </DashboardLayout>
  );
}
