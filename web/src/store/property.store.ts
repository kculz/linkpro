import { create } from 'zustand';
import * as PropertyService from '@/services/propertyService';
import * as UnitService from '@/services/unitService';

interface PropertyState {
  properties: (PropertyService.Property & { units?: UnitService.Unit[] })[];
  stats: PropertyService.PropertyStats | null;
  loading: boolean;
  error: string | null;
  fetchProperties: () => Promise<void>;
  fetchStats: () => Promise<void>;
  addProperty: (data: Partial<PropertyService.Property>) => Promise<void>;
  addUnit: (data: Partial<UnitService.Unit>) => Promise<void>;
  updateUnitStatus: (id: string, status: UnitService.Unit['status']) => Promise<void>;
}

export const usePropertyStore = create<PropertyState>((set, get) => ({
  properties: [],
  stats: null,
  loading: false,
  error: null,

  fetchProperties: async () => {
    set({ loading: true, error: null });
    try {
      const properties = await PropertyService.getProperties();
      set({ properties, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch properties', loading: false });
    }
  },

  fetchStats: async () => {
    try {
      const stats = await PropertyService.getPropertyStats();
      set({ stats });
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  },

  addProperty: async (data) => {
    set({ loading: true, error: null });
    try {
      const newProperty = await PropertyService.createProperty(data);
      set((state) => ({
        properties: [newProperty, ...state.properties],
        loading: false,
      }));
    } catch (err) {
      set({ error: 'Failed to add property', loading: false });
      throw err;
    }
  },

  addUnit: async (data) => {
    set({ loading: true, error: null });
    try {
      const newUnit = await UnitService.createUnit(data);
      set((state) => ({
        properties: state.properties.map((p) =>
          p.id === data.propertyId
            ? { 
                ...p, 
                units: p.units ? [...p.units, newUnit] : [newUnit],
                totalUnits: p.totalUnits + 1,
                occupiedUnits: newUnit.status === 'OCCUPIED' ? p.occupiedUnits + 1 : p.occupiedUnits
              }
            : p
        ),
        loading: false,
      }));
    } catch (err) {
      set({ error: 'Failed to add unit', loading: false });
      throw err;
    }
  },

  updateUnitStatus: async (id, status) => {
    try {
      const updatedUnit = await UnitService.updateUnit(id, { status });
      set((state) => ({
        properties: state.properties.map((p) =>
          p.id === updatedUnit.propertyId
            ? {
                ...p,
                units: p.units?.map((u) => (u.id === id ? updatedUnit : u)),
                occupiedUnits: status === 'OCCUPIED' 
                  ? p.occupiedUnits + 1 
                  : (p.occupiedUnits > 0 ? p.occupiedUnits - 1 : 0)
              }
            : p
        ),
      }));
    } catch (err) {
      console.error('Failed to update unit status', err);
    }
  },
}));
