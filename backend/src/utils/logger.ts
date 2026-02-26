import winston from "winston";
import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure log directory exists
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true }); // recursive: true creates nested directories
}

const { combine, timestamp, colorize, printf, json } = winston.format;

const devFormat = combine(
    colorize({ all: true }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    printf(({ level, message, timestamp, ...meta }) => {
        const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
        return `${timestamp} [${level}]: ${message}${metaStr}`;
    })
);

const prodFormat = combine(timestamp(), json());

const logLevel = process.env.LOG_LEVEL ?? (process.env.NODE_ENV === "production" ? "info" : "debug");

// Configure transports
const transports: winston.transport[] = [
    new winston.transports.Console()
];

// File transport in production
if (process.env.NODE_ENV === "production") {
    transports.push(
        new winston.transports.File({ 
            filename: path.join(logDir, 'error.log'), 
            level: 'error',
            maxsize: 5242880, 
            maxFiles: 5,      
        }),
        new winston.transports.File({ 
            filename: path.join(logDir, 'combined.log'),
            maxsize: 5242880,
            maxFiles: 5,
        })
    );
} else if (process.env.LOG_TO_FILE === 'true') { // File logging in development for debugging
    transports.push(
        new winston.transports.File({ 
            filename: path.join(logDir, 'dev.log'),
            format: devFormat, 
        })
    );
}

const logger = winston.createLogger({
    level: logLevel,
    format: process.env.NODE_ENV === "production" ? prodFormat : devFormat,
    transports,
    exitOnError: false,
});

export default logger;