import * as z from "zod";

// Regex to validate Email or Myanmar Phone Number (09...)
const emailOrPhoneRegex =
  /^(?:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|09\d{7,11})$/;

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, { message: "Email or Phone Number is required." })
    .regex(emailOrPhoneRegex, {
      message: "Please enter a valid email address or Myanmar phone number.",
    }),

  password: z
    .string()
    .min(6, { message: "Password must contain at least 6 characters." }),
});

export type LoginFormInputs = z.infer<typeof loginSchema>;
