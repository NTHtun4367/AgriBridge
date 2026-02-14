import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "..";

const origin =
  import.meta.env.VITE_MODE === "development"
    ? import.meta.env.VITE_LOCAL_API_URL
    : import.meta.env.VITE_API_URL;

const baseUrl = origin?.endsWith("/api/v1")
  ? origin
  : `${origin || "http://localhost:8000"}/api/v1`;

// 1. BaseQuery ကို အခြေခံပြီး Custom BaseQuery တစ်ခု တည်ဆောက်ပါ
const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// 2. GET request တိုင်းမှာ lang query ထည့်ပေးမည့် Wrapper Logic
const baseQueryWithLang: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Redux Settings Slice ထဲမှ လက်ရှိ language ကို ယူပါ
  const state = api.getState() as RootState;
  const currentLang = state.settings?.lang || "en";

  // အကယ်၍ args က string ဖြစ်နေရင် (ဥပမာ- '/entries') object အဖြစ်ပြောင်းပါ
  let newArgs = typeof args === "string" ? { url: args } : { ...args };

  // Method က GET ဖြစ်ခဲ့လျှင် lang query အသစ်ထည့်မည် (သို့မဟုတ် ရှိပြီးသားထဲပေါင်းမည်)
  if (!newArgs.method || newArgs.method.toUpperCase() === "GET") {
    newArgs.params = {
      ...newArgs.params,
      lang: currentLang,
    };
  }

  return rawBaseQuery(newArgs, api, extraOptions);
};

export const apiSlice = createApi({
  reducerPath: "apiSlice",
  baseQuery: baseQueryWithLang, // ပြင်ဆင်ထားသော query ကို အသုံးပြုပါ
  tagTypes: [
    "User",
    "MarketPrice",
    "Merchant",
    "Farmer",
    "FinanceStats",
    "Entries",
    "Invoice",
    "Preorders",
    "Notification",
    "Crops",
    "Markets",
    "Announcement",
    "Dispute",
    "Dashboard",
    "Crop",
    "Season",
  ],
  endpoints: () => ({}),
});
