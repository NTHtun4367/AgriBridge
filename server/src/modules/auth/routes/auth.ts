import { Router } from "express";
import {
  loginValidator,
  registerFarmerValidator,
  verifyOtpValidator,
  resendOtpValidator,
} from "../validators/authValidators";
import { validateRequest } from "../../../shared/middleware/validateRequest";
import {
  registerFarmer,
  registerMerchant,
  verifyOtp,
  resendOtp,
  login,
  getUserInfo,
  updateProfile,
  updateAvatar,
  updateMerchantDocs,
  requestEmailChange,
  confirmEmailChange,
} from "../controllers/auth";
import { upload } from "../../../shared/utils/upload";
import { protect } from "../../../shared/middleware/authMiddleware";
import { allowRoles } from "../../../shared/middleware/role";

const router = Router();

router.post(
  "/register/farmer",
  registerFarmerValidator,
  validateRequest,
  registerFarmer,
);

router.post(
  "/register/merchant",
  upload.fields([
    { name: "nrcFront", maxCount: 1 },
    { name: "nrcBack", maxCount: 1 },
  ]),
  registerMerchant,
);

// Verification (Uses unified identifier: email/phone)
router.post("/verify-otp", verifyOtpValidator, validateRequest, verifyOtp);
router.post("/resend-otp", resendOtpValidator, validateRequest, resendOtp);

router.post("/login", loginValidator, validateRequest, login);

router.get(
  "/me",
  protect,
  allowRoles("farmer", "merchant", "admin"),
  getUserInfo,
);

router.patch("/profile", protect, updateProfile);
router.post("/profile/avatar", protect, upload.single("avatar"), updateAvatar);
router.post(
  "/profile/documents",
  protect,
  upload.fields([
    { name: "nrcFront", maxCount: 1 },
    { name: "nrcBack", maxCount: 1 },
  ]),
  updateMerchantDocs,
);

router.post("/request-email-change", protect, requestEmailChange);
router.post("/confirm-email-change", protect, confirmEmailChange);

export default router;
