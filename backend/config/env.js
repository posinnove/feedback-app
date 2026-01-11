import dotenv from "dotenv";
dotenv.config();

export const env = {
  port: Number(process.env.port),
  databaseURL: process.env.DATABASE_URL,
  nodeEnv: process.env.NODE_ENV,
}