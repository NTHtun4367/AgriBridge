import type { Entry } from "@/types/entry";
import { apiSlice } from "./api";

export const entryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addEntry: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: "/entries/add-entry",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["FinanceStats", "Entries"],
    }),

    getAllEntries: builder.query<Entry[], void>({
      query: () => "/entries",
      providesTags: ["Entries"],
    }),

    getEntryById: builder.query<Entry, string>({
      query: (id) => `/entries/${id}`,
      providesTags: ["Entries"],
    }),
  }),
});

export const {
  useAddEntryMutation,
  useGetAllEntriesQuery,
  useGetEntryByIdQuery,
} = entryApi;
