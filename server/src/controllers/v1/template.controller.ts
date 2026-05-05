import { Request, Response, NextFunction } from 'express';
import * as TemplateService from '@services/template.service.js';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const templates = await TemplateService.getAllTemplates();
    res.json({ status: 'success', data: templates });
  } catch (e) {
    next(e);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const template = await TemplateService.createTemplate({
      ...req.body,
      createdBy: (req as any).user.id
    });
    res.status(201).json({ status: 'success', data: template });
  } catch (e) {
    next(e);
  }
};

export const seed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await TemplateService.seedDefaultTemplates((req as any).user.id);
    res.json({ status: 'success', message: 'Default templates seeded' });
  } catch (e) {
    next(e);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await TemplateService.deleteTemplate(req.params.id);
    res.json({ status: 'success', message: 'Template removed' });
  } catch (e) {
    next(e);
  }
};
