import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, type JwtPayload, generateAnonToken, verifyAnonToken, deriveFingerprint } from '../utils/token.ts';
import { Users } from '../models/users.model.ts';

// 365 days in ms 
const ANON_COOKIE_MAX_AGE = 365 * 24 * 60 * 60 * 1000;

// Extend Express Request to carry the auth payload
declare global {
  namespace Express {
    interface Request {
      auth?: JwtPayload;
    }
  }
}

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyAccessToken(token);
    req.auth = payload;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function optionalAuthenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next();
    return;
  }

  const token = authHeader.slice(7);

  try {
    req.auth = verifyAccessToken(token);
  } catch {
    // Ignore invalid optional token and continue unauthenticated.
  }

  next();
}

/** Restrict to a specific entity type ('user' | 'company') */
export function requireType(type: JwtPayload['type']) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.auth || req.auth.type !== type) {
      res
        .status(403)
        .json({ message: `Access restricted to ${type} accounts` });
      return;
    }
    next();
  };
}

/**
 * Ensures an anonymous voter identity cookie exists.
 * - If the `anon_token` cookie is present and valid, derives the fingerprint.
 * - If missing or invalid (e.g. tampered), issues a fresh one and sets the cookie.
 * Always attaches `req.anonFingerprint` before calling next().
 */
export function resolveAnonToken(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const raw = req.cookies?.anon_token as string | undefined;

  let jti: string | null = null;

  if (raw) {
    try {
      const payload = verifyAnonToken(raw);
      jti = payload.jti;
    } catch {
      // Invalid / tampered – will issue a fresh one below.
    }
  }

  if (!jti) {
    // Generate a new identity and hand it to the client.
    const newToken = generateAnonToken();
    res.cookie('anon_token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: ANON_COOKIE_MAX_AGE,
    });
    // Decode the jti we just signed (no need to verify again – we just signed it).
    const { jti: newJti } = verifyAnonToken(newToken);
    jti = newJti;
  }

  req.anonFingerprint = deriveFingerprint(jti);
  next();
}

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  if (!req.auth || req.auth.type !== 'user') {
    res.status(403).json({ message: 'Access denied. Admins only.' });
    return;
  }

  try {
    const user = await Users.findByPk(req.auth.id, { attributes: ['isAdmin'] });
    if (!user || !user.isAdmin) {
      res.status(403).json({ message: 'Access denied. Admins only.' });
      return;
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

