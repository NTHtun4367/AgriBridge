import { apiSlice } from "./api";
import type { Crop, Market, MarketPriceResponse } from "@/types/market";

// 1. Define the shape of the update request
interface PriceUpdateEntry {
  cropId: string;
  price: number;
  unit: string;
}

interface UpdateMarketPricesRequest {
  marketId?: string; // Optional: Provided by Admin, omitted by Merchant
  updates: PriceUpdateEntry[];
}

export const marketApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCrops: builder.query<Crop[], undefined>({
      query: () => "/markets/crops",
    }),

    getAllMarkets: builder.query<Market[], undefined>({
      query: () => "/markets",
    }),

    // Updated to accept filters (e.g., userId for merchant profile or official=true for public wall)
    getMarketPrices: builder.query<
      MarketPriceResponse,
      { userId?: string; official?: boolean }
    >({
      query: (params) => {
        const queryString = new URLSearchParams();
        if (params.userId) queryString.append("userId", params.userId);
        if (params.official)
          queryString.append("official", params.official.toString());

        return `/markets/prices?${queryString.toString()}`;
      },
      providesTags: ["MarketPrice"],
    }),

    // 2. Updated Mutation with Type Safety
    updateMarketPrices: builder.mutation<any, UpdateMarketPricesRequest>({
      query: (body) => ({
        url: "/markets/update",
        method: "POST",
        body,
      }),
      // This tells RTK Query to refetch any component using 'getLatestPrices'
      invalidatesTags: ["MarketPrice"],
    }),

    getCropPriceHistory: builder.query({
      query: ({ cropId, marketId }) =>
        `/markets/analytics/history?cropId=${cropId}&marketId=${marketId}`,
      providesTags: ["MarketPrice"],
    }),
  }),
});

export const {
  useGetAllCropsQuery,
  useGetAllMarketsQuery,
  useUpdateMarketPricesMutation,
  useGetMarketPricesQuery,
  useGetCropPriceHistoryQuery,
} = marketApi;
