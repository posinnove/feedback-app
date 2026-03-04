import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, type JwtPayload } from '../utils/token.ts';

// Extend Express Request to carry the auth payload
declare global {
    namespace Express {
        interface Request {
            auth?: JwtPayload;
        }
    }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
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

/** Restrict to a specific entity type ('user' | 'company') */
export function requireType(type: JwtPayload['type']) {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.auth || req.auth.type !== type) {
            res.status(403).json({ message: `Access restricted to ${type} accounts` });
            return;
        }
        next();
    };
}
