import type { Request, Response } from "express";
import { getAllCompanies as getAllCompaniesService } from "../services/company.service.ts";
import logger from "../utils/logger.ts";

export async function getAllCompanies(_req: Request, res: Response) {
    try {
        const companies = await getAllCompaniesService();
        res.json(companies);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        logger.error("Error fetching companies:", { message });
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getCompanyBySlug(_req: Request, res: Response) {
    res.json(res.locals.company);
}
