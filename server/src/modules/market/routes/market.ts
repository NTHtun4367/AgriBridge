import { Router } from "express";
import { protect } from "../../../shared/middleware/authMiddleware";
import { allowRoles } from "../../../shared/middleware/role";
import {
  getAllCrops,
  getAllMarkets,
  getLatestPrices,
  getMarketPrices,
  updateMarketPrices,
} from "../controllers/market";
import { validatePriceUpdate } from "../validators/market";
import { validateRequest } from "../../../shared/middleware/validateRequest";

const router = Router();

router.post(
  "/update",
  protect,
  allowRoles("admin", "merchant"),
  validatePriceUpdate,
  validateRequest,
  updateMarketPrices
);
router.get(
  "/latest",
  // allowRoles("farmer", "merchant", "admin"),
  getMarketPrices
);
router.get("/crops", protect, allowRoles("admin"), getAllCrops);
router.get("/", protect, allowRoles("admin"), getAllMarkets);

export default router;
