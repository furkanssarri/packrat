import { Router } from "express";
import multer from "multer";
import fs from "node:fs/promises";
import path from "node:path";
import prisma from "../db/prisma.js";

const uploadRouter = Router();

const uploadDir = path.join(process.cwd(), "server/uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

uploadRouter.post("/", upload.single("file"), async (req, res, next) => {
  try {
    const { originalname, filename, size, mimetype } = req.file;
    const { sort } = req.body;
    await prisma.file.create({
      data: {
        name: originalname,
        storageName: filename,
        size,
        type: mimetype,
        path: `/uploads/${filename}`,
        userId: req.user.id,
      },
    });

    if (sort) {
      res.redirect(`/dashboard?sort=${encodeURIComponent(sort)}`);
    } else {
      res.redirect("/dashboard");
    }
  } catch (err) {
    console.error("Error saving or retrieving files:", err);
    res.status(500).send("Internal Server Error");
  }
});

export default uploadRouter;
