import { apiSlice } from "./api";

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterFarmer extends LoginInput {
  name: string;
  homeAddress: string;
  division: string;
  district: string;
  township: string;
}

interface RegisterMerchant extends RegisterFarmer {
  businessName: string;
  phone: string;

  nrcRegion: string;
  nrcTownship: string;
  nrcType: string;
  nrcNumber: string;

  nrcFrontImage: {
    url: string;
    public_alt?: string;
  };

  nrcBackImage: {
    url: string;
    public_alt?: string;
  };
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data: LoginInput) => ({
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
      }),
      invalidatesTags: ["User"],
    }),

    registerMerchant: builder.mutation({
      query: (data: RegisterMerchant) => ({
        url: "/register/merchant",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterFarmerMutation,
  useRegisterMerchantMutation,
} = authApi;
