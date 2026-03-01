import type { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

// Shared error formatter
function handleValidationErrors(req: Request, res: Response, next: NextFunction): void {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ success: false, errors: errors.array() });
        return;
    }
    next();
}

// Register validation
export const validateRegister = [
    body("userName")
        .trim()
        .notEmpty().withMessage("Username is required")
        .isLength({ min: 3, max: 30 }).withMessage("Username must be 3–30 characters")
        .matches(/^[a-zA-Z0-9_]+$/).withMessage("Username can only contain letters, numbers, and underscores"),

    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Must be a valid email address")
        .normalizeEmail(),

    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
        .matches(/[0-9]/).withMessage("Password must contain at least one number")
        .matches(/[^a-zA-Z0-9]/).withMessage("Password must contain at least one special character"),

    body("accountType")
        .notEmpty().withMessage("Account type is required")
        .isIn(["admin", "company", "user"]).withMessage("Account type must be admin, company, or user"),

    handleValidationErrors,
];

// Register company validation (used on the protected /register-company route)
export const validateRegisterCompany = [
    body("companyName")
        .trim()
        .notEmpty().withMessage("Company name is required")
        .isLength({ min: 2, max: 100 }).withMessage("Company name must be 2–100 characters"),

    body("companyEmail")
        .trim()
        .notEmpty().withMessage("Company email is required")
        .isEmail().withMessage("Company email must be a valid email address")
        .normalizeEmail(),

    handleValidationErrors,
];

// Login validation
export const validateLogin = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Must be a valid email address")
        .normalizeEmail(),

    body("password")
        .notEmpty().withMessage("Password is required"),

    handleValidationErrors,
];
