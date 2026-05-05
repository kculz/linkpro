import Project from '@models/Project.js';
import User from '@models/User.js';
import { AppError } from '@middlewares/errorHandler.js';

export const getAllProjects = async () =>
  Project.findAll({ include: [{ model: User, as: 'manager', attributes: ['id', 'name', 'email'] }] });

export const getProjectById = async (id: string) => {
  const project = await Project.findByPk(id);
  if (!project) throw new AppError('Project not found', 404);
  return project;
};

export const createProject = async (data: Record<string, unknown>) => {
  // Sanitize empty optional UUID fields to null
  if (!data.propertyId) data.propertyId = null;
  return Project.create(data as Parameters<typeof Project.create>[0]);
};

export const updateProject = async (id: string, data: Record<string, unknown>) => {
  const project = await Project.findByPk(id);
  if (!project) throw new AppError('Project not found', 404);
  return project.update(data);
};

export const deleteProject = async (id: string) => {
  const project = await Project.findByPk(id);
  if (!project) throw new AppError('Project not found', 404);
  await project.destroy();
};

export const getProjectStats = async () => {
  const projects = await Project.findAll();
  const totalBudget = projects.reduce((s, p) => s + Number(p.budget), 0);
  const totalSpent = projects.reduce((s, p) => s + Number(p.spent), 0);
  return {
    total: projects.length,
    active: projects.filter((p) => p.status !== 'COMPLETED').length,
    completed: projects.filter((p) => p.status === 'COMPLETED').length,
    totalBudget,
    totalSpent,
  };
};
