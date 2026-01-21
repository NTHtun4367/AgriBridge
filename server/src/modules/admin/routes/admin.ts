import { Router } from "express";
import { protect } from "../../../shared/middleware/authMiddleware";
import { allowRoles } from "../../../shared/middleware/role";
import {
  changeUserStatus,
  getAdminOverview,
  getAllFarmersInfo,
  getAllMerchants,
  getAllVerificationPendingUsers,
  getMerchantInfoWithMerchantId,
  getVerifiedMerchants,
  updateUserVerificationStatus,
} from "../controllers/admin";
import { userIdValidator, userStatusValidator } from "../validators/admin";

const router = Router();

router.get("/overview", protect, allowRoles("admin"), getAdminOverview);
router.get("/farmers/all", protect, allowRoles("admin"), getAllFarmersInfo);
router.get(
  "/merchants/all",
  protect,
  allowRoles("admin"),
  getVerifiedMerchants,
);
router.get("/merchants", protect, allowRoles("admin"), getAllMerchants);
router.patch(
  "/users/:userId",
  protect,
  allowRoles("admin"),
  userIdValidator,
  userStatusValidator,
  changeUserStatus,
);
router.get(
  "/users/verification/pending",
  protect,
  allowRoles("admin"),
  getAllVerificationPendingUsers,
);
router.patch(
  "/users/verification/:userId",
  protect,
  allowRoles("admin"),
  userIdValidator,
  userStatusValidator,
  updateUserVerificationStatus,
);
router.get(
  "/users/:merchantId",
  protect,
  allowRoles("admin"),
  getMerchantInfoWithMerchantId,
);

export default router;
