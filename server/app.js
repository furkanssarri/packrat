import express from "express";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import methodOverride from "method-override";
import fs from "node:fs/promises";
import path from "path";
import expressLayouts from "express-ejs-layouts";
import passport from "passport";
import dotenv from "dotenv";
dotenv.config();
import prisma from "./db/prisma.js";
import supabase from "./config/supabaseClient.js";
import "./config/passport.js";

import authRouter from "./routes/authRouter.js";
import indexRouter from "./routes/indexRouter.js";
import dashboardRouter from "./routes/dashboardRouter.js";
import uploadRouter from "./routes/uploadRouter.js";
import folderRouter from "./routes/folderRouter.js";
import fileRouter from "./routes/fileRouter.js";

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

// TODO: FIX THIS LATER,
// async function listAllSupabaseFiles(path = "") {
//   const allFiles = [];
//   const { data, error } = await supabase.storage
//     .from("files")
//     .list(path, { limit: 1000 });
//
//   if (error) throw error;
//
//   for (const item of data) {
//     if (item.metadata) {
//       // ✅ File entry
//       allFiles.push(path ? `${path}/${item.name}` : item.name);
//     } else {
//       // ✅ Folder entry — recurse into it
//       const subFiles = await listAllSupabaseFiles(
//         path ? `${path}/${item.name}` : item.name,
//       );
//       allFiles.push(...subFiles);
//     }
//   }
//
//   return allFiles;
// }
//
// export async function syncDatabaseFiles() {
//   try {
//     console.log("Starting Supabase sync...");
//     const dbFiles = await prisma.file.findMany();
//
//     const supabaseFiles = await listAllSupabaseFiles();
//     const supabaseFileSet = new Set(supabaseFiles);
//
//     let removedCount = 0;
//
//     for (const dbFile of dbFiles) {
//       if (!supabaseFileSet.has(dbFile.storageName)) {
//         console.warn(`Removing missing file from DB: ${dbFile.storageName}`);
//         await prisma.file.delete({ where: { id: dbFile.id } });
//         removedCount++;
//       }
//     }
//
//     console.log(
//       `✅ Sync complete! Removed ${removedCount} orphaned DB entries.`,
//     );
//   } catch (err) {
//     console.error("❌ Error syncing DB with Supabase:", err);
//   }
// }
//
// syncDatabaseFiles();
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
