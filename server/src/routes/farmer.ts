import { Router } from "express";
import { loginValidator, registerFarmerValidator } from "../validators/farmer";
import { validateRequest } from "../middlewares/validateRequest";
import { login, registerFarmer } from "../controllers/farmer";

const router = Router();

router.post(
  "/register/farmer",
  registerFarmerValidator,
  validateRequest,
  registerFarmer
);
router.post("/login", loginValidator, validateRequest, login);

export default router;
