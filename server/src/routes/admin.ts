import { Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import { allowRoles } from "../middlewares/role";
import { changeUserStatus, getAllFarmersInfo } from "../controllers/admin";
import { userIdValidator, userStatusValidator } from "../validators/admin";

const router = Router();

router.get("/farmers/all", protect, allowRoles("admin"), getAllFarmersInfo);
router.patch(
  "/users/:userId",
  protect,
  allowRoles("admin"),
  userIdValidator,
  userStatusValidator,
  changeUserStatus
);

export default router;
