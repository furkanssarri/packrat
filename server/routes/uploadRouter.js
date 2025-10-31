import { Router } from "express";
import multer from "multer";
import prisma from "../db/prisma.js";
import supabase from "../config/supabaseClient.js";

const uploadRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });

uploadRouter.post("/", upload.single("file"), async (req, res, next) => {
  const { file } = req;
  const { originalname, filename, size, mimetype } = req.file;
  const { sort, parentId } = req.body;
  const userId = req.user.id;

  console.log(file);
  if (!file) return res.status(400).send("No file uploaded.");

  const filePath = `${userId}/${Date.now()}_${originalname}`;

  try {
    const { error } = await supabase.storage
      .from("files") // bucket name
      .upload(filePath, req.file.buffer, {
        contentType: mimetype,
        upsert: false,
      });

    if (error) throw error;

    // Get a public URL for the uploaded file
    const {
      data: { publicUrl },
    } = supabase.storage.from("files").getPublicUrl(filePath);

    await prisma.file.create({
      data: {
        name: file.originalname,
        storageName: filePath,
        type: file.mimetype,
        size: file.size,
        // path: `/uploads/${filename}`, // pre-supabase path
        path: filePath,
        url: publicUrl,
        user: { connect: { id: userId } },
        ...(parentId ? { folder: { connect: { id: parentId } } } : {}),
      },
    });

    // after prisma.file.create(...)
    const targetFolder = parentId
      ? `/folders/${encodeURIComponent(parentId)}`
      : "/dashboard";

    // preserve sort query if presen
    const sortQuery = sort ? `?sort=${encodeURIComponent(sort)}` : "";
    return res.redirect(`${targetFolder}${sortQuery}`);
  } catch (err) {
    console.error("Error uploading the file:", err);
    res.status(500).send("Error uploading the file.");
  }
});

export default uploadRouter;
