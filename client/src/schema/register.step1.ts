import * as z from "zod";

export const step1Schema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Name must contain at least 3 characters." })
    .max(8, { message: "Name must contain maximum 8 characters." }),

  email: z.string().email({ message: "Please enter a valid email address." }),

  password: z
    .string()
    .min(6, { message: "Password must contain at least 6 characters." }),
});
