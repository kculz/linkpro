import { Router } from 'express';
import * as AnalyticsController from '@controllers/v1/analytics.controller.js';
import { authenticate, authorize } from '@middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);
router.use(authorize('ADMIN', 'PM'));

router.get('/portfolio', AnalyticsController.getPortfolioStats);

export default router;
