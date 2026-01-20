import { apiSlice } from "./api";

export const disputeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * FARMER: Create a new dispute
     * Triggered by: Farmer
     */
    createDispute: builder.mutation({
      query: (newDispute) => ({
        url: "/disputes",
        method: "POST",
        body: newDispute,
      }),
      invalidatesTags: ["Dispute"],
    }),

    /**
     * FARMER: Get disputes filed by the logged-in user
     * Triggered by: Farmer
     */
    getMyDisputes: builder.query({
      query: () => "/disputes/my-disputes",
      providesTags: ["Dispute"],
    }),

    /**
     * ADMIN: Get all reports in the system
     * Triggered by: Admin
     */
    getDisputes: builder.query({
      query: () => "/disputes/admin/all",
      providesTags: ["Dispute"],
    }),

    /**
     * ADMIN: Update the status of a dispute
     * Triggered by: Admin
     */
    updateDisputeStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/disputes/admin/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Dispute"],
    }),
  }),
});

export const {
  useCreateDisputeMutation,
  useGetMyDisputesQuery,
  useGetDisputesQuery,
  useUpdateDisputeStatusMutation,
} = disputeApi;
