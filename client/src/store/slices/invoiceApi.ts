import { apiSlice } from "./api";
import type {
  CreateInvoiceRequest,
  IInvoiceResponse,
  UpdateStatusRequest,
} from "@/types/invoice";

export const invoiceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET Invoices
    getInvoices: builder.query<any[], void>({
      query: () => "/invoices/merchant",
      providesTags: ["Invoice"],
    }),

    getFarmerInvoices: builder.query<any[], void>({
      query: () => "/invoices/my-receipts",
      providesTags: ["Invoice"],
    }),

    // POST Create Invoice
    createInvoice: builder.mutation<IInvoiceResponse, CreateInvoiceRequest>({
      query: (newInvoice) => ({
        url: "/invoices",
        method: "POST",
        body: newInvoice,
      }),
      invalidatesTags: ["Invoice"],
    }),

    // PATCH Update Status (Manual)
    updateInvoiceStatus: builder.mutation<
      IInvoiceResponse,
      UpdateStatusRequest
    >({
      query: ({ id, status }) => ({
        url: `/invoices/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Invoice"],
    }),

    // NEW: Finalize Invoice (Triggered by Download)
    // This invalidates both tags because it updates the linked Preorder too
    finalizeInvoice: builder.mutation<IInvoiceResponse, string>({
      query: (id) => ({
        url: `/invoices/${id}/finalize`,
        method: "PATCH",
      }),
      invalidatesTags: ["Invoice", "Preorders"],
    }),

    // DELETE Invoice
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
  useFinalizeInvoiceMutation, // Exported for use in the UI
  useDeleteInvoiceMutation,
} = invoiceApi;
