import express, { Application, Request, Response } from "express";
import cors from "cors";
import companyFeedbackRoutes from "./routes/companyFeedback.routes";

const app: Application = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/company/feedback", companyFeedbackRoutes);

// Health check
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Server running" });
});

export default app;