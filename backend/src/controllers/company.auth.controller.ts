import type { Request, Response } from 'express';
import * as companyAuthService from '../services/company.auth.service.ts';

type ServiceError = Error & { status?: number };

function handleError(res: Response, err: unknown) {
    const e = err as ServiceError;
    res.status(e.status ?? 500).json({ message: e.message ?? 'Internal server error' });
}

export async function register(req: Request, res: Response) {
    try {
        const result = await companyAuthService.registerCompany(req.body);
        res.status(201).json({
            message: 'Registration successful. Please check your email to verify your account.',
            data: result,
        });
    } catch (err) {
        handleError(res, err);
    }
}

export async function verifyEmail(req: Request, res: Response) {
    try {
        const token = req.query.token as string;
        if (!token) {
            res.status(400).json({ message: 'Verification token is required' });
            return;
        }
        const result = await companyAuthService.verifyCompanyEmail(token);
        res.json(result);
    } catch (err) {
        handleError(res, err);
    }
}

export async function resendVerification(req: Request, res: Response) {
    try {
        const result = await companyAuthService.resendCompanyVerification(req.body.email);
        res.json(result);
    } catch (err) {
        handleError(res, err);
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;
        const result = await companyAuthService.loginCompany(email, password);
        res.json(result);
    } catch (err) {
        handleError(res, err);
    }
}

export async function forgotPassword(req: Request, res: Response) {
    try {
        const result = await companyAuthService.forgotCompanyPassword(req.body.email);
        res.json(result);
    } catch (err) {
        handleError(res, err);
    }
}

export async function resetPassword(req: Request, res: Response) {
    try {
        const { token, password } = req.body;
        const result = await companyAuthService.resetCompanyPassword(token, password);
        res.json(result);
    } catch (err) {
        handleError(res, err);
    }
}

export async function refreshToken(req: Request, res: Response) {
    try {
        const { refreshToken: token } = req.body;
        if (!token) {
            res.status(400).json({ message: 'Refresh token is required' });
            return;
        }
        const result = await companyAuthService.refreshCompanyToken(token);
        res.json(result);
    } catch (err) {
        handleError(res, err);
    }
}

export async function getMe(req: Request, res: Response) {
    try {
        const id = req.auth!.id;
        const company = await companyAuthService.getCompanyProfile(id);
        res.json(company);
    } catch (err) {
        handleError(res, err);
    }
}
