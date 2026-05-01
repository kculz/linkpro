import { Router } from 'express';
import * as PropertyController from '@controllers/v1/property.controller.js';
import * as UnitController from '@controllers/v1/unit.controller.js';
import { authenticate, authorize } from '@middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);
router.get('/', PropertyController.getAll);
router.get('/stats', PropertyController.stats);
router.get('/:id', PropertyController.getOne);
router.post('/', authorize('ADMIN', 'PM'), PropertyController.create);
router.put('/:id', authorize('ADMIN', 'PM'), PropertyController.update);
router.delete('/:id', authorize('ADMIN'), PropertyController.remove);

// Unit Routes
router.get('/units/:id', UnitController.getOne);
router.put('/units/:id', authorize('ADMIN', 'PM'), UnitController.update);

export default router;
