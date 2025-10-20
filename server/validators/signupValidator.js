import { body } from "express-validator";

const validateSignup = [
  // Email
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .normalizeEmail(),

  // Username
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required.")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters long.")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores.")
    .escape(),

  // First Name (optional)
  body("firstName")
    .optional({ checkFalsy: true })
    .isLength({ max: 50 })
    .withMessage("First name cannot exceed 50 characters.")
    .trim()
    .escape(),

  // Last Name (optional)
  body("lastName")
    .optional({ checkFalsy: true })
    .isLength({ max: 50 })
    .withMessage("Last name cannot exceed 50 characters.")
    .trim()
    .escape(),

  // Password
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password cannot be empty.")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long.")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter.")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter.")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number.")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("Password must contain at least one special character.")
    .escape(),

  // Confirm Password
  body("confirmPassword")
    .notEmpty()
    .withMessage("Please confirm your password.")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match.");
      }
      return true;
    }),
];

export default validateSignup;
