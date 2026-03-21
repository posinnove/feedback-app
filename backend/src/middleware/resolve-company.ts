import type { Request, Response, NextFunction } from 'express';
import { findCompanyBySlug as findCompanyBySlugService } from '../services/company.service.ts';
import logger from '../utils/logger.ts';

/**
 * Resolves a company by slug and attaches it to res.locals.company.
 * Short-circuits with 404 if no matching company is found.
 * Must run after validateSlug.
 */
export async function resolveCompany(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const slug = req.params.slug as string;
    const company = await findCompanyBySlugService(slug, req.auth);

    if (!company) {
      res.status(404).json({ message: 'Company not found' });
      return;
    }

    res.locals.company = company;
    next();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error('Error resolving company:', { message });
    res.status(500).json({ message: 'Internal server error' });
  }
}
