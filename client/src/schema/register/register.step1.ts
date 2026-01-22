import * as z from "zod";

// Regex to validate Email or Myanmar Phone Number
const emailOrPhoneRegex =
  /^(?:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|09\d{7,11})$/;

export const step1Schema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Name must contain at least 3 characters." })
    .max(20, { message: "Name must contain maximum 20 characters." }), // Increased from 8 to be more realistic

  identifier: z
    .string()
    .trim()
    .min(1, { message: "Email or Phone Number is required." })
    .regex(emailOrPhoneRegex, {
      message:
        "Please enter a valid email address or Myanmar phone number (09...).",
    }),

  password: z
    .string()
    .min(6, { message: "Password must contain at least 6 characters." }),
});
