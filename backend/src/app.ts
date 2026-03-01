import express from "express";
import type { Application, Request, Response } from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.ts";
import companyRoutes from "./routes/company.routes.ts";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Server running" });
});

// Auth routes
app.use("/api/auth", authRoutes);

// Public routes
app.use("/api/companies", companyRoutes);

export default app;
