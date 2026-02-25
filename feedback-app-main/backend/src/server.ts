import { connectDb } from "./config/db.ts";
import app from "./app.ts";
import { Users } from "./models/users.model.ts";
import { Company } from "./models/company.model.ts";
import { Feedback } from "./models/feedback.model.ts";
import logger from "./utils/logger.ts";

const PORT: number = Number(process.env.PORT) || 3000;

async function startServer() {
  try {
    await connectDb();
    await Users.sync();
    await Company.sync();
    await Feedback.sync();
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
    // server is of type http.Server if you want to use it
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("Failed to start server:", { message });
    process.exit(1);
  }
}

startServer();
