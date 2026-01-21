import type { Entry } from "@/types/entry";
import { apiSlice } from "./api";

export interface IFinanceStats {
  totalIncome: number;
  totalExpense: number;
  profit: number;
}

export const farmerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Updated to accept an optional season string
    getFinanceStats: builder.query<IFinanceStats, string | void>({
      query: (season) => ({
        url: "/farmers/finance/stats",
        params: season && season !== "all" ? { season } : {},
      }),
      providesTags: ["FinanceStats"],
    }),

    addEntry: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: "/farmers/add-entry",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["FinanceStats", "Entries"],
    }),

    getAllEntries: builder.query<Entry[], void>({
      query: () => "/farmers/entries",
      providesTags: ["Entries"],
    }),

    getEntryById: builder.query<Entry, string>({
      query: (id) => `/farmers/entries/${id}`,
      providesTags: ["Entries"],
    }),

    getMerchants: builder.query<any[], any>({
      query: (params) => ({
        url: "/farmers/merchants",
        params: params,
      }),
    }),

    getMerchantInfo: builder.query<any, string>({
      query: (userId) => `/farmers/merchants/${userId}`,
      providesTags: ["Merchant"],
    }),
  }),
});

export const {
  useGetFinanceStatsQuery,
  useAddEntryMutation,
  useGetAllEntriesQuery,
  useGetEntryByIdQuery,
  useGetMerchantsQuery,
  useGetMerchantInfoQuery,
} = farmerApi;
