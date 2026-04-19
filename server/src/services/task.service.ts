import Task from '@models/Task.js';
import User from '@models/User.js';
import { AppError } from '@middlewares/errorHandler.js';

export const getAllTasks = async (projectId?: string) => {
  const where: any = {};
  if (projectId) where.projectId = projectId;
  
  return Task.findAll({
    where,
    include: [{ model: User, as: 'assignee', attributes: ['id', 'name', 'avatar'] }]
  });
};

export const getTaskById = async (id: string) => {
  const task = await Task.findByPk(id, {
    include: [{ model: User, as: 'assignee', attributes: ['id', 'name', 'avatar'] }]
  });
  if (!task) throw new AppError('Task not found', 404);
  return task;
};

export const createTask = async (data: any) => {
  return Task.create(data);
};

export const updateTask = async (id: string, data: any) => {
  const task = await Task.findByPk(id);
  if (!task) throw new AppError('Task not found', 404);
  return task.update(data);
};

export const deleteTask = async (id: string) => {
  const task = await Task.findByPk(id);
  if (!task) throw new AppError('Task not found', 404);
  await task.destroy();
};

export const updateTaskStatus = async (id: string, status: string) => {
  const task = await Task.findByPk(id);
  if (!task) throw new AppError('Task not found', 404);
  return task.update({ status });
};
