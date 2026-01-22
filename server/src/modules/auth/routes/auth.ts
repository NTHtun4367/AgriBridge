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
} from "../controllers/auth";
import { upload } from "../../../shared/utils/upload";
import { protect } from "../../../shared/middleware/authMiddleware";
import { allowRoles } from "../../../shared/middleware/role";

const router = Router();

// Registration
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

// OTP Verification
router.post("/verify-otp", verifyOtpValidator, validateRequest, verifyOtp);
router.post("/resend-otp", resendOtpValidator, validateRequest, resendOtp);

// Standard Auth
router.post("/login", loginValidator, validateRequest, login);

// Profile
router.get(
  "/me",
  protect,
  allowRoles("farmer", "merchant", "admin"),
  getUserInfo,
);

// Profile Updates
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

export default router;
