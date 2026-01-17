import { apiSlice } from "./api";
import type {
  CreateInvoiceRequest,
  IInvoiceResponse,
  UpdateStatusRequest,
} from "@/types/invoice";

export const invoiceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInvoices: builder.query<IInvoiceResponse[], void>({
      query: () => "/invoices/merchant",
      providesTags: ["Invoice"],
    }),

    getFarmerInvoices: builder.query<IInvoiceResponse[], void>({
      query: () => "/invoices/my-receipts",
      providesTags: ["Invoice"],
    }),

    createInvoice: builder.mutation<IInvoiceResponse, CreateInvoiceRequest>({
      query: (newInvoice) => ({
        url: "/invoices",
        method: "POST",
        body: newInvoice,
      }),
      invalidatesTags: ["Invoice"],
    }),

    updateInvoiceStatus: builder.mutation<
      IInvoiceResponse,
      UpdateStatusRequest
    >({
      query: ({ id, status }) => ({
        url: `/invoices/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Invoice", "Preorders"],
    }),

    finalizeInvoice: builder.mutation<IInvoiceResponse, string>({
      query: (id) => ({
        url: `/invoices/${id}/finalize`,
        method: "PATCH",
      }),
      invalidatesTags: ["Invoice", "Preorders"],
    }),

    deleteInvoice: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/invoices/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Invoice"],
    }),
  }),
});

export const {
  useGetInvoicesQuery,
  useGetFarmerInvoicesQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceStatusMutation,
  useFinalizeInvoiceMutation,
  useDeleteInvoiceMutation,
} = invoiceApi;
