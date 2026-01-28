import { apiSlice } from "./api";

export interface SeasonalData {
  season: string;
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
}

export const reportApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSeasonalSummary: builder.query<SeasonalData[], string>({
      query: (userId) => `/seasonal-summary/${userId}`,
    }),
    getAiAnalysis: builder.mutation<
      { advice: string },
      { userId: string; season: string }
    >({
      query: (body) => ({
        url: "/ai-analyze",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetSeasonalSummaryQuery, useGetAiAnalysisMutation } =
  reportApi;
