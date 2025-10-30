import { Router } from "express";
import prisma from "../db/prisma.js";
import fs from "node:fs/promises";
import { getFolderData } from "../utils/folderUtils.js";

const dashboardRouter = Router();

dashboardRouter.get("/", async (req, res) => {
  const { sort } = req.query;
  const userId = req.user.id;

  const { orderBy } = getFolderData(userId, sort);

  try {
    const data = await getFolderData({ userId, orderBy });

    res.render("pages/dashboard", {
      title: `${data.title} || Packrat`,
      folders: data.folders || [],
      files: data.files || [],
      parentFolder: data.parentFolder || null,
      currentFolder: data.currentFolder || null, // ✅ add this
      sort,
    });
  } catch (err) {
    console.error("Error getting the dashboard,", err);
    return res.status(500).send("Internal Server Error");
  }
});

export default dashboardRouter;
