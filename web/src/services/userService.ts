import api from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'PM' | 'CLIENT' | 'TENANT';
  avatar?: string;
}

export const getUsers = async () => {
  const { data } = await api.get('/auth/users'); // Assuming this endpoint exists based on usual patterns
  return data.data;
};

export const getCurrentUser = async () => {
  const { data } = await api.get('/auth/me');
  return data.data;
};
