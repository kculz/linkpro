import { Request, Response, NextFunction } from 'express';
import * as UserService from '@services/user.service.js';
import * as activityService from '@services/activity.service.js';

export const getTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserService.getAllUsers();
    res.json({ status: 'success', data: users });
  } catch (e) {
    next(e);
  }
};

export const addEmployee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const employee = await UserService.createEmployee(req.body);
    
    await activityService.logActivity({
      userId: (req as any).user.id,
      type: 'CREATE',
      description: `Team: Added new ${employee.role} - ${employee.name}`,
      targetId: employee.id,
      targetType: 'GENERAL'
    });

    res.status(201).json({ status: 'success', data: employee });
  } catch (e) {
    next(e);
  }
};

export const updateRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role } = req.body;
    const user = await UserService.updateUserRole(req.params.id, role);
    
    await activityService.logActivity({
      userId: (req as any).user.id,
      type: 'UPDATE',
      description: `Team: Updated role for ${user.name} to ${role}`,
      targetId: user.id,
      targetType: 'GENERAL'
    });

    res.json({ status: 'success', data: user });
  } catch (e) {
    next(e);
  }
};

export const removeMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await UserService.removeUser(req.params.id);
    res.json({ status: 'success', message: 'Team member removed' });
  } catch (e) {
    next(e);
  }
};
