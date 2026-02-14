import { Preorder, IPreorder } from "../models/preorder";
import { authService } from "../../auth/services/auth";
import { notificationService } from "../../notification/services/notification";
import { autoTranslate } from "../../../shared/utils/ai";

export class PreorderService {
  /**
   * တောင်သူမှ အော်ဒါအသစ်တင်ခြင်းနှင့် ကုန်သည်ထံသို့ Notification ပို့ဆောင်ခြင်း
   */
  async createPreorder(payload: Partial<IPreorder>) {
    const preorder = await Preorder.create(payload);

    const { merchantId, fullName, items } = payload;

    if (merchantId) {
      try {
        const totalAmount =
          items?.reduce(
            (acc: number, item: any) =>
              acc + Number(item.quantity) * Number(item.price),
            0,
          ) || 0;

        const senderName = fullName || "တောင်သူတစ်ဦး";

        const title = "အော်ဒါအသစ် ရရှိပါသည်";
        const message = `${senderName} မှ ကျသင့်ငွေ ${totalAmount.toLocaleString()} MMK ရှိသော အော်ဒါအသစ်တစ်ခု တင်သွင်းထားပါသည်။`;

        await notificationService.createNotification(
          title,
          message,
          [merchantId.toString()],
          "merchant",
        );
      } catch (error) {
        console.error("Preorder Notification failed:", error);
      }
    }

    return preorder;
  }

  /**
   * ✅ တောင်သူကိုယ်တိုင် ၎င်း၏ အော်ဒါမှတ်တမ်းများ ပြန်ကြည့်ခြင်း (AI Translation ပါဝင်သည်)
   */
  async getAllPreorders(query: Record<string, any>) {
    const preorders = await Preorder.find(query).sort({ createdAt: -1 }).lean();

    return await Promise.all(
      preorders.map(async (order: any) => {
        let finalOrder = { ...order };

        const merchantInfo = await authService.getMerchantById(
          order.merchantId.toString(),
        );
        return { ...finalOrder, merchantInfo };
      }),
    );
  }

  async getMerchantPreorders(merchantId: string) {
    const preorders = await Preorder.find({ merchantId })
      .sort({ createdAt: -1 })
      .lean();

    return await Promise.all(
      preorders.map(async (order: any) => {
        let finalOrder = { ...order };

        try {
          const farmerInfo = await authService.getUserProfile(
            order.farmerId.toString(),
          );
          return { ...finalOrder, farmerInfo };
        } catch (error) {
          return { ...finalOrder, farmerInfo: { name: "အမည်မသိတောင်သူ" } };
        }
      }),
    );
  }

  /**
   * အော်ဒါအခြေအနေကို Update လုပ်ခြင်း
   */
  async updatePreorderStatus(id: string, status: string) {
    return await Preorder.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    );
  }
}

export const preorderService = new PreorderService();
