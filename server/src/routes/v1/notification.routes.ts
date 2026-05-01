import { Router } from 'express';
import * as NotificationController from '@controllers/v1/notification.controller.js';
import { authenticate } from '@middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', NotificationController.getAll);
router.put('/read-all', NotificationController.markAllRead);
router.put('/:id/read', NotificationController.markRead);

export default router;
