import * as z from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must contain at least 3 characters." })
    .max(8, { message: "Name must contain maximum 8 characters." })
    .trim(),
  email: z.email().nonempty(),
  password: z
    .string()
    .min(6, { message: "Password must contain at least 6 characters." }),
});

export type RegisterFormInputs = z.infer<typeof registerSchema>;
