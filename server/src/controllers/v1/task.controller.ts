import { Request, Response, NextFunction } from 'express';
import * as taskService from '@services/task.service.js';
import * as activityService from '@services/activity.service.js';
import { io } from '../../server.js';

export const getAllTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.query;
    const tasks = await taskService.getAllTasks(projectId as string);
    res.status(200).json({ status: 'success', data: tasks });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await taskService.getTaskById(req.params.id as string);
    res.status(200).json({ status: 'success', data: task });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await taskService.createTask(req.body);
    io.to(task.projectId).emit('task:created', task);
    
    await activityService.logActivity({
      userId: (req as any).user.id,
      type: 'CREATE',
      description: `Initialized new task: ${task.title}`,
      targetId: task.id,
      targetType: 'TASK',
      metadata: { projectId: task.projectId }
    });

    res.status(201).json({ status: 'success', data: task });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await taskService.updateTask(req.params.id as string, req.body);
    io.to(task.projectId).emit('task:updated', task);
    
    await activityService.logActivity({
      userId: (req as any).user.id,
      type: 'UPDATE',
      description: `Updated task parameters: ${task.title}`,
      targetId: task.id,
      targetType: 'TASK',
      metadata: { projectId: task.projectId }
    });

    res.status(200).json({ status: 'success', data: task });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const taskId = req.params.id as string;
    // We need the projectId before deleting to notify the room
    const task = await taskService.getTaskById(taskId);
    await taskService.deleteTask(taskId);
    io.to(task.projectId).emit('task:deleted', { id: taskId, projectId: task.projectId });
    
    await activityService.logActivity({
      userId: (req as any).user.id,
      type: 'DELETE',
      description: `Decommissioned task: ${task.title}`,
      targetId: task.id,
      targetType: 'TASK',
      metadata: { projectId: task.projectId }
    });

    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    next(error);
  }
};

export const updateTaskStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    const task = await taskService.updateTaskStatus(req.params.id as string, status);
    io.to(task.projectId).emit('task:updated', task);
    
    await activityService.logActivity({
      userId: (req as any).user.id,
      type: 'STATUS_CHANGE',
      description: `Transitioned ${task.title} to ${status}`,
      targetId: task.id,
      targetType: 'TASK',
      metadata: { projectId: task.projectId, status }
    });

    res.status(200).json({ status: 'success', data: task });
  } catch (error) {
    next(error);
  }
};
