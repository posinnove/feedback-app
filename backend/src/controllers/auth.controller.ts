import type { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service.ts';

// Helpers moved to middleware or handled globally

// POST /api/auth/login
export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;
        const result = await authService.unifiedLogin(email, password);

        // Set refresh token in HttpOnly cookie
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        const { refreshToken, ...rest } = result;
        res.json(rest);
    } catch (err) {
        next(err);
    }
}

// POST /api/auth/forgot-password
export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await authService.unifiedForgotPassword(req.body.email);
        res.json(result);
    } catch (err) {
        next(err);
    }
}

// POST /api/auth/reset-password
export async function resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
        const { token, password } = req.body;
        const result = await authService.unifiedResetPassword(token, password);
        res.json(result);
    } catch (err) {
        next(err);
    }
}

// GET /api/auth/verify-email?token=...
export async function verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.query.token as string;
        if (!token) {
            res.status(400).json({ message: 'Verification token is required' });
            return;
        }
        const result = await authService.unifiedVerifyEmail(token);
        res.json(result);
    } catch (err) {
        next(err);
    }
}

// POST /api/auth/resend-verification
export async function resendVerification(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await authService.unifiedResendVerification(req.body.email);
        res.json(result);
    } catch (err) {
        next(err);
    }
}

// POST /api/auth/refresh-token
export async function refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.cookies.refreshToken || req.body.refreshToken;
        if (!token) {
            res.status(400).json({ message: 'Refresh token is required' });
            return;
        }
        const result = await authService.unifiedRefreshToken(token);

        // Set new refresh token in HttpOnly cookie
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        const { refreshToken, ...rest } = result;
        res.json(rest);
    } catch (err) {
        next(err);
    }
}
