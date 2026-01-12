import { Router } from "express";
import {
  createPreorder,
  getMerchantPreorders,
  getMyPreorders,
  updatePreorderStatus,
} from "../controllers/preorder";
import { protect } from "../../../shared/middleware/authMiddleware";

const router = Router();

// Farmer Routes
router.post("/create-preorder", createPreorder);
router.get("/my-preorders", protect, getMyPreorders); // Added protect middleware

// Merchant Routes
router.get("/merchant", getMerchantPreorders);
router.patch("/:id/status", updatePreorderStatus);

export default router;
