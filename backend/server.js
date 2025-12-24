import {env} from "./config/env.js"
import { connectDb } from "./config/db.js"
import app from "./app.js"
import "./models/users.model.js"

const PORT = env.port || 3000

async function startServer() {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error("Failed to start server due to database connection error")
    process.exit(1)
  }
}

startServer()