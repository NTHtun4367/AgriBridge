import { Router } from "express";
import {
  deleteNotification,
  getMyNotifications,
  markAllAsRead,
  markAsRead,
} from "../controllers/notification";
import { protect } from "../../../shared/middleware/authMiddleware";

const router = Router();

router.use(protect);

router.get("/", getMyNotifications);
router.patch("/:id/read", markAsRead);
router.patch("/read-all", markAllAsRead);
router.delete("/:id", deleteNotification);

export default router;
