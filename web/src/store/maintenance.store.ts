import { create } from 'zustand';
import * as maintenanceService from '@/services/maintenanceService';

interface MaintenanceState {
  requests: maintenanceService.MaintenanceRequest[];
  loading: boolean;
  fetchRequests: (params?: any) => Promise<void>;
  addRequest: (data: Partial<maintenanceService.MaintenanceRequest>) => Promise<void>;
  updateRequest: (id: string, data: Partial<maintenanceService.MaintenanceRequest>) => Promise<void>;
  addRequestLocally: (request: maintenanceService.MaintenanceRequest) => void;
  updateRequestLocally: (request: maintenanceService.MaintenanceRequest) => void;
}

export const useMaintenanceStore = create<MaintenanceState>((set, get) => ({
  requests: [],
  loading: false,
  fetchRequests: async (params) => {
    set({ loading: true });
    try {
      const requests = await maintenanceService.getRequests(params);
      set({ requests, loading: false });
    } catch (err) {
      console.error('Failed to fetch maintenance requests', err);
      set({ loading: false });
    }
  },
  addRequest: async (data) => {
    const newRequest = await maintenanceService.createRequest(data);
    set({ requests: [newRequest, ...get().requests] });
  },
  updateRequest: async (id, data) => {
    const updated = await maintenanceService.updateRequest(id, data);
    set({ requests: get().requests.map(r => r.id === id ? updated : r) });
  },
  addRequestLocally: (request) => {
    set((state) => {
      const exists = state.requests.some(r => r.id === request.id);
      if (exists) return state;
      return { requests: [request, ...state.requests] };
    });
  },
  updateRequestLocally: (request) => {
    set((state) => ({
      requests: state.requests.map(r => r.id === request.id ? request : r)
    }));
  },
}));
