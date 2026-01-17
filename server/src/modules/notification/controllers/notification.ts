import { Response } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler";
import { AuthRequest } from "../../../shared/middleware/authMiddleware";
import { notificationService } from "../services/notification";

export const getMyNotifications = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    const notifications = await notificationService.getMyNotifications(
      userId?.toString()!
    );

    res.status(200).json(notifications);
  }
);

export const markAsRead = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    const { id: userNotificationId } = req.params; // This is the ID of the UserNotification doc

    const updated = await notificationService.markAsRead(
      userId?.toString()!,
      userNotificationId
    );

    if (!updated) {
      res.status(404);
      throw new Error("Notification record not found.");
    }

    res.status(200).json({ success: true, data: updated });
  }
);

export const deleteNotification = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    const { id: userNotificationId } = req.params;

    await notificationService.deleteNotification(
      userId?.toString()!,
      userNotificationId
    );

    res.status(200).json({ success: true, message: "Deleted" });
  }
);

export const markAllAsRead = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
console.log("mark all read");

    await notificationService.markAllAsRead(userId?.toString()!);
console.log("finish");

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  }
);
