import { Router } from "express";
import { registerFarmerValidator } from "../validators/user";
import { validateRequest } from "../middlewares/validateRequest";
import { registerFarmer } from "../controllers/user";

const router = Router();

router.post(
  "/register-farmer",
  registerFarmerValidator,
  validateRequest,
  registerFarmer
);

export default router;
