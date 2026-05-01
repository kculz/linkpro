'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, Wrench, Building2, LayoutGrid, Target, FileText, AlertTriangle } from 'lucide-react';
import { useMaintenanceStore } from '@/store/maintenance.store';
import { usePropertyStore } from '@/store/property.store';
import { clsx } from 'clsx';

interface LogMaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogMaintenanceModal({ isOpen, onClose }: LogMaintenanceModalProps) {
  const { addRequest } = useMaintenanceStore();
  const { properties, fetchProperties } = usePropertyStore();
  const [loading, setLoading] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    unitId: '',
    propertyId: '',
    category: 'GENERAL',
    priority: 'MEDIUM',
    status: 'OPEN',
  });

  useEffect(() => {
    if (isOpen) {
      fetchProperties();
    }
  }, [isOpen, fetchProperties]);

  const selectedProperty = properties.find(p => p.id === selectedPropertyId);
  const units = selectedProperty?.units || [];

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addRequest({
        ...formData,
        propertyId: selectedPropertyId,
      } as any);
      onClose();
      setFormData({ title: '', description: '', unitId: '', propertyId: '', category: 'GENERAL', priority: 'MEDIUM', status: 'OPEN' });
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
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter decoration-primary decoration-4 underline underline-offset-8">Log Operational Intelligence</h2>
            <p className="text-white/20 text-[10px] font-bold mt-4 uppercase tracking-[0.2em] italic">Initialize asset repair protocol</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl transition-all text-white/20 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8 relative z-10">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-white/20 mb-3 uppercase tracking-widest italic flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-primary" /> Incident Designation
                </label>
                <input
                  required
                  type="text"
                  placeholder="ISSUE TITLE..."
                  className="w-full bg-white/[0.02] px-6 py-4 rounded-2xl border border-white/[0.05] focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-white placeholder:text-white/10 font-bold italic text-sm"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

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
                  <option value="" className="bg-background">SELECT UNIT...</option>
                  {units.map(u => (
                    <option key={u.id} value={u.id} className="bg-background">UNIT {u.unitNumber}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-white/20 mb-3 uppercase tracking-widest italic flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" /> Sector Classification
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
                  <option value="GENERAL" className="bg-background">General</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-white/20 mb-3 uppercase tracking-widest italic flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-primary" /> Operational Priority
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFormData({ ...formData, priority: p as any })}
                      className={clsx(
                        "py-3 rounded-xl text-[9px] font-black uppercase tracking-widest italic border transition-all",
                        formData.priority === p 
                          ? 'bg-primary text-white border-primary shadow-lg' 
                          : 'bg-white/[0.02] text-white/20 border-white/[0.05] hover:border-white/10'
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-white/20 mb-3 uppercase tracking-widest italic flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" /> Tactical Description
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="PROVIDE INTEL..."
                  className="w-full bg-white/[0.02] px-6 py-4 rounded-2xl border border-white/[0.05] focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-white placeholder:text-white/10 font-bold italic text-sm resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
              Abort Intelligence
            </button>
            <button
              disabled={loading}
              type="submit"
              className="flex-1 px-8 py-5 bg-primary text-white rounded-[2rem] font-black italic uppercase text-xs tracking-[0.2em] shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:brightness-110 transition-all flex items-center justify-center gap-3 border border-primary/20"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Confirm Intelligence'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
