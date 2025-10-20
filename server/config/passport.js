import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import prisma from "../db/prisma.js";
import { validatePassword } from "../controllers/passwordUtils.js";

const verifyCallback = async (username, password, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (!user)
      return done(null, false, { message: "Incorrect username or pasword." });

    const isValidPassword = validatePassword(password, user);
    if (!isValidPassword)
      return done(null, false, { message: "Incorrect username or password." });
    done(null, user);
  } catch (err) {
    return done(err);
  }
};

const strategy = new LocalStrategy(verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
});
