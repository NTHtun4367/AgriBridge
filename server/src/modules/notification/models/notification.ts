import { model, Schema, Document } from "mongoose";

export interface INotification extends Document {
  title: string;
  message: string;
  targetRole: "all" | "farmer" | "merchant";
}

const notificationSchema = new Schema<INotification>(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    targetRole: {
      type: String,
      enum: ["all", "farmer", "merchant"],
      required: true,
    },
  },
  { timestamps: true },
);

export const Notification = model<INotification>(
  "Notification",
  notificationSchema,
);
