import { Router } from "express";
import { registerValidator } from "../validators/user";
import { validateRequest } from "../middlewares/validateRequest";
import { registerUser } from "../controllers/user";

const router = Router();

router.post("/register", registerValidator, validateRequest, registerUser);

export default router;
