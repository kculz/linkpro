import api from './api';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
  projectId: string;
  assigneeId?: string;
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export const getTasks = async (projectId?: string) => {
  const { data } = await api.get('/tasks', { params: { projectId } });
  return data.data;
};

export const createTask = async (taskData: Partial<Task>) => {
  const { data } = await api.post('/tasks', taskData);
  return data.data;
};

export const updateTask = async (id: string, taskData: Partial<Task>) => {
  const { data } = await api.put(`/tasks/${id}`, taskData);
  return data.data;
};

export const updateTaskStatus = async (id: string, status: Task['status']) => {
  const { data } = await api.patch(`/tasks/${id}/status`, { status });
  return data.data;
};

export const deleteTask = async (id: string) => {
  await api.delete(`/tasks/${id}`);
};
