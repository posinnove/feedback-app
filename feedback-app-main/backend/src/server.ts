import { env } from "./config/env.ts";
import { connectDb } from "./config/db.ts";
import app from "./app.ts";
import { Users } from "./models/users.model.ts";
import { Company } from "./models/company.model.ts";
import { Feedback } from "./models/feedback.model.ts";

const PORT: number = Number(env.port) || 3000;

async function startServer() {
  try {
    await connectDb();
    await Users.sync();
    await Company.sync();
    await Feedback.sync();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    // server is of type http.Server if you want to use it
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Failed to start server:", message);
    process.exit(1);
  }
}

startServer();
