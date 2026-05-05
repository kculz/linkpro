import { Router } from 'express';
import * as TemplateController from '@controllers/v1/template.controller.js';
import { authenticate } from '@middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', TemplateController.getAll);
router.post('/', TemplateController.create);
router.post('/seed', TemplateController.seed);
router.delete('/:id', TemplateController.remove);

export default router;
