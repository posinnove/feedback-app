# Backend Setup

## Prerequisites
- Node.js 18+
- PostgreSQL 13+

## Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and adjust the values:
   ```bash
   cp .env.example .env
   ```
   Provide either a `DATABASE_URL` or the individual `DB_*` values for your Postgres instance.

## Running the server
```bash
npm run dev
```
The server will attempt to connect to PostgreSQL before starting. On success it will listen on the port defined by `PORT` (defaults to `3000`).

## Troubleshooting
- Ensure the database credentials in `.env` are correct and the database is reachable.
- Set `DB_LOGGING=true` to see Sequelize SQL logs when debugging locally.
