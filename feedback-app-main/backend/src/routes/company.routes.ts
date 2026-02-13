import { Router } from "express";
import { getCompanyBySlug } from "../controllers/company.controller.ts";

const router = Router();

// Public endpoint — no auth required
router.get("/:slug", getCompanyBySlug);

export default router;
