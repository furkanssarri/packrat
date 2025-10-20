import { Router } from "express";

const indexRouter = Router();

indexRouter.get("/", (req, res) => {
  try {
    res.render("pages/index", {
      title: "Home | Pigeon",
    });
  } catch (err) {
    console.error("Error getting index page,", err);
    res.status(500).send("Internal Server Error.");
  }
});

export default indexRouter;
