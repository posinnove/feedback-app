import { Router } from "express";
import { register, registerCompany, login } from "../controllers/auth.controller.ts";
import {
    validateRegister,
    validateRegisterCompany,
    validateLogin,
} from "../middleware/auth.validation.ts";
import { authenticate } from "../middleware/authenticate.ts";
import { authLimiter } from "../middleware/rate-limit.ts";

const router = Router();

// POST /api/auth/register — creates a User record only (no company)
router.post("/register", authLimiter, validateRegister, register);

// POST /api/auth/register-company — protected; creates Company + updates accountType + issues fresh JWT
// Works both at signup (if accountType was 'company') and later from a settings page
router.post("/register-company", authLimiter, authenticate, validateRegisterCompany, registerCompany);

// POST /api/auth/login
router.post("/login", authLimiter, validateLogin, login);

export default router;
