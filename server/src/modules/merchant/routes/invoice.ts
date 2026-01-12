import { Router } from "express";
import {
  createInvoice,
  deleteInvoice,
  getInvoices,
  updateStatus,
  finalizeInvoice,
} from "../controllers/invoice";
import { protect } from "../../../shared/middleware/authMiddleware";
import { allowRoles } from "../../../shared/middleware/role";

const router = Router();

// Global protection: User must be logged in
router.use(protect);

// --- Merchant Actions ---
router
  .route("/invoices")
  .post(allowRoles("merchant"), createInvoice)
  .get(allowRoles("merchant"), getInvoices);

router
  .route("/invoices/:id")
  .patch(allowRoles("merchant"), updateStatus)
  .delete(allowRoles("merchant"), deleteInvoice);

// --- Shared/Farmer Actions ---
// Finalize is usually triggered by a Farmer clicking 'Download'
router.patch(
  "/invoices/:id/finalize",
  allowRoles("farmer", "merchant"),
  finalizeInvoice
);

export default router;
