import type { Request, Response } from 'express';
import * as authService from '../services/auth.service.ts';

type ServiceError = Error & { status?: number };

function handleError(res: Response, err: unknown) {
    const e = err as ServiceError;
    res.status(e.status ?? 500).json({ message: e.message ?? 'Internal server error' });
}

// POST /api/auth/login
export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;
        const result = await authService.unifiedLogin(email, password);
        res.json(result);
    } catch (err) {
        handleError(res, err);
    }
}

// POST /api/auth/forgot-password
export async function forgotPassword(req: Request, res: Response) {
    try {
        const result = await authService.unifiedForgotPassword(req.body.email);
        res.json(result);
    } catch (err) {
        handleError(res, err);
    }
}

// POST /api/auth/reset-password
export async function resetPassword(req: Request, res: Response) {
    try {
        const { token, password } = req.body;
        const result = await authService.unifiedResetPassword(token, password);
        res.json(result);
    } catch (err) {
        handleError(res, err);
    }
}

// GET /api/auth/verify-email?token=...
export async function verifyEmail(req: Request, res: Response) {
    try {
        const token = req.query.token as string;
        if (!token) {
            res.status(400).json({ message: 'Verification token is required' });
            return;
        }
        const result = await authService.unifiedVerifyEmail(token);
        res.json(result);
    } catch (err) {
        handleError(res, err);
    }
}

// POST /api/auth/resend-verification
export async function resendVerification(req: Request, res: Response) {
    try {
        const result = await authService.unifiedResendVerification(req.body.email);
        res.json(result);
    } catch (err) {
        handleError(res, err);
    }
}

// POST /api/auth/refresh-token
export async function refreshToken(req: Request, res: Response) {
    try {
        const { refreshToken: token } = req.body;
        if (!token) {
            res.status(400).json({ message: 'Refresh token is required' });
            return;
        }
        const result = await authService.unifiedRefreshToken(token);
        res.json(result);
    } catch (err) {
        handleError(res, err);
    }
}
