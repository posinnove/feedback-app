import { Router } from 'express';
import {
    login,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    refreshToken,
} from '../controllers/auth.controller.ts';
import { validate } from '../middleware/validation.middleware.ts';
import {
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
} from '../schemas/auth.schema.ts';

const router = Router();

router.post('/login', validate(loginSchema), login);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/refresh-token', refreshToken);

export default router;
