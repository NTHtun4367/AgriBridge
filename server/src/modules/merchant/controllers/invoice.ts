import { Request, Response } from "express";
import { invoiceService } from "../services/invoice";
import { AuthRequest } from "../../../shared/middleware/authMiddleware";
import asyncHandler from "../../../shared/utils/asyncHandler";

export const createInvoice = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const merchantId = req.user?._id;
    const invoice = await invoiceService.createInvoice(
      merchantId as string,
      req.body
    );
    res.status(201).json(invoice);
  }
);

export const getInvoices = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const merchantId = req.user?._id;
    const invoices = await invoiceService.getAllInvoices(merchantId as string);
    res.status(200).json(invoices);
  }
);

// NEW: For Farmers to see invoices sent to them
export const getFarmerInvoices = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const farmerId = req.user?._id;
    const invoices = await invoiceService.getInvoicesForFarmer(
      farmerId as string
    );
    res.status(200).json(invoices);
  }
);

export const updateStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const invoice = await invoiceService.updateInvoiceStatus(id, status);
    res.status(200).json(invoice);
  }
);

export const finalizeInvoice = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await invoiceService.completeTransaction(id);
    res.status(200).json(result);
  }
);

export const deleteInvoice = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    await invoiceService.deleteInvoice(id);
    res.status(200).json({ message: "Invoice deleted successfully" });
  }
);
