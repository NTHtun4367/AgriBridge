import { useState } from "react";
import { useNavigate } from "react-router";
import {
  TrendingDown,
  TrendingUp,
  Store,
  Plus,
  ArrowLeft,
  AlertCircle,
  PackageCheck,
  History,
  ReceiptText,
  Clock,
  MapPin,
} from "lucide-react";

import StatusCard from "@/common/StatusCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MOCK_PREORDERS } from "@/types/order";

// Component Imports
import { InvoiceCreator } from "@/components/merchant/InvoiceCreator";
import ActivityTitle from "@/components/farmer/ActivityTitle";
import MerchantEntryDialog from "@/components/merchant/MerchantEntryDialog";

// Hooks
import { useGetFinanceStatsQuery } from "@/store/slices/farmerApi";
import { useGetAllEntriesQuery } from "@/store/slices/entryApi";

const EMPTY_INVOICE = {
  farmerName: "",
  email: "",
  phone: "",
  address: "",
  items: [{ cropName: "", quantity: 0, unit: "kg", price: 0 }],
};

function MerchantDashboard() {
  const navigate = useNavigate();
  const [view, setView] = useState<"list" | "invoice">("list");
  const [isPreorderMode, setIsPreorderMode] = useState(false);
  const [selectedInvoiceData, setSelectedInvoiceData] =
    useState<any>(EMPTY_INVOICE);

  const { data: finance } = useGetFinanceStatsQuery("all");
  const { data: entries, isLoading: entriesLoading } = useGetAllEntriesQuery();

  // const handleProcessPreorder = (preorder: any) => {
  //   setSelectedInvoiceData({ ...preorder });
  //   setIsPreorderMode(true);
  //   setView("invoice");
  // };

  return (
    <div className="w-full min-h-screen p-4 md:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {view === "list" ? (
        <div className="w-full max-w-[1600px] mx-auto space-y-10">
          {/* --- HEADER SECTION --- */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-[0.2em]">
                <Store className="w-4 h-4" />
                <span>Enterprise Dashboard</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
                Merchant Hub
              </h2>
              <p className="text-slate-500 font-medium max-w-md">
                Manage your supply chain, procurement ledger, and incoming
                farmer requests.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                size={"lg"}
                onClick={() => {
                  setSelectedInvoiceData(EMPTY_INVOICE);
                  setIsPreorderMode(false);
                  setView("invoice");
                }}
                variant="outline"
                // className="h-14 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-2xl shadow-sm px-8 transition-all hover:shadow-lg active:scale-95"
              >
                <Plus className="mr-2 h-5 w-5 text-blue-600" /> Manual Invoice
              </Button>
              <MerchantEntryDialog />
            </div>
          </div>

          {/* --- STATS OVERVIEW --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatusCard
              title="Total Revenue"
              bgColor="bg-emerald-500/10"
              value={finance?.totalIncome || 0}
              icon={<TrendingUp className="w-6 h-6 text-emerald-600" />}
            />
            <StatusCard
              title="Procurement Cost"
              bgColor="bg-orange-500/10"
              value={finance?.totalExpense || 0}
              icon={<TrendingDown className="w-6 h-6 text-orange-600" />}
            />
            <StatusCard
              title="Active Preorders"
              bgColor="bg-blue-500/10"
              value={MOCK_PREORDERS.length || 0}
              icon={<PackageCheck className="w-6 h-6 text-blue-600" />}
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            {/* --- LEFT: TRANSACTION HISTORY --- */}
            <div className="xl:col-span-7 space-y-6">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-slate-900 rounded-2xl">
                    <History className="text-white w-5 h-5" />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight">Ledger</h3>
                </div>
                <Button
                  variant="ghost"
                  className="text-blue-600 font-bold hover:bg-blue-50 rounded-xl"
                  onClick={() => navigate("/merchant/transactions")}
                >
                  View Full History
                </Button>
              </div>

              <Card>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 gap-4">
                    {entriesLoading ? (
                      <div className="py-20 text-center text-slate-400 italic font-medium">
                        Loading ledger...
                      </div>
                    ) : (
                      entries
                        ?.slice(0, 6)
                        .map((act: any) => (
                          <ActivityTitle
                            key={act._id}
                            id={act._id}
                            title={act.category}
                            amount={act.value}
                            type={act.type}
                            date={act.date}
                          />
                        ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* --- RIGHT: BEAUTIFIED PREORDERS --- */}
            <div className="xl:col-span-5 space-y-6">
              <div className="flex items-center gap-3 px-2">
                <div className="p-3 bg-blue-600 rounded-2xl">
                  <ReceiptText className="text-white w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight">
                    Farmer Requests
                  </h3>
                  <p className="text-xs text-blue-500 font-bold uppercase tracking-widest">
                    Awaiting Approval
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {MOCK_PREORDERS.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-4xl border border-dashed border-slate-200">
                    <p className="text-slate-400 font-medium">
                      No pending requests
                    </p>
                  </div>
                ) : (
                  MOCK_PREORDERS.map((order) => (
                    <Card
                      key={order.id}
                      className="group border-none shadow-lg hover:shadow-2xl transition-all duration-300"
                    >
                      <CardContent>
                        <div className="flex justify-between items-start mb-4">
                          <div className="space-y-1">
                            <h4 className="text-lg font-black group-hover:text-blue-600 transition-colors">
                              {order.farmerName}
                            </h4>
                            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                              <MapPin size={14} />
                              <span>{order.address}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                            <Clock size={12} />
                            Pending
                          </div>
                        </div>

                        <div className="bg-secondary rounded-2xl p-4">
                          <div className="flex flex-wrap gap-4">
                            {order.items.map((item: any, idx: number) => (
                              <div key={idx} className="flex flex-col">
                                <span className="text-[10px] uppercase font-black text-slate-400">
                                  Crop
                                </span>
                                <span className="text-sm font-bold text-slate-700">
                                  {item.cropName}
                                </span>
                                <span className="text-xs font-medium text-slate-500">
                                  {item.quantity} {item.unit}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* <div className="flex items-center gap-2">
                          <Button
                            className="flex-1 bg-slate-900 hover:bg-black text-white font-bold rounded-xl h-11"
                            onClick={() => handleProcessPreorder(order)}
                          >
                            Generate Invoice
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-11 w-11 rounded-xl border-slate-200 text-emerald-600 hover:bg-emerald-50"
                          >
                            <CheckCircle2 size={20} />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-11 w-11 rounded-xl border-slate-200 text-rose-600 hover:bg-rose-50"
                          >
                            <XCircle size={20} />
                          </Button>
                        </div> */}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {/* ACTION TIP */}
              <div className="p-8 bg-linear-to-br from-indigo-600 to-blue-700 text-white rounded-2xl">
                <AlertCircle className="mb-4 opacity-50" size={32} />
                <h4 className="text-xl font-bold mb-2">Inventory Sync</h4>
                <p className="text-sm opacity-80 leading-relaxed font-medium">
                  Generating an invoice from a preorder will automatically
                  reserve stock and update your procurement forecast.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* --- INVOICE VIEW --- */
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="mb-8 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setView("list")}
              // className="rounded-2xl bg-white border border-slate-200 shadow-sm font-bold hover:bg-slate-50 px-6 h-12"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Exit Editor
            </Button>

            {/* <div className="flex items-center gap-3 bg-slate-900 p-2 px-5 rounded-2xl text-white text-xs font-bold uppercase tracking-widest shadow-lg">
              <span className="opacity-60">Hub</span>
              <ChevronRight size={14} />
              <span>{isPreorderMode ? "Invoice Generator" : "New Entry"}</span>
            </div> */}
          </div>

          <div>
            {/* <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 w-full" /> */}
            <InvoiceCreator
              initialData={selectedInvoiceData}
              mode={isPreorderMode ? "preorder" : "manual"}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default MerchantDashboard;
