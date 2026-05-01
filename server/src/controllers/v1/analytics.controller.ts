import { Request, Response, NextFunction } from 'express';
import Transaction from '@models/Transaction.js';
import MaintenanceRequest from '@models/MaintenanceRequest.js';
import Project from '@models/Project.js';
import Property from '@models/Property.js';
import { Op, fn, col } from 'sequelize';

export const getPortfolioStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Revenue Trends (Last 6 Months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    
    const revenueTrends = await Transaction.findAll({
      attributes: [
        [fn('DATE_TRUNC', 'month', col('createdAt')), 'month'],
        [fn('SUM', col('amount')), 'total'],
        'status'
      ],
      where: {
        createdAt: { [Op.gte]: sixMonthsAgo }
      },
      group: [fn('DATE_TRUNC', 'month', col('createdAt')), 'status'],
      order: [[fn('DATE_TRUNC', 'month', col('createdAt')), 'ASC']]
    });

    // 2. Maintenance Distribution
    const maintenanceDist = await MaintenanceRequest.findAll({
      attributes: ['category', [fn('COUNT', col('id')), 'count']],
      group: ['category']
    });

    // 3. Project Status Distribution
    const projectDist = await Project.findAll({
      attributes: ['status', [fn('COUNT', col('id')), 'count']],
      group: ['status']
    });

    // 4. Property Performance (Top Yielding)
    const propertyYields = await Property.findAll({
      attributes: ['name', 'monthlyIncome', 'totalUnits', 'occupiedUnits'],
      order: [['monthlyIncome', 'DESC']],
      limit: 5
    });

    res.json({
      status: 'success',
      data: {
        revenueTrends,
        maintenanceDist,
        projectDist,
        propertyYields
      }
    });
  } catch (e) {
    next(e);
  }
};
