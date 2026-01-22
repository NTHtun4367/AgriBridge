import type { User } from "@/types/user";
import { apiSlice } from "./api";

interface LoginRequest {
  identifier: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    role: "farmer" | "merchant" | "admin";
    verificationStatus: "unverified" | "pending" | "verified";
    merchantId?: string | null;
  };
}

interface RegisterFarmer extends LoginRequest {
  name: string;
  homeAddress: string;
  division: string;
  district: string;
  township: string;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    registerFarmer: builder.mutation({
      query: (data: RegisterFarmer) => ({
        url: "/auth/register/farmer",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["User"],
    }),

    registerMerchant: builder.mutation({
      query: (data: FormData) => ({
        url: "/auth/register/merchant",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    currentUser: builder.query<User, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    updateProfile: builder.mutation<User, Partial<User>>({
      query: (data) => ({
        url: "/auth/profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    updateAvatar: builder.mutation<{ avatar: string }, FormData>({
      query: (formData) => ({
        url: "/auth/profile/avatar",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),

    updateMerchantDocs: builder.mutation<{ message: string }, FormData>({
      query: (formData) => ({
        url: "/auth/profile/documents",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterFarmerMutation,
  useRegisterMerchantMutation,
  useCurrentUserQuery,
  useUpdateProfileMutation,
  useUpdateAvatarMutation,
  useUpdateMerchantDocsMutation,
} = authApi;
