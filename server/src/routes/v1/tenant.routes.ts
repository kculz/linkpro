import { Router } from 'express';
import * as TenantController from '@controllers/v1/tenant.controller.js';
import { authenticate, authorize } from '@middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', TenantController.getAll);
router.get('/:id', TenantController.getOne);
router.post('/', authorize('ADMIN', 'PM'), TenantController.create);
router.put('/:id', authorize('ADMIN', 'PM'), TenantController.update);
router.delete('/:id', authorize('ADMIN'), TenantController.remove);

export default router;
