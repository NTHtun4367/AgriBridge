import { model, Schema, Types } from "mongoose";

interface IUserNotification extends Document {
  userId: Types.ObjectId;
  notificationId: Types.ObjectId;
  isRead: boolean;
  isDeleted: boolean;
}

const userNotificationSchema = new Schema<IUserNotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    notificationId: {
      type: Schema.Types.ObjectId,
      ref: "Notification",
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userNotificationSchema.index({ userId: 1, isDeleted: 1 });

export const UserNotification = model<IUserNotification>(
  "UserNotification",
  userNotificationSchema
);
