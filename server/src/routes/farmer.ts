import { Router } from "express";
import { loginValidator, registerFarmerValidator } from "../validators/farmer";
import { validateRequest } from "../middlewares/validateRequest";
import { registerFarmer } from "../controllers/farmer";
import { login } from "../controllers/common";

const router = Router();

router.post(
  "/register/farmer",
  registerFarmerValidator,
  validateRequest,
  registerFarmer
);
router.post("/login", loginValidator, validateRequest, login);

export default router;
