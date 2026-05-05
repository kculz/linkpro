import { Request, Response, NextFunction } from 'express';
import * as projectService from '@services/project.service.js';
import * as activityService from '@services/activity.service.js';
import { io } from '../../server.js';

export const getAllProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projects = await projectService.getAllProjects();
    res.status(200).json({ status: 'success', data: projects });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await projectService.getProjectById(req.params.id as string);
    res.status(200).json({ status: 'success', data: project });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = { ...req.body, managerId: (req as any).user.id };
    const project = await projectService.createProject(body);
    
    await activityService.logActivity({
      userId: (req as any).user.id,
      type: 'CREATE',
      description: `Initialized new project deployment: ${project.name}`,
      targetId: project.id,
      targetType: 'PROJECT'
    });

    res.status(201).json({ status: 'success', data: project });
  } catch (error: any) {
    console.error('PROJECT CREATE ERROR:', error?.original?.message || error?.message, 'SQL:', error?.sql);
    console.error('Request body:', JSON.stringify(req.body, null, 2));
    next(error);
  }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await projectService.updateProject(req.params.id as string, req.body);
    io.to(project.id).emit('project:updated', project);
    
    await activityService.logActivity({
      userId: (req as any).user.id,
      type: 'UPDATE',
      description: `Adjusted project parameters: ${project.name}`,
      targetId: project.id,
      targetType: 'PROJECT',
      metadata: { status: project.status }
    });

    res.status(200).json({ status: 'success', data: project });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = req.params.id as string;
    const project = await projectService.getProjectById(projectId);
    await projectService.deleteProject(projectId);
    
    if (project) {
      await activityService.logActivity({
        userId: (req as any).user.id,
        type: 'DELETE',
        description: `Decommissioned project: ${project.name}`,
        targetId: projectId,
        targetType: 'PROJECT'
      });
    }

    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    next(error);
  }
};

export const getProjectStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await projectService.getProjectStats();
    res.status(200).json({ status: 'success', data: stats });
  } catch (error) {
    next(error);
  }
};
