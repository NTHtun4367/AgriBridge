import { body } from "express-validator";

export const entryValidator = [
  body("date").isISO8601().withMessage("Valid ISO date is required"),
  body("category")
    .notEmpty()
    .isIn([
      "seeds",
      "fertilizer",
      "pesticide",
      "labor",
      "machinery",
      "transport",
      "other",
    ])
    .withMessage("Invalid category"),
  body("value")
    .isNumeric()
    .withMessage("Value must be a number")
    .custom((val) => Number(val) > 0)
    .withMessage("Value must be greater than 0"),
  body("quantity")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage("Quantity must be a number"),
  body("unit").optional().isString().trim(),
  body("notes").optional().isString().trim(),
];
