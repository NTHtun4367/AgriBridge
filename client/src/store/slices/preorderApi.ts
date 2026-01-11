import { apiSlice } from "./api";

export const preorderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPreorder: builder.mutation({
      query: (data) => ({
        url: "/preorder/create-preorder",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Preorders"],
    }),
    // New query to fetch preorders for a specific farmer
    getMyPreorders: builder.query({
      query: (farmerId) => ({
        url: `/preorder/my-preorders?farmerId=${farmerId}`,
        method: "GET",
      }),
      providesTags: ["Preorders"],
    }),
    // For Merchant: Get orders received from farmers
    getMerchantPreorders: builder.query({
      query: (merchantId) => `/preorder/merchant?merchantId=${merchantId}`,
      providesTags: ["Preorders"],
    }),

    // Update Status (Confirm/Cancel/Delivered)
    updatePreorderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Preorders"],
    }),
  }),
});

export const {
  useCreatePreorderMutation,
  useGetMyPreordersQuery,
  useGetMerchantPreordersQuery,
  useUpdatePreorderStatusMutation,
} = preorderApi;
