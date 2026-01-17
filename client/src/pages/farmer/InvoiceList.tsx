import { useState, useRef } from "react";
import * as htmlToImage from "html-to-image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Receipt,
  CheckCircle,
  Clock,
  X,
  CreditCard,
  Image as ImageIcon,
  ChevronRight,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import {
  useFinalizeInvoiceMutation,
  useGetFarmerInvoicesQuery,
} from "@/store/slices/invoiceApi";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useGetMerchantInfoQuery } from "@/store/slices/farmerApi";

export default function InvoiceList() {
  const { data: invoices, isLoading: invoicesLoading } =
    useGetFarmerInvoicesQuery();
  const [finalize, { isLoading: isFinalizing }] = useFinalizeInvoiceMutation();

  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const { data: merchant, isLoading: merchantLoading } =
    useGetMerchantInfoQuery(
      selectedInvoice?.merchantId?._id || selectedInvoice?.merchantId,
      { skip: !selectedInvoice }
    );

  const handleComplete = async (id: string) => {
    try {
      await finalize(id).unwrap();
      toast.success("Transaction marked as paid!");
      if (selectedInvoice) {
        setSelectedInvoice({ ...selectedInvoice, status: "paid" });
      }
    } catch (err) {
      toast.error("Failed to finalize transaction");
    }
  };

  const handleDownloadImage = async () => {
    if (!invoiceRef.current) return;

    const loadingToast = toast.loading("Generating Receipt Image...");

    try {
      const dataUrl = await htmlToImage.toPng(invoiceRef.current, {
        quality: 1.0,
        pixelRatio: 3,
        backgroundColor: "#ffffff",
        filter: (node) => {
          const exclusionClasses = ["print-hidden"];
          return !exclusionClasses.some(
            (cls) => node instanceof HTMLElement && node.classList.contains(cls)
          );
        },
      });

      const link = document.createElement("a");
      link.download = `Receipt_${selectedInvoice.invoiceId}.png`;
      link.href = dataUrl;
      link.click();

      toast.dismiss(loadingToast);
      toast.success("Receipt saved to Photos");
    } catch (error) {
      console.error("Image Generation Error:", error);
      toast.dismiss(loadingToast);
      toast.error("Failed to generate image. Please try again.");
    }
  };

  if (invoicesLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-4 text-slate-500 animate-pulse">
          Loading your receipts...
        </p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      {/* --- ENHANCED HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2 text-primary mb-1">
            <Receipt size={20} />
            <span className="text-xs font-bold uppercase tracking-widest">
              Billing History
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Digital Receipts
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            View, pay, and download your transaction records.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
          <div className="px-3 py-1.5 bg-white shadow-sm rounded-md text-xs font-bold text-slate-700">
            All Invoices ({invoices?.length || 0})
          </div>
        </div>
      </div>

      {/* --- ENHANCED INVOICE LIST --- */}
      <div className="grid gap-4">
        {invoices?.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <div className="bg-white p-4 rounded-full shadow-sm inline-block mb-4">
              <Search className="text-slate-300" size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              No receipts yet
            </h3>
            <p className="text-slate-500 max-w-xs mx-auto text-sm">
              When you complete a purchase or receive an invoice, it will appear
              here.
            </p>
          </div>
        ) : (
          invoices?.map((inv: any) => (
            <Card
              key={inv._id}
              className="group border-none shadow-sm hover:shadow-md transition-all cursor-pointer bg-white overflow-hidden relative"
              onClick={() => setSelectedInvoice(inv)}
            >
              {/* Status Side-Bar Color */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  inv.status === "paid" ? "bg-green-500" : "bg-amber-500"
                }`}
              />

              <CardContent className="p-5 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div
                    className={`p-3 rounded-2xl shrink-0 ${
                      inv.status === "paid"
                        ? "bg-green-50 text-green-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {inv.status === "paid" ? (
                      <CheckCircle size={24} />
                    ) : (
                      <Clock size={24} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-lg leading-tight group-hover:text-primary transition-colors">
                      {merchant?.merchantId?.businessName || "Agri Merchant"}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-500 uppercase">
                        #{inv.invoiceId}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500 font-medium">
                        {new Date(inv.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-6 border-t md:border-none pt-4 md:pt-0">
                  <div className="text-left md:text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      Amount Due
                    </p>
                    <span className="text-xl font-black text-slate-900 tracking-tight">
                      {inv.totalAmount.toLocaleString()}{" "}
                      <span className="text-xs font-bold text-slate-400">
                        MMK
                      </span>
                    </span>
                  </div>
                  <ChevronRight className="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* --- MODAL (Kept exactly as requested) --- */}
      <Dialog
        open={!!selectedInvoice}
        onOpenChange={() => setSelectedInvoice(null)}
      >
        <DialogContent className="max-w-2xl p-0 overflow-hidden border-none bg-transparent shadow-none">
          {selectedInvoice && (
            <div className="relative">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="absolute -top-12 right-0 text-white flex items-center gap-2 font-bold print-hidden"
              >
                <X size={20} /> Close
              </button>

              {/* CAPTURE AREA */}
              <div ref={invoiceRef}>
                <Card className="border-none shadow-2xl overflow-hidden bg-white min-h-[700px] flex flex-col">
                  <div className="h-2 bg-primary w-full" />
                  <CardContent className="p-8 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-12">
                      <div>
                        <div className="bg-primary text-white p-2 inline-block rounded-lg mb-4">
                          <Receipt size={24} />
                        </div>
                        <h2 className="text-2xl font-black tracking-tighter">
                          INVOICE
                        </h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                          #{selectedInvoice.invoiceId}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xl text-primary italic">
                          AgriBridge
                        </p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">
                          Platform Verified Receipt
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mb-12 text-sm">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">
                          Billed From
                        </p>
                        {merchantLoading ? (
                          <div className="h-4 w-32 bg-slate-100 animate-pulse rounded" />
                        ) : (
                          <>
                            <p className="font-bold text-slate-900">
                              {merchant?.merchantId?.businessName}
                            </p>
                            <p className="text-slate-500 text-xs">
                              {merchant?.township}, {merchant?.division}
                            </p>
                            <p className="text-slate-500 text-xs">
                              {merchant?.merchantId?.phone}
                            </p>
                          </>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">
                          Status
                        </p>
                        <span
                          className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                            selectedInvoice.status === "paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {selectedInvoice.status}
                        </span>
                        <p className="mt-4 text-[10px] text-slate-400 font-bold uppercase">
                          Date Issued
                        </p>
                        <p className="font-bold text-xs">
                          {new Date(
                            selectedInvoice.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex-1">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b-2 border-slate-100 text-[10px] uppercase text-slate-400 font-bold">
                            <th className="text-left pb-3">Item</th>
                            <th className="text-center pb-3">Qty</th>
                            <th className="text-right pb-3">Price</th>
                            <th className="text-right pb-3">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedInvoice.items?.map(
                            (item: any, i: number) => (
                              <tr key={i} className="border-b border-slate-50">
                                <td className="py-4 font-medium text-slate-900">
                                  {item.cropName}
                                </td>
                                <td className="py-4 text-center">
                                  {item.quantity} {item.unit}
                                </td>
                                <td className="py-4 text-right">
                                  {item.price.toLocaleString()}
                                </td>
                                <td className="py-4 text-right font-bold text-slate-900">
                                  {(
                                    item.quantity * item.price
                                  ).toLocaleString()}{" "}
                                  MMK
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-8 pt-4 border-t-2 border-slate-900 flex justify-between items-center text-xl font-black">
                      <span>Total Due</span>
                      <span className="text-primary">
                        {selectedInvoice.totalAmount.toLocaleString()} MMK
                      </span>
                    </div>

                    <div className="mt-12 flex gap-3 print-hidden">
                      {selectedInvoice.status !== "paid" ? (
                        <Button
                          className="flex-1 py-6 gap-2"
                          onClick={() => handleComplete(selectedInvoice._id)}
                          disabled={isFinalizing}
                        >
                          <CreditCard size={18} /> Pay & Complete
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          className="flex-1 py-6 gap-2 text-green-700 bg-green-50 border-green-200"
                          onClick={handleDownloadImage}
                        >
                          <ImageIcon size={18} /> Save Receipt to Gallery
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
