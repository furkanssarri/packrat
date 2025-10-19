import { Router } from "express";
import { signup } from "../controllers/authorController.js";

const authRouter = Router();

authRouter.get("/signup", signup);

export default authRouter;
