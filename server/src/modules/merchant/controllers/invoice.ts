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

export const updateStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const updatedInvoice = await invoiceService.updateInvoiceStatus(id, status);

    if (!updatedInvoice) {
      throw new Error("Invoice not found");
    }

    res.status(200).json(updatedInvoice);
  }
);

export const deleteInvoice = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    await invoiceService.deleteInvoice(id);

    res.status(200).json({ message: "Invoice deleted successfully" });
  }
);
