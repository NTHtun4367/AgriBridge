import { apiSlice } from "./api";
import type {
  CreateInvoiceRequest,
  IInvoiceResponse,
  UpdateStatusRequest,
} from "@/types/invoice";

export const merchantApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET Invoices
    getInvoices: builder.query<IInvoiceResponse[], void>({
      query: () => "/merchants/invoices",
      providesTags: ["Invoice"],
    }),

    // POST Create Invoice
    createInvoice: builder.mutation<IInvoiceResponse, CreateInvoiceRequest>({
      query: (newInvoice) => ({
        url: "/merchants/invoices",
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
        url: `/merchants/invoices/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Invoice"],
    }),

    // NEW: Finalize Invoice (Triggered by Download)
    // This invalidates both tags because it updates the linked Preorder too
    finalizeInvoice: builder.mutation<IInvoiceResponse, string>({
      query: (id) => ({
        url: `/merchants/invoices/${id}/finalize`,
        method: "PATCH",
      }),
      invalidatesTags: ["Invoice", "Preorders"],
    }),

    // DELETE Invoice
    deleteInvoice: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/merchants/invoices/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Invoice"],
    }),
  }),
});

export const {
  useGetInvoicesQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceStatusMutation,
  useFinalizeInvoiceMutation, // Exported for use in the UI
  useDeleteInvoiceMutation,
} = merchantApi;
