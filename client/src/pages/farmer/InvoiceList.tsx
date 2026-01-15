import { useState, useRef } from "react";
import * as htmlToImage from "html-to-image"
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Receipt,
  CheckCircle,
  Clock,
  X,
  CreditCard,
  Image as ImageIcon,
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

  /**
   * This generates a high-quality KPay style image.
   */
  const handleDownloadImage = async () => {
    if (!invoiceRef.current) return;

    const loadingToast = toast.loading("Generating Receipt Image...");
    
    try {
      // html-to-image preserves modern CSS better than html2canvas
      const dataUrl = await htmlToImage.toPng(invoiceRef.current, {
        quality: 1.0,
        pixelRatio: 3, // For high-res "KPay style" sharp text
        backgroundColor: "#ffffff",
        // Hides the "Save" button in the final image
        filter: (node) => {
          const exclusionClasses = ['print-hidden'];
          return !exclusionClasses.some(cls => 
            node instanceof HTMLElement && node.classList.contains(cls)
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
    return <div className="p-10 text-center">Loading receipts...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Digital Receipts</h1>
        <Receipt className="text-primary" />
      </div>

      {/* --- INVOICE LIST --- */}
      <div className="grid gap-4">
        {invoices?.map((inv: any) => (
          <Card
            key={inv._id}
            className="border-l-4 border-l-primary hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedInvoice(inv)}
          >
            <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-full ${
                    inv.status === "paid" ? "bg-green-100" : "bg-amber-100"
                  }`}
                >
                  {inv.status === "paid" ? (
                    <CheckCircle className="text-green-600" />
                  ) : (
                    <Clock className="text-amber-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg">
                    {inv.merchantId?.businessName || "Agri Merchant"}
                  </h3>
                  <p className="text-sm text-slate-500">#{inv.invoiceId}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-primary">
                  {inv.totalAmount.toLocaleString()} MMK
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* --- MODAL --- */}
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
                              {merchant?.merchantId?.businessName || "Agri Merchant"}
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
                                <td className="py-4 font-medium">
                                  {item.cropName}
                                </td>
                                <td className="py-4 text-center">
                                  {item.quantity} {item.unit}
                                </td>
                                <td className="py-4 text-right">
                                  {item.price.toLocaleString()}
                                </td>
                                <td className="py-4 text-right font-bold">
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
                          <ImageIcon size={18} /> Save Receipt to Photos
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