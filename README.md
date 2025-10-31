# packrat (formerly pigeon)

Packrat is a small, simplified file-uploader / cloud-drive web application that lets users create accounts, sign in, and upload files and folders for personal cloud storage. This project is built as a learning exercise alongside The Odin Project's file uploader lesson and is intended as a minimalist, extensible foundation rather than a production-ready service.

## Table of contents

- [Demo](#demo)
- [Project overview](#project-overview)
- [Tech stack & dependencies](#tech-stack--dependencies)
- [Features](#features)
- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment variables](#environment-variables)
  - [Install and run (development)](#install-and-run-development)
  - [Database / Prisma notes](#database--prisma-notes)
- [Project structure](#project-structure)
- [License](#license)
- [Notes](#notes)

## Demo

Live demo link will be made available Soon™.

## Project overview

Packrat provides basic user authentication (signup/login), session management, and file uploads with a simple web UI rendered using EJS. The server-side is implemented with Express and uses Prisma as the ORM for database access. Uploaded files are stored using a Supabase storage backend (server/supabaseClient.js).

## Tech stack & dependencies

Core technologies:

- Node.js (LTS recommended)
- Express
- EJS (server-side templates)
- Passport (local auth)
- Prisma (ORM + migrations)
- PostgreSQL (configured via DATABASE_URL)
- Supabase storage (for uploaded files)
- express-validator for request validation

Representative dependencies (package.json style)

```json
{
  "dependencies": {
    "express": "^4.18.x",
    "ejs": "^3.1.x",
    "express-ejs-layouts": "^2.5.x",
    "dotenv": "^16.x",
    "passport": "^0.6.x",
    "passport-local": "^1.0.x",
    "express-session": "^1.17.x",
    "prisma": "^5.x",
    "@prisma/client": "^5.x",
    "prisma-session-store": "^3.x",
    "express-validator": "^6.x",
    "method-override": "^3.x",
    "@supabase/supabase-js": "^2.x",
    "multer": "^1.4.x"
  }
}
```

Note: exact versions are not included here — check `server/package.json` for the precise versions used in your environment.

## Features

- User signup and login (local, session-based)
- Session persistence using a Prisma-backed session store
- File upload and storage in Supabase storage
- Simple dashboard view for uploaded files and folders
- Validation for signup fields (server-side via express-validator)
- Prisma migrations and generated client included

## Getting started

### Prerequisites

- Node.js (LTS recommended — Node 18+ suggested)
- npm
- PostgreSQL (or any DB supported by Prisma and configured in DATABASE_URL)

### Environment variables

Create a `.env` in `server/` containing at minimum:

- DATABASE_URL - Prisma database connection string
- SECRET - session secret used by express-session (app reads process.env.SECRET)
- PORT - optional, server port (default is 5000 in app)
- SUPABASE_URL - Supabase project URL (if using Supabase storage)
- SUPABASE_KEY - Supabase service role or anon key used by the server (prefer service role for server-side uploads)

Example:

```env
DATABASE_URL="postgresql://username:password@host:port/database"
SECRET="your_session_secret_here"
PORT=3000
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_KEY="your-supabase-key"
```

> Note: README previously referenced `SESSION_SECRET`. The server currently uses `SECRET` (process.env.SECRET). Update your .env accordingly.

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

3. Generate Prisma client:

   ```bash
   npx prisma generate
   ```

4. Apply migrations (development):

   ```bash
   npx prisma migrate dev --name init
   ```

5. Start the app:

   ```bash
   npm run start
   ```

   or

   ```bash
   node app.js
   ```

### Database / Prisma notes

- Migrations are included under `server/prisma/migrations`. Review them before applying to a production database.
- The project ships with a generated Prisma client under `server/prisma/generated/prisma`.
- The app uses a Prisma-backed session store (PrismaSessionStore) for express-session — see `server/app.js` for configuration.

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
    fileController.js
    folderController.js
  db/
    prisma.js
  prisma/
    schema.prisma
    generated/
    migrations/
  routes/
    authRouter.js
    dashboardRouter.js
    fileRouter.js
    folderRouter.js
    indexRouter.js
    uploadRouter.js
  validators/
    signupValidator.js
  utils/
    folderUtils.js
    sortUtils.js
  supabaseClient.js
  views/
    layout.ejs
    pages/
      404.ejs
      dashboard.ejs
      index.ejs
      login.ejs
      signup.ejs
      folders/
        _form.ejs
        index.ejs
        show.ejs
```

## Notes

- Supabase storage integration: uploaded files are stored using Supabase. Ensure SUPABASE_URL and SUPABASE_KEY are set for server-side access.
- Sessions: a Prisma-based session store is used. The Prisma schema and migrations include session model changes.
- Validation: express-validator is used for signup/login. Be careful not to HTML-escape passwords before hashing — that alters the raw password and will break comparisons.
- Internationalization: username and password validators currently use ASCII-based checks in places — if you want to allow Turkish characters (ç, ğ, ı, İ, ö, ş, ü) or other Unicode letters, consider switching to Unicode-aware regex (e.g. `\p{L}` with the `u` flag) or explicitly including those characters in the allowed sets.

## License

This project is provided under the MIT License.

## Further work / TODO

- Harden authentication and password policies for production.
- Add rate-limiting and input sanitization consistency (avoid escaping passwords).
- Add end-to-end tests and CI configuration.
- Consider storing files in a production-ready object store (S3/GCS) or a hardened Supabase configuration.
