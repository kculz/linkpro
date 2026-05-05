import api from './api';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'OWNER' | 'ADMIN' | 'MANAGER' | 'ACCOUNTANT' | 'MAINTENANCE' | 'CLIENT' | 'TENANT';
  isVerified: boolean;
  avatar?: string;
  phone?: string;
  createdAt: string;
}

export const getTeam = async () => {
  const { data } = await api.get('/team');
  return data.data as TeamMember[];
};

export const addEmployee = async (employeeData: Partial<TeamMember>) => {
  const { data } = await api.post('/team/employees', employeeData);
  return data.data as TeamMember;
};

export const updateRole = async (id: string, role: string) => {
  const { data } = await api.put(`/team/${id}/role`, { role });
  return data.data as TeamMember;
};

export const removeMember = async (id: string) => {
  await api.delete(`/team/${id}`);
};
