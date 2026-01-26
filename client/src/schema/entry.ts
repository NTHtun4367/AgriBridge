import * as z from "zod";

export const entrySchema = z.object({
  date: z.date(),
  type: z.string(),
  category: z.string().min(1, "Category is required."),
  season: z.string().min(1, "Season is required.").optional(), // Added
  quantity: z.string().optional(),
  unit: z.string().optional(),
  value: z.string().min(1, "Value/Amount is required."),
  notes: z.string().optional(),
  // For file uploads, we expect a File object or null
  billImage: z.instanceof(File).optional().nullable(),
});

export type EntryFormValues = z.infer<typeof entrySchema>;
