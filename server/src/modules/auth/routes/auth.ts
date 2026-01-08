import { Router } from "express";
import {
  loginValidator,
  registerFarmerValidator,
} from "../validators/authValidators";
import { validateRequest } from "../../../shared/middleware/validateRequest";
import { registerFarmer } from "../controllers/farmer";
import { getUserInfo, login } from "../controllers/common";
import { upload } from "../../../shared/utils/upload";
import { registerMerchant } from "../controllers/merchant";
import { protect } from "../../../shared/middleware/authMiddleware";
import { allowRoles } from "../../../shared/middleware/role";

const router = Router();

router.post(
  "/register/farmer",
  registerFarmerValidator,
  validateRequest,
  registerFarmer
);
router.post(
  "/register/merchant",
  upload.fields([
    { name: "nrcFront", maxCount: 1 },
    { name: "nrcBack", maxCount: 1 },
  ]),
  registerMerchant
);
router.post("/login", loginValidator, validateRequest, login);
router.get(
  "/me",
  protect,
  allowRoles("farmer", "merchant", "admin"),
  getUserInfo
);

export default router;
