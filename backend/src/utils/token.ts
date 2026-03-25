import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import 'dotenv/config';

const ANON_TOKEN_SECRET = (process.env.ANON_TOKEN_SECRET ?? process.env.JWT_SECRET) as string;

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

// ── Anonymous voter token ────────────────────────────────────────────────────

export interface AnonTokenPayload {
    /** Random UUID – the raw identity. Never stored; only its hash is. */
    jti: string;
}

/**
 * Issues a signed JWT with a random jti that serves as the anonymous voter
 * identity. No expiry – the cookie max-age governs lifetime.
 */
export function generateAnonToken(): string {
    const jti = crypto.randomUUID();
    return jwt.sign({ jti }, ANON_TOKEN_SECRET);
}

/** Verifies the anon token and returns the payload. Throws on invalid token. */
export function verifyAnonToken(token: string): AnonTokenPayload {
    return jwt.verify(token, ANON_TOKEN_SECRET) as AnonTokenPayload;
}

/**
 * Derives the stable database fingerprint from a raw jti.
 * We store only the hash so the raw identity cannot be reconstructed from DB.
 */
export function deriveFingerprint(jti: string): string {
    return crypto.createHash('sha256').update(jti).digest('hex');
}