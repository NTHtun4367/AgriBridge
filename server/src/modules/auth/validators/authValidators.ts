import { body } from "express-validator";

// Email OR Myanmar phone
export const identifierChain = body("identifier")
  .notEmpty()
  .withMessage("Email or Phone is required.")
  .custom((value) => {
    const isEmail = /^\S+@\S+\.\S+$/.test(value);
    const isPhone = /^(09|\+959)\d{7,9}$/.test(value);

    if (!isEmail && !isPhone) {
      throw new Error("Please provide a valid email or Myanmar phone number.");
    }
    return true;
  });

export const registerFarmerValidator = [
  body("name").notEmpty().withMessage("Name is required."),
  identifierChain,
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters."),
  body("homeAddress").notEmpty().withMessage("Home Address is required."),
  body("division").notEmpty().withMessage("Division is required."),
  body("district").notEmpty().withMessage("District is required."),
  body("township").notEmpty().withMessage("Township is required."),
];

export const registerMerchantValidator = [
  ...registerFarmerValidator,
  body("businessName").notEmpty().withMessage("Business name is required."),
  body("phone").notEmpty().withMessage("Business phone is required."),
  body("nrcRegion").notEmpty().withMessage("NRC Region is required."),
  body("nrcTownship").notEmpty().withMessage("NRC Township is required."),
  body("nrcType").notEmpty().withMessage("NRC Type is required."),
  body("nrcNumber").notEmpty().withMessage("NRC Number is required."),
];

export const loginValidator = [
  identifierChain,
  body("password").notEmpty().withMessage("Password is required."),
];

export const verifyOtpValidator = [
  body("identifier")
    .notEmpty()
    .withMessage("Email or Phone identifier is required"),
  body("otp")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be exactly 6 digits"),
];

export const resendOtpValidator = [
  body("identifier").notEmpty().withMessage("Identifier is required"),
];
