import { apiSlice } from "./api";

export const preorderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create Preorder
    createPreorder: builder.mutation({
      query: (data) => ({
        url: "/preorder/create-preorder",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Preorders"],
    }),

    // Fetches preorders for the logged-in farmer
    getMyPreorders: builder.query({
      query: () => ({
        url: `/preorder/my-preorders`,
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
        url: `/preorder/${id}/status`,
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