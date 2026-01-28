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
      providesTags: (result, error, id) => [{ type: "Entries", id }],
    }),

    // --- NEW: Update Mutation ---
    updateEntry: builder.mutation<Entry, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/entries/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        "FinanceStats",
        "Entries",
        { type: "Entries", id },
      ],
    }),

    // --- NEW: Delete Mutation ---
    deleteEntry: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/entries/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["FinanceStats", "Entries"],
    }),
  }),
});

export const {
  useAddEntryMutation,
  useGetAllEntriesQuery,
  useGetEntryByIdQuery,
  useUpdateEntryMutation,
  useDeleteEntryMutation,
} = entryApi;
