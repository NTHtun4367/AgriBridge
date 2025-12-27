import { apiSlice } from "./api";
import type { Crop, Market } from "@/types/market";

export const marketApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCrops: builder.query<Crop[], undefined>({
      query: () => "crops/all",
    }),
    getAllMarkets: builder.query<Market[], undefined>({
      query: () => "markets/all",
    }),
    updateMarketPrices: builder.mutation({
      query: (body) => ({
        url: "/market-prices/update",
        method: "POST",
        body,
      }),
      invalidatesTags: ["MarketPrice"],
    }),
  }),
});

export const {
  useGetAllCropsQuery,
  useGetAllMarketsQuery,
  useUpdateMarketPricesMutation,
} = marketApi;
