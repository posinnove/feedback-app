import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import 'dotenv/config';

export type AuthEntityType = 'user' | 'company';

export interface JwtPayload {
    id: number;
    type: AuthEntityType;
}

const ACCESS_SECRET = process.env.JWT_SECRET as string;
const REFRESH_SECRET = (process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET) as string;

export function generateAccessToken(id: number, type: AuthEntityType): string {
    return jwt.sign({ id, type }, ACCESS_SECRET, { expiresIn: '15m' });
}

export function generateRefreshToken(id: number, type: AuthEntityType): string {
    return jwt.sign({ id, type }, REFRESH_SECRET, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
    return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
}

export interface VerificationTokenResult {
    token: string;
    expires: Date;
}

/** Generates a random 64-char hex token + expiry date (24 hours from now) */
export function generateVerificationToken(): VerificationTokenResult {
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    return { token, expires };
}

/** Generates a random password-reset token + expiry (1 hour from now) */
export function generatePasswordResetToken(): VerificationTokenResult {
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    return { token, expires };
}
