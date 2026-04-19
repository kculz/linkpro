import api from './api';

export interface Project {
  id: string;
  name: string;
  description?: string;
  type: 'DEVELOPMENT' | 'RENOVATION' | 'MAINTENANCE';
  status: 'PLANNING' | 'IN_PROGRESS' | 'ON_TRACK' | 'DELAYED' | 'COMPLETED';
  budget: number;
  spent: number;
  progress: number;
  startDate: string;
  dueDate: string;
  propertyId?: string;
  managerId: string;
  image?: string;
  manager?: {
    id: string;
    name: string;
    email: string;
  };
  tasks?: any[];
}

export const getProjects = async () => {
  const { data } = await api.get('/projects');
  return data.data;
};

export const getProjectById = async (id: string) => {
  const { data } = await api.get(`/projects/${id}`);
  return data.data;
};

export const createProject = async (projectData: Partial<Project>) => {
  const { data } = await api.post('/projects', projectData);
  return data.data;
};

export const updateProject = async (id: string, projectData: Partial<Project>) => {
  const { data } = await api.put(`/projects/${id}`, projectData);
  return data.data;
};

export const deleteProject = async (id: string) => {
  await api.delete(`/projects/${id}`);
};

export const getProjectStats = async () => {
  const { data } = await api.get('/projects/stats');
  return data.data;
};
