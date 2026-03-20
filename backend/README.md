# Backend Setup

## Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and adjust the values:
   ```bash
   copy .env.example .env
   ```

## Running the server
```bash
npm run dev
```

## Database Management
We use Sequelize migrations to manage the schema.
```bash
# Run migrations
npx sequelize-cli db:migrate

# Rollback
npx sequelize-cli db:migrate:undo
```

## Security & Validation
- **Zod**: Input validation for all routes.
- **Rate Limiting**: Brute-force protection on auth routes.
- **Cookies**: HttpOnly refresh tokens for secure persistence.

## Troubleshooting
- Make sure you have PostgreSQL installed in your computer 

   postgresql host server: https://www.postgresql.org/download/ <br/>
   pgAdmin: https://www.pgadmin.org/download/

