# TempNest Setup Guide

## Backend (API)

1. Navigate to the api directory:
   ```
   cd api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up Prisma:
   ```
   npx prisma init
   ```

4. Update your schema in `prisma/schema.prisma`, then run:
   ```
   npx prisma migrate dev --name init
   ```

5. Start the server:
   ```
   npm run dev
   ```

## Frontend (Client)

1. Navigate to the client directory:
   ```
   cd client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the dev server:
   ```
   npm run dev
   ```

## Notes

- Requires Node.js and npm.
- Uses SQLite for simplicity in local development.
- Authentication uses JWT with cookie storage.
