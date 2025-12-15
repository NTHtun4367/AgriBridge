import { Router } from "express";
import { loginValidator, registerFarmerValidator } from "../validators/farmer";
import { validateRequest } from "../middlewares/validateRequest";
import {
  getAllFarmersInfo,
  login,
  registerFarmer,
} from "../controllers/farmer";
import { protect } from "../middlewares/authMiddleware";
import { allowRoles } from "../middlewares/role";

const router = Router();

router.post(
  "/register/farmer",
  registerFarmerValidator,
  validateRequest,
  registerFarmer
);
router.post("/login", loginValidator, validateRequest, login);
router.get("/farmers/all", protect, allowRoles("admin"), getAllFarmersInfo);

export default router;
