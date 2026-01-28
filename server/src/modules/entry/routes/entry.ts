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
} from "../../entry/controllers/entry";

const router = Router();

router.use(protect);

router.post(
  "/add-entry",
  upload.single("billImage"),
  entryValidator,
  validateRequest,
  createEntry,
);
router.get("/", getAllEntries);
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
