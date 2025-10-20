import crypto from "node:crypto";
import passport from "passport";

export const generateHash = (resPassword) => {
  const createSalt = crypto.randomBytes(31).toString("hex");
  const createHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return {
    hash: createHash,
    salt: createSalt,
  };
};

export const validatePassword = (resPassword, { password, salt }) => {
  const verifyHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return password === verifyHash;
};
