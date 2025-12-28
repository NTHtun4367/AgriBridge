import { Router } from "express";
import {
  deleteNotification,
  getMyNotifications,
  markAsRead,
} from "../controllers/notification";
import { protect } from "../../../shared/middleware/authMiddleware";

const router = Router();

router.use(protect);

router.get("/", getMyNotifications);
router.patch("/:id/read", markAsRead);
router.delete("/:id/delete", deleteNotification);

export default router;
