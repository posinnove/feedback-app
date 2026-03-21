import { Router } from 'express';
import {
  login,
  googleLogin,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  refreshToken,
  logout,
} from '../controllers/auth.controller.ts';
import { validate } from '../middleware/validation.middleware.ts';
import {
  loginSchema,
  googleLoginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../schemas/auth.schema.ts';

const router = Router();

router.post('/login', validate(loginSchema), login);
router.post('/google-login', validate(googleLoginSchema), googleLogin);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

export default router;
