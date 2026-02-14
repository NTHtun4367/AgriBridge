import { Notification } from "../models/notification";
import { UserNotification } from "../models/userNotification";
import { Types } from "mongoose";
import { Announcement } from "../models/announcement";
import { authService } from "../../auth/services/auth";
import { autoTranslate } from "../../../shared/utils/ai";

export class NotificationService {
  async createAnnouncement(data: {
    title: string;
    content: string;
    target: string;
    adminId?: string;
  }) {
    const announcement = await Announcement.create({
      title: data.title,
      content: data.content,
      target: data.target,
      adminId: data.adminId ? new Types.ObjectId(data.adminId) : undefined,
    });

    const roleMapping: Record<string, "all" | "farmer" | "merchant"> = {
      All: "all",
      Farmers: "farmer",
      Merchants: "merchant",
    };

    const targetRole = roleMapping[data.target] || "all";
    let users =
      targetRole === "all"
        ? await authService.getAllUsers()
        : await authService.getAllUsersByRole(targetRole);
    const userIds = users.map((u) => u._id.toString());

    if (userIds.length > 0) {
      // Input object literal error ကို ကျော်လွှားရန် casting နှင့် _id ထည့်သွင်းခြင်း
      const translated: any = await autoTranslate(
        { _id: announcement._id, title: data.title, content: data.content },
        // ["title", "content"],
        true,
      );

      await this.createNotification(
        translated.title,
        translated.content,
        userIds,
        targetRole,
      );
    }

    return announcement;
  }

  async getAnnouncementHistory() {
    return await Announcement.find().sort({ createdAt: -1 });
  }

  async createNotification(
    title: string,
    message: string,
    userIds: string[],
    role: "all" | "farmer" | "admin" | "merchant" = "all",
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
