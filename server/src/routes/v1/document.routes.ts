import { Router } from 'express';
import * as DocumentController from '@controllers/v1/document.controller.js';
import { authenticate } from '@middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', DocumentController.getAll);
router.post('/', DocumentController.create);
router.delete('/:id', DocumentController.remove);

export default router;
