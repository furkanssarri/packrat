import { Router } from "express";
import { uploadSingleFile } from "../controllers/uploadController.js";
import multer from "multer";

const uploadRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });

uploadRouter.post("/", upload.single("file"), uploadSingleFile);

export default uploadRouter;
