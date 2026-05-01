import api from './api';

export interface MaintenanceRequest {
  id: string;
  tenantId?: string;
  unitId: string;
  propertyId: string;
  title: string;
  description: string;
  category: 'PLUMBING' | 'ELECTRICAL' | 'HVAC' | 'GENERAL' | 'SECURITY';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
  property?: { name: string; address: string };
  unit?: { unitNumber: string };
  tenant?: { name: string; email: string };
}

export const getRequests = async (params: any = {}) => {
  const { data } = await api.get('/maintenance', { params });
  return data.data as MaintenanceRequest[];
};

export const createRequest = async (requestData: Partial<MaintenanceRequest>) => {
  const { data } = await api.post('/maintenance', requestData);
  return data.data as MaintenanceRequest;
};

export const updateRequest = async (id: string, requestData: Partial<MaintenanceRequest>) => {
  const { data } = await api.put(`/maintenance/${id}`, requestData);
  return data.data as MaintenanceRequest;
};

export const deleteRequest = async (id: string) => {
  await api.delete(`/maintenance/${id}`);
};
