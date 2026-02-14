import { Types } from "mongoose";
import { Invoice } from "../models/invoice";
import { preorderService } from "../../preorder/services/preorder";
import { notificationService } from "../../notification/services/notification";
import { authService } from "../../auth/services/auth";
import { autoTranslate } from "../../../shared/utils/ai";

export class InvoiceService {
  async createInvoice(
    merchantId: string,
    invoiceData: {
      farmerId?: string;
      preorderId?: string;
      invoiceId: string;
      farmerName: string;
      farmerPhone: string;
      farmerAddress: string;
      farmerNRC: string;
      items: any[];
      notes?: string;
      status?: string;
    },
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
      status,
    } = invoiceData;

    const totalAmount = items.reduce(
      (acc: number, item: any) =>
        acc + Number(item.quantity) * Number(item.price),
      0,
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
      status,
    });

    const savedInvoice = await invoice.save();

    // --- Notification Logic (Localized) ---
    if (farmerId) {
      try {
        const merchant = (await authService.getMerchantById(merchantId)) as any;
        const businessName =
          merchant?.merchantId?.businessName || merchant?.name || "ကုန်သည်";

        // တောင်သူများအတွက် မြန်မာလို Notification ပို့ပေးခြင်း
        const title = "အော်ဒါပြေစာအသစ် ရောက်ရှိလာပါသည်";
        const message = `${businessName} မှ သင့်ထံသို့ ပြေစာအမှတ် ${invoiceId} အတွက် ကျသင့်ငွေ ${totalAmount.toLocaleString()} MMK ပေးပို့ထားပါသည်။`;

        await notificationService.createNotification(
          title,
          message,
          [farmerId],
          "farmer",
        );
      } catch (error) {
        console.error("Notification failed:", error);
      }
    }

    return savedInvoice;
  }

  async getAllInvoices(merchantId: string) {
    return await Invoice.find({ merchantId }).sort({ createdAt: -1 }).lean();
  }

  async getInvoicesForFarmer(farmerId: string) {
    const invoices = await Invoice.find({
      farmerId: new Types.ObjectId(farmerId),
    })
      .sort({ createdAt: -1 })
      .lean();

    return invoices;
  }

  async updateInvoiceStatus(invoiceId: string, status: string) {
    return await Invoice.findByIdAndUpdate(
      invoiceId,
      { status },
      { new: true },
    );
  }

  async completeTransaction(invoiceId: string) {
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      invoiceId,
      { status: "paid" },
      { new: true },
    );
    if (updatedInvoice?.preorderId) {
      await preorderService.updatePreorderStatus(
        updatedInvoice.preorderId.toString(),
        "delivered",
      );
    }
    return updatedInvoice;
  }

  async deleteInvoice(invoiceId: string) {
    return await Invoice.findByIdAndDelete(invoiceId);
  }
}

export const invoiceService = new InvoiceService();
