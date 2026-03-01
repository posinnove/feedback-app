import type { Request, Response } from "express";
import {
    registerUser,
    registerCompany as registerCompanyService,
    loginUser,
} from "../services/auth.service.ts";
import logger from "../utils/logger.ts";
import type { RegisterInput, RegisterCompanyInput } from "../types/auth.types.ts";

export async function register(req: Request, res: Response): Promise<void> {
    try {
        const input: RegisterInput = req.body;
        const result = await registerUser(input);
        res.status(201).json({ success: true, data: result });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);

        if (message === "CONFLICT") {
            res.status(409).json({ success: false, message: "Invalid registration details" });
            return;
        }

        logger.error("Register error:", { message });
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function registerCompany(req: Request, res: Response): Promise<void> {
    try {
        const userId = res.locals.user.userId as number;
        const input: RegisterCompanyInput = req.body;
        const result = await registerCompanyService(userId, input);
        res.status(201).json({ success: true, data: result });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);

        if (message === "COMPANY_ALREADY_EXISTS") {
            res.status(409).json({ success: false, message: "You already own a company" });
            return;
        }
        if (message === "COMPANY_EMAIL_TAKEN") {
            res.status(409).json({ success: false, message: "That company email is already in use" });
            return;
        }
        if (message === "USER_NOT_FOUND") {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }

        logger.error("Register company error:", { message });
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function login(req: Request, res: Response): Promise<void> {
    try {
        const result = await loginUser(req.body);
        res.status(200).json({ success: true, data: result });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);

        if (message === "INVALID_CREDENTIALS") {
            res.status(401).json({ success: false, message: "Invalid email or password" });
            return;
        }

        logger.error("Login error:", { message });
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
