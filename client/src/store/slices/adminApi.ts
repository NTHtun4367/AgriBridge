import type { User } from "@/types/user";
import { apiSlice } from "./api";
import type { MerchantInfo } from "@/types/merchant";

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllFarmers: builder.query<User[], undefined>({
      query: () => "/farmers/all",
      providesTags: ["Farmer"],
    }),

    changeUserStatus: builder.mutation({
      query: ({ userId, status }) => ({
        url: `/users/${userId}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Farmer", "Merchant"],
    }),

    getAllVerificationPendingUsers: builder.query<User[], undefined>({
      query: () => "/users/verification/pending",
      providesTags: ["Merchant"],
    }),

    updateUserVerificationStatus: builder.mutation({
      query: ({ userId, status }) => ({
        url: `/users/verification/${userId}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Farmer", "Merchant"],
    }),

    getMerchantInfoForAdmin: builder.query<MerchantInfo, string>({
      query: (merchantId) => `/users/${merchantId}`,
      providesTags: ["Merchant"],
    }),
  }),
});

export const {
  useGetAllFarmersQuery,
  useChangeUserStatusMutation,
  useGetAllVerificationPendingUsersQuery,
  useUpdateUserVerificationStatusMutation,
  useGetMerchantInfoForAdminQuery,
} = adminApi;
