import { env } from "./config/env";
import { connectDb } from "./config/db";
import app from "./app";
import { Users } from "./models/users.model";



const PORT: number = Number(env.port) || 3000;

async function startServer() {
  try {
    await connectDb();
    await Users.sync(); 
    const server = app.listen(PORT, () => { // optional: type inferred
      console.log(`Server running on port ${PORT}`);
    });
    // server is of type http.Server if you want to use it
  } catch (error: any) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
