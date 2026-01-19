import { model, Schema, Types, Document } from "mongoose";

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  target: string;
  adminId?: Types.ObjectId;
}

const announcementSchema = new Schema<IAnnouncement>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    target: { type: String, required: true },
    adminId: { type: Schema.Types.ObjectId },
  },
  { timestamps: true },
);

export const Announcement = model<IAnnouncement>(
  "Announcement",
  announcementSchema,
);
