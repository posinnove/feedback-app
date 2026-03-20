import 'dotenv/config';
import logger from '../../src/utils/logger.ts';

const config = {
    development: {
        url: process.env.DATABASE_URL,
        dialect: 'postgres' as const,
        logging: (sql: string) => logger.debug(sql),
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
    },
    test: {
        url: process.env.DATABASE_URL,
        dialect: 'postgres' as const,
        logging: false as const,
    },
    production: {
        url: process.env.DATABASE_URL,
        dialect: 'postgres' as const,
        logging: false as const,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
    },
};

export default config;
