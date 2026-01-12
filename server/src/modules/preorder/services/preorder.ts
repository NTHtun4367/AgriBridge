import { Preorder, IPreorder } from "../models/preorder";
import { authService } from "../../auth/services/auth";

export class PreorderService {
  async createPreorder(payload: Partial<IPreorder>) {
    return await Preorder.create(payload);
  }

  async getAllPreorders(query: Record<string, any>) {
    const preorders = await Preorder.find(query).sort({ createdAt: -1 }).lean();
    return await Promise.all(
      preorders.map(async (order) => {
        const merchantInfo = await authService.getMerchantById(order.merchantId.toString());
        return { ...order, merchantInfo };
      })
    );
  }

  async getMerchantPreorders(merchantId: string) {
    const preorders = await Preorder.find({ merchantId }).sort({ createdAt: -1 }).lean();
    return await Promise.all(
      preorders.map(async (order) => {
        const farmerInfo = await authService.getUserProfile(order.farmerId.toString());
        return { ...order, farmerInfo };
      })
    );
  }

  async updatePreorderStatus(id: string, status: string) {
    return await Preorder.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
  }
}

export const preorderService = new PreorderService();