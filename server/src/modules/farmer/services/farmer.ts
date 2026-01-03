import { authService } from "../../auth/services/auth";

export class FarmerService {
  async getVerifiedMerchants(
    division: string,
    district: string,
    township: string
  ) {
    // Base filter: only verified active merchants with a linked profile
    const filter: any = {
      role: "merchant",
      verificationStatus: "verified",
      status: "active",
      merchantId: { $exists: true },
    };

    // Add location filters only if they are provided in the query
    if (division && division !== "undefined") filter.division = division;
    if (district && district !== "undefined") filter.district = district;
    if (township && township !== "undefined") filter.township = township;

    const merchants = await authService.getMerchants(filter);

    return merchants;
  }
}

export const farmerService = new FarmerService();
