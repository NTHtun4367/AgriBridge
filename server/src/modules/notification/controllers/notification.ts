import { Request, Response } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler";
import { AuthRequest } from "../../../shared/middleware/authMiddleware";
import { notificationService } from "../services/notification";

// --- ADMIN ACTIONS ---

export const createAnnouncement = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { title, content, target } = req.body;
    const adminId = req.user?._id.toString();

    const result = await notificationService.createAnnouncement({
      title,
      content,
      target,
      adminId,
    });

    res.status(201).json({ success: true, data: result });
  },
);

export const getAnnouncementHistory = asyncHandler(
  async (req: Request, res: Response) => {
    const history = await notificationService.getAnnouncementHistory();
    res.status(200).json(history);
  },
);

// --- USER ACTIONS ---

export const getMyNotifications = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id.toString()!;
    const notifications = await notificationService.getMyNotifications(userId);
    res.status(200).json(notifications);
  },
);

export const markAsRead = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id.toString()!;
    const { id } = req.params;
    const updated = await notificationService.markAsRead(userId, id);
    res.status(200).json({ success: true, data: updated });
  },
);

export const markAllAsRead = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id.toString()!;
    await notificationService.markAllAsRead(userId);
    res.status(200).json({ success: true, message: "All marked as read" });
  },
);

export const deleteNotification = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id.toString()!;
    const { id } = req.params;
    await notificationService.deleteNotification(userId, id);
    res.status(200).json({ success: true, message: "Notification deleted" });
  },
);
