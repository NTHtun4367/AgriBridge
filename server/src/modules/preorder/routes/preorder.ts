import { Router } from "express";
import {
  createPreorder,
  getMerchantPreorders,
  getMyPreorders,
} from "../controllers/preorder";

const router = Router();

router.post("/create-preorder", createPreorder);
router.get("/my-preorders", getMyPreorders);
router.get("/merchant", getMerchantPreorders); // Merchant view
// router.patch("/:id/status", updatePreorderStatus)

export default router;
