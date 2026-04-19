'use client';

import { useState } from 'react';
import { X, Loader2, Hash, Layers, DollarSign, Maximize } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Add New Unit</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
                <Hash className="w-4 h-4 text-slate-400" /> Unit Number
              </label>
              <input
                required
                type="text"
                placeholder="e.g. 101"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                value={formData.unitNumber}
                onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-400" /> Type
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none bg-white"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              >
                <option value="STUDIO">Studio</option>
                <option value="1BHK">1BHK</option>
                <option value="2BHK">2BHK</option>
                <option value="3BHK">3BHK</option>
                <option value="OFFICE">Office</option>
                <option value="RETAIL">Retail</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
                <Maximize className="w-4 h-4 text-slate-400" /> Area (sqft)
              </label>
              <input
                required
                type="number"
                placeholder="0"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                value={formData.floorArea}
                onChange={(e) => setFormData({ ...formData, floorArea: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-slate-400" /> Rent
              </label>
              <input
                required
                type="number"
                placeholder="0.00"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                value={formData.rent}
                onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Initial Status</label>
            <div className="grid grid-cols-2 gap-2">
              {['VACANT', 'OCCUPIED'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFormData({ ...formData, status: s as any })}
                  className={`py-2 rounded-xl text-sm font-bold border transition-all ${
                    formData.status === s 
                      ? 'bg-slate-900 text-white border-slate-900' 
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {s.charAt(0) + s.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              type="submit"
              className="flex-1 px-6 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-blue-500/25 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Add Unit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
