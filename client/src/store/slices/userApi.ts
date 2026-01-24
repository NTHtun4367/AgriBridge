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

    verifyOtp: builder.mutation({
      query: (data: { identifier: string; otp: string }) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    requestIdentifierChange: builder.mutation<
      { message: string },
      { newIdentifier: string }
    >({
      query: (data) => ({
        url: "/auth/request-identifier-change",
        method: "POST",
        body: data, // Sending { newIdentifier }
      }),
    }),

    confirmIdentifierChange: builder.mutation<
      { message: string },
      { otp: string }
    >({
      query: (data) => ({
        url: "/auth/confirm-identifier-change",
        method: "POST",
        body: data, // Sending { otp }
      }),
      invalidatesTags: ["User"],
    }),

    // Resend OTP
    resendOtp: builder.mutation<{ message: string }, { identifier: string }>({
      query: (data) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useRequestIdentifierChangeMutation,
  useConfirmIdentifierChangeMutation,
  useRegisterFarmerMutation,
  useRegisterMerchantMutation,
  useCurrentUserQuery,
  useUpdateProfileMutation,
  useUpdateAvatarMutation,
  useUpdateMerchantDocsMutation,
} = authApi;
