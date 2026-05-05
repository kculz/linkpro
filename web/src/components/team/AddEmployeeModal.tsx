'use client';

import { useState } from 'react';
import { X, Loader2, UserPlus, Shield, Mail, Phone, User } from 'lucide-react';
import { useTeamStore } from '@/store/team.store';
import { clsx } from 'clsx';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ROLES = [
  { id: 'ADMIN', label: 'Administrator', desc: 'Full system management' },
  { id: 'MANAGER', label: 'Operations Manager', desc: 'Manage properties & projects' },
  { id: 'ACCOUNTANT', label: 'Financial Accountant', desc: 'Access to billing & transactions' },
  { id: 'MAINTENANCE', label: 'Maintenance Specialist', desc: 'Task & repair management' },
];

export default function AddEmployeeModal({ isOpen, onClose }: AddEmployeeModalProps) {
  const { addEmployee } = useTeamStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'MANAGER',
    phone: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addEmployee(formData as any);
      onClose();
      setFormData({ name: '', email: '', role: 'MANAGER', phone: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-surface border border-white/[0.05] rounded-[3rem] w-full max-w-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-300 relative">
        <div className="absolute inset-0 bg-primary/[0.01] pointer-events-none" />
        
        <div className="flex items-center justify-between p-10 border-b border-white/[0.03] relative z-10">
          <div>
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter decoration-primary decoration-4 underline underline-offset-8">Add Team Member</h2>
            <p className="text-white/20 text-[10px] font-bold mt-4 uppercase tracking-[0.2em] italic">Onboard new personnel with secure roles</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl transition-all text-white/20 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8 relative z-10">
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-white/20 mb-3 uppercase tracking-widest italic flex items-center gap-2">
                <User className="w-4 h-4 text-primary" /> Full Name
              </label>
              <input
                required
                type="text"
                placeholder="EMPLOYEE NAME..."
                className="w-full bg-white/[0.02] px-6 py-4 rounded-2xl border border-white/[0.05] focus:border-primary/50 outline-none transition-all text-white font-bold italic text-sm placeholder:text-white/5"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-white/20 mb-3 uppercase tracking-widest italic flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" /> Work Email
              </label>
              <input
                required
                type="email"
                placeholder="EMAIL ADDRESS..."
                className="w-full bg-white/[0.02] px-6 py-4 rounded-2xl border border-white/[0.05] focus:border-primary/50 outline-none transition-all text-white font-bold italic text-sm placeholder:text-white/5"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-black text-white/20 mb-3 uppercase tracking-widest italic flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" /> Assign Role
                </label>
                <select
                  className="w-full bg-white/[0.02] px-6 py-4 rounded-2xl border border-white/[0.05] focus:border-primary/50 outline-none transition-all text-white font-bold italic text-sm appearance-none"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  {ROLES.map(r => <option key={r.id} value={r.id} className="bg-surface">{r.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-white/20 mb-3 uppercase tracking-widest italic flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" /> Phone (Optional)
                </label>
                <input
                  type="text"
                  placeholder="+263..."
                  className="w-full bg-white/[0.02] px-6 py-4 rounded-2xl border border-white/[0.05] focus:border-primary/50 outline-none transition-all text-white font-bold italic text-sm placeholder:text-white/5"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <>
                  <UserPlus className="w-5 h-5" /> Onboard Member
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
