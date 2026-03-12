import type { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.ts';

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    // Log the error
    logger.error(`${status} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    if (status === 500) {
        logger.error(err.stack);
    }

    res.status(status).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};
