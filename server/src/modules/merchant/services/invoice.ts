import { Types } from "mongoose";
import { Invoice } from "../models/invoice";
import { preorderService } from "../../preorder/services/preorder";
import { notificationService } from "../../notification/services/notification";
import { authService } from "../../auth/services/auth";

export class InvoiceService {
  async createInvoice(
    merchantId: string,
    invoiceData: {
      farmerId: string;
      preorderId?: string;
      invoiceId: string;
      farmerName: string;
      farmerPhone: string;
      farmerAddress: string;
      farmerNRC: string;
      items: any[];
      notes?: string;
    }
  ) {
    const {
      farmerId,
      preorderId,
      invoiceId,
      items,
      notes,
      farmerName,
      farmerPhone,
      farmerAddress,
      farmerNRC,
    } = invoiceData;

    const totalAmount = items.reduce(
      (acc: number, item: any) =>
        acc + Number(item.quantity) * Number(item.price),
      0
    );

    const invoice = new Invoice({
      invoiceId,
      merchantId: new Types.ObjectId(merchantId),
      farmerId: new Types.ObjectId(farmerId),
      preorderId: preorderId ? new Types.ObjectId(preorderId) : undefined,
      farmerName,
      farmerPhone,
      farmerAddress,
      farmerNRC,
      items,
      totalAmount,
      notes,
      status: "pending",
    });

    const savedInvoice = await invoice.save();

    // Notification Logic
    if (farmerId) {
      try {
        const merchant = (await authService.getMerchantById(merchantId)) as any;
        const businessName =
          merchant?.merchantId?.businessName || merchant?.name || "A Merchant";

        await notificationService.createNotification(
          "New Invoice Received",
          `${businessName} sent you invoice ${invoiceId} for ${totalAmount.toLocaleString()} MMK.`,
          [farmerId],
          "farmer"
        );
      } catch (error) {
        console.error("Notification failed:", error);
      }
    }

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
    return await Invoice.findByIdAndUpdate(
      invoiceId,
      { status },
      { new: true }
    );
  }

  async completeTransaction(invoiceId: string) {
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      invoiceId,
      { status: "paid" },
      { new: true }
    );
    if (updatedInvoice?.preorderId) {
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
