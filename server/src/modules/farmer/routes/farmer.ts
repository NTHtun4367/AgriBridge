import { Router } from "express";
import { upload } from "../../../shared/utils/upload";
import { entryValidator } from "../validators/entry";
import { validateRequest } from "../../../shared/middleware/validateRequest";
import { createEntry, getAllEntries, getEntryById } from "../controllers/entry";
import { protect } from "../../../shared/middleware/authMiddleware";
import { getStats } from "../controllers/finance";

const router = Router();

router.use(protect);

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

export default router;
