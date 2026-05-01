import { Request, Response, NextFunction } from 'express';
import * as VendorService from '@services/vendor.service.js';
import * as activityService from '@services/activity.service.js';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vendors = await VendorService.getAllVendors(req.query);
    res.json({ status: 'success', data: vendors });
  } catch (e) {
    next(e);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vendor = await VendorService.createVendor(req.body);
    
    await activityService.logActivity({
      userId: (req as any).user.id,
      type: 'CREATE',
      description: `Onboarded new vendor: ${vendor.name} (${vendor.category})`,
      targetId: vendor.id,
      targetType: 'GENERAL'
    });

    res.status(201).json({ status: 'success', data: vendor });
  } catch (e) {
    next(e);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vendor = await VendorService.updateVendor(req.params.id, req.body);
    res.json({ status: 'success', data: vendor });
  } catch (e) {
    next(e);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await VendorService.deleteVendor(req.params.id);
    res.json({ status: 'success', message: 'Vendor removed' });
  } catch (e) {
    next(e);
  }
};
