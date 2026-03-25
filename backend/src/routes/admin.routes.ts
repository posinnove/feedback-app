import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.ts';
import { requireAdmin } from '../middleware/auth.middleware.ts';
import * as adminController from '../controllers/admin.controller.ts';

const router = Router();

// Apply auth and admin requirement to all routes in this router
router.use(authenticate, requireAdmin);

// Dashboard Stats
router.get('/stats', adminController.getStats);

// Company Management
router.get('/companies', adminController.getCompanies);
router.patch('/companies/:id/verify', adminController.verifyCompany);
router.delete('/companies/:id', adminController.removeCompany);

// Content Management
router.get('/feedbacks', adminController.getFeedbacks);
router.delete('/feedbacks/:id', adminController.removeFeedback);
router.delete('/replies/:id', adminController.removeReply);

export default router;
