import { Router } from 'express';
import * as VendorController from '@controllers/v1/vendor.controller.js';
import { authenticate, authorize } from '@middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', VendorController.getAll);
router.post('/', authorize('ADMIN', 'PM'), VendorController.create);
router.put('/:id', authorize('ADMIN', 'PM'), VendorController.update);
router.delete('/:id', authorize('ADMIN'), VendorController.remove);

export default router;
