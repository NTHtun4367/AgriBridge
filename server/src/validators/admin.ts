import { body, param } from "express-validator";

export const userIdValidator = [
  param("userId").isMongoId().withMessage("Invalid user id."),
];

export const userStatusValidator = [
  body("status").isIn(["active", "ban"]).withMessage("Invalid user status."),
];
