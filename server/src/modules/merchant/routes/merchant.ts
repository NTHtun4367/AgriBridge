import { Router } from "express";
import {
  createInvoice,
  deleteInvoice,
  getInvoices,
  getFarmerInvoices, // Added this
  updateStatus,
  finalizeInvoice,
} from "../controllers/invoice";
import { protect } from "../../../shared/middleware/authMiddleware";
import { allowRoles } from "../../../shared/middleware/role";
import { upload } from "../../../shared/utils/upload";
import { entryValidator } from "../../entry/validators/entry";
import { validateRequest } from "../../../shared/middleware/validateRequest";
import {
  createEntry,
  getAllEntries,
  getEntryById,
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
// router.get("/finance/stats", getStats);
router.get("/entries", getAllEntries);
router.get("/entries/:id", getEntryById);

// --- Merchant Specific ---
router.post("/", allowRoles("merchant"), createInvoice);
router.get("/merchant", allowRoles("merchant"), getInvoices);

// --- Farmer Specific ---
router.get("/my-receipts", allowRoles("farmer"), getFarmerInvoices);

// --- Individual Invoice Actions ---
router
  .route("/:id")
  .patch(allowRoles("merchant"), updateStatus)
  .delete(allowRoles("merchant"), deleteInvoice);

// --- Shared Action ---
router.patch(
  "/:id/finalize",
  allowRoles("farmer", "merchant"),
  finalizeInvoice,
);

export default router;
