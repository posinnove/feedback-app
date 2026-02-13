import type { Request, Response } from "express";
import { findCompanyBySlug } from "../services/company.service.ts";

export async function getCompanyBySlug(req: Request, res: Response) {
    try {
        const slug = req.params.slug as string;
        const company = await findCompanyBySlug(slug);

        if (!company) {
            res.status(404).json({ message: "Company not found" });
            return;
        }

        res.json(company);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Error fetching company:", message);
        res.status(500).json({ message: "Internal server error" });
    }
}
