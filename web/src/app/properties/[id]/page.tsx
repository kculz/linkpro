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
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePropertyStore } from '@/store/property.store';
import * as PropertyService from '@/services/propertyService';
import AddUnitModal from '@/components/properties/AddUnitModal';

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const { properties, fetchProperties } = usePropertyStore();
  const [property, setProperty] = useState<PropertyService.Property | null>(null);
  const [loading, setLoading] = useState(true);

  const selectedProperty = properties.find(p => p.id === id);

  useEffect(() => {
    if (!selectedProperty) {
      fetchProperties();
    } else {
      setProperty(selectedProperty);
      setLoading(false);
    }
  }, [id, selectedProperty, fetchProperties]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary opacity-50" />
        </div>
      </DashboardLayout>
    );
  }

  if (!property) {
    return (
      <DashboardLayout>
        <div className="py-20 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Property not found</h2>
          <Link href="/properties" className="text-primary mt-4 inline-block font-semibold">
            Back to Properties
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const occupancyRate = property.totalUnits > 0 ? Math.round((property.occupiedUnits / property.totalUnits) * 100) : 0;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Navigation & Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-4">
            <Link 
              href="/properties" 
              className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium text-sm w-fit"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Portfolio
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{property.name}</h1>
                <div className="flex items-center gap-2 text-slate-500 mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>{property.address}, {property.city}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all">
              <Settings className="w-5 h-5" />
            </button>
            <button className="px-6 py-3 bg-white border border-slate-200 text-red-600 rounded-xl font-bold hover:bg-red-50 hover:border-red-100 transition-all flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> Delete Property
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="relative h-96 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50">
              <Image 
                src={property.image || '/images/property-placeholder.png'} 
                alt={property.name} 
                fill 
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
                <div className="flex gap-3">
                  <span className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-bold border border-white/30">
                    {property.type}
                  </span>
                  <span className={`px-4 py-2 rounded-full text-white text-sm font-bold border border-white/30 backdrop-blur-md ${property.status === 'ACTIVE' ? 'bg-emerald-500/40' : 'bg-amber-500/40'}`}>
                    {property.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Units Section */}
            <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-8 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <LayoutGrid className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Units Inventory</h3>
                </div>
                <button 
                  onClick={() => setIsUnitModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
                >
                  <Plus className="w-4 h-4" /> Add Unit
                </button>
              </div>
              
              <div className="divide-y divide-slate-50">
                {property.units && property.units.length > 0 ? (
                  property.units.map((unit) => (
                    <div key={unit.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-primary group-hover:text-white transition-all capitalize">
                          <span className="font-bold">{unit.unitNumber.slice(0, 2)}</span>
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">Unit {unit.unitNumber}</p>
                          <p className="text-sm text-slate-500">{unit.type} • {unit.floorArea} sqft</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <p className="font-bold text-slate-900">${Number(unit.rent).toLocaleString()}</p>
                          <p className="text-xs text-slate-400">Monthly Rent</p>
                        </div>
                        <button 
                          onClick={() => {
                            const newStatus = unit.status === 'OCCUPIED' ? 'VACANT' : 'OCCUPIED';
                            usePropertyStore.getState().updateUnitStatus(unit.id, newStatus);
                          }}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                            unit.status === 'OCCUPIED' 
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                              : unit.status === 'VACANT'
                              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                              : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                          }`}
                        >
                          {unit.status.charAt(0) + unit.status.slice(1).toLowerCase()}
                        </button>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 transition-colors" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <p className="text-slate-500">No units added to this property yet.</p>
                  </div>
                )}
              </div>
              
              <div className="p-6 bg-slate-50 text-center">
                <button className="text-sm font-bold text-primary hover:underline">
                  View all units
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl shadow-blue-900/20">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" /> Performance
              </h3>
              
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between text-sm text-slate-400 mb-2">
                    <span>Occupancy Rate</span>
                    <span className="text-white font-bold">{occupancyRate}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.5)]" 
                      style={{ width: `${occupancyRate}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-xs text-slate-400 mb-1">Total Units</p>
                    <p className="text-2xl font-bold">{property.totalUnits}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-xs text-slate-400 mb-1">Occupied</p>
                    <p className="text-2xl font-bold">{property.occupiedUnits}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <p className="text-sm text-slate-400 mb-1 text-center">Monthly Gross Income</p>
                  <p className="text-4xl font-bold text-center tracking-tight">
                    <span className="text-blue-400 text-2xl mr-1">$</span>
                    {Number(property.monthlyIncome).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-500" /> Recent Tenants
              </h3>
              <div className="space-y-4">
                <p className="text-sm text-slate-500 text-center py-4">No recent tenant activity.</p>
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
