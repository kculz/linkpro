'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, FileText, Upload, Target, ShieldCheck, HardDrive, LayoutGrid } from 'lucide-react';
import { useDocumentStore } from '@/store/document.store';
import { usePropertyStore } from '@/store/property.store';
import { useProjectStore } from '@/store/project.store';
import { clsx } from 'clsx';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadDocumentModal({ isOpen, onClose }: UploadDocumentModalProps) {
  const { addDocument } = useDocumentStore();
  const { properties, fetchProperties } = usePropertyStore();
  const { projects, fetchProjects } = useProjectStore();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'LEASE',
    targetType: 'GENERAL',
    targetId: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchProperties();
      fetchProjects();
    }
  }, [isOpen, fetchProperties, fetchProjects]);

  if (!isOpen) return null;

  const getTargetOptions = () => {
    if (formData.targetType === 'PROPERTY') return properties.map(p => ({ id: p.id, label: p.name }));
    if (formData.targetType === 'PROJECT') return projects.map(p => ({ id: p.id, label: p.name }));
    return [];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDocument(formData as any);
      onClose();
      setFormData({ name: '', type: 'LEASE', targetType: 'GENERAL', targetId: '' });
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
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter decoration-primary decoration-4 underline underline-offset-8">Upload Document</h2>
            <p className="text-white/20 text-[10px] font-bold mt-4 uppercase tracking-[0.2em] italic">Add files to your records</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl transition-all text-white/20 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8 relative z-10">
          <div className="group relative border-2 border-dashed border-white/5 hover:border-primary/30 rounded-[2.5rem] p-12 text-center transition-all cursor-pointer bg-white/[0.01]">
            <Upload className="w-12 h-12 mx-auto mb-4 text-white/10 group-hover:text-primary transition-colors" />
            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest italic group-hover:text-white transition-colors">Select a file to upload...</p>
            <p className="text-[8px] text-white/5 font-bold uppercase tracking-widest mt-2 italic">PDF, DOCX, JPEG (MAX 25MB)</p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="col-span-2">
              <label className="block text-[10px] font-black text-white/20 mb-3 uppercase tracking-widest italic flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" /> Document Name
              </label>
              <input
                required
                type="text"
                placeholder="DOCUMENT NAME..."
                className="w-full bg-white/[0.02] px-6 py-4 rounded-2xl border border-white/[0.05] focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-white placeholder:text-white/10 font-bold italic text-sm"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-white/20 mb-3 uppercase tracking-widest italic flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" /> Document Type
              </label>
              <select
                className="w-full bg-white/[0.02] px-6 py-4 rounded-2xl border border-white/[0.05] focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-white font-bold italic text-sm appearance-none"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              >
                <option value="LEASE" className="bg-background">Lease Agreement</option>
                <option value="QUOTATION" className="bg-background">Quotation</option>
                <option value="INVOICE" className="bg-background">Invoice</option>
                <option value="RECEIPT" className="bg-background">Receipt</option>
                <option value="CONTRACT" className="bg-background">Contract</option>
                <option value="BLUEPRINT" className="bg-background">Blueprint</option>
                <option value="ID" className="bg-background">Personal ID</option>
                <option value="OTHER" className="bg-background">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black text-white/20 mb-3 uppercase tracking-widest italic flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" /> Attach To
              </label>
              <select
                className="w-full bg-white/[0.02] px-6 py-4 rounded-2xl border border-white/[0.05] focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-white font-bold italic text-sm appearance-none"
                value={formData.targetType}
                onChange={(e) => setFormData({ ...formData, targetType: e.target.value as any, targetId: '' })}
              >
                <option value="GENERAL" className="bg-background">General</option>
                <option value="PROPERTY" className="bg-background">Property</option>
                <option value="PROJECT" className="bg-background">Project</option>
              </select>
            </div>

            {formData.targetType !== 'GENERAL' && (
              <div className="col-span-2 animate-in slide-in-from-top-4 duration-300">
                <label className="block text-[10px] font-black text-white/20 mb-3 uppercase tracking-widest italic flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-primary" /> Target Selection
                </label>
                <select
                  required
                  className="w-full bg-white/[0.02] px-6 py-4 rounded-2xl border border-white/[0.05] focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-white font-bold italic text-sm appearance-none"
                  value={formData.targetId}
                  onChange={(e) => setFormData({ ...formData, targetId: e.target.value })}
                >
                  <option value="" className="bg-background">SELECT {formData.targetType}...</option>
                  {getTargetOptions().map(opt => (
                    <option key={opt.id} value={opt.id} className="bg-background">{opt.label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="pt-10 flex gap-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-8 py-5 rounded-[2rem] font-black italic uppercase text-xs tracking-widest text-white/20 hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              type="submit"
              className="flex-1 px-8 py-5 bg-primary text-white rounded-[2rem] font-black italic uppercase text-xs tracking-[0.2em] shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:brightness-110 transition-all flex items-center justify-center gap-3 border border-primary/20"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Upload File'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
