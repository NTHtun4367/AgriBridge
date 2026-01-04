import { body } from "express-validator";

export const validatePriceUpdate = [
  body("marketId").isMongoId().withMessage("Invalid Market ID").optional(),
  body("updates")
    .isArray({ min: 1 })
    .withMessage("Updates must be a non-empty array"),
  body("updates.*.cropId")
    .isMongoId()
    .withMessage("Invalid Crop ID in updates"),
  body("updates.*.price").isNumeric().withMessage("Price must be a number"),
  body("updates.*.unit").notEmpty().withMessage("Unit is required"),
];
