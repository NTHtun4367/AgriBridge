import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  createColumnHelper,
} from "@tanstack/react-table";
import type {
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Settings2,
  Search,
  ArrowUpDown,
  CheckCircle2,
  Eye,
  User,
  Store,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";

import {
  useGetDisputesQuery,
  useUpdateDisputeStatusMutation,
} from "@/store/slices/disputeApi";

// --- Interfaces ---
interface PopulatedUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  merchantId?: {
    businessName: string;
    phone: string;
  };
}

interface Dispute {
  _id: string;
  merchantId: PopulatedUser;
  farmerId: PopulatedUser;
  reason: string;
  description: string;
  status: "pending" | "resolved" | "rejected";
  createdAt: string;
}

const columnHelper = createColumnHelper<Dispute>();

export default function DisputeManagement() {
  const { t } = useTranslation();
  const { data: response, isLoading } = useGetDisputesQuery(undefined);
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateDisputeStatusMutation();

  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const disputes = useMemo(() => response?.data || [], [response]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("_id", {
        header: t("admin_disputes.table.columns.id"),
        cell: (info) => (
          <span className="font-mono text-xs uppercase text-muted-foreground">
            {info.getValue().slice(-6)}
          </span>
        ),
      }),
      columnHelper.accessor("createdAt", {
        header: t("admin_disputes.table.columns.date"),
        cell: (info) => (
          <span className="text-sm">
            {format(new Date(info.getValue()), "dd MMM yyyy")}
          </span>
        ),
      }),
      columnHelper.accessor("merchantId.name", {
        id: "merchantName",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="hover:bg-transparent p-0 font-bold flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("admin_disputes.table.columns.merchant")}
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        ),
        cell: (info) => (
          <span className="font-medium pl-3">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("farmerId.name", {
        id: "farmerName",
        header: t("admin_disputes.table.columns.farmer"),
        cell: (info) => <span>{info.getValue()}</span>,
      }),
      columnHelper.accessor("reason", {
        header: t("admin_disputes.table.columns.reason"),
        cell: (info) => (
          <Badge variant="outline" className="capitalize font-normal">
            {info.getValue()}
          </Badge>
        ),
      }),
      columnHelper.accessor("status", {
        header: t("admin_disputes.table.columns.status"),
        cell: (info) => {
          const status = info.getValue();
          return (
            <Badge
              className={
                status === "pending"
                  ? "bg-destructive hover:bg-destructive/90 capitalize"
                  : "bg-primary hover:bg-primary/90 capitalize"
              }
            >
              {t(`admin_disputes.statuses.${status}`)}
            </Badge>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: () => (
          <div className="text-right">
            {t("admin_disputes.table.columns.action")}
          </div>
        ),
        cell: (info) => (
          <div className="flex justify-end">
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-2 border-2 px-3 hover:bg-muted"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedDispute(info.row.original);
              }}
            >
              <Eye className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-semibold">
                {t("admin_disputes.table.details_btn")}
              </span>
            </Button>
          </div>
        ),
      }),
    ],
    [t],
  );

  const table = useReactTable({
    data: disputes,
    columns,
    state: { sorting, columnFilters, columnVisibility, pagination },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleResolve = async (id: string) => {
    await updateStatus({ id, status: "resolved" });
    setSelectedDispute(null);
  };

  return (
    <div className="w-full space-y-4 p-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight mm:leading-loose">
          {t("admin_disputes.title")}
        </h2>
        <p className="text-muted-foreground text-sm mm:leading-loose">
          {t("admin_disputes.description")}
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("admin_disputes.search_placeholder")}
            value={
              (table.getColumn("merchantName")?.getFilterValue() as string) ??
              ""
            }
            onChange={(event) =>
              table
                .getColumn("merchantName")
                ?.setFilterValue(event.target.value)
            }
            className="pl-9 h-9 border-2"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto border-2">
              <Settings2 className="mr-2 h-4 w-4" />{" "}
              {t("admin_disputes.view_toggle")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id.replace(/([A-Z])/g, " $1")}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="rounded-md border-2 bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="font-bold py-3 text-foreground"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t("admin_disputes.table.loading")}
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => setSelectedDispute(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {t("admin_disputes.table.empty")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer / Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground font-medium">
          {t("admin_disputes.total_count", { count: disputes.length })}
        </div>
        <div className="flex items-center space-x-4 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-xs font-medium mm:mb-0">
              {t("admin_disputes.table.rows_per_page")}
            </p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(v) => table.setPageSize(Number(v))}
            >
              <SelectTrigger className="h-8 w-[70px] border-2">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 50].map((sz) => (
                  <SelectItem key={sz} value={`${sz}`}>
                    {sz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-medium">
              {t("admin_disputes.table.page_info", {
                current: table.getState().pagination.pageIndex + 1,
                total: table.getPageCount(),
              })}
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="h-8 px-3 border-2"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                {t("admin_disputes.table.prev")}
              </Button>
              <Button
                variant="outline"
                className="h-8 px-3 border-2"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                {t("admin_disputes.table.next")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Details */}
      <Dialog
        open={!!selectedDispute}
        onOpenChange={() => setSelectedDispute(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl mm:leading-loose">
              <AlertCircle className="h-5 w-5 text-red-500" />
              {t("admin_disputes.modal.title")}
            </DialogTitle>
            <DialogDescription>
              {t("admin_disputes.modal.record_id")}:{" "}
              <span className="font-mono text-xs">{selectedDispute?._id}</span>
            </DialogDescription>
          </DialogHeader>

          {selectedDispute && (
            <div className="grid gap-6 py-4">
              <div className="flex justify-between items-start bg-muted/30 p-4 rounded-lg border mm:w-[465px]">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase font-bold mm:leading-loose">
                    {t("admin_disputes.modal.issue_type")}
                  </p>
                  <Badge variant="outline" className="text-sm px-3">
                    {selectedDispute.reason}
                  </Badge>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-xs text-muted-foreground uppercase font-bold mm:leading-loose">
                    {t("admin_disputes.modal.lodged_on")}
                  </p>
                  <div className="flex items-center justify-end gap-2 text-sm">
                    <Calendar className="h-3.5 w-3.5" />
                    {format(new Date(selectedDispute.createdAt), "PPP")}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mm:w-[465px] mm:gap-2">
                <div className="p-4 border-2 rounded-xl bg-blue-50/20 mm:w-full">
                  <div className="flex items-center gap-2 mb-2 text-blue-700">
                    <User className="h-4 w-4" />
                    <h4 className="text-sm font-bold">
                      {t("admin_disputes.modal.plaintiff")}
                    </h4>
                  </div>
                  <p className="font-semibold text-sm">
                    {selectedDispute.farmerId.name}
                  </p>
                  <p className="text-xs text-muted-foreground mm:mb-0">
                    {selectedDispute.farmerId.email}
                  </p>
                </div>

                <div className="p-4 border-2 rounded-xl bg-orange-50/20 mm:w-full">
                  <div className="flex items-center gap-2 mb-2 text-orange-700">
                    <Store className="h-4 w-4" />
                    <h4 className="text-sm font-bold">
                      {t("admin_disputes.modal.defendant")}
                    </h4>
                  </div>
                  <p className="font-semibold text-sm">
                    {selectedDispute.merchantId.merchantId?.businessName ||
                      selectedDispute.merchantId.name}
                  </p>
                  <p className="text-xs text-muted-foreground mm:mb-0">
                    {selectedDispute.merchantId.email}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-foreground">
                  {t("admin_disputes.modal.description_label")}
                </h4>
                <div className="p-4 rounded-lg bg-muted text-sm leading-relaxed border italic text-muted-foreground mm:w-[465px]">
                  "{selectedDispute.description}"
                </div>
              </div>

              <DialogFooter className="mt-4 flex mm:flex-wrap items-center justify-between sm:justify-between mm:w-[465px]">
                <Badge
                  className={`mm:mb-2 ${
                    selectedDispute.status === "pending"
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {t("admin_disputes.modal.status_badge", {
                    status: t(
                      `admin_disputes.statuses.${selectedDispute.status}`,
                    ),
                  })}
                </Badge>
                <div className="flex mm:grid mm:grid-cols-2 gap-2">
                  <Button
                    className="mm:w-full"
                    variant="outline"
                    onClick={() => setSelectedDispute(null)}
                  >
                    {t("admin_disputes.modal.close")}
                  </Button>
                  {selectedDispute.status === "pending" && (
                    <Button
                      className="mm:w-full"
                      onClick={() => handleResolve(selectedDispute._id)}
                      disabled={isUpdating}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      {t("admin_disputes.modal.resolve_btn")}
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
