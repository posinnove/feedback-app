import "./config/env";
import { connectDb } from "./config/db";
import app from "./app";
import { Users } from "./models/users.model";
import { Feedback } from "./models/feedback.model";
import { FeedbackReply } from "./models/feedbackReply.model";
import express from "express";
import path from "path";

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  try {
    await connectDb();

    // Ensure tables exist (safe even if they already exist)
    await Users.sync();
    await Feedback.sync();
    await FeedbackReply.sync();
  
    app.use("/uploads", express.static(path.join(__dirname, "uploads")));
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error: any) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();