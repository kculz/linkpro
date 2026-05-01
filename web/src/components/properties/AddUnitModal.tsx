'use client';

import { useState } from 'react';
import { X, Loader2, Hash, Layers, DollarSign, Maximize, Target } from 'lucide-react';
import { usePropertyStore } from '@/store/property.store';

interface AddUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
}

export default function AddUnitModal({ isOpen, onClose, propertyId }: AddUnitModalProps) {
  const { addUnit } = usePropertyStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    unitNumber: '',
    type: 'STUDIO',
    floorArea: '',
    rent: '',
    status: 'VACANT',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addUnit({
        ...formData,
        propertyId,
        floorArea: parseFloat(formData.floorArea) || 0,
        rent: parseFloat(formData.rent) || 0,
      } as any);
      onClose();
      setFormData({ unitNumber: '', type: 'STUDIO', floorArea: '', rent: '', status: 'VACANT' });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-surface border border-white/[0.05] rounded-[3rem] w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-300 relative">
        <div className="absolute inset-0 bg-primary/[0.02] pointer-events-none" />
        <div className="flex items-center justify-between p-10 border-b border-white/[0.03] relative z-10">
          <div>
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter decoration-primary decoration-4 underline underline-offset-8">Deploy Unit</h2>
            <p className="text-white/20 text-[10px] font-bold mt-4 uppercase tracking-[0.2em] italic">Initialize new asset segment</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl transition-all text-white/20 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8 relative z-10">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black text-white/20 mb-3 uppercase tracking-widest italic flex items-center gap-2">
                <Hash className="w-4 h-4 text-primary" /> Designation
              </label>
              <input
                required
                type="text"
                placeholder="UNIT ID..."
                className="w-full bg-white/[0.02] px-6 py-4 rounded-2xl border border-white/[0.05] focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-white placeholder:text-white/10 font-bold italic text-sm"
                value={formData.unitNumber}
                onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-white/20 mb-3 uppercase tracking-widest italic flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" /> Classification
              </label>
              <select
                className="w-full bg-white/[0.02] px-6 py-4 rounded-2xl border border-white/[0.05] focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-white font-bold italic text-sm appearance-none"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              >
                <option value="STUDIO" className="bg-background">Studio</option>
                <option value="1BHK" className="bg-background">1BHK</option>
                <option value="2BHK" className="bg-background">2BHK</option>
                <option value="3BHK" className="bg-background">3BHK</option>
                <option value="OFFICE" className="bg-background">Office</option>
                <option value="RETAIL" className="bg-background">Retail</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black text-white/20 mb-3 uppercase tracking-widest italic flex items-center gap-2">
                <Maximize className="w-4 h-4 text-primary" /> Dimension (SQFT)
              </label>
              <input
                required
                type="number"
                placeholder="AREA..."
                className="w-full bg-white/[0.02] px-6 py-4 rounded-2xl border border-white/[0.05] focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-white placeholder:text-white/10 font-bold italic text-sm"
                value={formData.floorArea}
                onChange={(e) => setFormData({ ...formData, floorArea: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-white/20 mb-3 uppercase tracking-widest italic flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" /> Target Yield
              </label>
              <input
                required
                type="number"
                placeholder="RENT..."
                className="w-full bg-white/[0.02] px-6 py-4 rounded-2xl border border-white/[0.05] focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-white placeholder:text-white/10 font-bold italic text-sm"
                value={formData.rent}
                onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-white/20 mb-3 uppercase tracking-widest italic flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" /> Operational Status
            </label>
            <div className="grid grid-cols-2 gap-4">
              {['VACANT', 'OCCUPIED'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFormData({ ...formData, status: s as any })}
                  className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] italic border transition-all ${
                    formData.status === s 
                      ? 'bg-primary text-white border-primary shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                      : 'bg-white/[0.02] text-white/20 border-white/[0.05] hover:border-white/10'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-10 flex gap-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-8 py-5 rounded-[2rem] font-black italic uppercase text-xs tracking-widest text-white/20 hover:bg-white/5 transition-all"
            >
              Abort
            </button>
            <button
              disabled={loading}
              type="submit"
              className="flex-1 px-8 py-5 bg-primary text-white rounded-[2rem] font-black italic uppercase text-xs tracking-[0.2em] shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:brightness-110 transition-all flex items-center justify-center gap-3 border border-primary/20"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Confirm Deployment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
