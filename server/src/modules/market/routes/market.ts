import { Router } from "express";
import { protect } from "../../../shared/middleware/authMiddleware";
import { allowRoles } from "../../../shared/middleware/role";
import {
  createCrop,
  createMarket,
  deleteCrop,
  deleteMarket,
  getAllCrops,
  getAllMarkets,
  getCropPriceHistory,
  getMarketPrices,
  updateCrop,
  updateMarket,
  updateMarketPrices,
} from "../controllers/market";

const router = Router();

// --- Price Updates (Admin & Merchant) ---
router.post(
  "/update",
  protect,
  allowRoles("admin", "merchant"),
  updateMarketPrices,
);
router.get("/prices", getMarketPrices);
router.get("/analytics/history", getCropPriceHistory);

// --- Crop Management ---
router.get("/crops", protect, getAllCrops); // Accessible to all logged in users
router.post("/crops", protect, allowRoles("admin"), createCrop);
router.put("/crops/:id", protect, allowRoles("admin"), updateCrop);
router.delete("/crops/:id", protect, allowRoles("admin"), deleteCrop);

// --- Market Management ---
router.get("/", getAllMarkets);
router.post("/", protect, allowRoles("admin"), createMarket);
router.put("/:id", protect, allowRoles("admin"), updateMarket);
router.delete("/:id", protect, allowRoles("admin"), deleteMarket);

export default router;
