import { connectDb } from './config/db.ts';
import app from './app.ts';
import logger from './utils/logger.ts';

const PORT: number = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

async function startServer() {
  try {
    await connectDb();
    app.listen(PORT, HOST, () => {
      logger.info(`Server running on ${HOST}:${PORT}`);
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error('Failed to start server:', { message });
    process.exit(1);
  }
}

startServer();
