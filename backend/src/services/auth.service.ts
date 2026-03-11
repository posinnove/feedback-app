import jwt from 'jsonwebtoken';
import 'dotenv/config';
import * as userAuthService from './user.auth.service.ts';
import * as companyAuthService from './company.auth.service.ts';
import { Users } from '../models/users.model.ts';
import { Company } from '../models/company.model.ts';
import { Op } from 'sequelize';
import { verifyRefreshToken } from '../utils/token.ts';

// ─── Unified Login ────────────────────────────────────────────────────────────

export async function unifiedLogin(email: string, password: string) {
    // Try user first
    const user = await Users.findOne({ where: { email } });
    if (user) {
        const result = await userAuthService.loginUser(email, password);
        return { ...result, type: 'user' as const };
    }

    // Fallback: try company
    const company = await Company.findOne({ where: { email } });
    if (company) {
        const result = await companyAuthService.loginCompany(email, password);
        return { ...result, type: 'company' as const };
    }

    // Neither found — return generic error (don't reveal which table was checked)
    throw Object.assign(new Error('Invalid email or password'), { status: 401 });
}

// ─── Unified Forgot Password ──────────────────────────────────────────────────

export async function unifiedForgotPassword(email: string) {
    const user = await Users.findOne({ where: { email } });
    if (user) {
        return userAuthService.forgotUserPassword(email);
    }

    const company = await Company.findOne({ where: { email } });
    if (company) {
        return companyAuthService.forgotCompanyPassword(email);
    }

    // Return generic message regardless — don't reveal if email exists
    return { message: 'If the email exists, a password reset link has been sent.' };
}

// ─── Unified Reset Password ───────────────────────────────────────────────────

export async function unifiedResetPassword(token: string, newPassword: string) {
    // Try user reset token first
    const userWithToken = await Users.findOne({
        where: {
            passwordResetToken: token,
            passwordResetExpires: { [Op.gt]: new Date() },
        },
    });
    if (userWithToken) {
        return userAuthService.resetUserPassword(token, newPassword);
    }

    // Try company reset token
    const companyWithToken = await Company.findOne({
        where: {
            passwordResetToken: token,
            passwordResetExpires: { [Op.gt]: new Date() },
        },
    });
    if (companyWithToken) {
        return companyAuthService.resetCompanyPassword(token, newPassword);
    }

    throw Object.assign(new Error('Invalid or expired reset token'), { status: 400 });
}

// ─── Unified Verify Email ─────────────────────────────────────────────────────

export async function unifiedVerifyEmail(token: string) {
    // Try user verification token first
    const userWithToken = await Users.findOne({
        where: {
            emailVerificationToken: token,
            emailVerificationExpires: { [Op.gt]: new Date() },
        },
    });
    if (userWithToken) {
        return userAuthService.verifyUserEmail(token);
    }

    // Try company verification token
    const companyWithToken = await Company.findOne({
        where: {
            emailVerificationToken: token,
            emailVerificationExpires: { [Op.gt]: new Date() },
        },
    });
    if (companyWithToken) {
        return companyAuthService.verifyCompanyEmail(token);
    }

    throw Object.assign(new Error('Invalid or expired verification token'), { status: 400 });
}

// ─── Unified Resend Verification ──────────────────────────────────────────────

export async function unifiedResendVerification(email: string) {
    const user = await Users.findOne({ where: { email } });
    if (user) {
        return userAuthService.resendUserVerification(email);
    }

    const company = await Company.findOne({ where: { email } });
    if (company) {
        return companyAuthService.resendCompanyVerification(email);
    }

    return { message: 'If the email exists, a verification link has been sent.' };
}

// ─── Unified Refresh Token ────────────────────────────────────────────────────

export async function unifiedRefreshToken(token: string) {
    // Decode to get the type without full verification first
    const raw = jwt.decode(token) as { type?: string } | null;
    const type = raw?.type;

    if (type === 'user') {
        return userAuthService.refreshUserToken(token);
    }
    if (type === 'company') {
        return companyAuthService.refreshCompanyToken(token);
    }

    // Unknown type — let verifyRefreshToken throw
    try {
        verifyRefreshToken(token);
    } catch {
        throw Object.assign(new Error('Invalid or expired refresh token'), { status: 401 });
    }
    throw Object.assign(new Error('Token type mismatch'), { status: 401 });
}
