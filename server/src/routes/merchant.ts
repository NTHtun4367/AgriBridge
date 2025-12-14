import { Router } from "express";
import { registerMerchant } from "../controllers/merchant";
import { upload } from "../utils/upload";

const router = Router();

router.post(
  "/register/merchant",
  upload.fields([
    { name: "nrcFront", maxCount: 1 },
    { name: "nrcBack", maxCount: 1 },
  ]),
  registerMerchant
);

export default router;
