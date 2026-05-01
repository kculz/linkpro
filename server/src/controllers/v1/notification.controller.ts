import { Request, Response, NextFunction } from 'express';
import * as NotificationService from '@services/notification.service.js';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notifications = await NotificationService.getUserNotifications((req as any).user.id);
    res.json({ status: 'success', data: notifications });
  } catch (e) {
    next(e);
  }
};

export const markRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await NotificationService.markAsRead(req.params.id);
    res.json({ status: 'success', message: 'Notification marked as read' });
  } catch (e) {
    next(e);
  }
};

export const markAllRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await NotificationService.markAllAsRead((req as any).user.id);
    res.json({ status: 'success', message: 'All notifications marked as read' });
  } catch (e) {
    next(e);
  }
};
