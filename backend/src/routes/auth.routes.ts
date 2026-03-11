import { Router } from 'express';
import {
    login,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    refreshToken,
} from '../controllers/auth.controller.ts';

const router = Router();

router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/refresh-token', refreshToken);

export default router;
