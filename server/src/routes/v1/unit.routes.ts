import { Router } from 'express';
import * as UnitController from '@controllers/v1/unit.controller.js';
import { authenticate } from '@middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', UnitController.getAll);
router.get('/:id', UnitController.getOne);
router.post('/', UnitController.create);
router.put('/:id', UnitController.update);
router.delete('/:id', UnitController.remove);

export default router;
