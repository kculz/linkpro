import { Router } from 'express';
import * as TransactionController from '@controllers/v1/transaction.controller.js';
import { authenticate, authorize } from '@middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', TransactionController.getAll);
router.get('/stats', TransactionController.getStats);
router.get('/finance-intelligence', TransactionController.getFinanceIntelligence);
router.post('/', authorize('ADMIN', 'PM'), TransactionController.create);
router.put('/:id', authorize('ADMIN', 'PM'), TransactionController.update);

export default router;
