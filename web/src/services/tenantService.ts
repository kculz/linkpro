import api from './api';

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  unitId: string;
  leaseStart: string;
  leaseEnd: string;
  rentAmount: number;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'EVICTED';
  unit?: {
    id: string;
    unitNumber: string;
    property?: {
      id: string;
      name: string;
      address: string;
    };
  };
}

export const getAllTenants = async () => {
  const { data } = await api.get('/tenants');
  return data.data as Tenant[];
};

export const createTenant = async (tenantData: Partial<Tenant>) => {
  const { data } = await api.post('/tenants', tenantData);
  return data.data as Tenant;
};

export const updateTenant = async (id: string, tenantData: Partial<Tenant>) => {
  const { data } = await api.put(`/tenants/${id}`, tenantData);
  return data.data as Tenant;
};

export const deleteTenant = async (id: string) => {
  await api.delete(`/tenants/${id}`);
};
