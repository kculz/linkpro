import { Request, Response, NextFunction } from 'express';
import * as ProjectService from '@services/project.service.js';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await ProjectService.getAllProjects() }); }
  catch (e) { next(e); }
};

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await ProjectService.getProjectById(String(req.params.id)) }); }
  catch (e) { next(e); }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await ProjectService.createProject(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (e) { next(e); }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await ProjectService.updateProject(String(req.params.id), req.body) }); }
  catch (e) { next(e); }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await ProjectService.deleteProject(String(req.params.id));
    res.json({ success: true, message: 'Project deleted' });
  } catch (e) { next(e); }
};

export const stats = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await ProjectService.getProjectStats() }); }
  catch (e) { next(e); }
};
