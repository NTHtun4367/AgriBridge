import { authService } from "../../auth/services/auth";
import { IPreorder, Preorder } from "../models/preorder";

export class PreorderService {
  async createPreorder(payload: IPreorder) {
    const result = await Preorder.create(payload);
    return result;
  }

  async getAllPreorders(query: Record<string, unknown>) {
    // 1. Fetch preorders from MongoDB
    const preorders = await Preorder.find(query).lean();

    // 2. Enhance each preorder with merchant information manually
    const enhancedPreorders = await Promise.all(
      preorders.map(async (order) => {
        try {
          // Use your existing authService logic to get merchant/user data
          // merchantId in your schema is the User ID that owns the merchant profile
          const merchantUser = await authService.getMerchantById(
            order.merchantId.toString()
          );

          return {
            ...order,
            merchantInfo: merchantUser, // This adds name, businessName (via populated merchantId), etc.
          };
        } catch (error) {
          return { ...order, merchantInfo: null };
        }
      })
    );

    return enhancedPreorders;
  }

  async getMerchantPreorders(merchantId: string) {
    // 1. Fetch preorders where the merchant is the recipient
    const preorders = await Preorder.find({ merchantId })
      .sort({ createdAt: -1 })
      .lean();

    // 2. Enhance each preorder with Farmer information from the Auth Service
    const enhancedPreorders = await Promise.all(
      preorders.map(async (order) => {
        try {
          // Use your existing authService method to get farmer info
          const farmerProfile = await authService.getUserProfile(
            order.farmerId.toString()
          );

          return {
            ...order,
            farmerInfo: farmerProfile, // Includes name, email, location, etc.
          };
        } catch (error) {
          return { ...order, farmerInfo: null };
        }
      })
    );

    return enhancedPreorders;
  }
}

export const preorderService = new PreorderService();
