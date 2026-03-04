import { Router } from 'express';
import {
    register,
    verifyEmail,
    resendVerification,
    login,
    forgotPassword,
    resetPassword,
    refreshToken,
    getMe,
} from '../controllers/company.auth.controller.ts';
import { authenticate, requireType } from '../middleware/auth.middleware.ts';

const router = Router();

router.post('/register', register);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/refresh-token', refreshToken);

// Protected
router.get('/me', authenticate, requireType('company'), getMe);

export default router;
