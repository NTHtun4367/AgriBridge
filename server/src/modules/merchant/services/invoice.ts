import { Types } from "mongoose";
import { Invoice } from "../models/invoice";
import { preorderService } from "../../preorder/services/preorder";

export class InvoiceService {
  async createInvoice(
    merchantId: string,
    invoiceData: {
      farmerId: string;
      preorderId?: string;
      invoiceId: string;
      items: any[];
      notes?: string;
    }
  ) {
    const { farmerId, preorderId, invoiceId, items, notes } = invoiceData;

    const totalAmount = items.reduce(
      (acc: number, item: any) => acc + (Number(item.quantity) * Number(item.price)),
      0
    );

    const invoice = new Invoice({
      invoiceId,
      merchantId: new Types.ObjectId(merchantId),
      farmerId: new Types.ObjectId(farmerId),
      preorderId: preorderId ? new Types.ObjectId(preorderId) : undefined,
      items,
      totalAmount,
      notes,
      status: "pending",
    });

    return await invoice.save();
  }

  async getAllInvoices(merchantId: string) {
    return await Invoice.find({ merchantId })
      .populate("farmerId", "fullName phone") // Optional: useful for the list view
      .sort({ createdAt: -1 });
  }

  // Update status manually (e.g., Merchant marks as Cancelled)
  async updateInvoiceStatus(invoiceId: string, status: string) {
    const invoice = await Invoice.findByIdAndUpdate(
      invoiceId,
      { status },
      { new: true }
    );
    if (!invoice) throw new Error("Invoice not found");
    return invoice;
  }

  // Logic for when Farmer downloads/completes the receipt
  async completeTransaction(invoiceId: string) {
    // 1. Update Invoice to paid
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      invoiceId,
      { status: "paid" },
      { new: true }
    );

    if (!updatedInvoice) throw new Error("Invoice not found");

    // 2. If it came from a preorder, mark preorder as delivered/completed
    if (updatedInvoice.preorderId) {
      try {
        await preorderService.updatePreorderStatus(
          updatedInvoice.preorderId.toString(),
          "delivered"
        );
      } catch (error) {
        console.error("Failed to update linked preorder status:", error);
        // We don't necessarily want to fail the whole invoice completion 
        // if the preorder link fails, but you could throw here if strictly required.
      }
    }

    return updatedInvoice;
  }

  async deleteInvoice(invoiceId: string) {
    return await Invoice.findByIdAndDelete(invoiceId);
  }
}

export const invoiceService = new InvoiceService();