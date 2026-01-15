import { Sequelize } from "sequelize";
import { env } from "./env";

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
  } catch (error: any) {
    console.error("Unable to connect to the database:", error.message);
    throw error;
  }
}
