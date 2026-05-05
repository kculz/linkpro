import { Router } from 'express';
import * as MessageController from '@controllers/v1/message.controller.js';
import { authenticate } from '@middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/conversations', MessageController.getConversations);
router.get('/contacts', MessageController.getContacts);
router.get('/unread-count', MessageController.getUnreadCount);
router.get('/:conversationId', MessageController.getMessages);
router.post('/', MessageController.sendMessage);

export default router;
