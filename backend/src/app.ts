import express from 'express';
import type { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import companyRoutes from './routes/company.routes.ts';
import userAuthRoutes from './routes/user.auth.routes.ts';
import companyAuthRoutes from './routes/company.auth.routes.ts';
import authRoutes from './routes/auth.routes.ts';
import { errorHandler } from './middleware/error.middleware.ts';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-7', // Settlement of `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});

const app: Application = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Server running' });
});

// Unified auth routes (login, forgot/reset password, verify email, refresh token)
app.use('/api/auth', authLimiter, authRoutes);

// Type-specific auth routes (register + protected /me)
app.use('/api/auth/users', authLimiter, userAuthRoutes);
app.use('/api/auth/companies', authLimiter, companyAuthRoutes);

// Public company board routes
app.use('/api/companies', companyRoutes);

// Error handling - MUST BE LAST
app.use(errorHandler);

export default app;
