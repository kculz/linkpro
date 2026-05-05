import { Request, Response, NextFunction } from 'express';
import * as TenantService from '@services/tenant.service.js';
import * as activityService from '@services/activity.service.js';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenants = await TenantService.getAllTenants(req.query);
    res.json({ status: 'success', data: tenants });
  } catch (e) {
    next(e);
  }
};

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenant = await TenantService.getTenantById(req.params.id as string);
    res.json({ status: 'success', data: tenant });
  } catch (e) {
    next(e);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenant = await TenantService.createTenant(req.body);
    
    await activityService.logActivity({
      userId: (req as any).user.id,
      type: 'CREATE',
      description: `Onboarded new tenant: ${tenant.name}`,
      targetId: tenant.id,
      targetType: 'UNIT', // Logging against Unit for asset visibility
      metadata: { unitId: tenant.unitId }
    });

    res.status(201).json({ status: 'success', data: tenant });
  } catch (e) {
    next(e);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenant = await TenantService.updateTenant(req.params.id as string, req.body);
    
    await activityService.logActivity({
      userId: (req as any).user.id,
      type: 'UPDATE',
      description: `Updated lease for ${tenant.name}`,
      targetId: tenant.id,
      targetType: 'UNIT',
      metadata: { unitId: tenant.unitId }
    });

    res.json({ status: 'success', data: tenant });
  } catch (e) {
    next(e);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenant = await TenantService.getTenantById(req.params.id as string);
    await TenantService.deleteTenant(req.params.id as string);
    
    if (tenant) {
      await activityService.logActivity({
        userId: (req as any).user.id,
        type: 'DELETE',
        description: `Offboarded tenant: ${tenant.name}`,
        targetId: req.params.id as string,
        targetType: 'UNIT',
        metadata: { unitId: tenant.unitId }
      });
    }

    res.json({ status: 'success', message: 'Tenant removed' });
  } catch (e) {
    next(e);
  }
};
