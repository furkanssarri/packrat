import { validationResult } from "express-validator";
import prisma from "../db/prisma.js";
import { generateHash } from "./passwordUtils.js";

export const signupPost = async (req, res) => {
  const { email, username, firstName, lastName, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).render("pages/signup", {
      title: "Sign Up | Packrat",
      errors: errors.array(),
      formData: req.body,
    });
  }
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });
    if (existingUser) {
      return res.status(400).render("pages/signup", {
        title: "Sign Up | Packrat",
        errors: [{ msg: "Email or username already exists." }],
        formData: req.body,
      });
    }
    const { hash, salt } = generateHash(password);

    await prisma.user.create({
      data: {
        email,
        username,
        firstName: firstName || null,
        lastName: lastName || null,
        password: hash,
        salt,
      },
    });

    res.redirect("/auth/login");
  } catch (err) {
    console.error("Error in auth controller.", err);
    res.status(500).send("Internal Server Error");
  }
};
