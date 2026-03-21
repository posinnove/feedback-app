import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.ts';
import {
  getNotifications,
  markAsRead,
} from '../controllers/notification.controller.ts';

const router = Router();

// Get unread notifications for authenticated user
router.get('/', authenticate, getNotifications);

// Mark notifications as read
router.post('/mark-as-read', authenticate, markAsRead);

export default router;
