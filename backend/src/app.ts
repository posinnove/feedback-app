import express from 'express';
import type { Application, Request, Response } from 'express';
import cors from 'cors';
import companyRoutes from './routes/company.routes.ts';
import userAuthRoutes from './routes/user.auth.routes.ts';
import companyAuthRoutes from './routes/company.auth.routes.ts';
import authRoutes from './routes/auth.routes.ts';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Server running' });
});

// Unified auth routes (login, forgot/reset password, verify email, refresh token)
app.use('/api/auth', authRoutes);

// Type-specific auth routes (register + protected /me)
app.use('/api/auth/users', userAuthRoutes);
app.use('/api/auth/companies', companyAuthRoutes);

// Public company board routes
app.use('/api/companies', companyRoutes);

export default app;
