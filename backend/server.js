import express from "express"
import dotenv from "dotenv"
import cors from "cors"

import { connectDb } from "./db/sequelize.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.json({ message: "Server running" })
})

const PORT = process.env.PORT || 3000

async function start() {
  try {
    await connectDb()
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error("Failed to start server due to database connection error")
    process.exit(1)
  }
}

start()
