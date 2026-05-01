import { create } from 'zustand';
import * as tenantService from '@/services/tenantService';

interface TenantState {
  tenants: tenantService.Tenant[];
  loading: boolean;
  fetchTenants: () => Promise<void>;
  addTenant: (tenantData: Partial<tenantService.Tenant>) => Promise<void>;
  updateTenant: (id: string, tenantData: Partial<tenantService.Tenant>) => Promise<void>;
  deleteTenant: (id: string) => Promise<void>;
}

export const useTenantStore = create<TenantState>((set, get) => ({
  tenants: [],
  loading: false,
  fetchTenants: async () => {
    set({ loading: true });
    try {
      const tenants = await tenantService.getAllTenants();
      set({ tenants, loading: false });
    } catch (err) {
      console.error('Failed to fetch tenants', err);
      set({ loading: false });
    }
  },
  addTenant: async (tenantData) => {
    const newTenant = await tenantService.createTenant(tenantData);
    set({ tenants: [newTenant, ...get().tenants] });
  },
  updateTenant: async (id, tenantData) => {
    const updatedTenant = await tenantService.updateTenant(id, tenantData);
    set({ tenants: get().tenants.map(t => t.id === id ? updatedTenant : t) });
  },
  deleteTenant: async (id) => {
    await tenantService.deleteTenant(id);
    set({ tenants: get().tenants.filter(t => t.id !== id) });
  },
}));
