import { apiSlice } from "./api";
import type { Crop, Market } from "@/types/market";

export const marketApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCrops: builder.query<Crop[], undefined>({
      query: () => "/markets/crops",
    }),
    getAllMarkets: builder.query<Market[], undefined>({
      query: () => "/markets",
    }),
    updateMarketPrices: builder.mutation({
      query: (body) => ({
        url: "/markets/update",
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
