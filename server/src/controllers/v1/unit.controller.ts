import { Request, Response, NextFunction } from 'express';
import * as PropertyService from '@services/property.service.js';

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const unit = await PropertyService.getUnitById(req.params.id);
    if (!unit) return res.status(404).json({ status: 'fail', message: 'Unit not found' });
    res.json({ status: 'success', data: unit });
  } catch (e) {
    next(e);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const unit = await PropertyService.updateUnit(req.params.id, req.body);
    res.json({ status: 'success', data: unit });
  } catch (e) {
    next(e);
  }
};
