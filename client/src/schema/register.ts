import { z } from "zod";

export const registerSchema = z
  .object({
    status: z.enum(["farmer", "merchant"]),

    // Step 1
  name: z
    .string()
    .min(3, { message: "Name must contain at least 3 characters." })
    .max(8, { message: "Name must contain maximum 8 characters." })
    .trim(),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must contain at least 6 characters." }),

    // Step 2
  homeAddress: z.string().min(1, { message: "Home Address is required." }),
  division: z.string().min(1, { message: "Division is required." }),
  district: z.string().min(1, { message: "District is required." }),
  township: z.string().min(1, { message: "Township is required." }),

    // Step 3 (merchant)
  businessName: z
    .string()
    .min(1, { message: "Business must be at least 1 characters." })
    .max(15, { message: "Business name must be maximum 15 characters." })
    .trim(),
  phone: z.string().length(11, { message: "Invalid phone number." }),

    // Step 4 (merchant)
  nrcRegion: z.string().nonempty({ message: "NRC Region should not empty." }),
  nrcTownship: z
    .string()
    .nonempty({ message: "NRC Township should not empty." }),
  nrcType: z.string().nonempty({ message: "NRC Type should not empty." }),
  nrcNumber: z
    .string()
    .min(3, { message: "NRC Number must be at least 3 characters." }),
  nrcFrontImage: z
    .object({
      file: z.instanceof(File).optional(),
      url: z.string(),
      public_alt: z.string().optional(),
    })
    .nullable(),
  nrcBackImage: z
    .object({
      file: z.instanceof(File).optional(),
      url: z.string(),
      public_alt: z.string().optional(),
    })
    .nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.status === "merchant") {
      if (!data.businessName)
        ctx.addIssue({
          path: ["businessName"],
          message: "Business name required",
          code: z.ZodIssueCode.custom,
        });

      if (!data.phone)
        ctx.addIssue({
          path: ["phone"],
          message: "Phone required",
          code: z.ZodIssueCode.custom,
        });

      if (!data.nrcNumber)
        ctx.addIssue({
          path: ["nrcNumber"],
          message: "NRC number required",
          code: z.ZodIssueCode.custom,
        });

      if (!data.nrcFrontImage || !data.nrcBackImage)
        ctx.addIssue({
          path: ["nrcFrontImage"],
          message: "Both NRC images required",
          code: z.ZodIssueCode.custom,
        });
    }
  });

export type RegisterFormInputs = z.infer<typeof registerSchema>;
