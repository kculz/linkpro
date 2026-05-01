import { create } from 'zustand';
import * as vendorService from '@/services/vendorService';

interface VendorState {
  vendors: vendorService.Vendor[];
  loading: boolean;
  fetchVendors: (params?: any) => Promise<void>;
  addVendor: (data: Partial<vendorService.Vendor>) => Promise<void>;
  updateVendor: (id: string, data: Partial<vendorService.Vendor>) => Promise<void>;
  deleteVendor: (id: string) => Promise<void>;
}

export const useVendorStore = create<VendorState>((set, get) => ({
  vendors: [],
  loading: false,
  fetchVendors: async (params) => {
    set({ loading: true });
    try {
      const vendors = await vendorService.getVendors(params);
      set({ vendors, loading: false });
    } catch (err) {
      console.error('Failed to fetch vendors', err);
      set({ loading: false });
    }
  },
  addVendor: async (data) => {
    const newVendor = await vendorService.createVendor(data);
    set({ vendors: [newVendor, ...get().vendors] });
  },
  updateVendor: async (id, data) => {
    const updated = await vendorService.updateVendor(id, data);
    set({ vendors: get().vendors.map(v => v.id === id ? updated : v) });
  },
  deleteVendor: async (id) => {
    await vendorService.deleteVendor(id);
    set({ vendors: get().vendors.filter(v => v.id !== id) });
  },
}));
