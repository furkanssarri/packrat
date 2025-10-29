import { Router } from "express";
import prisma from "../db/prisma.js";
import fs from "node:fs/promises";

const dashboardRouter = Router();

dashboardRouter.get("/", async (req, res) => {
  try {
    const { sort } = req.query;

    let orderBy = { createdAt: "desc" }; //default sorting

    switch (sort) {
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "size-desc":
        orderBy = { size: "desc" };
        break;
      case "size-asc":
        orderBy = { size: "asc" };
        break;
      case "type":
        orderBy = { type: "asc" };
        break;
      case "name":
        orderBy = { name: "asc" };
        break;
    }
    const files = await prisma.file.findMany({
      where: { userId: req.user.id },
      orderBy,
    });

    res.render("pages/dashboard", {
      title: "My Files | Packrat",
      user: req.user,
      files,
      sort,
    });
  } catch (err) {
    console.error("Error getting the dashboard,", err);
    return res.status(500).send("Internal Server Error");
  }
});

export default dashboardRouter;
