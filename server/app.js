import express from "express";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import methodOverride from "method-override";
import path from "path";
import expressLayouts from "express-ejs-layouts";
import passport from "passport";
import dotenv from "dotenv";
import prisma from "./db/prisma.js";
import "./config/passport.js";

import authRouter from "./routes/authRouter.js";
import indexRouter from "./routes/indexRouter.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(methodOverride("_method"));
app.set("views", path.join(__dirname, "server/views"));
app.set("view engine", "ejs");
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

app.use("/auth", authRouter);

app.use("/", indexRouter);

app.listen(PORT, (err) => {
  if (err) {
    console.error("There is an error with the server:", err);
  }
  console.log(`Listening the server on port ${PORT}...`);
});
