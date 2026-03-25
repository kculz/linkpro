import { Router } from 'express';
import * as ProjectController from '@controllers/v1/project.controller.js';
import { authenticate, authorize } from '@middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);
router.get('/', ProjectController.getAll);
router.get('/stats', ProjectController.stats);
router.get('/:id', ProjectController.getOne);
router.post('/', authorize('ADMIN', 'PM'), ProjectController.create);
router.put('/:id', authorize('ADMIN', 'PM'), ProjectController.update);
router.delete('/:id', authorize('ADMIN'), ProjectController.remove);

export default router;
