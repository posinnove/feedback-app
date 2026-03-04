import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import { Users } from '../models/users.model.ts';
import {
    generateAccessToken,
    generateRefreshToken,
    generateVerificationToken,
    generatePasswordResetToken,
    verifyRefreshToken,
} from '../utils/token.ts';
import {
    sendVerificationEmail,
    sendPasswordResetEmail,
} from '../utils/sendEmail.ts';

// ─── Register ────────────────────────────────────────────────────────────────

export async function registerUser(data: {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber?: string;
}) {
    const exists = await Users.findOne({
        where: {
            [Op.or]: [
                { email: data.email },
                { username: data.username },
            ],
        },
    });

    if (exists) {
        if (exists.email === data.email) {
            throw Object.assign(new Error('Email already in use'), { status: 409 });
        }
        throw Object.assign(new Error('Username already taken'), { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const { token, expires } = generateVerificationToken();

    const user = await Users.create({
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: hashedPassword,
        phoneNumber: data.phoneNumber ?? null,
        isEmailVerified: false,
        emailVerificationToken: token,
        emailVerificationExpires: expires,
    });

    await sendVerificationEmail(user.email, token, 'user');

    return { id: user.id, email: user.email, username: user.username };
}

// ─── Verify Email ─────────────────────────────────────────────────────────────

export async function verifyUserEmail(token: string) {
    const user = await Users.findOne({
        where: {
            emailVerificationToken: token,
            emailVerificationExpires: { [Op.gt]: new Date() },
        },
    });

    if (!user) {
        throw Object.assign(new Error('Invalid or expired verification token'), { status: 400 });
    }

    await user.update({
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
    });

    return { message: 'Email verified successfully' };
}

// ─── Resend Verification ─────────────────────────────────────────────────────

export async function resendUserVerification(email: string) {
    const user = await Users.findOne({ where: { email } });

    if (!user) {
        // Don't reveal whether email exists
        return { message: 'If the email exists, a verification link has been sent.' };
    }

    if (user.isEmailVerified) {
        throw Object.assign(new Error('Email is already verified'), { status: 400 });
    }

    const { token, expires } = generateVerificationToken();
    await user.update({
        emailVerificationToken: token,
        emailVerificationExpires: expires,
    });

    await sendVerificationEmail(user.email, token, 'user');
    return { message: 'If the email exists, a verification link has been sent.' };
}

// ─── Login ───────────────────────────────────────────────────────────────────

export async function loginUser(email: string, password: string) {
    const user = await Users.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw Object.assign(new Error('Invalid email or password'), { status: 401 });
    }

    if (!user.isEmailVerified) {
        throw Object.assign(new Error('Please verify your email before logging in'), { status: 403 });
    }

    const accessToken = generateAccessToken(user.id, 'user');
    const refreshToken = generateRefreshToken(user.id, 'user');

    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        },
    };
}

// ─── Forgot Password ─────────────────────────────────────────────────────────

export async function forgotUserPassword(email: string) {
    const user = await Users.findOne({ where: { email } });

    if (user) {
        const { token, expires } = generatePasswordResetToken();
        await user.update({
            passwordResetToken: token,
            passwordResetExpires: expires,
        });
        await sendPasswordResetEmail(user.email, token, 'user');
    }

    return { message: 'If the email exists, a password reset link has been sent.' };
}

// ─── Reset Password ───────────────────────────────────────────────────────────

export async function resetUserPassword(token: string, newPassword: string) {
    const user = await Users.findOne({
        where: {
            passwordResetToken: token,
            passwordResetExpires: { [Op.gt]: new Date() },
        },
    });

    if (!user) {
        throw Object.assign(new Error('Invalid or expired reset token'), { status: 400 });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await user.update({
        password: hashed,
        passwordResetToken: null,
        passwordResetExpires: null,
    });

    return { message: 'Password reset successfully' };
}

// ─── Refresh Token ────────────────────────────────────────────────────────────

export async function refreshUserToken(token: string) {
    let payload;
    try {
        payload = verifyRefreshToken(token);
    } catch {
        throw Object.assign(new Error('Invalid or expired refresh token'), { status: 401 });
    }

    if (payload.type !== 'user') {
        throw Object.assign(new Error('Token type mismatch'), { status: 401 });
    }

    const user = await Users.findByPk(payload.id);
    if (!user) {
        throw Object.assign(new Error('User not found'), { status: 404 });
    }

    const accessToken = generateAccessToken(user.id, 'user');
    const refreshToken = generateRefreshToken(user.id, 'user');

    return { accessToken, refreshToken };
}

// ─── Get Me ───────────────────────────────────────────────────────────────────

export async function getUserProfile(id: number) {
    const user = await Users.findByPk(id, {
        attributes: ['id', 'username', 'firstName', 'lastName', 'email', 'phoneNumber', 'createdAt'],
    });

    if (!user) {
        throw Object.assign(new Error('User not found'), { status: 404 });
    }

    return user;
}
