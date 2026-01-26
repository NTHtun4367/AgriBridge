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
  useGetMerchantsQuery,
  useGetMerchantInfoQuery,
} = farmerApi;
