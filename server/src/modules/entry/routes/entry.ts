import { Router } from "express";
import { upload } from "../../../shared/utils/upload";
import { entryValidator } from "../../entry/validators/entry";
import { validateRequest } from "../../../shared/middleware/validateRequest";
import { protect } from "../../../shared/middleware/authMiddleware";
import {
  createEntry,
  getAllEntries,
  getEntryById,
  updateEntry,
  deleteEntry,
  getEntryStats,
} from "../../entry/controllers/entry";

const router = Router();

router.use(protect);

/**
 * 1. SPECIFIC/STATIC ROUTES FIRST
 * These must be defined before the /:id routes
 */
router.get("/category-stats", getEntryStats);

/**
 * 2. GENERAL COLLECTION ROUTES
 */
router.get("/", getAllEntries);

router.post(
  "/add-entry",
  upload.single("billImage"),
  entryValidator,
  validateRequest,
  createEntry,
);

/**
 * 3. DYNAMIC PARAMETER ROUTES LAST
 * These are "catch-alls" for anything that wasn't matched above
 */
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
