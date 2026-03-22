import { Router } from "express";
import {
    getAllCompanies,
    getCompanyBySlug,
    getMyFeatures,
} from "../controllers/company.controller.ts";
import { validateSlug } from "../middleware/slug.validation.ts";
import { resolveCompany } from "../middleware/resolve-company.ts";
import { authenticate, requireType } from "../middleware/auth.middleware.ts";

const router = Router();

router.get("/", getAllCompanies);
router.get("/me/features", authenticate, requireType("company"), getMyFeatures);
router.get("/:slug", validateSlug, resolveCompany, getCompanyBySlug);

export default router;
