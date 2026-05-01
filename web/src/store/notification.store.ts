import { create } from 'zustand';
import * as notificationService from '@/services/notificationService';

interface NotificationState {
  notifications: notificationService.Notification[];
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  addNotificationLocally: (notification: notificationService.Notification) => void;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  loading: false,
  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const notifications = await notificationService.getNotifications();
      set({ notifications, loading: false });
    } catch (err) {
      console.error('Failed to fetch notifications', err);
      set({ loading: false });
    }
  },
  addNotificationLocally: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications]
    }));
  },
  markRead: async (id) => {
    await notificationService.markAsRead(id);
    set((state) => ({
      notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    }));
  },
  markAllRead: async () => {
    await notificationService.markAllAsRead();
    set((state) => ({
      notifications: state.notifications.map(n => ({ ...n, read: true }))
    }));
  },
}));
