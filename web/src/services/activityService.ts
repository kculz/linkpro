import api from './api';

export interface Activity {
  id: string;
  userId: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE' | 'STATUS_CHANGE' | 'ASSIGNMENT';
  description: string;
  targetId: string;
  targetType: 'PROPERTY' | 'PROJECT' | 'TASK' | 'UNIT';
  metadata?: any;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export const getActivities = async (params: { targetId?: string; targetType?: string; limit?: number } = {}) => {
  const { data } = await api.get('/activity', { params });
  return data.data as Activity[];
};
