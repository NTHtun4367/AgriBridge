import { model, Schema } from "mongoose";

interface INotification extends Document {
  title: string;
  message: string;
  targetRole: "all" | "farmer" | "merchant";
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    targetRole: {
      type: String,
      enum: ["all", "farmer", "merchant"],
    },
  },
  { timestamps: true }
);

export const Notification = model<INotification>(
  "Notification",
  notificationSchema
);
