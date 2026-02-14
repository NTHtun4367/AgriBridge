import { Request, Response } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler";
import { AuthRequest } from "../../../shared/middleware/authMiddleware";
import { notificationService } from "../services/notification";

export const createAnnouncement = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const result = await notificationService.createAnnouncement({
      title: req.body.title,
      content: req.body.content,
      target: req.body.target,
      adminId: req.user?._id.toString(),
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

export const getMyNotifications = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const notifications = await notificationService.getMyNotifications(
      req.user?._id.toString()!,
    );
    res.status(200).json(notifications);
  },
);

export const markAsRead = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const updated = await notificationService.markAsRead(
      req.user?._id.toString()!,
      req.params.id,
    );
    res.status(200).json({ success: true, data: updated });
  },
);

export const markAllAsRead = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    await notificationService.markAllAsRead(req.user?._id.toString()!);
    res.status(200).json({ success: true, message: "All marked as read" });
  },
);

export const deleteNotification = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    await notificationService.deleteNotification(
      req.user?._id.toString()!,
      req.params.id,
    );
    res.status(200).json({ success: true, message: "Notification deleted" });
  },
);
