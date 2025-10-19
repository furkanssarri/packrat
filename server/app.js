import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (_req, res) => {
  res.send("Hello, world");
});

app.listen(PORT, (err) => {
  if (err) {
    console.error("There is an error with the server:", err);
  }
  console.log(`Listening the server on port ${PORT}...`);
});
