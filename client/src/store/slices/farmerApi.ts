import { apiSlice } from "./api";

export interface IFinanceStats {
  totalIncome: number;
  totalExpense: number;
  profit: number;
}

export const farmerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFinanceStats: builder.query<IFinanceStats, void>({
      query: () => "/farmers/finance/stats",
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
  }),
});

export const { useGetFinanceStatsQuery, useAddEntryMutation } = farmerApi;
