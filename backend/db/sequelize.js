import { Sequelize } from "sequelize"

const {
  DATABASE_URL,
  NODE_ENV,
} = process.env

const logging = NODE_ENV === "development" ? console.log : false

export const sequelize = new Sequelize(DATABASE_URL, {
      dialect: "postgres",
      logging,
    })

export async function connectDb() {
  try {
    await sequelize.authenticate()
    console.log("Connected to DB successfully")
  } catch (error) {
    console.error("Unable to connect to the database", error.message)
    throw error
  }
}
