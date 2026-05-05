import { Request, Response, NextFunction } from 'express';
import * as UnitService from '@services/unit.service.js';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const units = await UnitService.getAllUnits(req.query);
    res.json({ status: 'success', data: units });
  } catch (e) {
    next(e);
  }
};

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const unit = await UnitService.getUnitById(req.params.id);
    if (!unit) return res.status(404).json({ status: 'fail', message: 'Unit not found' });
    res.json({ status: 'success', data: unit });
  } catch (e) {
    next(e);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const unit = await UnitService.createUnit(req.body);
    res.status(201).json({ status: 'success', data: unit });
  } catch (e) {
    next(e);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const unit = await UnitService.updateUnit(req.params.id, req.body);
    res.json({ status: 'success', data: unit });
  } catch (e) {
    next(e);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await UnitService.deleteUnit(req.params.id);
    res.json({ status: 'success', message: 'Unit deleted' });
  } catch (e) {
    next(e);
  }
};
