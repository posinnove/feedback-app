import { Request, Response, NextFunction } from 'express';
import { param, validationResult } from 'express-validator';

export const validateSlug = [
    // Validate slug parameter
    param('slug')
        .notEmpty().withMessage('Slug is required')
        .isString().withMessage('Slug must be a string')
        .matches(/^[a-z0-9-]+$/).withMessage('Slug can only contain lowercase letters, numbers, and hyphens')
        .isLength({ min: 3, max: 100 }).withMessage('Slug must be between 3 and 100 characters'),

    // Check validation results
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }
        next();
    },
];
