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

const router = Router();

router.use(protect);

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
  finalizeInvoice
);

export default router;
