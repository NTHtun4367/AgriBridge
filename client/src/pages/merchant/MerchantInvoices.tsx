import { useState, useRef, useMemo } from "react";
import * as htmlToImage from "html-to-image";
import { useTranslation } from "react-i18next";
import {
  Receipt,
  CheckCircle,
  Search,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ChevronRight,
  Loader2,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import StatusCard from "@/common/StatusCard";
import { useGetInvoicesQuery } from "@/store/slices/invoiceApi";

export default function MerchantInvoices() {
  const { t, i18n } = useTranslation();

  // --- API HOOKS ---
  const { data: invoices, isLoading } = useGetInvoicesQuery();

  // --- STATE ---
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const invoiceRef = useRef<HTMLDivElement>(null);

  // --- STATS CALCULATION ---
  const stats = useMemo(() => {
    if (!invoices || !Array.isArray(invoices))
      return { total: 0, pending: 0, collected: 0 };
    return invoices.reduce(
      (acc, inv) => {
        const amount = inv.totalAmount ?? 0;
        acc.total += amount;
        if (inv.status === "paid") acc.collected += amount;
        else acc.pending += amount;
        return acc;
      },
      { total: 0, pending: 0, collected: 0 },
    );
  }, [invoices]);

  // --- FILTER LOGIC ---
  const filteredInvoices = useMemo(() => {
    if (!invoices) return [];
    return invoices.filter(
      (inv) =>
        inv.farmerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.invoiceId?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [invoices, searchTerm]);

  // --- HANDLERS ---
  const handleExportImage = async () => {
    if (!invoiceRef.current) return;

    const loadingToast = toast.loading(t("merchant_invoices.modal.generating"));

    try {
      const dataUrl = await htmlToImage.toPng(invoiceRef.current, {
        quality: 1.0,
        pixelRatio: 3,
        backgroundColor: "#ffffff",
        filter: (node) => {
          const exclusionClasses = ["print-hidden"];
          return !exclusionClasses.some(
            (cls) =>
              node instanceof HTMLElement && node.classList.contains(cls),
          );
        },
      });

      const link = document.createElement("a");
      link.download = `Receipt_${selectedInvoice.invoiceId}.png`;
      link.href = dataUrl;
      link.click();

      toast.dismiss(loadingToast);
      toast.success(t("merchant_invoices.modal.save_gallery") + " Success");
    } catch (error) {
      console.error("Image Generation Error:", error);
      toast.dismiss(loadingToast);
      toast.error("Failed to generate image.");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      i18n.language === "my" ? "my-MM" : "en-GB",
    );
  };

  if (isLoading)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="mt-4 text-slate-500 font-medium">
          {t("merchant_invoices.modal.syncing")}
        </p>
      </div>
    );

  return (
    <div className="w-full min-h-screen p-4 animate-in slide-in-from-bottom-4 duration-500 space-y-6">
      {/* Overview Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mm:leading-loose">{t("merchant_invoices.title")}</h2>
          <p className="text-sm text-slate-500 mm:leading-loose">
            {t("merchant_invoices.subtitle")}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatusCard
          title={t("merchant_invoices.stats.total_volume")}
          bgColor="bg-blue-500/15"
          value={stats.total}
          icon={<TrendingUp className="w-6 h-6 text-blue-500" />}
        />
        <StatusCard
          title={t("merchant_invoices.stats.total_collected")}
          bgColor="bg-emerald-500/15"
          value={stats.collected}
          icon={<CheckCircle className="w-6 h-6 text-green-600" />}
        />
        <StatusCard
          title={t("merchant_invoices.stats.pending_receivables")}
          bgColor="bg-red-500/15"
          value={stats.pending}
          icon={<TrendingDown className="w-6 h-6 text-red-500" />}
        />
      </div>

      {/* Main List Card */}
      <Card>
        <CardTitle className="px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-lg font-bold">
              {t("merchant_invoices.list.title")}
            </h2>
            <div className="relative w-full md:w-72">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <Input
                placeholder={t("merchant_invoices.list.search_placeholder")}
                className="pl-9 bg-slate-50 border-none h-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardTitle>
        <CardContent className="px-6">
          <div className="grid grid-cols-1 gap-3">
            {filteredInvoices.length === 0 ? (
              <div className="py-10 text-center text-slate-400">
                {t("merchant_invoices.list.no_data")}
              </div>
            ) : (
              filteredInvoices.map((inv) => (
                <div
                  key={inv._id}
                  onClick={() => setSelectedInvoice(inv)}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-2xl ${
                        inv.status === "paid"
                          ? "bg-green-600/15 text-primary"
                          : "bg-amber-100 text-amber-600"
                      }`}
                    >
                      <Receipt size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold">{inv.farmerName}</h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {inv.invoiceId} • {formatDate(inv.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right mm:-space-y-2">
                      <p
                        className={`font-bold ${inv.status === "paid" && "text-primary"}`}
                      >
                        {inv.totalAmount.toLocaleString()} MMK
                      </p>
                      <Badge
                        variant="outline"
                        className={`text-[10px] uppercase font-bold border-none p-0 h-auto ${
                          inv.status === "paid"
                            ? "text-green-600"
                            : "text-amber-500"
                        }`}
                      >
                        {inv.status}
                      </Badge>
                    </div>
                    <ChevronRight
                      className="text-slate-300 group-hover:text-primary transition-colors"
                      size={18}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Info Footer */}
      <Card className="border-2 border-slate-100 rounded-2xl p-6 shadow">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-blue-100 text-primary rounded-2xl mm:mt-2">
            <DollarSign size={20} />
          </div>
          <div>
            <h4 className="font-bold mm:-mt-3">{t("merchant_invoices.footer.title")}</h4>
            <p className="text-xs text-slate-500 font-medium mm:-mb-3">
              {t("merchant_invoices.footer.description")}
            </p>
          </div>
        </div>
      </Card>

      {/* --- INVOICE MODAL --- */}
      <Dialog
        open={!!selectedInvoice}
        onOpenChange={() => setSelectedInvoice(null)}
      >
        <DialogContent className="max-w-2xl p-0 overflow-hidden border-none bg-transparent shadow-none">
          <DialogHeader className="sr-only">
            <DialogTitle>{t("merchant_invoices.list.title")}</DialogTitle>
          </DialogHeader>

          {selectedInvoice && (
            <div className="relative">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="absolute -top-12 right-0 text-white flex items-center gap-2 font-bold hover:text-slate-200 transition-colors"
              >
                <X size={20} /> {t("merchant_invoices.modal.close")}
              </button>

              <div ref={invoiceRef}>
                <Card className="border-none shadow-2xl overflow-hidden bg-white min-h-[650px] flex flex-col rounded-3xl">
                  <div className="h-2 bg-primary w-full" />
                  <CardContent className="p-8 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-10">
                      <div>
                        <div className="bg-primary text-white p-2.5 inline-block rounded-xl mb-4 mm:mb-0">
                          <Receipt size={24} />
                        </div>
                        <h2 className="text-2xl font-black tracking-tighter">
                          {t("merchant_invoices.modal.invoice_header")}
                        </h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">
                          #{selectedInvoice.invoiceId}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-xl text-primary italic mm:mb-0">
                          AgriBridge
                        </p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                          {t("merchant_invoices.modal.verified")}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mb-10 text-sm">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-2 ">
                          {t("merchant_invoices.modal.billed_to")}
                        </p>
                        <p className="font-bold mm:mb-0">
                          {selectedInvoice.farmerName}
                        </p>
                        <p className="text-slate-500 text-xs leading-relaxed mm:mb-0">
                          {selectedInvoice.farmerNRC}
                        </p>
                        <p className="text-slate-500 text-xs leading-relaxed">
                          {selectedInvoice.farmerAddress}
                          <br />
                          {selectedInvoice.farmerPhone}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">
                          {t("merchant_invoices.modal.status")}
                        </p>
                        <Badge
                          className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase border-none ${
                            selectedInvoice.status === "paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {selectedInvoice.status}
                        </Badge>
                        <p className="mt-6 text-[10px] text-slate-400 font-bold uppercase mm:mt-2">
                          {t("merchant_invoices.modal.date_issued")}
                        </p>
                        <p className="font-bold text-xs mm:-mt-2">
                          {formatDate(selectedInvoice.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex-1">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b-2 border-slate-100 text-[10px] uppercase text-slate-400 font-bold">
                            <th className="text-left pb-3">
                              {t("merchant_invoices.modal.table_item")}
                            </th>
                            <th className="text-center pb-3">
                              {t("merchant_invoices.modal.table_qty")}
                            </th>
                            <th className="text-right pb-3">
                              {t("merchant_invoices.modal.table_price")}
                            </th>
                            <th className="text-right pb-3">
                              {t("merchant_invoices.modal.table_total")}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {selectedInvoice.items?.map(
                            (item: any, i: number) => (
                              <tr key={i}>
                                <td className="py-4 font-bold">
                                  {item.cropName}
                                </td>
                                <td className="py-4 text-center text-slate-600">
                                  {item.quantity} {item.unit}
                                </td>
                                <td className="py-4 text-right text-slate-600">
                                  {item.price.toLocaleString()}
                                </td>
                                <td className="py-4 text-right font-black">
                                  {(
                                    item.quantity * item.price
                                  ).toLocaleString()}{" "}
                                  MMK
                                </td>
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-8 pt-6 border-t-2 border-slate-900 flex justify-between items-center text-2xl font-black">
                      <span className="text-slate-900 mm:text-xl">
                        {t("merchant_invoices.modal.total_due")}
                      </span>
                      <span className="text-primary">
                        {selectedInvoice.totalAmount.toLocaleString()}{" "}
                        <span className="text-sm font-bold">MMK</span>
                      </span>
                    </div>

                    <div className="mt-10 flex gap-3 print-hidden">
                      {selectedInvoice.status == "paid" && (
                        <Button
                          variant="outline"
                          className="flex-1 py-6 gap-2 text-green-700 bg-green-50 border-green-200"
                          onClick={handleExportImage}
                        >
                          <ImageIcon size={18} />{" "}
                          {t("merchant_invoices.modal.save_gallery")}
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
