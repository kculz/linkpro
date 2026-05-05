import { Request, Response, NextFunction } from 'express';
import * as MaintenanceService from '@services/maintenance.service.js';
import * as activityService from '@services/activity.service.js';
import * as notificationService from '@services/notification.service.js';
import { io } from '../../server.js';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requests = await MaintenanceService.getAllRequests(req.query);
    res.json({ status: 'success', data: requests });
  } catch (e) {
    next(e);
  }
};

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = await MaintenanceService.getRequestById(req.params.id as string);
    res.json({ status: 'success', data: request });
  } catch (e) {
    next(e);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = await MaintenanceService.createRequest(req.body);
    
    // Broadcast real-time update
    io.to(request.propertyId).emit('maintenance:new', request);

    await activityService.logActivity({
      userId: (req as any).user.id,
      type: 'CREATE',
      description: `Reported maintenance issue: ${request.title}`,
      targetId: request.id,
      targetType: 'PROPERTY',
      metadata: { unitId: request.unitId, priority: request.priority }
    });

    await notificationService.broadcastToAdmins({
      title: 'New Maintenance Incident',
      message: `${request.title} reported for Unit ${request.unitId}`,
      type: request.priority === 'URGENT' ? 'URGENT' : 'WARNING',
      link: `/maintenance`
    });

    res.status(201).json({ status: 'success', data: request });
  } catch (e) {
    next(e);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = await MaintenanceService.updateRequest(req.params.id as string, req.body);
    
    // Broadcast real-time update
    io.to(request.propertyId).emit('maintenance:updated', request);

    await activityService.logActivity({
      userId: (req as any).user.id,
      type: 'STATUS_CHANGE',
      description: `Maintenance status updated: ${request.title} is now ${request.status}`,
      targetId: request.id,
      targetType: 'PROPERTY',
      metadata: { unitId: request.unitId, status: request.status }
    });

    res.json({ status: 'success', data: request });
  } catch (e) {
    next(e);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await MaintenanceService.deleteRequest(req.params.id as string);
    res.json({ status: 'success', message: 'Request removed' });
  } catch (e) {
    next(e);
  }
};
