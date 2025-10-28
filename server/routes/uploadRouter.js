import { Router } from "express";
import multer from "multer";
import path from "node:path";

const uploadRouter = Router();
const __dirname = path.resolve();
const upload = multer({ dest: path.join(__dirname, "server/uploads/") });

uploadRouter.post("/", upload.single("file"), async (req, res, next) => {
  try {
    console.log(req.file);
    const { filename, path } = await req.file;
    res.send("the image is: ", req.file.filename, "path: ", req.file.path);
  } catch (err) {
    console.error("Error writing the uploaded file,", err);
    res.status(500).send("Internal Server Error");
  }
});

export default uploadRouter;
