import { Router } from "express";
import prisma from "../db/prisma.js";
import fs from "node:fs/promises";

const dashboardRouter = Router();

dashboardRouter.get("/", async (req, res) => {
  try {
    const files = await prisma.file.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    res.render("pages/dashboard", {
      title: "My Files | Packrat",
      user: req.user,
      files,
    });
  } catch (err) {
    console.error("Error getting the dashboard,", err);
    return res.status(500).send("Internal Server Error");
  }
});

export default dashboardRouter;
