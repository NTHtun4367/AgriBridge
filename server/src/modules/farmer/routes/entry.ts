import { Router } from "express";
import { upload } from "../../../shared/utils/upload";
import { entryValidator } from "../validators/entry";
import { validateRequest } from "../../../shared/middleware/validateRequest";
import { createEntry } from "../controllers/entry";

const router = Router();

router.post(
  "/add-entry",
  upload.single("billImage"),
  entryValidator,
  validateRequest,
  createEntry
);
export default router;
