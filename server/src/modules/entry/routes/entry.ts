import { Router } from "express";
import { upload } from "../../../shared/utils/upload";
import { entryValidator } from "../validators/entry";
import { validateRequest } from "../../../shared/middleware/validateRequest";
import { protect } from "../../../shared/middleware/authMiddleware";
import {
  createEntry,
  getAllEntries,
  getEntryById,
  updateEntry,
  deleteEntry,
  getEntryStats,
} from "../controllers/entry";

const router = Router();
router.use(protect);

router.get("/category-stats", getEntryStats);
router.get("/", getAllEntries);
router.post(
  "/add-entry",
  upload.single("billImage"),
  entryValidator,
  validateRequest,
  createEntry,
);

router.get("/:id", getEntryById);
router.put(
  "/:id",
  upload.single("billImage"),
  entryValidator,
  validateRequest,
  updateEntry,
);
router.delete("/:id", deleteEntry);

export default router;
