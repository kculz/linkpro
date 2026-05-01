import api from './api';

export interface Property {
  id: string;
  name: string;
  type: 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL' | 'MIXED_USE';
  address: string;
  city: string;
  totalUnits: number;
  occupiedUnits: number;
  monthlyIncome: number;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  image?: string;
}

export interface PropertyStats {
  totalProperties: number;
  totalUnits: number;
  occupiedUnits: number;
  vacantUnits: number;
  occupancyRate: number;
  totalMonthlyIncome: number;
}

export const getProperties = async () => {
  const { data } = await api.get('/properties');
  return data.data;
};

export const getPropertyStats = async () => {
  const { data } = await api.get('/properties/stats');
  return data.data;
};

export const createProperty = async (propertyData: Partial<Property>) => {
  const { data } = await api.post('/properties', propertyData);
  return data.data;
};

export const deleteProperty = async (id: string) => {
  await api.delete(`/properties/${id}`);
};

export const getUnitById = async (id: string) => {
  const { data } = await api.get(`/properties/units/${id}`);
  return data.data;
};
