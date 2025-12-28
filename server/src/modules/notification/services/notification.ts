import { Notification } from "../models/notification";
import { UserNotification } from "../models/userNotification";

export class NotificationService {
  // Creates a master notification and links it to specific users
  async createNotification(title: string, message: string, userIds: string[]) {
    const notification = await Notification.create({
      title,
      message,
      targetRole: "all", // Defaulting to all, can be dynamic
    });

    const userLinks = userIds.map((id) => ({
      userId: id,
      notificationId: notification._id,
      isRead: false,
      isDeleted: false,
    }));

    return await UserNotification.insertMany(userLinks);
  }

  async getMyNotifications(userId: string) {
    return await UserNotification.find({ userId, isDeleted: false }) // Filter deleted
      .populate("notificationId")
      .sort({ createdAt: -1 });
  }

  async markAsRead(userId: string, notificationId: string) {
    return await UserNotification.findOneAndUpdate(
      { userId, notificationId },
      { isRead: true },
      { new: true }
    );
  }

  // New: Soft delete logic
  async deleteNotification(userId: string, notificationId: string) {
    return await UserNotification.findOneAndUpdate(
      { userId, notificationId },
      { isDeleted: true },
      { new: true }
    );
  }
}

export const notificationService = new NotificationService();
