import { Sequelize } from "sequelize";
import { env } from "./env.ts";

const logging = env.nodeEnv === "development" ? console.log : false;

export const sequelize = new Sequelize(env.databaseURL, {
  dialect: "postgres",
  logging,
});

export async function connectDb() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Connected to DB successfully [VOXELA]");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Unable to connect to the database:", message);
    throw error;
  }
}
