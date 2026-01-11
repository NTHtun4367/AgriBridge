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
      query: () => "/invoices",
      providesTags: ["Invoice"],
    }),

    // POST Create Invoice
    createInvoice: builder.mutation<IInvoiceResponse, CreateInvoiceRequest>({
      query: (newInvoice) => ({
        url: "/invoices",
        method: "POST",
        body: newInvoice,
      }),
      invalidatesTags: ["Invoice"], // Automatically refreshes the list
    }),

    // PATCH Update Status
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
  useCreateInvoiceMutation,
  useUpdateInvoiceStatusMutation,
  useDeleteInvoiceMutation,
} = merchantApi;
