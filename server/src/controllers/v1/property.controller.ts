import { Request, Response, NextFunction } from 'express';
import * as PropertyService from '@services/property.service.js';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await PropertyService.getAllProperties() }); }
  catch (e) { next(e); }
};

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await PropertyService.getPropertyById(String(req.params.id)) }); }
  catch (e) { next(e); }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const property = await PropertyService.createProperty(req.body);
    res.status(201).json({ success: true, data: property });
  } catch (e) { next(e); }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await PropertyService.updateProperty(String(req.params.id), req.body) }); }
  catch (e) { next(e); }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await PropertyService.deleteProperty(String(req.params.id));
    res.json({ success: true, message: 'Property deleted' });
  } catch (e) { next(e); }
};

export const stats = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await PropertyService.getOccupancyStats() }); }
  catch (e) { next(e); }
};
