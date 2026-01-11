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
  DialogDescription,
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
  Mail,
  Package,
  FileText,
  Loader2,
  Search,
  Calendar,
} from "lucide-react";
import type { RootState } from "@/store";
import {
  useGetMerchantPreordersQuery,
  useUpdatePreorderStatusMutation,
} from "@/store/slices/preorderApi";
import { useNavigate } from "react-router";

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

  // 3. Search & Filter Logic
  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter(
      (order: any) =>
        order.farmerInfo?.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        order._id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [orders, searchQuery]);

  const selectedOrder = orders?.find((o: any) => o._id === selectedOrderId);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateStatus({ id, status }).unwrap();
      if (status === "cancelled" || status === "confirmed")
        setSelectedOrderId(null);
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
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Merchant Dashboard
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Manage preorders and farmer submissions
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <Input
              placeholder="Search farmer name or order ID..."
              className="pl-10 bg-white border-slate-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Card className="border-none shadow-xl overflow-hidden bg-white">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="pl-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Order ID
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Farmer
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
                {filteredOrders.map((order: any) => (
                  <TableRow
                    key={order._id}
                    className="group hover:bg-slate-50/50 transition-colors border-slate-100"
                  >
                    <TableCell className="pl-6 font-mono font-bold text-xs text-blue-600">
                      #{order._id.slice(-6).toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-sm">
                          {order.farmerInfo?.name}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {order.farmerInfo?.township}
                        </span>
                      </div>
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
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrderId(order._id)}
                          className="h-8 gap-2 border-slate-200"
                        >
                          <Eye size={14} /> Details
                        </Button>
                        {order.status === "confirmed" && (
                          <Button
                            size="sm"
                            className="h-8 bg-slate-900 font-bold gap-1.5"
                          >
                            <FileText size={14} /> Invoice
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* DETAILS DIALOG */}
        <Dialog
          open={!!selectedOrderId}
          onOpenChange={(open) => !open && setSelectedOrderId(null)}
        >
          {/* Fixed max-width and dynamic height with overflow handling */}
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] p-0 overflow-hidden flex flex-col border-none shadow-2xl">
            {selectedOrder && (
              <>
                <DialogHeader className="p-6 bg-slate-900 text-white shrink-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge className="bg-blue-500 text-white border-none mb-2 uppercase text-[10px]">
                        Preorder Details
                      </Badge>
                      <DialogTitle className="text-2xl font-black">
                        #{selectedOrder._id.slice(-6).toUpperCase()}
                      </DialogTitle>
                      <DialogDescription className="text-slate-400">
                        Review farmer submission details
                      </DialogDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">
                        Received On
                      </p>
                      <p className="text-sm font-bold flex items-center gap-2 justify-end mt-1">
                        <Calendar size={14} className="text-blue-400" />{" "}
                        {new Date(selectedOrder.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </DialogHeader>

                {/* Scrollable Body */}
                <div className="p-6 space-y-6 overflow-y-auto">
                  {/* Farmer Information Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <h4 className="text-[10px] uppercase font-bold text-slate-400 mb-3">
                        Farmer Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p className="font-bold text-slate-800">
                          {selectedOrder.farmerInfo?.name}
                        </p>
                        <div className="flex items-center gap-2 text-slate-500">
                          <Phone size={12} />{" "}
                          {selectedOrder.phone ||
                            selectedOrder.farmerInfo?.phone}
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                          <Mail size={12} /> {selectedOrder.farmerInfo?.email}
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <h4 className="text-[10px] uppercase font-bold text-slate-400 mb-3">
                        Farmer Location
                      </h4>
                      <div className="flex gap-2 text-sm text-slate-600">
                        <MapPin
                          size={14}
                          className="text-red-400 shrink-0 mt-0.5"
                        />
                        <div>
                          <p className="font-medium leading-tight">
                            {selectedOrder.farmerInfo?.homeAddress}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {selectedOrder.farmerInfo?.township},{" "}
                            {selectedOrder.farmerInfo?.division}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Produce List Section */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-2">
                      <Package size={12} /> Produce List
                    </h4>
                    <div className="border rounded-xl overflow-hidden bg-white">
                      <Table>
                        <TableHeader className="bg-slate-50">
                          <TableRow>
                            <TableHead className="text-xs">Item</TableHead>
                            <TableHead className="text-center text-xs">
                              Qty
                            </TableHead>
                            <TableHead className="text-right text-xs">
                              Est. Price
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

                  {/* Notes Section */}
                  {selectedOrder.notes && (
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                      <h4 className="text-[10px] uppercase font-bold text-amber-600 mb-1">
                        Merchant Notes
                      </h4>
                      <p className="text-sm italic text-amber-800">
                        "{selectedOrder.notes}"
                      </p>
                    </div>
                  )}

                  {/* Estimated Delivery Display */}
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-blue-600" />
                      <span className="text-xs font-bold text-blue-800 uppercase tracking-tight">
                        Estimated Delivery
                      </span>
                    </div>
                    <span className="text-sm font-black text-blue-700">
                      {getDeliveryDate(
                        selectedOrder.createdAt,
                        selectedOrder.deliveryTimeline
                      )}
                    </span>
                  </div>
                </div>

                {/* Fixed Footer */}
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
                          <X size={14} className="mr-1" /> Reject
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isUpdating}
                          onClick={() =>
                            handleStatusChange(selectedOrder._id, "confirmed")
                          }
                          className="text-emerald-600 hover:bg-emerald-50 border-emerald-200 font-bold"
                        >
                          <Check size={14} className="mr-1" /> Approve
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
