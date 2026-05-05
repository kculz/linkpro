import { Router } from 'express';
import * as TeamController from '@controllers/v1/team.controller.js';
import { authenticate, authorize } from '@middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);
router.use(authorize('OWNER', 'ADMIN'));

router.get('/', TeamController.getTeam);
router.post('/employees', TeamController.addEmployee);
router.put('/:id/role', TeamController.updateRole);
router.delete('/:id', TeamController.removeMember);

export default router;
