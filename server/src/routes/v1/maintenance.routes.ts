import { Router } from 'express';
import * as MaintenanceController from '@controllers/v1/maintenance.controller.js';
import { authenticate } from '@middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', MaintenanceController.getAll);
router.get('/:id', MaintenanceController.getOne);
router.post('/', MaintenanceController.create);
router.put('/:id', MaintenanceController.update);
router.delete('/:id', MaintenanceController.remove);

export default router;
