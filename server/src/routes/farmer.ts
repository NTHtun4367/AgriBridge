import { Router } from "express";
import { registerFarmerValidator } from "../validators/farmer";
import { validateRequest } from "../middlewares/validateRequest";
import { registerFarmer } from "../controllers/farmer";

const router = Router();

router.post(
  "/register/farmer",
  registerFarmerValidator,
  validateRequest,
  registerFarmer
);

export default router;
