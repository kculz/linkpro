import { Request, Response, NextFunction } from 'express';
import * as UnitService from '@services/unit.service.js';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const units = await UnitService.getAllUnits(req.query);
    res.json({ success: true, data: units });
  } catch (e) {
    next(e);
  }
};

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const unit = await UnitService.getUnitById(req.params.id as string);
    res.json({ success: true, data: unit });
  } catch (e) {
    next(e);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const unit = await UnitService.createUnit(req.body);
    res.status(201).json({ success: true, data: unit });
  } catch (e) {
    next(e);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const unit = await UnitService.updateUnit(req.params.id as string, req.body);
    res.json({ success: true, data: unit });
  } catch (e) {
    next(e);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await UnitService.deleteUnit(req.params.id as string);
    res.json({ success: true, message: 'Unit deleted' });
  } catch (e) {
    next(e);
  }
};
