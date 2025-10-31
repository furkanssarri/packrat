import { Router } from "express";
import {
  deleteFile,
  editFile,
  moveFile,
} from "../controllers/fileController.js";

const fileRouter = Router();

fileRouter.post("/move", moveFile);
fileRouter.post("/:id/edit", editFile);
fileRouter.post("/:id/delete", deleteFile);

export default fileRouter;
