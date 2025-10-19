import express from "express";
import dotenv from "dotenv";
import expressLayouts from "express-ejs-layouts";
import methodOverride from "method-override";
import path from "path";
import authRouter from "./routes/authRouter.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(methodOverride("_method"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layout");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/auth", authRouter);

app.listen(PORT, (err) => {
  if (err) {
    console.error("There is an error with the server:", err);
  }
  console.log(`Listening the server on port ${PORT}...`);
});
