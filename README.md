# packrat (formerly pigeon)

Packrat is a small, simplified file-uploader / cloud-drive web application that lets users create accounts, sign in, and upload files and folders for personal cloud storage. This project is built as a learning exercise alongside The Odin Project's file uploader lesson and is intended as a minimalist, extensible foundation rather than a production-ready service.

## Table of contents

- [Demo](#demo)
- [Project overview](#project-overview)
- [Tech stack](#tech-stack)
- [Features](#features)
- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Install and run (development)](#install-and-run-development)
  - [Database / Prisma notes](#database--prisma-notes)
- [Project structure](#project-structure)
- [License](#license)
- [Notes](#notes)

## Demo

Live demo link will be made available Soon™.

## Project overview

Packrat provides basic user authentication (signup/login), session management, and file uploads with a simple web UI rendered using EJS. The server-side is implemented with Express and uses Prisma as the ORM for database access. Uploaded files are stored on supabase storage platform for this simplified implementation.

## Tech stack

- Node.js (recommended LTS)
- Express
- EJS (server-side templates)
- Passport (authentication)
- Prisma (ORM + migrations)
- PostgreSQL (configured via DATABASE_URL)
- npm for package management

## Features

- User signup and login
- Session-based local authentication
- File upload and basic file storage on the cloud storage
- Simple dashboard view for uploaded files
- Validation for signup fields

## Getting started

### Prerequisites

- Node.js (LTS recommended — Node 18+ suggested)
- npm
- (Optional) Git
- A database supported by Prisma (this app uses PostgreSQL)

### Install and run (development)

From the project root:

1. Navigate to the server directory:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` at `server/.env` directory. At minimum include:

   ```bash
   DATABASE_URL="postgresql://username:password@host:port/database"   # for PostgreSQL (example)
   SESSION_SECRET="your_session_secret_here"
   PORT=3000
   ```

4. Generate Prisma client:

   ```bash
   npx prisma generate
   ```

5. Apply migrations (development):

   ```bash
   npx prisma migrate dev --name init
   ```

6. Start the app:

     ```bash
     npm run start 
     ```

### Database / Prisma notes

- Migrations are included under `server/prisma/migrations`. Review them before applying to a production database.
- The project ships with a generated Prisma client configured in `server/prisma/generated/prisma`.
- If switching DB providers, update `schema.prisma` and `DATABASE_URL` then run `npx prisma migrate dev` (for local development).

## Project structure

Root:

```txt
README.md
server/
  app.js
  config/
    passport.js
  controllers/
    authController.js
    passwordUtils.js
  db/
    prisma.js
  prisma/
    schema.prisma
    generated/
      prisma/
        client.js
        client.d.ts
        ...
    migrations/
  routes/
    authRouter.js
    dashboardRouter.js
    indexRouter.js
    uploadRouter.js
  validators/
    signupValidator.js
  views/
    layout.ejs
    pages/
      404.ejs
      dashboard.ejs
      index.ejs
      login.ejs
      signup.ejs
```

Notes:

- Server-side code lives in `server/` — run commands from that folder unless otherwise noted.

## License

This project is provided under the MIT License. Add a `LICENSE`.

## Notes

- This implementation is intentionally minimal and educational. For production use consider:
  - Storing files in durable object storage (S3, GCS, etc.)
  - Hardened authentication and password policies
  - Input sanitization and rate limiting
  - Secure session and cookie handling
  - Proper secrets management and environment handling
