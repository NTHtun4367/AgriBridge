import { Router } from "express";
import {
  createDispute,
  getMyDisputes,
  getAllDisputes,
  updateDisputeStatus,
} from "../controllers/dispute";
import { protect } from "../../../shared/middleware/authMiddleware";
import { allowRoles } from "../../../shared/middleware/role";

const router = Router();

// Farmer Endpoints
router.post("/", protect, createDispute);
router.get("/my-disputes", protect, getMyDisputes);

// Admin Endpoints
router.get("/admin/all", protect, allowRoles("admin"), getAllDisputes);
router.patch(
  "/admin/:id/status",
  protect,
  allowRoles("admin"),
  updateDisputeStatus,
);

export default router;
