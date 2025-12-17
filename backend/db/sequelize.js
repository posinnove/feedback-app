import { Sequelize } from "sequelize"

export const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');

export async function connectDb() {
  await sequelize.authenticate()
}
