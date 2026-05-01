'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Star, 
  Mail, 
  Phone, 
  Award,
  Loader2,
  CheckCircle2,
  MoreVertical,
  Wrench,
  Zap,
  Droplets,
  ShieldAlert,
  Leaf,
  ArrowUpRight
} from 'lucide-react';
import { useVendorStore } from '@/store/vendor.store';
import AddVendorModal from '@/components/vendors/AddVendorModal';
import { clsx } from 'clsx';

const CATEGORIES = [
  { id: 'PLUMBING', label: 'Plumbing', icon: Droplets, color: 'text-blue-500' },
  { id: 'ELECTRICAL', label: 'Electrical', icon: Zap, color: 'text-amber-500' },
  { id: 'HVAC', label: 'HVAC', icon: Wrench, color: 'text-primary' },
  { id: 'SECURITY', label: 'Security', icon: ShieldAlert, color: 'text-status-error' },
  { id: 'LANDSCAPING', label: 'Landscaping', icon: Leaf, color: 'text-emerald-500' },
  { id: 'GENERAL', label: 'General', icon: Users, color: 'text-slate-400' },
];

export default function VendorsPage() {
  const { vendors, loading, fetchVendors, deleteVendor } = useVendorStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         v.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !activeCategory || v.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-in fade-in duration-700">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase underline decoration-primary decoration-4 underline-offset-8">Vendor Orchestration</h1>
            <p className="text-white/20 mt-4 font-bold italic uppercase tracking-widest text-[10px]">Service Provider Directory • Operational Partners</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 bg-primary text-white rounded-[1.5rem] font-black italic uppercase text-xs tracking-[0.2em] hover:brightness-110 transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)] flex items-center gap-3 border border-primary/20"
          >
            <Plus className="w-5 h-5" /> Onboard Provider
          </button>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 px-4">
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => setActiveCategory(null)}
              className={clsx(
                "px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all border",
                !activeCategory ? "bg-white/5 border-white/10 text-white shadow-lg" : "text-white/20 border-transparent hover:text-white/40"
              )}
            >
              All Providers
            </button>
            {CATEGORIES.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={clsx(
                  "px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all border flex items-center gap-2",
                  activeCategory === cat.id ? "bg-white/5 border-white/10 text-white shadow-lg" : "text-white/20 border-transparent hover:text-white/40"
                )}
              >
                <cat.icon className={clsx("w-3.5 h-3.5", activeCategory === cat.id ? cat.color : "text-current")} />
                {cat.label}
              </button>
            ))}
          </div>
          
          <div className="flex-1 max-w-md relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Filter by name or contact..."
              className="w-full bg-surface/40 border border-white/[0.05] rounded-2xl py-4 pl-12 pr-6 text-xs font-bold text-white italic placeholder:text-white/10 outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Vendor Grid */}
        {loading ? (
          <div className="py-40 flex flex-col items-center justify-center opacity-20">
            <Loader2 className="w-12 h-12 animate-spin mb-6" />
            <p className="text-[10px] font-black uppercase tracking-widest italic">Syncing Operational Partners...</p>
          </div>
        ) : filteredVendors.length === 0 ? (
          <div className="bg-surface/30 rounded-[3rem] border border-white/[0.03] p-32 text-center opacity-40">
            <Award className="w-16 h-16 mx-auto mb-6 text-white/10" />
            <p className="text-[10px] font-black uppercase tracking-widest italic">No service providers found matching criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
            {filteredVendors.map((vendor) => {
              const CategoryIcon = CATEGORIES.find(c => c.id === vendor.category)?.icon || Users;
              const categoryColor = CATEGORIES.find(c => c.id === vendor.category)?.color || 'text-white/20';
              
              return (
                <div key={vendor.id} className="group bg-surface/40 rounded-[2.5rem] border border-white/[0.03] hover:border-primary/30 transition-all duration-500 overflow-hidden shadow-2xl relative p-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex items-start justify-between mb-8 relative z-10">
                    <div className={clsx("w-16 h-16 rounded-[1.5rem] bg-white/[0.03] border border-white/[0.05] flex items-center justify-center shadow-inner transition-all group-hover:scale-110", categoryColor)}>
                      <CategoryIcon className="w-8 h-8" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black italic text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          {vendor.rating.toFixed(1)}
                       </div>
                       <span className={clsx(
                         "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest italic border",
                         vendor.status === 'ACTIVE' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-white/5 text-white/20 border-white/10"
                       )}>
                         {vendor.status}
                       </span>
                    </div>
                  </div>

                  <div className="space-y-6 relative z-10">
                    <div>
                      <h3 className="text-xl font-black text-white italic uppercase tracking-tighter group-hover:text-primary transition-colors">{vendor.name}</h3>
                      <p className="text-[9px] text-white/20 font-black uppercase tracking-widest mt-1 italic">{vendor.category} Specialist</p>
                    </div>

                    <div className="space-y-3 pt-6 border-t border-white/[0.03]">
                      <div className="flex items-center gap-3 text-white/30 group-hover:text-white/60 transition-colors">
                        <Mail className="w-4 h-4" />
                        <span className="text-[10px] font-bold italic lowercase">{vendor.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-white/30 group-hover:text-white/60 transition-colors">
                        <Phone className="w-4 h-4" />
                        <span className="text-[10px] font-bold italic tracking-widest">{vendor.phone}</span>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/[0.03] flex items-center justify-between">
                       <button className="flex items-center gap-2 text-[9px] font-black text-primary uppercase tracking-widest italic hover:text-white transition-colors">
                         View History <ArrowUpRight className="w-3 h-3" />
                       </button>
                       <button 
                        onClick={() => {
                          if (confirm('Decommission this operational partner?')) {
                            deleteVendor(vendor.id);
                          }
                        }}
                        className="p-2 hover:bg-status-error/10 rounded-xl text-white/5 hover:text-status-error transition-all"
                       >
                         <MoreVertical className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <AddVendorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </DashboardLayout>
  );
}
