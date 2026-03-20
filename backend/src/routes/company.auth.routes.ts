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
import { validate } from '../middleware/validation.middleware.ts';
import {
    companyRegisterSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
} from '../schemas/auth.schema.ts';

const router = Router();

router.post('/register', validate(companyRegisterSchema), register);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/login', validate(loginSchema), login);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);
router.post('/refresh-token', refreshToken);

// Protected
router.get('/me', authenticate, requireType('company'), getMe);

export default router;
