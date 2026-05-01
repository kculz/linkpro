'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, User, Mail, Phone, Calendar, Building2, LayoutGrid, DollarSign } from 'lucide-react';
import { useTenantStore } from '@/store/tenant.store';
import { usePropertyStore } from '@/store/property.store';
import { clsx } from 'clsx';

interface AddTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddTenantModal({ isOpen, onClose }: AddTenantModalProps) {
  const { addTenant } = useTenantStore();
  const { properties, fetchProperties } = usePropertyStore();
  const [loading, setLoading] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    unitId: '',
    leaseStart: '',
    leaseEnd: '',
    rentAmount: '',
    status: 'ACTIVE',
  });

  useEffect(() => {
    if (isOpen) {
      fetchProperties();
    }
  }, [isOpen, fetchProperties]);

  const selectedProperty = properties.find(p => p.id === selectedPropertyId);
  const vacantUnits = selectedProperty?.units?.filter(u => u.status === 'VACANT') || [];

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addTenant({
        ...formData,
        rentAmount: parseFloat(formData.rentAmount) || 0,
      } as any);
      onClose();
      setFormData({ name: '', email: '', phone: '', unitId: '', leaseStart: '', leaseEnd: '', rentAmount: '', status: 'ACTIVE' });
      setSelectedPropertyId('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-surface border border-white/[0.05] rounded-[3rem] w-full max-w-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-300 relative">
        <div className="absolute inset-0 bg-primary/[0.02] pointer-events-none" />
        <div className="flex items-center justify-between p-10 border-b border-white/[0.03] relative z-10">
          <div>
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter decoration-primary decoration-4 underline underline-offset-8">Onboard Occupant</h2>
            <p className="text-white/20 text-[10px] font-bold mt-4 uppercase tracking-[0.2em] italic">Initialize legal occupancy agreement</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl transition-all text-white/20 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 grid grid-cols-2 gap-8 relative z-10">
          {/* Left Column: Occupant Details */}
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-white/20 mb-3 uppercase tracking-widest italic flex items-center gap-2">
                <User className="w-4 h-4 text-primary" /> Full Legal Name
              </label>
              <input
                required
                type="text"
                placeholder="INPUT NAME..."
                className="w-full bg-white/[0.02] px-6 py-4 rounded-2xl border border-white/[0.05] focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-white placeholder:text-white/10 font-bold italic text-sm"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-white/20 mb-3 uppercase tracking-widest italic flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" /> Digital Contact
              </label>
              <input
                required
                type="email"
                placeholder="EMAIL ADDRESS..."
                className="w-full bg-white/[0.02] px-6 py-4 rounded-2xl border border-white/[0.05] focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-white placeholder:text-white/10 font-bold italic text-sm"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-white/20 mb-3 uppercase tracking-widest italic flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" /> Mobile Uplink
              </label>
              <input
                required
                type="text"
                placeholder="PHONE NUMBER..."
                className="w-full bg-white/[0.02] px-6 py-4 rounded-2xl border border-white/[0.05] focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-white placeholder:text-white/10 font-bold italic text-sm"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          {/* Right Column: Asset Assignment */}
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-white/20 mb-3 uppercase tracking-widest italic flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" /> Target Asset
              </label>
              <select
                required
                className="w-full bg-white/[0.02] px-6 py-4 rounded-2xl border border-white/[0.05] focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-white font-bold italic text-sm appearance-none"
                value={selectedPropertyId}
                onChange={(e) => setSelectedPropertyId(e.target.value)}
              >
                <option value="" className="bg-background">SELECT PROPERTY...</option>
                {properties.map(p => (
                  <option key={p.id} value={p.id} className="bg-background">{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-white/20 mb-3 uppercase tracking-widest italic flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-primary" /> Asset Segment
              </label>
              <select
                required
                disabled={!selectedPropertyId}
                className="w-full bg-white/[0.02] px-6 py-4 rounded-2xl border border-white/[0.05] focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-white font-bold italic text-sm appearance-none disabled:opacity-20"
                value={formData.unitId}
                onChange={(e) => setFormData({ ...formData, unitId: e.target.value })}
              >
                <option value="" className="bg-background">SELECT VACANT UNIT...</option>
                {vacantUnits.map(u => (
                  <option key={u.id} value={u.id} className="bg-background">UNIT {u.unitNumber} ({u.type})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-white/20 mb-3 uppercase tracking-widest italic flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" /> Monthly Obligation
              </label>
              <input
                required
                type="number"
                placeholder="RENT AMOUNT..."
                className="w-full bg-white/[0.02] px-6 py-4 rounded-2xl border border-white/[0.05] focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-white placeholder:text-white/10 font-bold italic text-sm"
                value={formData.rentAmount}
                onChange={(e) => setFormData({ ...formData, rentAmount: e.target.value })}
              />
            </div>
          </div>

          {/* Lease Cycle */}
          <div className="col-span-2 grid grid-cols-2 gap-8 pt-4">
            <div>
              <label className="block text-[10px] font-black text-white/20 mb-3 uppercase tracking-widest italic flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" /> Commencement Date
              </label>
              <input
                required
                type="date"
                className="w-full bg-white/[0.02] px-6 py-4 rounded-2xl border border-white/[0.05] focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-white font-bold italic text-sm [color-scheme:dark]"
                value={formData.leaseStart}
                onChange={(e) => setFormData({ ...formData, leaseStart: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-white/20 mb-3 uppercase tracking-widest italic flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" /> Termination Date
              </label>
              <input
                required
                type="date"
                className="w-full bg-white/[0.02] px-6 py-4 rounded-2xl border border-white/[0.05] focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-white font-bold italic text-sm [color-scheme:dark]"
                value={formData.leaseEnd}
                onChange={(e) => setFormData({ ...formData, leaseEnd: e.target.value })}
              />
            </div>
          </div>

          <div className="col-span-2 pt-10 flex gap-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-8 py-5 rounded-[2rem] font-black italic uppercase text-xs tracking-widest text-white/20 hover:bg-white/5 transition-all"
            >
              Abort Onboarding
            </button>
            <button
              disabled={loading}
              type="submit"
              className="flex-1 px-8 py-5 bg-primary text-white rounded-[2rem] font-black italic uppercase text-xs tracking-[0.2em] shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:brightness-110 transition-all flex items-center justify-center gap-3 border border-primary/20"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Confirm Onboarding'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
