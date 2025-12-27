import { body } from "express-validator";

export const registerFarmerValidator = [
  body("name").notEmpty().withMessage("Name is required."),
  body("email").isEmail().withMessage("Invalid email address."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters."),
  body("homeAddress").notEmpty().withMessage("Home Address is required."),
  body("division").notEmpty().withMessage("Division is required."),
  body("district").notEmpty().withMessage("Township is required."),
];

export const loginValidator = [
  body("email").isEmail().withMessage("Invalid email address."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters."),
];
