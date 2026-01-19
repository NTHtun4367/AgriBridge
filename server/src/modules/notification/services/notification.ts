import { Notification } from "../models/notification";
import { UserNotification } from "../models/userNotification";
import { Types } from "mongoose";
import { Announcement } from "../models/announcement";
import { authService } from "../../auth/services/auth";

export class NotificationService {
  /**
   * ADMIN: Create announcement and notify users
   */
  async createAnnouncement(data: {
    title: string;
    content: string;
    target: string;
    adminId?: string;
  }) {
    // 1. Save announcement log
    const announcement = await Announcement.create({
      title: data.title,
      content: data.content,
      target: data.target,
      adminId: data.adminId ? new Types.ObjectId(data.adminId) : undefined,
    });

    // 2. Map frontend target → DB role
    const roleMapping: Record<string, "all" | "farmer" | "merchant"> = {
      All: "all",
      Farmers: "farmer",
      Merchants: "merchant",
    };

    const targetRole = roleMapping[data.target] || "all";

    // 3. Fetch users CORRECTLY
    let users;
    if (targetRole === "all") {
      users = await authService.getAllUsers(); // ✅ NO ROLE FILTER
    } else {
      users = await authService.getAllUsersByRole(targetRole); // ✅ STRING
    }

    const userIds = users.map((u) => u._id.toString());

    // 4. Create notifications
    if (userIds.length > 0) {
      await this.createNotification(
        data.title,
        data.content,
        userIds,
        targetRole,
      );
    }

    return announcement;
  }

  /**
   * Admin: Announcement history
   */
  async getAnnouncementHistory() {
    return await Announcement.find().sort({ createdAt: -1 });
  }

  // ============================================================
  // ORIGINAL METHODS
  // ============================================================

  async createNotification(
    title: string,
    message: string,
    userIds: string[],
    role: "all" | "farmer" | "merchant" = "all",
  ) {
    const notification = await Notification.create({
      title,
      message,
      targetRole: role,
    });

    const userLinks = userIds.map((id) => ({
      userId: new Types.ObjectId(id),
      notificationId: notification._id,
      isRead: false,
      isDeleted: false,
    }));

    return await UserNotification.insertMany(userLinks);
  }

  async getMyNotifications(userId: string) {
    return await UserNotification.find({
      userId: new Types.ObjectId(userId),
      isDeleted: false,
    })
      .populate("notificationId")
      .sort({ createdAt: -1 });
  }

  async markAsRead(userId: string, userNotificationId: string) {
    return await UserNotification.findOneAndUpdate(
      {
        _id: new Types.ObjectId(userNotificationId),
        userId: new Types.ObjectId(userId),
      },
      { isRead: true },
      { new: true },
    );
  }

  async deleteNotification(userId: string, userNotificationId: string) {
    return await UserNotification.findOneAndUpdate(
      {
        _id: new Types.ObjectId(userNotificationId),
        userId: new Types.ObjectId(userId),
      },
      { isDeleted: true },
      { new: true },
    );
  }

  async markAllAsRead(userId: string) {
    return await UserNotification.updateMany(
      {
        userId: new Types.ObjectId(userId),
        isRead: false,
        isDeleted: false,
      },
      { isRead: true },
    );
  }
}

export const notificationService = new NotificationService();
