import { Router } from "express";
import {
  createAnnouncement,
  getAnnouncementHistory,
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notification";
import { protect } from "../../../shared/middleware/authMiddleware";
import { allowRoles } from "../../../shared/middleware/role";

const router = Router();

// All routes below require the user to be logged in
router.use(protect);

// --- ADMIN ROUTES ---
// Only admins can create announcements or view the broadcast history
router.post("/announcements", allowRoles("admin"), createAnnouncement);
router.get(
  "/announcements/history",
  allowRoles("admin"),
  getAnnouncementHistory,
);

// --- USER ROUTES ---
// Any logged-in user can manage their personal inbox
router.get("/", getMyNotifications);
router.patch("/:id/read", markAsRead);
router.patch("/read-all", markAllAsRead);
router.delete("/:id", deleteNotification);

export default router;
