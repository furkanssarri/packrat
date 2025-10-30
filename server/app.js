import express from "express";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import methodOverride from "method-override";
import fs from "node:fs/promises";
import path from "path";
import expressLayouts from "express-ejs-layouts";
import passport from "passport";
import dotenv from "dotenv";
import prisma from "./db/prisma.js";
import "./config/passport.js";

import authRouter from "./routes/authRouter.js";
import indexRouter from "./routes/indexRouter.js";
import dashboardRouter from "./routes/dashboardRouter.js";
import uploadRouter from "./routes/uploadRouter.js";
import folderRouter from "./routes/folderRouter.js";
import fileRouter from "./routes/fileRouter.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();
const uploadDir = path.join(process.cwd(), "server/uploads");

app.use(methodOverride("_method"));
app.set("views", path.join(__dirname, "server/views"));
app.set("view engine", "ejs");
app.locals.basedir = path.join(__dirname, "server/views");
app.use(expressLayouts);
app.set("layout", "layout");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
      sessionModelName: "Session",
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // ms
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// make currently-authenticated user available as `user` in all views
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.use((_req, res, next) => {
  res.locals.errors = [];
  res.locals.formData = {};
  next();
});

async function syncDatabaseFiles() {
  const dbFiles = await prisma.file.findMany();
  const diskFiles = await fs.readdir(uploadDir);

  for (const dbFile of dbFiles) {
    if (!diskFiles.includes(dbFile.storageName)) {
      console.warn(`Removing missing file from DB: ${dbFile.storageName}`);
      await prisma.file.delete({ where: { id: dbFile.id } });
    }
  }
}
syncDatabaseFiles();
app.use("/uploads", express.static(path.join(__dirname, "server/uploads")));

app.use("/auth", authRouter);
app.use("/dashboard", dashboardRouter);
app.use("/upload", uploadRouter);
app.use("/folders", folderRouter);
app.use("/files", fileRouter);

app.use("/", indexRouter);

app.listen(PORT, (err) => {
  if (err) {
    console.error("There is an error with the server:", err);
  }
  console.log(`Listening the server on port ${PORT}...`);
});
