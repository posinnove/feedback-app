import type { Request, Response, NextFunction } from 'express';
import * as userAuthService from '../services/user.auth.service.ts';

// Helpers handled globally

export async function register(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await userAuthService.registerUser(req.body);
        res.status(201).json({
            message: 'Registration successful. Please check your email to verify your account.',
            data: result,
        });
    } catch (err) {
        next(err);
    }
}

export async function verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.query.token as string;
        if (!token) {
            res.status(400).json({ message: 'Verification token is required' });
            return;
        }
        const result = await userAuthService.verifyUserEmail(token);
        res.json(result);
    } catch (err) {
        next(err);
    }
}

export async function resendVerification(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await userAuthService.resendUserVerification(req.body.email);
        res.json(result);
    } catch (err) {
        next(err);
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;
        const result = await userAuthService.loginUser(email, password);

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

export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await userAuthService.forgotUserPassword(req.body.email);
        res.json(result);
    } catch (err) {
        next(err);
    }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
        const { token, password } = req.body;
        const result = await userAuthService.resetUserPassword(token, password);
        res.json(result);
    } catch (err) {
        next(err);
    }
}

export async function refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.cookies.refreshToken || req.body.refreshToken;
        if (!token) {
            res.status(400).json({ message: 'Refresh token is required' });
            return;
        }
        const result = await userAuthService.refreshUserToken(token);

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

export async function getMe(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.auth!.id;
        const user = await userAuthService.getUserProfile(id);
        res.json(user);
    } catch (err) {
        next(err);
    }
}
