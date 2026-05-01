import { Router } from 'express';
import * as activityService from '@services/activity.service.js';
import { authenticate } from '@middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const { targetId, targetType, limit } = req.query;
    const where: any = {};
    if (targetId) where.targetId = targetId;
    if (targetType) where.targetType = targetType;
    
    const activities = await activityService.getRecentActivities(
      limit ? parseInt(limit as string) : 20,
      where
    );
    
    res.status(200).json({ status: 'success', data: activities });
  } catch (error) {
    next(error);
  }
});

export default router;
