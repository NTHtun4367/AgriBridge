import * as z from "zod";

export const announcementSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Message must be at least 10 characters"),
  target: z.enum(["All", "Farmers", "Merchants"]),
});

export type AnnouncementFormValues = z.infer<typeof announcementSchema>;
