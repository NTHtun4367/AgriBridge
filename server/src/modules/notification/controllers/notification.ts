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
    const { id: notificationId } = req.params;

    const updated = await notificationService.markAsRead(
      userId?.toString()!,
      notificationId
    );

    if (!updated) {
      res.status(404);
      throw new Error("Notification not found.");
    }

    res.status(200).json({ success: true, data: updated });
  }
);

// New Delete Handler
export const deleteNotification = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    const { id: notificationId } = req.params;

    await notificationService.deleteNotification(
      userId?.toString()!,
      notificationId
    );

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  }
);
