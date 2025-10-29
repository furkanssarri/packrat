import { Router } from "express";
import {
  getAllFolders,
  getFolderContents,
  createFolder,
  updateFolder,
  deleteFolder,
} from "../controllers/folderController.js";

const folderRouter = Router();

folderRouter.get("/", getAllFolders);
folderRouter.get("/:id", getFolderContents);
folderRouter.post("/", createFolder);
folderRouter.post("/:id/edit", updateFolder);
folderRouter.post("/:id/delete", deleteFolder);

export default folderRouter;
