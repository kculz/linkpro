import { Request, Response, NextFunction } from 'express';
import * as MessageService from '@services/message.service.js';
import { io } from '../../server.js';

export const getConversations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const conversations = await MessageService.getConversations(userId);
    res.json({ status: 'success', data: conversations });
  } catch (e) {
    next(e);
  }
};

export const getMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const messages = await MessageService.getMessages(req.params.conversationId, userId);
    res.json({ status: 'success', data: messages });
  } catch (e) {
    next(e);
  }
};

export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const senderId = (req as any).user.id;
    const { receiverId, content } = req.body;

    if (!receiverId || !content?.trim()) {
      return res.status(400).json({ status: 'fail', message: 'receiverId and content are required' });
    }

    const message = await MessageService.sendMessage(senderId, receiverId, content.trim());

    // Emit real-time event to receiver
    io.to(`user:${receiverId}`).emit('message:new', message);
    // Also emit to sender so other tabs/devices sync
    io.to(`user:${senderId}`).emit('message:new', message);

    res.status(201).json({ status: 'success', data: message });
  } catch (e) {
    next(e);
  }
};

export const getUnreadCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const count = await MessageService.getUnreadCount(userId);
    res.json({ status: 'success', data: { count } });
  } catch (e) {
    next(e);
  }
};

export const getContacts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const contacts = await MessageService.getContacts(userId);
    res.json({ status: 'success', data: contacts });
  } catch (e) {
    next(e);
  }
};
