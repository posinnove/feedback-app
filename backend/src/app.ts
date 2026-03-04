import express from 'express';
import type { Application, Request, Response } from 'express';
import cors from 'cors';
import companyRoutes from './routes/company.routes.ts';
import userAuthRoutes from './routes/user.auth.routes.ts';
import companyAuthRoutes from './routes/company.auth.routes.ts';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Server running' });
});

// Auth routes
app.use('/api/auth/users', userAuthRoutes);
app.use('/api/auth/companies', companyAuthRoutes);

// Public company board routes
app.use('/api/companies', companyRoutes);

export default app;
