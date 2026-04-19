import { Request, Response, NextFunction } from 'express';
import * as taskService from '@services/task.service.js';

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
    res.status(201).json({ status: 'success', data: task });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await taskService.updateTask(req.params.id as string, req.body);
    res.status(200).json({ status: 'success', data: task });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await taskService.deleteTask(req.params.id as string);
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    next(error);
  }
};

export const updateTaskStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    const task = await taskService.updateTaskStatus(req.params.id as string, status);
    res.status(200).json({ status: 'success', data: task });
  } catch (error) {
    next(error);
  }
};
