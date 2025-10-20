import { Router } from "express";
import prisma from "../db/prisma.js";

const dashboardRouter = Router();

dashboardRouter.get("/", async (req, res) => {
  try {
    res.render("pages/dashboard", {
      title: "My Files | Pigeon",
      user: req.user,
      files: {},
    });
  } catch (err) {
    console.error("Error getting the dashboard,", err);
    return res.status(500).send("Internal Server Error");
  }
});

export default dashboardRouter;
