import { useState } from "react";
import { Plus, ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_PREORDERS } from "@/types/order";
import { DashboardStats } from "@/components/merchant/DashboardStats";
import { IncomingRequests } from "@/components/merchant/IncomingRequests";
import { InvoiceCreator } from "@/components/merchant/InvoiceCreator";

// Initial state for a clean invoice
const EMPTY_INVOICE = {
  farmerName: "",
  email: "",
  phone: "",
  address: "",
  items: [{ cropName: "", quantity: 0, unit: "kg", price: 0 }],
};

function MerchantDashboard() {
  const [view, setView] = useState<"list" | "invoice">("list");
  const [isPreorderMode, setIsPreorderMode] = useState(false);
  const [selectedInvoiceData, setSelectedInvoiceData] = useState<any>(EMPTY_INVOICE);

  const handleProcessPreorder = (id: string) => {
    const selected = MOCK_PREORDERS.find((p) => p.id === id);
    if (selected) {
      setSelectedInvoiceData({ ...selected });
      setIsPreorderMode(true);
      setView("invoice");
    }
  };

  const handleApprove = (id: string) => {
    console.log("Approved order:", id);
    // Add your API call here
  };

  const handleReject = (id: string) => {
    console.log("Rejected order:", id);
  };

  return (
    <div className="w-full min-h-screen">
      <div className="w-full max-w-[1600px] mx-auto p-4 md:p-8 space-y-8">
        {view === "list" ? (
          <>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                  Merchant Hub
                </h1>
                <p className="text-slate-500 mt-2 font-medium">
                  Manage incoming farmer preorders and supply chain requests.
                </p>
              </div>
              <Button
                onClick={() => {
                  setSelectedInvoiceData(EMPTY_INVOICE);
                  setIsPreorderMode(false);
                  setView("invoice");
                }}
                className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
              >
                <Plus className="mr-2 h-4 w-4" /> New Manual Invoice
              </Button>
            </div>

            <DashboardStats />

            <IncomingRequests 
              onProcess={handleProcessPreorder} 
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setView("list")}
                  className="rounded-full hover:bg-slate-100"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex items-center text-sm text-slate-500">
                  <span className="hover:text-blue-600 cursor-pointer" onClick={() => setView("list")}>Dashboard</span>
                  <ChevronRight size={16} className="mx-2" />
                  <span className="font-bold text-slate-900">
                    {isPreorderMode ? "Process Preorder" : "Create Manual Invoice"}
                  </span>
                </div>
              </div>
            </div>

            <InvoiceCreator
              initialData={selectedInvoiceData}
              mode={isPreorderMode ? "preorder" : "manual"}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default MerchantDashboard;