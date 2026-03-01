import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { AuthPayload } from "../types/auth.types.ts";

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Locals {
            user: AuthPayload;
        }
    }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Authorization token is required" });
        return;
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        res.status(500).json({ message: "Internal server error" });
        return;
    }

    try {
        const decoded = jwt.verify(token, secret) as AuthPayload;
        res.locals.user = decoded;
        next();
    } catch {
        res.status(401).json({ message: "Invalid or expired token" });
    }
}
