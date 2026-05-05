'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Building2, Users, TrendingUp, Plus, MapPin, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { usePropertyStore } from '@/store/property.store';
import AddPropertyModal from '@/components/properties/AddPropertyModal';
import EntityDocumentsModal from '@/components/shared/EntityDocumentsModal';
import { FileText } from 'lucide-react';

export default function PropertiesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { properties, stats, loading, fetchProperties, fetchStats } = usePropertyStore();
  const [activeTab, setActiveTab] = useState('All Properties');
  
  const [docModal, setDocModal] = useState<{ isOpen: boolean; targetId: string; title: string }>({
    isOpen: false,
    targetId: '',
    title: ''
  });

  useEffect(() => {
    fetchProperties();
    fetchStats();
  }, [fetchProperties, fetchStats]);

  const filteredProperties = properties.filter(p => {
    if (activeTab === 'All Properties') return true;
    if (activeTab === 'Residential') return p.type === 'RESIDENTIAL';
    if (activeTab === 'Commercial') return p.type === 'COMMERCIAL';
    return true;
  });

  const getOccupancyColor = (rate: number) => {
    if (rate >= 90) return 'bg-emerald-500';
    if (rate >= 70) return 'bg-blue-500';
    return 'bg-amber-500';
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'RESIDENTIAL': return 'bg-emerald-100 text-emerald-700';
      case 'COMMERCIAL': return 'bg-blue-100 text-blue-700';
      case 'RENOVATION': return 'bg-amber-100 text-amber-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-in fade-in duration-700">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase underline decoration-primary decoration-4 underline-offset-8">Properties</h1>
            <p className="text-white/20 mt-4 font-bold italic uppercase tracking-widest text-[10px]">Real Estate Portfolio • Asset Management</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 bg-primary text-white rounded-[1.5rem] font-black italic uppercase text-xs tracking-[0.2em] hover:brightness-110 transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)] flex items-center gap-3 border border-primary/20"
          >
            <Plus className="w-5 h-5" /> Add Property
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Total Properties', value: stats?.totalProperties ?? 0, icon: Building2, color: 'text-primary bg-primary/10' },
            { label: 'Occupancy Rate', value: `${stats?.occupancyRate ?? 0}%`, icon: Users, color: 'text-status-success bg-status-success/10' },
            { label: 'Monthly Income', value: `$${(stats?.totalMonthlyIncome ?? 0).toLocaleString()}`, icon: TrendingUp, color: 'text-status-warning bg-status-warning/10' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-surface/40 rounded-[2.5rem] p-8 border border-white/[0.03] flex items-center gap-6 shadow-2xl backdrop-blur-md relative group overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center ${color} border border-current shadow-lg`}>
                <Icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-white/20 text-[10px] font-black uppercase tracking-widest italic mb-2">{label}</p>
                <p className="text-3xl font-black text-white italic tracking-tighter uppercase">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 bg-white/5 rounded-[2rem] p-2 w-fit border border-white/[0.05]">
          {['All Properties', 'Residential', 'Commercial'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.15em] italic transition-all ${activeTab === tab ? 'bg-primary text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 grayscale opacity-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-6" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] italic">Loading Properties...</p>
          </div>
        ) : (
          /* Properties Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-20">
            {filteredProperties.length > 0 ? (
              filteredProperties.map((property) => {
                const occupancyRate = property.totalUnits > 0 ? Math.round((property.occupiedUnits / property.totalUnits) * 100) : 0;
                return (
                  <div
                    key={property.id}
                    className="bg-surface/40 rounded-[3rem] border border-white/[0.03] shadow-2xl hover:border-primary/30 hover:-translate-y-2 transition-all duration-500 overflow-hidden group cursor-pointer backdrop-blur-md relative"
                  >
                    <div className="absolute inset-0 bg-primary/[0.01] pointer-events-none" />
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={property.image || '/images/property-placeholder.png'}
                        alt={property.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110 saturate-[0.7] group-hover:saturate-100 brightness-75 group-hover:brightness-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                      <div className="absolute top-6 left-6 flex gap-2">
                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest italic border backdrop-blur-md shadow-lg ${property.type === 'COMMERCIAL' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-status-success/20 text-status-success border-status-success/30'}`}>
                          {property.type}
                        </span>
                      </div>
                      <div className="absolute top-6 right-6">
                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest italic border backdrop-blur-md shadow-lg ${property.status === 'ACTIVE' ? 'bg-status-success text-white border-status-success/50 shadow-status-success/20' : 'bg-status-warning text-white border-status-warning/50'}`}>
                          {property.status}
                        </span>
                      </div>
                    </div>

                    <div className="p-8">
                      <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-4 decoration-primary/20 underline decoration-2 underline-offset-4">{property.name}</h3>
                      <div className="flex items-center gap-3 text-white/20 text-[10px] font-bold uppercase tracking-widest italic">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="truncate">{property.address}, {property.city}</span>
                      </div>

                      <div className="mt-8 space-y-6">
                        <div className="flex justify-between items-end">
                          <span className="text-white/20 text-[10px] font-black uppercase tracking-widest italic">Occupancy</span>
                          <span className="text-lg font-black text-white italic">{occupancyRate}%</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-1.5 shadow-inner">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.6)] ${getOccupancyColor(occupancyRate)}`}
                            style={{ width: `${occupancyRate}%` }}
                          />
                        </div>

                        <div className="flex justify-between items-center pt-6 border-t border-white/[0.03]">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setDocModal({ isOpen: true, targetId: property.id, title: property.name });
                            }}
                            className="flex items-center gap-2 text-white/20 hover:text-white transition-all group/files"
                          >
                            <FileText className="w-4 h-4 text-white/10 group-hover/files:text-primary transition-colors" />
                            <span className="text-[9px] font-black uppercase tracking-widest italic">Files</span>
                          </button>
                          <div className="text-right">
                            <p className="text-2xl font-black text-white italic tracking-tighter uppercase">
                              ${Number(property.monthlyIncome).toLocaleString()}
                              <span className="text-[10px] text-white/20 font-black uppercase tracking-widest ml-1">Income</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full bg-white/[0.02] rounded-[3rem] border-2 border-dashed border-white/[0.05] py-32 flex flex-col items-center justify-center group hover:border-primary/20 transition-all">
                <div className="w-24 h-24 bg-white/[0.02] rounded-[2.5rem] flex items-center justify-center mb-8 border border-white/[0.05] shadow-inner group-hover:scale-110 transition-transform">
                  <Building2 className="w-12 h-12 text-white/10" />
                </div>
                <p className="text-white text-2xl font-black uppercase tracking-tighter italic">No Properties</p>
                <p className="text-white/20 mt-4 text-[10px] font-bold uppercase tracking-[0.2em] italic text-center max-w-xs leading-relaxed">You haven't added any properties yet. Start by adding your first one.</p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="mt-12 px-8 py-4 bg-primary text-white rounded-[1.5rem] font-black italic uppercase text-xs tracking-[0.2em] hover:brightness-110 transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)] flex items-center gap-3 border border-primary/20"
                >
                  <Plus className="w-5 h-5" /> Add First Property
                </button>
              </div>
            )}
          </div>
        )}

        <AddPropertyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        <EntityDocumentsModal 
          isOpen={docModal.isOpen} 
          onClose={() => setDocModal(p => ({ ...p, isOpen: false }))}
          targetId={docModal.targetId}
          targetType="PROPERTY"
          title={docModal.title}
        />
      </div>
    </DashboardLayout>
  );
}
