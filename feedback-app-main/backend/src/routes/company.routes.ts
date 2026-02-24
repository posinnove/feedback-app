import { Router } from "express";
import { getAllCompanies, getCompanyBySlug } from "../controllers/company.controller.ts";
import { validateSlug } from "../middleware/slug.validation.ts";
import { resolveCompany } from "../middleware/resolve-company.ts";

const router = Router();

router.get("/", getAllCompanies);
router.get("/:slug", validateSlug, resolveCompany, getCompanyBySlug);

export default router;
