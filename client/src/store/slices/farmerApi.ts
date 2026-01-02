import { apiSlice } from "./api";

export const farmerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addEntry: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: "/farmers/add-entry",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Farmer"],
    }),
  }),
});

export const { useAddEntryMutation } = farmerApi;
