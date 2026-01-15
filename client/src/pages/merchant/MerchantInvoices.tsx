import { useState, useRef, useMemo } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { 
  Receipt, 
  CheckCircle, 
  Clock, 
  X, 
  FileDown, 
  Search, 
  Filter,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  MoreVertical,
  Printer,
  Loader2,
  CreditCard
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  useGetInvoicesQuery,
  useUpdateInvoiceStatusMutation,
  useDeleteInvoiceMutation,
} from "@/store/slices/invoiceApi";

export default function MerchantInvoices() {
  const { data: invoices, isLoading, isError } = useGetInvoicesQuery();
  const [updateStatus, { isLoading: isFinalizing }] = useUpdateInvoiceStatusMutation();
  const [deleteInvoice] = useDeleteInvoiceMutation();

  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const invoiceRef = useRef<HTMLDivElement>(null);

  // Mock merchant data (Replace with your actual merchant query if applicable)
  const merchant: any = invoices?.[0]?.merchantId ? { merchantId: invoices[0].merchantId, township: "Monywa", division: "Sagaing" } : null;
  const merchantLoading = isLoading;

  // --- STATS ---
  const stats = useMemo(() => {
    if (!invoices || !Array.isArray(invoices)) return { total: 0, pending: 0, collected: 0 };
    return invoices.reduce((acc, inv) => {
      const amount = inv.totalAmount ?? 0;
      acc.total += amount;
      if (inv.status === "paid") acc.collected += amount;
      else acc.pending += amount;
      return acc;
    }, { total: 0, pending: 0, collected: 0 });
  }, [invoices]);

  // --- FILTERING ---
  const filteredInvoices = useMemo(() => {
    if (!invoices) return [];
    return invoices.filter(inv => {
      const name = (inv?.farmerName ?? "").toLowerCase();
      const id = (inv?.invoiceId ?? "").toLowerCase();
      const search = searchTerm.toLowerCase();
      return name.includes(search) || id.includes(search);
    });
  }, [invoices, searchTerm]);

  // --- PDF GENERATION ---
  const handleDownloadPDF = async () => {
    if (!invoiceRef.current || !selectedInvoice) return;
    const loadingToast = toast.loading("Generating high-resolution PDF...");
    
    try {
      const element = invoiceRef.current;
      const canvas = await html2canvas(element, {
        scale: 3, 
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Receipt_${selectedInvoice.invoiceId}.pdf`);
      toast.dismiss(loadingToast);
      toast.success("Receipt downloaded successfully");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to generate PDF");
    }
  };

  // --- STATUS UPDATE ---
  const handleComplete = async (id: string) => {
    try {
      await updateStatus({ id, status: "paid" }).unwrap();
      toast.success("Invoice marked as paid");
      setSelectedInvoice(null);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (isLoading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-primary" size={40} />
      <p className="text-slate-500 font-medium tracking-tight">Syncing Ledger...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 bg-slate-50/50 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic">AgriBridge <span className="text-primary">Ledger</span></h1>
          <p className="text-slate-500 font-medium">Digital trade auditing and farmer receipts.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2 px-6">
          <Printer size={18} /> Batch CSV Export
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Gross Volume" value={stats.total} icon={<TrendingUp size={20} className="text-blue-600"/>} color="bg-blue-100/50" />
        <StatCard title="Funds Collected" value={stats.collected} icon={<CheckCircle size={20} className="text-emerald-600"/>} color="bg-emerald-100/50" />
        <StatCard title="Awaiting Payment" value={stats.pending} icon={<Wallet size={20} className="text-amber-600"/>} color="bg-amber-100/50" />
      </div>

      {/* Main Table */}
      <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden">
        <CardHeader className="bg-white border-b border-slate-100 flex-row items-center justify-between space-y-0 p-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Search farmer name or ID..." 
              className="pl-10 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-primary/20 h-11"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="border-slate-200"><Filter size={18}/></Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/80 text-[11px] uppercase font-black text-slate-400 tracking-wider">
                <tr>
                  <th className="text-left p-5">Farmer Account</th>
                  <th className="text-left p-5">Date</th>
                  <th className="text-left p-5">Status</th>
                  <th className="text-right p-5">Total Amount</th>
                  <th className="p-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((inv) => (
                  <tr 
                    key={inv._id} 
                    className="hover:bg-blue-50/30 transition-all cursor-pointer group" 
                    onClick={() => setSelectedInvoice(inv)}
                  >
                    <td className="p-5">
                      <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">{inv.farmerName}</p>
                      <p className="text-xs text-slate-400 font-mono mt-0.5 tracking-tight">REF: {inv.invoiceId}</p>
                    </td>
                    <td className="p-5 text-sm text-slate-500 font-medium">
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-5">
                      <Badge variant="outline" className={`rounded-md px-2 py-1 font-bold text-[10px] uppercase border-none ${
                        inv.status === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {inv.status}
                      </Badge>
                    </td>
                    <td className="p-5 text-right font-black text-slate-900">
                      {inv.totalAmount.toLocaleString()} <span className="text-[10px] text-slate-400">MMK</span>
                    </td>
                    <td className="p-5 text-right">
                      <Button variant="ghost" size="icon" className="rounded-full"><MoreVertical size={16} /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* --- INVOICE DIALOG MODAL --- */}
      <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden border-none bg-transparent shadow-none">
          {selectedInvoice && (
            <div className="relative">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="absolute -top-12 right-0 text-white flex items-center gap-2 font-bold hover:text-primary transition-colors"
              >
                <X size={20} /> Close
              </button>

              <div ref={invoiceRef}>
                <Card className="border-none shadow-2xl overflow-hidden bg-white min-h-[700px] flex flex-col">
                  <div className="h-2 bg-primary w-full" />
                  <CardContent className="p-10 flex-1 flex flex-col">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-12">
                      <div>
                        <div className="bg-primary text-white p-2 inline-block rounded-lg mb-4">
                          <Receipt size={24} />
                        </div>
                        <h2 className="text-2xl font-black tracking-tighter">INVOICE</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">
                          #{selectedInvoice.invoiceId}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-2xl text-primary italic leading-none">AgriBridge</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold mt-1 tracking-tighter">
                          Platform Verified Receipt
                        </p>
                      </div>
                    </div>

                    {/* Merchant Info */}
                    <div className="grid grid-cols-2 gap-8 mb-12 text-sm border-b border-slate-50 pb-8">
                      <div>
                        <p className="text-[10px] uppercase font-black text-slate-400 mb-3 tracking-widest">Billed From</p>
                        {merchantLoading ? (
                          <div className="h-4 w-32 bg-slate-100 animate-pulse rounded" />
                        ) : (
                          <>
                            <p className="font-bold text-slate-900 text-lg">
                              {merchant?.merchantId?.businessName || "Registered Merchant"}
                            </p>
                            <p className="text-slate-500 text-xs mt-1">
                              {merchant?.township}, {merchant?.division}
                            </p>
                            <p className="text-slate-500 text-xs italic">
                              {merchant?.merchantId?.phone}
                            </p>
                          </>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-black text-slate-400 mb-3 tracking-widest">Status</p>
                        <Badge className={`px-4 py-1 rounded-full uppercase text-[10px] font-black border-none ${
                            selectedInvoice.status === "paid" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                        }`}>
                          {selectedInvoice.status}
                        </Badge>
                        <p className="mt-6 text-[10px] text-slate-400 font-black uppercase tracking-widest">Date Issued</p>
                        <p className="font-bold text-xs">
                          {new Date(selectedInvoice.createdAt).toLocaleDateString(undefined, { dateStyle: 'long'})}
                        </p>
                      </div>
                    </div>

                    {/* Item Table */}
                    <div className="flex-1">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b-2 border-slate-100 text-[10px] uppercase text-slate-400 font-black tracking-widest">
                            <th className="text-left pb-4">Item Description</th>
                            <th className="text-center pb-4">Qty</th>
                            <th className="text-right pb-4">Price</th>
                            <th className="text-right pb-4">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {selectedInvoice.items?.map((item: any, i: number) => (
                            <tr key={i} className="text-slate-700">
                              <td className="py-5 font-bold text-slate-900">{item.cropName}</td>
                              <td className="py-5 text-center font-medium">{item.quantity} {item.unit}</td>
                              <td className="py-5 text-right font-mono text-xs">{item.price.toLocaleString()}</td>
                              <td className="py-5 text-right font-black text-slate-900">
                                {(item.quantity * item.price).toLocaleString()} <span className="text-[10px] font-normal text-slate-400">MMK</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Grand Total Area */}
                    <div className="mt-12 pt-6 border-t-[3px] border-slate-900 flex justify-between items-center">
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Total Payable Amount</span>
                      <span className="text-4xl font-black text-primary italic">
                        {selectedInvoice.totalAmount.toLocaleString()} <span className="text-sm font-bold not-italic">MMK</span>
                      </span>
                    </div>

                    {/* Action Buttons (Hidden during PDF generation/Print) */}
                    <div className="mt-12 flex gap-3 print:hidden">
                      {selectedInvoice.status !== "paid" ? (
                        <Button
                          className="flex-1 py-7 gap-3 text-md font-bold shadow-xl shadow-primary/20"
                          onClick={() => handleComplete(selectedInvoice._id)}
                          disabled={isFinalizing}
                        >
                          {isFinalizing ? <Loader2 className="animate-spin" /> : <CreditCard size={20} />} 
                          Confirm Payment & Mark Paid
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          className="flex-1 py-7 gap-3 text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100 font-bold"
                          onClick={handleDownloadPDF}
                        >
                          <FileDown size={20} /> Download Official Receipt PDF
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

// --- Visual Helper Component ---
function StatCard({ title, value, icon, color }: any) {
  return (
    <Card className="border-none shadow-sm group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className={`p-4 rounded-2xl ${color} transition-all group-hover:rotate-6 duration-300`}>
            {icon}
          </div>
          <ArrowUpRight size={18} className="text-slate-300 group-hover:text-primary transition-colors" />
        </div>
        <div className="mt-6">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{title}</p>
          <p className="text-3xl font-black text-slate-900 mt-2 tracking-tighter font-mono">
            {value.toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}