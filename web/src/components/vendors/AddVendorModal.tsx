'use client';

import { useState } from 'react';
import { X, Loader2, Users, Mail, Phone, Target, Star, Award, LayoutGrid } from 'lucide-react';
import { useVendorStore } from '@/store/vendor.store';
import { clsx } from 'clsx';

interface AddVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddVendorModal({ isOpen, onClose }: AddVendorModalProps) {
  const { addVendor } = useVendorStore();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'GENERAL',
    status: 'ACTIVE',
    rating: 5.0,
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addVendor(formData as any);
      onClose();
      setFormData({ name: '', email: '', phone: '', category: 'GENERAL', status: 'ACTIVE', rating: 5.0 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-surface border border-white/[0.05] rounded-[3rem] w-full max-w-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-300 relative">
        <div className="absolute inset-0 bg-primary/[0.02] pointer-events-none" />
        <div className="flex items-center justify-between p-10 border-b border-white/[0.03] relative z-10">
          <div>
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter decoration-primary decoration-4 underline underline-offset-8">Onboard Partner</h2>
            <p className="text-white/20 text-[10px] font-bold mt-4 uppercase tracking-[0.2em] italic">Initialize operational vendor protocol</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl transition-all text-white/20 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8 relative z-10">
          <div>
            <label className="block text-[10px] font-black text-white/20 mb-3 uppercase tracking-widest italic flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" /> Entity Name
            </label>
            <input
              required
              type="text"
              placeholder="SERVICE PROVIDER NAME..."
              className="w-full bg-white/[0.02] px-6 py-4 rounded-2xl border border-white/[0.05] focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-white placeholder:text-white/10 font-bold italic text-sm"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="block text-[10px] font-black text-white/20 mb-3 uppercase tracking-widest italic flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" /> Tactical Email
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

          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="block text-[10px] font-black text-white/20 mb-3 uppercase tracking-widest italic flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-primary" /> Operational Category
              </label>
              <select
                className="w-full bg-white/[0.02] px-6 py-4 rounded-2xl border border-white/[0.05] focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-white font-bold italic text-sm appearance-none"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              >
                <option value="PLUMBING" className="bg-background">Plumbing</option>
                <option value="ELECTRICAL" className="bg-background">Electrical</option>
                <option value="HVAC" className="bg-background">HVAC</option>
                <option value="SECURITY" className="bg-background">Security</option>
                <option value="LANDSCAPING" className="bg-background">Landscaping</option>
                <option value="GENERAL" className="bg-background">General</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-white/20 mb-3 uppercase tracking-widest italic flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" /> Quality Index
              </label>
              <div className="flex items-center gap-3 bg-white/[0.02] px-6 py-4 rounded-2xl border border-white/[0.05]">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  className="bg-transparent outline-none text-white font-bold italic text-sm w-full"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <div className="pt-10 flex gap-6">
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
