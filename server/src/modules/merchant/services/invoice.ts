import { Types } from "mongoose";
import { Invoice } from "../models/invoice";

export class InvoiceService {
  async createInvoice(
    merchantId: string,
    invoiceData: { farmerId: string; items: any[]; notes?: string }
  ) {
    const { farmerId, items, notes } = invoiceData;

    // Calculate total amount
    const totalAmount = items.reduce(
      (acc: number, item: any) => acc + item.quantity * item.price,
      0
    );

    // Create document
    const invoice = new Invoice({
      merchantId: new Types.ObjectId(merchantId),
      farmerId: new Types.ObjectId(farmerId),
      items,
      totalAmount,
      notes,
      status: "pending",
    });

    return await invoice.save();
  }

  async getAllInvoices(merchantId: string) {
    return await Invoice.find({ merchantId }).sort({ createdAt: -1 });
  }

  async updateInvoiceStatus(invoiceId: string, status: "pending" | "paid") {
    return await Invoice.findByIdAndUpdate(
      invoiceId,
      { status },
      { new: true, runValidators: true }
    );
  }

  async deleteInvoice(invoiceId: string) {
    return await Invoice.findByIdAndDelete(invoiceId);
  }
}

export const invoiceService = new InvoiceService();
