import { apiSlice } from "./api";
import type { Crop, Market, MarketPriceResponse } from "@/types/market";

// 1. Types for Price Updates
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
    /* ---------------- CROP ENDPOINTS ---------------- */
    getAllCrops: builder.query<Crop[], undefined>({
      query: () => "/markets/crops",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Crops" as const, id: _id })),
              { type: "Crops", id: "LIST" },
            ]
          : [{ type: "Crops", id: "LIST" }],
    }),

    createCrop: builder.mutation<Crop, Partial<Crop>>({
      query: (body) => ({ url: "/markets/crops", method: "POST", body }),
      invalidatesTags: [{ type: "Crops", id: "LIST" }],
    }),

    updateCrop: builder.mutation<Crop, { id: string; data: Partial<Crop> }>({
      query: ({ id, data }) => ({
        url: `/markets/crops/${id}`,
        method: "PUT",
        body: data,
      }),
      // Invalidates the specific crop and the list
      invalidatesTags: (result, error, { id }) => [
        { type: "Crops", id },
        { type: "Crops", id: "LIST" },
      ],
    }),

    deleteCrop: builder.mutation<void, string>({
      query: (id) => ({ url: `/markets/crops/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Crops", id: "LIST" }],
    }),

    /* ---------------- MARKET ENDPOINTS ---------------- */
    getAllMarkets: builder.query<Market[], undefined>({
      query: () => "/markets",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: "Markets" as const,
                id: _id,
              })),
              { type: "Markets", id: "LIST" },
            ]
          : [{ type: "Markets", id: "LIST" }],
    }),

    createMarket: builder.mutation<Market, Partial<Market>>({
      query: (body) => ({ url: "/markets", method: "POST", body }),
      invalidatesTags: [{ type: "Markets", id: "LIST" }],
    }),

    updateMarket: builder.mutation<
      Market,
      { id: string; data: Partial<Market> }
    >({
      query: ({ id, data }) => ({
        url: `/markets/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Markets", id },
        { type: "Markets", id: "LIST" },
      ],
    }),

    deleteMarket: builder.mutation<void, string>({
      query: (id) => ({ url: `/markets/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Markets", id: "LIST" }],
    }),

    /* ---------------- PRICE & ANALYTICS ---------------- */
    getMarketPrices: builder.query<
      MarketPriceResponse,
      { userId?: string; official?: boolean; marketId?: string } // Added marketId
    >({
      query: (params) => {
        const queryString = new URLSearchParams();
        if (params.userId) queryString.append("userId", params.userId);
        if (params.official !== undefined)
          queryString.append("official", params.official.toString());
        if (params.marketId && params.marketId !== "all")
          queryString.append("marketId", params.marketId);

        return `/markets/prices?${queryString.toString()}`;
      },
      providesTags: ["MarketPrice"],
    }),

    updateMarketPrices: builder.mutation<any, UpdateMarketPricesRequest>({
      query: (body) => ({
        url: "/markets/update",
        method: "POST",
        body,
      }),
      // Refetches price lists and history charts
      invalidatesTags: ["MarketPrice"],
    }),

    getCropPriceHistory: builder.query<
      any,
      { cropId: string; marketId: string }
    >({
      query: ({ cropId, marketId }) =>
        `/markets/analytics/history?cropId=${cropId}&marketId=${marketId}`,
      providesTags: ["MarketPrice"],
    }),
  }),
});

export const {
  useGetAllCropsQuery,
  useCreateCropMutation,
  useUpdateCropMutation,
  useDeleteCropMutation,
  useGetAllMarketsQuery,
  useCreateMarketMutation,
  useUpdateMarketMutation,
  useDeleteMarketMutation, // Added this hook
  useUpdateMarketPricesMutation,
  useGetMarketPricesQuery,
  useGetCropPriceHistoryQuery,
} = marketApi;
