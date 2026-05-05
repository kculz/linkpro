import Notification from '@models/Notification.js';
import User from '@models/User.js';
import { io } from '../server.js';

export const getUserNotifications = async (userId: string) => {
  return Notification.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
    limit: 50
  });
};

export const createNotification = async (data: any) => {
  const notification = await Notification.create(data);
  
  // Emit to user's private socket room
  io.to(data.userId).emit('notification:new', notification);
  
  return notification;
};

export const markAsRead = async (id: string) => {
  const notification = await Notification.findByPk(id);
  if (notification) {
    return notification.update({ read: true });
  }
};

export const markAllAsRead = async (userId: string) => {
  return Notification.update({ read: true }, { where: { userId, read: false } });
};

export const broadcastToAdmins = async (data: any) => {
  const admins = await User.findAll({ where: { role: ['ADMIN', 'PM'] } });
  for (const admin of admins) {
    await createNotification({ ...data, userId: admin.id });
  }
};
