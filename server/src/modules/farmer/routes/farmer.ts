import { Router } from "express";
import { upload } from "../../../shared/utils/upload";
import { entryValidator } from "../validators/entry";
import { validateRequest } from "../../../shared/middleware/validateRequest";
import { createEntry, getAllEntries, getEntryById } from "../controllers/entry";
import { protect } from "../../../shared/middleware/authMiddleware";
import { getStats } from "../controllers/finance";
import {
  getMerchantInfoById,
  getVerifiedMerchants,
} from "../controllers/merchant";
import { allowRoles } from "../../../shared/middleware/role";

const router = Router();

router.use(protect, allowRoles("farmer"));

router.post(
  "/add-entry",
  upload.single("billImage"),
  entryValidator,
  validateRequest,
  createEntry
);
router.get("/finance/stats", getStats);
router.get("/entries", getAllEntries);
router.get("/entries/:id", getEntryById);

// MOVE THIS LINE BEFORE THE DYNAMIC ROUTE
router.get("/merchants", getVerifiedMerchants);

// KEEP THIS AS THE LAST ROUTE
router.get("/merchants/:userId", getMerchantInfoById);

export default router;
