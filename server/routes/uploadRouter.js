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
  const { originalname, filename, size, mimetype } = req.file;
  const { sort, parentId } = req.body;
  const userId = req.user.id;

  try {
    await prisma.file.create({
      data: {
        name: originalname,
        storageName: filename,
        type: mimetype,
        size,
        path: `/uploads/${filename}`,
        user: { connect: { id: userId } },
        ...(parentId ? { folder: { connect: { id: parentId } } } : {}),
      },
    });

    // after prisma.file.create(...)
    const targetFolder = parentId
      ? `/folders/${encodeURIComponent(parentId)}`
      : null;

    if (targetFolder) {
      // preserve sort query if present
      const sortQuery = sort ? `?sort=${encodeURIComponent(sort)}` : "";
      return res.redirect(`${targetFolder}${sortQuery}`);
    }

    if (sort) {
      return res.redirect(`/dashboard?sort=${encodeURIComponent(sort)}`);
    }

    return res.redirect("/dashboard");
  } catch (err) {
    console.error("Error saving or retrieving files:", err);
    res.status(500).send("Internal Server Error");
  }
});

export default uploadRouter;
