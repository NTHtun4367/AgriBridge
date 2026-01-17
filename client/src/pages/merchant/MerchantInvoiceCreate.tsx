import { useLocation, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { InvoiceCreator } from "@/components/merchant/InvoiceCreator";

export default function MerchantInvoiceCreate() {
  const location = useLocation();
  const navigate = useNavigate();

  // If navigated from preorder → state exists
  const preorderData = location.state || null;

  return (
    <div className="w-full min-h-screen">
      <div className="w-full max-w-[1600px] mx-auto p-4 md:p-8 space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-black">
              {preorderData
                ? "Process Preorder Invoice"
                : "Create Manual Invoice"}
            </h1>
          </div>
        </div>

        {/* Invoice Creator */}
        <InvoiceCreator
          initialData={preorderData}
          mode={preorderData ? "preorder" : "manual"}
        />
      </div>
    </div>
  );
}
