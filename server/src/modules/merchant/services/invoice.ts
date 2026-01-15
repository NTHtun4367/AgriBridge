import { Types } from "mongoose";
import { Invoice } from "../models/invoice";
import { preorderService } from "../../preorder/services/preorder";
import { notificationService } from "../../notification/services/notification";

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
      (acc: number, item: any) =>
        acc + Number(item.quantity) * Number(item.price),
      0
    )
        
    // 1. Create Invoice
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

    const savedInvoice = await invoice.save();

    // 2. "Send" to Farmer via Notification Service
    // This creates the Notification AND the UserNotification link
    await notificationService.createNotification(
      "New Invoice Received",
      `Merchant has sent you invoice ${invoiceId} for ${totalAmount.toLocaleString()} MMK.`,
      [farmerId],
      "farmer"
    );

    return savedInvoice;
  }

  async getAllInvoices(merchantId: string) {
    return await Invoice.find({ merchantId }).sort({ createdAt: -1 });
  }

  async getInvoicesForFarmer(farmerId: string) {
    return await Invoice.find({ farmerId: new Types.ObjectId(farmerId) }).sort({
      createdAt: -1,
    });
  }

  async updateInvoiceStatus(invoiceId: string, status: string) {
    const invoice = await Invoice.findByIdAndUpdate(
      invoiceId,
      { status },
      { new: true }
    );
    if (!invoice) throw new Error("Invoice not found");
    return invoice;
  }

  async completeTransaction(invoiceId: string) {
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      invoiceId,
      { status: "paid" },
      { new: true }
    );

    if (!updatedInvoice) throw new Error("Invoice not found");

    // Link back to preorder status
    if (updatedInvoice.preorderId) {
      await preorderService.updatePreorderStatus(
        updatedInvoice.preorderId.toString(),
        "delivered"
      );
    }

    return updatedInvoice;
  }

  async deleteInvoice(invoiceId: string) {
    return await Invoice.findByIdAndDelete(invoiceId);
  }
}

export const invoiceService = new InvoiceService();
