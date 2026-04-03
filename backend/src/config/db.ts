import 'dotenv/config';
import { Sequelize } from 'sequelize';
import pg from 'pg';
import logger from '../utils/logger.ts';

const logging =
  process.env.NODE_ENV === 'development'
    ? (sql: string) => logger.debug(sql)
    : false;

export const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
  dialect: 'postgres',
  dialectModule: pg,
  logging,
  pool: {
    max: 3,
    min: 0,
    idle: 10_000,
    acquire: 30_000,
  },
});

export async function connectDb() {
  try {
    await sequelize.authenticate();
    logger.info('Connected to DB successfully [VOXELA]');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error('Unable to connect to the database:', { message });
    throw error;
  }
}
