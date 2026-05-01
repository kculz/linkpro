'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, Briefcase, FileText, Target, Calendar, LayoutGrid } from 'lucide-react';
import { useProjectStore } from '@/store/project.store';
import { Project } from '@/services/projectService';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export default function EditProjectModal({ isOpen, onClose, project }: EditProjectModalProps) {
  const { updateProject } = useProjectStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: project.name,
    description: project.description || '',
    type: project.type,
    status: project.status,
    dueDate: project.dueDate.split('T')[0],
  });

  useEffect(() => {
    setFormData({
      name: project.name,
      description: project.description || '',
      type: project.type,
      status: project.status,
      dueDate: project.dueDate.split('T')[0],
    });
  }, [project]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProject(project.id, formData);
      onClose();
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
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter decoration-primary decoration-4 underline underline-offset-8">Operations Control</h2>
            <p className="text-white/20 text-[10px] font-bold mt-4 uppercase tracking-[0.2em] italic">Adjust tactical mission parameters</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl transition-all text-white/20 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8 relative z-10">
          <div>
            <label className="block text-[10px] font-black text-white/20 mb-3 uppercase tracking-widest italic flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" /> Project Designation
            </label>
            <input
              required
              type="text"
              placeholder="MISSION NAME..."
              className="w-full bg-white/[0.02] px-6 py-4 rounded-2xl border border-white/[0.05] focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-white placeholder:text-white/10 font-bold italic text-sm"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-white/20 mb-3 uppercase tracking-widest italic flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" /> Mission Objectives
            </label>
            <textarea
              rows={3}
              placeholder="DETAILED DESCRIPTION..."
              className="w-full bg-white/[0.02] px-6 py-4 rounded-2xl border border-white/[0.05] focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-white placeholder:text-white/10 font-bold italic text-sm resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black text-white/20 mb-3 uppercase tracking-widest italic flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-primary" /> Mission Type
              </label>
              <select
                className="w-full bg-white/[0.02] px-6 py-4 rounded-2xl border border-white/[0.05] focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-white font-bold italic text-sm appearance-none"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              >
                <option value="RENOVATION" className="bg-background">Renovation</option>
                <option value="DEVELOPMENT" className="bg-background">Development</option>
                <option value="MAINTENANCE" className="bg-background">Maintenance</option>
                <option value="ACQUISITION" className="bg-background">Acquisition</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-white/20 mb-3 uppercase tracking-widest italic flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" /> Operational Status
              </label>
              <select
                className="w-full bg-white/[0.02] px-6 py-4 rounded-2xl border border-white/[0.05] focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-white font-bold italic text-sm appearance-none"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              >
                <option value="PLANNING" className="bg-background">Planning</option>
                <option value="IN_PROGRESS" className="bg-background">In Progress</option>
                <option value="ON_TRACK" className="bg-background">On Track</option>
                <option value="DELAYED" className="bg-background">Delayed</option>
                <option value="COMPLETED" className="bg-background">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-white/20 mb-3 uppercase tracking-widest italic flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" /> Target Deadline
            </label>
            <input
              required
              type="date"
              className="w-full bg-white/[0.02] px-6 py-4 rounded-2xl border border-white/[0.05] focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-white font-bold italic text-sm [color-scheme:dark]"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
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
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Apply Adjustments'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
