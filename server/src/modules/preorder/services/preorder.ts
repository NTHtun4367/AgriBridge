import { Preorder, IPreorder } from "../models/preorder";
import { authService } from "../../auth/services/auth";
import { notificationService } from "../../notification/services/notification";

export class PreorderService {
  async createPreorder(payload: Partial<IPreorder>) {
    // 1. Save the preorder to the database
    const preorder = await Preorder.create(payload);

    // 2. Destructure data from your specific payload structure
    const { merchantId, farmerId, fullName, items } = payload;

    if (merchantId) {
      try {
        // Calculate total amount from the items array in your payload
        const totalAmount =
          items?.reduce(
            (acc: number, item: any) =>
              acc + Number(item.quantity) * Number(item.price),
            0,
          ) || 0;

        // In this flow, the Farmer is the sender, so we notify the Merchant
        // We use fullName from your payload to tell the merchant who sent it
        const senderName = fullName || "A Farmer";

        await notificationService.createNotification(
          "New Preorder Received",
          `${senderName} submitted a new preorder for ${totalAmount.toLocaleString()} MMK.`,
          [merchantId.toString()], // Array of recipients
          "merchant", // Targeted role
        );
      } catch (error) {
        // Log error but don't block the successful preorder creation response
        console.error("Preorder Notification failed:", error);
      }
    }

    return preorder;
  }

  async getAllPreorders(query: Record<string, any>) {
    const preorders = await Preorder.find(query).sort({ createdAt: -1 }).lean();
    return await Promise.all(
      preorders.map(async (order) => {
        const merchantInfo = await authService.getMerchantById(
          order.merchantId.toString(),
        );
        return { ...order, merchantInfo };
      }),
    );
  }

  async getMerchantPreorders(merchantId: string) {
    const preorders = await Preorder.find({ merchantId })
      .sort({ createdAt: -1 })
      .lean();
    return await Promise.all(
      preorders.map(async (order) => {
        const farmerInfo = await authService.getUserProfile(
          order.farmerId.toString(),
        );
        return { ...order, farmerInfo };
      }),
    );
  }

  async updatePreorderStatus(id: string, status: string) {
    return await Preorder.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    );
  }
}

export const preorderService = new PreorderService();
