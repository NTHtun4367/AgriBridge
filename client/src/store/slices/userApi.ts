import type { Farmer } from "@/types/farmer";
import { apiSlice } from "./api";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    role: "farmer" | "merchant" | "admin";
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

// interface RegisterMerchant extends RegisterFarmer {
//   businessName: string;
//   phone: string;

//   nrcRegion: string;
//   nrcTownship: string;
//   nrcType: string;
//   nrcNumber: string;

//   nrcFrontImage: {
//     url: string;
//     public_alt?: string;
//   };

//   nrcBackImage: {
//     url: string;
//     public_alt?: string;
//   };
// }

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    registerFarmer: builder.mutation({
      query: (data: RegisterFarmer) => ({
        url: "/register/farmer",
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
        url: "/register/merchant",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    getAllFarmers: builder.query<Farmer[], undefined>({
      query: () => "/farmers/all",
      providesTags: ["Farmer"],
    }),

    changeUserStatus: builder.mutation({
      query: ({ userId, status }) => ({
        url: `/users/${userId}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Farmer"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterFarmerMutation,
  useRegisterMerchantMutation,
  useGetAllFarmersQuery,
  useChangeUserStatusMutation,
} = authApi;
