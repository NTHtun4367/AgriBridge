import * as z from "zod";
import { step1Schema } from "./register.step1";
import { step2Schema } from "./register.step2";
import { step3Schema } from "./register.step3";
import { step4Schema } from "./register.step4";

export const registerSchema = z.discriminatedUnion("role", [
  z
    .object({
      role: z.literal("farmer"),
    })
    .merge(step1Schema)
    .merge(step2Schema),

  z
    .object({
      role: z.literal("merchant"),
    })
    .merge(step1Schema)
    .merge(step2Schema)
    .merge(step3Schema)
    .merge(step4Schema),
]).superRefine((data, ctx) => {
  if (data.role === "merchant") {
    if (!data.nrcFrontImage)
      ctx.addIssue({
        path: ["nrcFrontImage"],
        code: z.ZodIssueCode.custom,
        message: "Front NRC image is required.",
      });
    if (!data.nrcBackImage)
      ctx.addIssue({
        path: ["nrcBackImage"],
        code: z.ZodIssueCode.custom,
        message: "Back NRC image is required.",
      });
  }
});

export type RegisterFormInputs = z.infer<typeof registerSchema>;
