import { Notification } from "../models/notification";
import { UserNotification } from "../models/userNotification";
import { Types } from "mongoose";

export class NotificationService {
  /**
   * Creates a master notification and links it to specific users.
   * @param title - The header of the notification
   * @param message - The body text
   * @param userIds - Array of User ObjectIds (as strings)
   * @param role - Who this is intended for (defaults to "all")
   */
  async createNotification(
    title: string,
    message: string,
    userIds: string[],
    role: "all" | "farmer" | "merchant" = "all"
  ) {
    // 1. Create the master notification content record
    const notification = await Notification.create({
      title,
      message,
      targetRole: role,
    });

    // 2. Prepare the link records for each individual user
    const userLinks = userIds.map((id) => ({
      userId: new Types.ObjectId(id),
      notificationId: notification._id,
      isRead: false,
      isDeleted: false,
    }));

    // 3. Bulk insert for performance
    return await UserNotification.insertMany(userLinks);
  }

  /**
   * Fetches the specific notification inbox for a user
   */
  async getMyNotifications(userId: string) {
    return await UserNotification.find({
      userId: new Types.ObjectId(userId),
      isDeleted: false,
    })
      .populate("notificationId") // Merges the title and message from the Notification model
      .sort({ createdAt: -1 });
  }

  /**
   * Marks a specific notification as read for a user
   */
  async markAsRead(userId: string, notificationId: string) {
    return await UserNotification.findOneAndUpdate(
      {
        userId: new Types.ObjectId(userId),
        notificationId: new Types.ObjectId(notificationId),
      },
      { isRead: true },
      { new: true }
    );
  }

  /**
   * Soft deletes a notification from the user's view
   */
  async deleteNotification(userId: string, notificationId: string) {
    return await UserNotification.findOneAndUpdate(
      {
        userId: new Types.ObjectId(userId),
        notificationId: new Types.ObjectId(notificationId),
      },
      { isDeleted: true },
      { new: true }
    );
  }

  /**
   * Optional: Marks all notifications as read for a user
   */
  async markAllAsRead(userId: string) {
    return await UserNotification.updateMany(
      { userId: new Types.ObjectId(userId), isRead: false },
      { isRead: true }
    );
  }
}

export const notificationService = new NotificationService();
