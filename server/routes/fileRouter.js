import { Router } from "express";
import { moveFile } from "../controllers/fileController.js";

const fileRouter = Router();

fileRouter.post("/move", moveFile);

export default fileRouter;
