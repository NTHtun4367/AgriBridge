import { apiSlice } from "./api";

export const farmerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Starts the season using the generated name string
    startSeason: builder.mutation<any, string>({
      query: (name) => ({
        url: "/farmers/seasons/start",
        method: "POST",
        body: { name },
      }),
      invalidatesTags: ["Season"],
    }),

    // Ends the season (updates isActive to false)
    endSeason: builder.mutation<any, string>({
      query: (id) => ({
        url: `/farmers/seasons/${id}/end`,
        method: "PATCH",
      }),
      invalidatesTags: ["Season"],
    }),

    // Submits the "Invoice" array of crop rows
    registerCropsBulk: builder.mutation<
      any,
      { seasonId: string; crops: any[] }
    >({
      query: (body) => ({
        url: "/farmers/crops/bulk",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Crop"],
    }),

    // Gets all crops registered for a specific season ID
    getCrops: builder.query<any[], string>({
      query: (seasonId) => `/farmers/crops?seasonId=${seasonId}`,
      providesTags: ["Crop"],
    }),

    getActiveSeason: builder.query<any, void>({
      query: () => "/farmers/seasons/active",
      providesTags: ["Season"],
    }),
  }),
});

export const {
  useStartSeasonMutation,
  useEndSeasonMutation,
  useRegisterCropsBulkMutation,
  useGetCropsQuery,
  useGetActiveSeasonQuery,
} = farmerApi;
