// routes/invoiceRoutes.ts
import { Router } from "express";
import {
  createInvoice,
  deleteInvoice,
  getInvoices,
  updateStatus,
} from "../controllers/invoice";
import { protect } from "../../../shared/middleware/authMiddleware";
import { allowRoles } from "../../../shared/middleware/role";

const router = Router();

// All invoice routes should be protected
router.use(protect, allowRoles("merchant"));

router
  .route("/")
  .post(createInvoice) // POST /api/invoices
  .get(getInvoices); // GET /api/invoices

router
  .route("/:id")
  .patch(updateStatus) // PATCH /api/invoices/:id
  .delete(deleteInvoice); // DELETE /api/invoices/:id

export default router;
