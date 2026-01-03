import { apiSlice } from "./api";
import type { Crop, Market, MarketPriceResponse } from "@/types/market";

export const marketApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCrops: builder.query<Crop[], undefined>({
      query: () => "/markets/crops",
    }),
    getAllMarkets: builder.query<Market[], undefined>({
      query: () => "/markets",
    }),
    getLatestPrices: builder.query<MarketPriceResponse, void>({
      query: () => "/markets/latest",
      providesTags: ["MarketPrice"],
      // Optional: Polling to keep data fresh every 60 seconds
      // pollingInterval: 60000,
    }),
    updateMarketPrices: builder.mutation({
      query: (body) => ({
        url: "/markets/update",
        method: "POST",
        body,
      }),
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
  useGetLatestPricesQuery,
  useGetCropPriceHistoryQuery,
} = marketApi;
