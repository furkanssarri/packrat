import { Router } from "express";
import multer from "multer";
import fs from "node:fs";
import path from "node:path";

const uploadRouter = Router();
const __dirname = path.resolve();

const uploadDir = path.join(__dirname, "server/uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, rile, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

uploadRouter.post("/", upload.single("file"), (req, res, next) => {
  fs.readdir(uploadDir, (err) => {
    if (err) {
      console.error("Error reading upload directory:", err);
      return res.status(500).send("Internal Server Error");
    }
    res.render("pages/dashboard", {
      title: "Dashboard || Packrat",
      files,
    });
  });
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
