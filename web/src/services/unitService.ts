import api from './api';

export interface Unit {
  id: string;
  propertyId: string;
  unitNumber: string;
  type: 'STUDIO' | '1BHK' | '2BHK' | '3BHK' | 'OFFICE' | 'RETAIL';
  floorArea: number;
  rent: number;
  status: 'VACANT' | 'OCCUPIED' | 'MAINTENANCE';
  tenantId?: string;
}

export const getUnits = async (propertyId?: string) => {
  const { data } = await api.get('/units', { params: { propertyId } });
  return data.data;
};

export const createUnit = async (unitData: Partial<Unit>) => {
  const { data } = await api.post('/units', unitData);
  return data.data;
};

export const updateUnit = async (id: string, unitData: Partial<Unit>) => {
  const { data } = await api.put(`/units/${id}`, unitData);
  return data.data;
};

export const deleteUnit = async (id: string) => {
  await api.delete(`/units/${id}`);
};
