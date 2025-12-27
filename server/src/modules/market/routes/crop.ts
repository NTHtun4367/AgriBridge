import { Router } from "express";
import { protect } from "../../../shared/middleware/authMiddleware";
import { allowRoles } from "../../../shared/middleware/role";
import { getAllCrops } from "../controllers/crop";

const router = Router();

router.get("/all", protect, allowRoles("admin"), getAllCrops);

export default router;
