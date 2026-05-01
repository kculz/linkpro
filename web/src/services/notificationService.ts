import api from './api';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'URGENT' | 'SUCCESS';
  read: boolean;
  link?: string;
  createdAt: string;
}

export const getNotifications = async () => {
  const { data } = await api.get('/notifications');
  return data.data as Notification[];
};

export const markAsRead = async (id: string) => {
  await api.put(`/notifications/${id}/read`);
};

export const markAllAsRead = async () => {
  await api.put('/notifications/read-all');
};
