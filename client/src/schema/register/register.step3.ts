import * as z from "zod";

export const step3Schema = z.object({
  businessName: z
    .string()
    .trim()
    .min(1, { message: "Business must be at least 1 character." })
    .max(15, { message: "Business name must be maximum 15 characters." }),

  businessPhone: z.string().refine((v) => v.length === 11, {
    message: "Invalid phone number.",
  }),
});
