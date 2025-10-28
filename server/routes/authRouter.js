import { Router } from "express";
import { signupPost } from "../controllers/authController.js";
import validateSignup from "../validators/signupValidator.js";
import passport from "passport";

const authRouter = Router();

authRouter.post("/signup", validateSignup, signupPost);

authRouter.get("/signup", (_req, res) => {
  try {
    res.render("pages/signup", {
      title: "Sign Up || Packrat",
      errors: [],
      FormData: {},
    });
  } catch (err) {
    console.error("Error getting the signup form,", err);
    return res.status(500).send("Internal Server Error");
  }
});

authRouter.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/auth/login",
    successRedirect: "/dashboard",
  }),
);

authRouter.get("/login", (req, res) => {
  try {
    res.render("pages/login", {
      title: "Login | Packrat",
      errorMessage: [],
      formData: {},
    });
  } catch (err) {
    console.error("Error getting the login form,", err);
    res.status(500).send("Internal Server Error");
  }
});

authRouter.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

export default authRouter;
