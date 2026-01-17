import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Clock,
  Check,
  X,
  Eye,
  MapPin,
  Phone,
  // Mail,
  Package,
  FileText,
  Loader2,
  Search,
  Calendar,
  CreditCard,
} from "lucide-react";
import type { RootState } from "@/store";
import {
  useGetMerchantPreordersQuery,
  useUpdatePreorderStatusMutation,
} from "@/store/slices/preorderApi";
import { useNavigate } from "react-router";

// --- Helper Components & Functions ---

const formatNRC = (nrc: any) => {
  if (!nrc) return "N/A";
  return `${nrc.region}/${nrc.township}${nrc.type}${nrc.number}`;
};

export function MerchantOrderList() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // 1. Data Fetching
  const { data: orders, isLoading } = useGetMerchantPreordersQuery(user?.id, {
    skip: !user?.id,
  });

  const [updateStatus, { isLoading: isUpdating }] =
    useUpdatePreorderStatusMutation();

  // 2. Delivery Date Calculation Helper
  const getDeliveryDate = (
    createdAt: string,
    timeline: { count: number; unit: string }
  ) => {
    const date = new Date(createdAt);
    const count = timeline?.count || 0;
    const unit = timeline?.unit?.toLowerCase() || "days";

    if (unit.includes("day")) date.setDate(date.getDate() + count);
    else if (unit.includes("week")) date.setDate(date.getDate() + count * 7);
    else if (unit.includes("month")) date.setMonth(date.getMonth() + count);

    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // 3. Search & Filter Logic (Updated for new schema fields)
  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter(
      (order: any) =>
        order.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.nrc?.number?.includes(searchQuery) ||
        order._id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [orders, searchQuery]);

  const selectedOrder = orders?.find((o: any) => o._id === selectedOrderId);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateStatus({ id, status }).unwrap();
      // Keep dialog open for "confirmed" so they can print invoice,
      // otherwise close it.
      if (status === "cancelled") setSelectedOrderId(null);
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Search and Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight">
              Preorders
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Review and manage farmer preorders
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <Input
              placeholder="Search with farmer name..."
              className="pl-10 bg-white border-slate-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Card className="border-none shadow-xl overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-secondary">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="pl-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Order ID
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Farmer Name
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    NRC Number
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">
                    Est. Delivery
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Status
                  </TableHead>
                  <TableHead className="text-right pr-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order: any) => (
                    <TableRow
                      key={order._id}
                      className="group hover:bg-slate-50/50 transition-colors border-slate-100"
                    >
                      <TableCell className="pl-6 font-mono font-bold text-xs text-blue-600">
                        #{order._id.slice(-6).toUpperCase()}
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-sm">
                          {order.fullName}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-medium text-slate-600">
                          {formatNRC(order.nrc)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className="font-medium text-slate-600 border-slate-200"
                        >
                          {getDeliveryDate(
                            order.createdAt,
                            order.deliveryTimeline
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`text-[10px] uppercase font-bold ${
                            order.status === "pending"
                              ? "bg-amber-100 text-amber-700"
                              : order.status === "confirmed"
                              ? "bg-emerald-100 text-emerald-700"
                              : order.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrderId(order._id)}
                          className="h-8 gap-2 border-slate-200"
                        >
                          <Eye size={14} /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-32 text-center text-slate-400"
                    >
                      No preorders found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* DETAILS DIALOG */}
        <Dialog
          open={!!selectedOrderId}
          onOpenChange={(open) => !open && setSelectedOrderId(null)}
        >
          <DialogContent className="sm:max-w-[750px] max-h-[90vh] p-0 overflow-hidden flex flex-col border-none shadow-2xl">
            {selectedOrder && (
              <>
                <DialogHeader className="p-6 bg-slate-900 text-white shrink-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge className="bg-blue-500 text-white border-none mb-2 uppercase text-[10px]">
                        Order Verification
                      </Badge>
                      <DialogTitle className="text-2xl font-black">
                        #{selectedOrder._id.slice(-6).toUpperCase()}
                      </DialogTitle>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">
                        Date Submitted
                      </p>
                      <p className="text-sm font-bold flex items-center gap-2 justify-end mt-1">
                        <Calendar size={14} className="text-blue-400" />
                        {new Date(selectedOrder.createdAt).toLocaleDateString(
                          "en-GB"
                        )}
                      </p>
                    </div>
                  </div>
                </DialogHeader>

                <div className="p-6 space-y-6 overflow-y-auto">
                  {/* Farmer Information Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                      <h4 className="text-[10px] uppercase font-bold text-slate-400">
                        Identity Details
                      </h4>
                      <div className="space-y-2">
                        <p className="text-sm font-black text-slate-800 flex items-center gap-2">
                          {selectedOrder.fullName}
                        </p>
                        <p className="text-xs text-slate-600 flex items-center gap-2">
                          <CreditCard size={14} className="text-slate-400" />
                          NRC: {formatNRC(selectedOrder.nrc)}
                        </p>
                        <p className="text-xs text-slate-600 flex items-center gap-2">
                          <Phone size={14} className="text-slate-400" />
                          {selectedOrder.phone}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                      <h4 className="text-[10px] uppercase font-bold text-slate-400">
                        Logistics Info
                      </h4>
                      <div className="flex gap-2 text-xs text-slate-600">
                        <MapPin size={14} className="text-red-400 shrink-0" />
                        <div>
                          <p className="font-bold">
                            {selectedOrder.farmerInfo?.homeAddress || "N/A"}
                          </p>
                          <p className="text-slate-400">
                            {selectedOrder.farmerInfo?.township},{" "}
                            {selectedOrder.farmerInfo?.division}
                          </p>
                        </div>
                      </div>
                      {/* <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Mail size={14} className="text-slate-400" />
                        {selectedOrder.farmerInfo?.email || "No email provided"}
                      </div> */}
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-2">
                      <Package size={12} /> Ordered Produce
                    </h4>
                    <div className="border rounded-xl overflow-hidden bg-white">
                      <Table>
                        <TableHeader className="bg-slate-50">
                          <TableRow>
                            <TableHead className="text-xs">Crop Name</TableHead>
                            <TableHead className="text-center text-xs">
                              Quantity
                            </TableHead>
                            <TableHead className="text-right text-xs">
                              Est. Unit Price
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedOrder.items.map((item: any, idx: number) => (
                            <TableRow key={idx}>
                              <TableCell className="font-bold text-sm">
                                {item.cropName}
                              </TableCell>
                              <TableCell className="text-center text-sm">
                                {item.quantity} {item.unit}
                              </TableCell>
                              <TableCell className="text-right font-mono font-bold text-blue-600 text-sm">
                                {item.price.toLocaleString()} MMK
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Timeline & Notes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock size={14} className="text-blue-600" />
                        <span className="text-[10px] font-bold text-blue-800 uppercase">
                          Target Delivery
                        </span>
                      </div>
                      <span className="text-lg font-black text-blue-700">
                        {getDeliveryDate(
                          selectedOrder.createdAt,
                          selectedOrder.deliveryTimeline
                        )}
                      </span>
                    </div>

                    {selectedOrder.notes && (
                      <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                        <h4 className="text-[10px] uppercase font-bold text-amber-600 mb-1">
                          Farmer's Note
                        </h4>
                        <p className="text-xs italic text-amber-800">
                          "{selectedOrder.notes}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <DialogFooter className="p-6 bg-slate-50 border-t flex flex-row items-center justify-between gap-3 shrink-0">
                  <div className="flex gap-2">
                    {selectedOrder.status === "pending" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isUpdating}
                          onClick={() =>
                            handleStatusChange(selectedOrder._id, "cancelled")
                          }
                          className="text-red-600 hover:bg-red-50 border-red-200 font-bold"
                        >
                          <X size={14} className="mr-1" /> Reject Order
                        </Button>
                        <Button
                          size="sm"
                          disabled={isUpdating}
                          onClick={() =>
                            handleStatusChange(selectedOrder._id, "confirmed")
                          }
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                        >
                          <Check size={14} className="mr-1" /> Approve Order
                        </Button>
                      </>
                    )}
                  </div>

                  <Button
                    className="bg-slate-900 font-bold gap-2"
                    disabled={selectedOrder.status !== "confirmed"}
                    onClick={() =>
                      navigate("/merchant/invoices/create", {
                        state: selectedOrder,
                      })
                    }
                  >
                    <FileText size={16} /> Generate Invoice
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
