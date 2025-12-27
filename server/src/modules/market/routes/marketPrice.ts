import { Router } from "express";
import { protect } from "../../../shared/middleware/authMiddleware";
import { allowRoles } from "../../../shared/middleware/role";
import {
  getLatestPrices,
  updateMarketPrices,
} from "../controllers/marketPrice";

const router = Router();

router.post(
  "/update",
  protect,
  allowRoles("admin", "merchant"),
  updateMarketPrices
);
router.get(
  "/latest",
  allowRoles("farmer", "merchant", "admin"),
  getLatestPrices
);

export default router;
