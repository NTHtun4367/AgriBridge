import { Router } from "express";
import { allowRoles } from "../../../shared/middleware/role";
import { getAllMarkets } from "../controllers/market";
import { protect } from "../../../shared/middleware/authMiddleware";

const router = Router();

router.get("/all", protect, allowRoles("admin"), getAllMarkets);

export default router;
