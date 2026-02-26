import * as dotenv from "dotenv";
dotenv.config();

export const env = {
  port: Number(process.env.PORT ?? 3000),
  databaseURL: process.env.DATABASE_URL as string,
  nodeEnv: process.env.NODE_ENV ?? "development",
};
