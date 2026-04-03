import app from '../src/app.ts';
import { connectDb } from '../src/config/db.ts';
import logger from '../src/utils/logger.ts';

let dbReady = false;
let dbConnectPromise: Promise<void> | null = null;

async function ensureDbConnection(): Promise<void> {
  if (dbReady) return;

  if (!dbConnectPromise) {
    dbConnectPromise = connectDb()
      .then(() => {
        dbReady = true;
      })
      .catch((error: unknown) => {
        dbConnectPromise = null;
        throw error;
      });
  }

  await dbConnectPromise;
}

export default async function handler(req: any, res: any) {
  try {
    await ensureDbConnection();
    return app(req, res);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error('Serverless request failed before reaching Express app', {
      message,
    });
    res.status(500).json({ message: 'Server initialization failed' });
  }
}
