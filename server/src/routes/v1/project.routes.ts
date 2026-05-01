import { Router } from 'express';
import * as projectController from '@controllers/v1/project.controller.js';
import { authenticate } from '@middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);
router.get('/', projectController.getAllProjects);
router.get('/stats', projectController.getProjectStats);
router.get('/:id', projectController.getProjectById);
router.post('/', projectController.createProject);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

export default router;
