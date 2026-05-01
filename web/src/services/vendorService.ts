import api from './api';

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: 'PLUMBING' | 'ELECTRICAL' | 'HVAC' | 'GENERAL' | 'SECURITY' | 'LANDSCAPING';
  status: 'ACTIVE' | 'INACTIVE';
  rating: number;
}

export const getVendors = async (params: any = {}) => {
  const { data } = await api.get('/vendors', { params });
  return data.data as Vendor[];
};

export const createVendor = async (vendorData: Partial<Vendor>) => {
  const { data } = await api.post('/vendors', vendorData);
  return data.data as Vendor;
};

export const updateVendor = async (id: string, vendorData: Partial<Vendor>) => {
  const { data } = await api.put(`/vendors/${id}`, vendorData);
  return data.data as Vendor;
};

export const deleteVendor = async (id: string) => {
  await api.delete(`/vendors/${id}`);
};
