'use client';

import { useEffect, useState, use } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  Building2, 
  MapPin, 
  Users, 
  TrendingUp, 
  ArrowLeft, 
  Plus, 
  Settings, 
  LayoutGrid,
  ChevronRight,
  Loader2,
  Trash2,
  Calendar,
  DollarSign,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePropertyStore } from '@/store/property.store';
import { useActivityStore } from '@/store/activity.store';
import * as PropertyService from '@/services/propertyService';
import AddUnitModal from '@/components/properties/AddUnitModal';
import { useSocket } from '@/hooks/useSocket';
import { clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const { properties, fetchProperties, updateUnitStatus } = usePropertyStore();
  const { activities, fetchActivities } = useActivityStore();
  const [property, setProperty] = useState<PropertyService.Property | null>(null);
  const [loading, setLoading] = useState(true);

  // Real-time synchronization
  useSocket(id);

  const selectedProperty = properties.find(p => p.id === id);

  useEffect(() => {
    if (!selectedProperty) {
      fetchProperties();
    } else {
      setProperty(selectedProperty);
      setLoading(false);
    }
  }, [id, selectedProperty, fetchProperties]);

  useEffect(() => {
    fetchActivities({ targetId: id, targetType: 'UNIT', limit: 10 });
  }, [id, fetchActivities]);

  if (loading || !property) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-40">
          <Loader2 className="w-12 h-12 animate-spin text-primary opacity-50" />
          <p className="text-white/20 mt-6 font-black italic uppercase tracking-widest text-[10px]">Scanning Asset Parameters...</p>
        </div>
      </DashboardLayout>
    );
  }

  const occupancyRate = property.totalUnits > 0 ? Math.round((property.occupiedUnits / property.totalUnits) * 100) : 0;

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-in fade-in duration-700">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-6">
            <Link 
              href="/properties" 
              className="group flex items-center gap-3 text-white/20 hover:text-primary transition-all font-black text-[10px] uppercase tracking-[0.3em] w-fit italic"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" /> Back to Portfolio
            </Link>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-2xl">
                <Building2 className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase underline decoration-primary decoration-4 underline-offset-8 mb-4">{property.name}</h1>
                <div className="flex items-center gap-4 text-white/20">
                  <span className="text-[10px] font-black flex items-center gap-2 uppercase tracking-widest italic">
                    <MapPin className="w-4 h-4 text-primary" /> {property.address}, {property.city}
                  </span>
                  <span className="text-white/5 font-black">/ / /</span>
                  <span className="text-[10px] font-black px-3 py-1 bg-primary/5 border border-primary/20 rounded-lg uppercase tracking-widest italic text-primary">{property.type}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="w-14 h-14 bg-surface/40 border border-white/[0.03] text-white/20 hover:text-white rounded-2xl flex items-center justify-center transition-all hover:bg-surface/60">
              <Settings className="w-6 h-6" />
            </button>
            <button className="px-8 py-4 bg-status-error/10 border border-status-error/20 text-status-error rounded-[1.5rem] font-black italic uppercase text-xs tracking-widest hover:bg-status-error/20 transition-all flex items-center gap-3 shadow-2xl">
              <Trash2 className="w-4 h-4" /> Decommission
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="relative h-[500px] rounded-[3.5rem] overflow-hidden shadow-2xl group border border-white/5">
              <Image 
                src={property.image || '/images/property-placeholder.png'} 
                alt={property.name} 
                fill 
                className="object-cover brightness-75 group-hover:brightness-90 transition-all duration-1000 saturate-50 group-hover:saturate-100 scale-105 group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-10 left-10 right-10 flex items-end justify-between">
                <div className="space-y-2">
                  <p className="text-primary font-black italic text-[10px] uppercase tracking-[0.4em]">Strategic Asset</p>
                  <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Operational Overview</h2>
                </div>
                <div className="flex gap-3">
                  <span className="px-5 py-2 bg-white/5 backdrop-blur-xl rounded-xl text-white/40 text-[10px] font-black uppercase tracking-widest border border-white/10 italic">
                    {property.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Units Section */}
            <div className="bg-surface/40 rounded-[3rem] border border-white/[0.03] overflow-hidden shadow-2xl backdrop-blur-md relative group">
              <div className="absolute inset-0 bg-primary/[0.01] pointer-events-none" />
              <div className="p-10 flex items-center justify-between border-b border-white/[0.03]">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                  <h3 className="font-black text-white text-[10px] uppercase tracking-[0.25em] italic">Unit Inventory</h3>
                </div>
                <button 
                  onClick={() => setIsUnitModalOpen(true)}
                  className="px-6 py-3 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest italic hover:brightness-110 transition-all flex items-center gap-3 border border-white/10 shadow-lg"
                >
                  <Plus className="w-4 h-4" /> Deploy Unit
                </button>
              </div>
              
              <div className="divide-y divide-white/[0.02]">
                {property.units && property.units.length > 0 ? (
                  property.units.map((unit) => (
                    <Link 
                      key={unit.id} 
                      href={`/properties/${id}/units/${unit.id}`}
                      className="p-8 flex items-center justify-between hover:bg-white/[0.02] transition-all group/unit relative"
                    >
                      <div className="flex items-center gap-6 relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-white/20 group-hover/unit:bg-primary/20 group-hover/unit:text-primary transition-all shadow-inner">
                          <span className="font-black italic text-lg">{unit.unitNumber.slice(0, 2)}</span>
                        </div>
                        <div>
                          <p className="font-black text-white italic uppercase tracking-tighter text-lg">Unit {unit.unitNumber}</p>
                          <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest mt-1 italic">{unit.type} • {unit.floorArea} SQFT</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-10 relative z-10">
                        <div className="text-right">
                          <p className="font-black text-white italic text-lg leading-none">${Number(unit.rent).toLocaleString()}</p>
                          <p className="text-[9px] text-white/10 font-black uppercase tracking-widest mt-1">Monthly Yield</p>
                        </div>
                        <span className={clsx(
                          "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic border",
                          unit.status === 'OCCUPIED' 
                            ? 'bg-status-success/10 text-status-success border-status-success/20' 
                            : 'bg-primary/10 text-primary border-primary/20'
                        )}>
                          {unit.status}
                        </span>
                        <ChevronRight className="w-5 h-5 text-white/5 group-hover/unit:text-primary transition-all group-hover/unit:translate-x-1" />
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-24 text-center">
                    <p className="text-[10px] font-black text-white/5 uppercase tracking-[0.4em] italic">No active deployments detected</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-8">
            <div className="bg-surface/40 rounded-[3rem] p-10 border border-white/[0.03] shadow-2xl backdrop-blur-md relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-32 h-32 bg-primary/10 blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10 space-y-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <h3 className="font-black text-white text-[10px] uppercase tracking-[0.2em] italic">Performance Metrics</h3>
                  </div>
                </div>
                
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest italic text-white/20 mb-3">
                      <span>Occupancy Density</span>
                      <span className="text-white">{occupancyRate}%</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden shadow-inner">
                      <div 
                        className="bg-primary h-full rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)] transition-all duration-1000" 
                        style={{ width: `${occupancyRate}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-white/[0.02] rounded-[2rem] border border-white/[0.03] shadow-inner">
                      <p className="text-[9px] text-white/20 font-black uppercase tracking-widest mb-2 italic">Total Units</p>
                      <p className="text-2xl font-black text-white italic tracking-tighter">{property.totalUnits}</p>
                    </div>
                    <div className="p-6 bg-white/[0.02] rounded-[2rem] border border-white/[0.03] shadow-inner">
                      <p className="text-[9px] text-white/20 font-black uppercase tracking-widest mb-2 italic">Occupied</p>
                      <p className="text-2xl font-black text-primary italic tracking-tighter">{property.occupiedUnits}</p>
                    </div>
                  </div>

                  <div className="pt-10 border-t border-white/[0.03] text-center">
                    <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em] mb-4 italic">Estimated Monthly Yield</p>
                    <p className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
                      <span className="text-primary text-2xl mr-1 leading-none">$</span>
                      {Number(property.monthlyIncome).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface/40 rounded-[3rem] p-10 border border-white/[0.03] shadow-2xl backdrop-blur-md relative overflow-hidden group">
              <div className="flex items-center gap-3 mb-10">
                <Users className="w-5 h-5 text-status-success" />
                <h3 className="font-black text-white text-[10px] uppercase tracking-[0.2em] italic">Real-Time Intel</h3>
              </div>
              <div className="space-y-6">
                 {activities.length > 0 ? (
                  activities.map((activity, i) => (
                    <div key={activity.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/5">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[10px] font-black text-white/20 uppercase italic border border-white/5">
                        {activity.user?.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-black text-white italic uppercase tracking-tighter">{activity.user?.name}</p>
                        <p className="text-[8px] text-white/20 font-bold uppercase tracking-widest">{activity.description}</p>
                      </div>
                      <span className="text-[8px] font-black text-primary italic shrink-0">{formatDistanceToNow(new Date(activity.createdAt), { addSuffix: false }).replace('about ', '')}</span>
                    </div>
                  ))
                ) : (
                  <div className="py-10 text-center opacity-10">
                    <Clock className="w-8 h-8 mx-auto mb-4" />
                    <p className="text-[8px] font-black uppercase tracking-widest italic">No asset events logged</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <AddUnitModal 
          isOpen={isUnitModalOpen} 
          onClose={() => setIsUnitModalOpen(false)} 
          propertyId={property.id} 
        />
      </div>
    </DashboardLayout>
  );
}
