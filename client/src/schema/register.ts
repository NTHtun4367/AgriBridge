import * as z from "zod";

export const registerSchema = z
  .object({
    status: z.enum(["farmer", "merchant"]), // Important

    // STEP 1
    name: z
      .string()
      .min(3, { message: "Name must contain at least 3 characters." })
      .max(8, { message: "Name must contain maximum 8 characters." })
      .trim(),
    email: z.email().nonempty(),
    password: z
      .string()
      .min(6, { message: "Password must contain at least 6 characters." }),

    // STEP 2
    homeAddress: z.string().min(1, "Home Address is required."),
    division: z.string().min(3, "Division is required."),
    district: z.string().min(3, "District is required."),
    township: z.string().min(1, "Township is required."),

    // STEP 3 -> Merchant only
    businessName: z
      .string()
      .min(3, { message: "Name must contain at least 3 characters." })
      .max(8, { message: "Name must contain maximum 8 characters." })
      .trim()
      .optional(),
    phone: z
      .string()
      .min(9, "Phone number must contain minimum 9 characters.")
      .max(9, "Phone number must contain maximum 9 characters.")
      .optional(),

    // STEP 4 -> Merchant only
    nrcRegion: z.string().min(1, "NRC Region must select.").optional(),
    nrcTownship: z.string().min(1, "NRC Township must select.").optional(),
    nrcType: z.string().min(1, "NRC Type must select.").optional(),
    nrcNumber: z
      .string()
      .min(3, "NRC Number must be at least 3 characters.")
      .optional(),
    nrcFrontImage: z
      .object({
        file: z.instanceof(File).optional(),
        url: z.string(),
        public_alt: z.string().optional(),
      })
      .optional(),
    nrcBackImage: z
      .object({
        file: z.instanceof(File).optional(),
        url: z.string(),
        public_alt: z.string().optional(),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.status === "merchant") {
      // Step 3 requirements
      if (!data.businessName) {
        ctx.addIssue({
          code: "custom",
          message: "Business Name is required for merchants.",
          path: ["businessName"],
        });
      }

      if (!data.phone) {
        ctx.addIssue({
          code: "custom",
          message: "Phone number is required for merchants.",
          path: ["phone"],
        });
      }

      // Step 4 requirements
      const nrcKeys = [
        "nrcRegion",
        "nrcTownship",
        "nrcType",
        "nrcNumber",
      ] as const;

      nrcKeys.forEach((key) => {
        if (!data[key]) {
          ctx.addIssue({
            code: "custom",
            message: `${key} is required for merchants.`,
            path: [key],
          });
        }
      });

      if (!data.nrcFrontImage) {
        ctx.addIssue({
          code: "custom",
          message: "Front NRC image is required for merchants.",
          path: ["nrcFrontImage"],
        });
      }

      if (!data.nrcBackImage) {
        ctx.addIssue({
          code: "custom",
          message: "Back NRC image is required for merchants.",
          path: ["nrcBackImage"],
        });
      }
    }
  });

export type RegisterFormInputs = z.infer<typeof registerSchema>;
