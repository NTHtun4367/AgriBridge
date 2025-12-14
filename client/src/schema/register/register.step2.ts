import * as z from "zod";

export const step2Schema = z.object({
  homeAddress: z.string().min(1, { message: "Home Address is required." }),
  division: z.string().min(1, { message: "Division is required." }),
  district: z.string().min(1, { message: "District is required." }),
  township: z.string().min(1, { message: "Township is required." }),
});
