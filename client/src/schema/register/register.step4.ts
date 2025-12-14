import * as z from "zod";

export const step4Schema = z.object({
  nrcRegion: z.string().min(1, "NRC Region should not empty."),
  nrcTownship: z.string().min(1, "NRC Township should not empty."),
  nrcType: z.string().min(1, "NRC Type should not empty."),

  nrcNumber: z.string().min(3, "NRC Number must be at least 3 characters."),

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
});
