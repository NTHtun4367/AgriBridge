import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "..";

const origin =
  import.meta.env.VITE_MODE === "development"
    ? import.meta.env.VITE_LOCAL_API_URL
    : import.meta.env.VITE_API_URL;
const baseUrl = origin?.endsWith("/api/v1")
  ? origin
  : `${origin || "http://localhost:8000"}/api/v1`;

export const apiSlice = createApi({
  reducerPath: "apiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
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
  ], // used for auto re-fetching
  endpoints: () => ({}),
});
