import type { Request, Response } from 'express';
import { advancedSearch } from '../services/search.service.ts';
import logger from '../utils/logger.ts';

export async function search(req: Request, res: Response) {
  try {
    const query = typeof req.query.q === 'string' ? req.query.q : '';
    const results = await advancedSearch(query);
    res.json(results);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error('Error performing search:', { message });
    res.status(500).json({ message: 'Internal server error' });
  }
}
