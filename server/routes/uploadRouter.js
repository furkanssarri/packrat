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

    const files = await prisma.file.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    const verifiedFiles = [];
    for (const file of files) {
      const fullPath = path.join(uploadDir, file.storageName);
      try {
        await fs.access(fullPath);
        verifiedFiles.push(file);
      } catch {
        console.warn(`Missing file on disk: ${file.storageName}`);
      }
    }

    res.render("pages/dashboard", {
      title: "Dashboard || Packrat",
      files: verifiedFiles,
    });
  } catch (err) {
    console.error("Error saving or retrieving files:", err);
    res.status(500).send("Internal Server Error");
  }
});

uploadRouter.get("/", (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      console.error("Error reading uploads folder:", err);
      return res.status(500).send("Internal Server Error");
    }
    res.render("pages/dashboard", {
      title: "Dashboard || Packrat",
      files: files,
    });
  });
});
export default uploadRouter;
