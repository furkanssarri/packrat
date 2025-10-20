import crypto from "node:crypto";
import passport from "passport";

export const generateHash = (resPassword) => {
  const salt = crypto.randomBytes(31).toString("hex");
  const hash = crypto
    .pbkdf2Sync(resPassword, salt, 10000, 64, "sha512")
    .toString("hex");

  return {
    hash,
    salt,
  };
};

export const validatePassword = (resPassword, { password, salt }) => {
  const verifyHash = crypto
    .pbkdf2Sync(resPassword, salt, 10000, 64, "sha512")
    .toString("hex");
  return password === verifyHash;
};
