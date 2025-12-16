import { Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import { allowRoles } from "../middlewares/role";
import {
  changeUserStatus,
  getAllFarmersInfo,
  getAllVerificationPendingUsers,
  getMerchantInfoWithMerchantId,
  updateUserVerificationStatus,
} from "../controllers/admin";
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
router.get(
  "/users/verification/pending",
  protect,
  allowRoles("admin"),
  getAllVerificationPendingUsers
);
router.patch(
  "/users/verification/:userId",
  protect,
  allowRoles("admin"),
  userIdValidator,
  userStatusValidator,
  updateUserVerificationStatus
);
router.get(
  "/users/:merchantId",
  protect,
  allowRoles("admin"),
  getMerchantInfoWithMerchantId
);

export default router;
