import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Clock,
  Check,
  X,
  Eye,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Package,
  FileText,
  Trash2,
} from "lucide-react";
import { MOCK_PREORDERS } from "@/types/order";

// Define the interface to match what the Dashboard provides
interface RequestsProps {
  onProcess: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export function IncomingRequests({ onProcess, onApprove, onReject }: RequestsProps) {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const selectedOrder = MOCK_PREORDERS.find((o) => o.id === selectedOrderId);

  return (
    <TooltipProvider>
      <Card className="border-none shadow-xl overflow-hidden bg-white">
        <CardHeader className="border-b bg-white p-6 flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold tracking-tight">Incoming Requests</CardTitle>
            <p className="text-xs text-slate-500 font-medium">Review, approve, or invoice farmer preorders</p>
          </div>
          <Badge
            variant="secondary"
            className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 border-blue-100 font-bold"
          >
            {MOCK_PREORDERS.length} Requests Pending
          </Badge>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="pl-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Order ID</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Farmer Info</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Produce</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Delivery</TableHead>
                <TableHead className="text-right pr-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_PREORDERS.map((order) => (
                <TableRow key={order.id} className="group hover:bg-slate-50/50 transition-colors border-slate-100">
                  <TableCell className="pl-6 font-mono font-bold text-sm text-blue-600">
                    #{order.id}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 text-sm">{order.farmerName}</span>
                      <span className="text-xs text-slate-500 font-medium">{order.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      {order.items.slice(0, 2).map((i, idx) => (
                        <Badge key={idx} variant="outline" className="bg-white border-slate-200 text-[11px] font-medium py-0">
                          {i.cropName} <span className="text-slate-400 ml-1">{i.quantity}{i.unit}</span>
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold">
                      <Clock size={12} className="text-slate-500" />
                      {order.expectedDelivery}
                    </div>
                  </TableCell>
                  <TableCell className="pr-6">
                    <div className="flex items-center justify-end gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedOrderId(order.id)}
                            className="h-8 w-8 text-slate-400 hover:text-blue-600"
                          >
                            <Eye size={16} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>View Details</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onReject?.(order.id)}
                            className="h-8 w-8 text-slate-400 hover:text-red-600"
                          >
                            <X size={16} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Reject</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onApprove?.(order.id)}
                            className="h-8 w-8 text-slate-400 hover:text-emerald-600"
                          >
                            <Check size={16} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Approve</TooltipContent>
                      </Tooltip>

                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => onProcess(order.id)}
                        className="ml-2 h-8 bg-slate-900 hover:bg-black text-[11px] font-bold gap-1.5"
                      >
                        <FileText size={14} />
                        Invoice
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedOrderId} onOpenChange={(open) => !open && setSelectedOrderId(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden border-none shadow-2xl">
          {selectedOrder && (
            <>
              <DialogHeader className="p-6 bg-slate-900 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge className="bg-blue-500 text-white border-none mb-2 uppercase text-[10px]">Preorder Request</Badge>
                    <DialogTitle className="text-2xl font-black">#{selectedOrder.id}</DialogTitle>
                    <DialogDescription className="text-slate-400">Review farmer submission details</DialogDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Expected Delivery</p>
                    <p className="text-sm font-bold flex items-center gap-2 justify-end mt-1">
                      <Calendar size={14} className="text-blue-400" /> {selectedOrder.expectedDelivery}
                    </p>
                  </div>
                </div>
              </DialogHeader>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <h4 className="text-[10px] uppercase font-bold text-slate-400 mb-3">Farmer Information</h4>
                    <div className="space-y-2 text-sm">
                      <p className="font-bold text-slate-800">{selectedOrder.farmerName}</p>
                      <div className="flex items-center gap-2 text-slate-500"><Phone size={12}/> {selectedOrder.phone}</div>
                      <div className="flex items-center gap-2 text-slate-500"><Mail size={12}/> {selectedOrder.email || "N/A"}</div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <h4 className="text-[10px] uppercase font-bold text-slate-400 mb-3">Pickup Address</h4>
                    <div className="flex gap-2 text-sm text-slate-600">
                      <MapPin size={14} className="text-red-400 shrink-0 mt-0.5" />
                      <p className="font-medium">{selectedOrder.address}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-2"><Package size={12} /> Produce List</h4>
                  <div className="border rounded-xl overflow-hidden">
                    <Table>
                      <TableHeader className="bg-slate-50">
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead className="text-center">Qty</TableHead>
                          <TableHead className="text-right">Est. Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.items.map((item, idx) => (
                          <TableRow key={idx}>
                            <td className="p-3 text-sm font-bold">{item.cropName}</td>
                            <td className="p-3 text-sm text-center">{item.quantity} {item.unit}</td>
                            <td className="p-3 text-sm text-right font-mono font-bold text-blue-600">
                              {item.price.toLocaleString()} MMK
                            </td>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>

              <DialogFooter className="p-6 bg-slate-50/50 border-t flex items-center justify-between sm:justify-between">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => onReject?.(selectedOrder.id)} className="text-red-600 hover:bg-red-50 hover:text-red-700">
                    <Trash2 size={14} className="mr-2" /> Reject
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onApprove?.(selectedOrder.id)} className="text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700">
                    <Check size={14} className="mr-2" /> Approve
                  </Button>
                </div>
                <Button onClick={() => onProcess(selectedOrder.id)} className="bg-slate-900 font-bold">
                  Generate Invoice
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}