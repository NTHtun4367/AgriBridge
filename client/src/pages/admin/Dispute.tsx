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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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

import {
  useGetDisputesQuery,
  useUpdateDisputeStatusMutation,
} from "@/store/slices/disputeApi";
import { localizeData, toMyanmarNumerals } from "@/utils/translator";

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

interface MerchantDispute {
  _id: string;
  merchantId: PopulatedUser;
  farmerId: PopulatedUser;
  reason: string;
  description: string;
  status: string;
  createdAt: string;
}

const columnHelper = createColumnHelper<MerchantDispute>();

export default function MerchantDisputeManagement() {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language as "en" | "mm") || "en";
  const isMM = currentLang === "mm";

  const { data, isLoading } = useGetDisputesQuery(undefined);
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateDisputeStatusMutation();

  const merchant_disputes = useMemo(() => {
    const localizedResponse = localizeData(data, currentLang);
    return (localizedResponse?.data || []) as MerchantDispute[];
  }, [data, currentLang]);

  const [selectedDispute, setSelectedDispute] =
    useState<MerchantDispute | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  // Localization Helpers
  const formatUI = (val: string | number) => {
    return isMM ? toMyanmarNumerals(val) : val.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    const formatted = new Intl.DateTimeFormat(
      currentLang === "mm" ? "my-MM" : "en-US",
      options,
    ).format(date);
    return isMM ? toMyanmarNumerals(formatted) : formatted;
  };

  const isPendingStatus = (status: string) => {
    return status.toLowerCase() === "pending" || status === "စောင့်ဆိုင်းဆဲ";
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("_id", {
        id: "id",
        header: t("admin_disputes.table.columns.id"),
        cell: (info) => (
          <span className="font-mono text-xs uppercase text-muted-foreground">
            {formatUI(info.getValue()).slice(-6)}
          </span>
        ),
      }),
      columnHelper.accessor("createdAt", {
        header: t("admin_disputes.table.columns.date"),
        cell: (info) => (
          <span className="text-sm">{formatDate(info.getValue())}</span>
        ),
      }),
      columnHelper.accessor("merchantId.name", {
        id: "merchantName",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="hover:bg-transparent p-0 font-bold flex items-center gap-1 text-foreground"
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
          <Badge variant="outline" className="font-normal mm:leading-loose">
            {info.getValue()}
          </Badge>
        ),
      }),
      columnHelper.accessor("status", {
        header: t("admin_disputes.table.columns.status"),
        cell: (info) => {
          const status = info.getValue();
          const pending = isPendingStatus(status);
          return (
            <Badge
              className={
                pending
                  ? "bg-destructive hover:bg-destructive/90 text-white mm:leading-loose"
                  : "bg-primary hover:bg-primary/90 text-white mm:leading-loose"
              }
            >
              {status}
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
    [t, currentLang, isMM],
  );

  const table = useReactTable({
    data: merchant_disputes,
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
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight mm:leading-loose">
          {t("admin_disputes.title")}
        </h2>
        <p className="text-muted-foreground text-sm mm:leading-loose">
          {t("admin_disputes.description")}
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-sm:max-w-none max-w-sm">
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
              <Settings2 className="mr-2 h-4 w-4" />
              {t("admin_disputes.view_toggle")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {table
              .getAllColumns()
              .filter((col) => col.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {t(`admin_disputes.table.columns.${column.id}`)}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

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

      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground font-medium">
          {/* Regex-based localization for numbers within the translated string */}
          {t("admin_disputes.total_count", {
            count: merchant_disputes.length,
            interpolation: { escapeValue: false },
          }).replace(/\d+/g, (m) => formatUI(m))}
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
                <SelectValue>
                  {formatUI(table.getState().pagination.pageSize)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 50].map((sz) => (
                  <SelectItem key={sz} value={`${sz}`}>
                    {formatUI(sz)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium">
              {t("admin_disputes.table.page_info", {
                current: formatUI(table.getState().pagination.pageIndex + 1),
                total: formatUI(table.getPageCount()),
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

      <Dialog
        open={!!selectedDispute}
        onOpenChange={() => setSelectedDispute(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <AlertCircle className="h-5 w-5 text-red-500" />
              {t("admin_disputes.modal.title")}
            </DialogTitle>
            <DialogDescription>
              {t("admin_disputes.modal.record_id")}:{" "}
              <span className="font-mono text-xs">
                {formatUI(selectedDispute?._id || "")}
              </span>
            </DialogDescription>
          </DialogHeader>

          {selectedDispute && (
            <div className="grid gap-6 py-4">
              <div className="flex justify-between items-start bg-muted/30 p-4 rounded-lg border">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase font-bold mm:leading-loose">
                    {t("admin_disputes.modal.issue_type")}
                  </p>
                  <Badge
                    variant="outline"
                    className="text-sm px-3 mm:text-xs mm:leading-loose"
                  >
                    {selectedDispute.reason}
                  </Badge>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-xs text-muted-foreground uppercase font-bold mm:leading-loose">
                    {t("admin_disputes.modal.lodged_on")}
                  </p>
                  <div className="flex items-center justify-end gap-2 text-sm mm:text-xs mm:leading-loose">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(selectedDispute.createdAt)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border-2 rounded-xl bg-blue-50/20">
                  <div className="flex items-center gap-2 mb-2 text-blue-700">
                    <User className="h-4 w-4" />
                    <h4 className="text-sm font-bold">
                      {t("admin_disputes.modal.plaintiff")}
                    </h4>
                  </div>
                  <p className="font-semibold text-sm">
                    {selectedDispute.farmerId.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedDispute.farmerId.email}
                  </p>
                </div>
                <div className="p-4 border-2 rounded-xl bg-orange-50/20">
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
                  <p className="text-xs text-muted-foreground">
                    {selectedDispute.merchantId.email}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-foreground">
                  {t("admin_disputes.modal.description_label")}
                </h4>
                <div className="p-4 rounded-lg bg-muted text-sm leading-relaxed border italic text-muted-foreground">
                  "{selectedDispute.description}"
                </div>
              </div>

              <DialogFooter className="mt-4 flex items-center justify-between sm:justify-between">
                <Badge
                  className={
                    isPendingStatus(selectedDispute.status)
                      ? "bg-red-100 text-red-700 hover:bg-red-100 mm:leading-loose"
                      : "bg-green-100 text-green-700 hover:bg-green-100 mm:leading-loose"
                  }
                >
                  {selectedDispute.status}
                </Badge>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedDispute(null)}
                  >
                    {t("admin_disputes.modal.close")}
                  </Button>
                  {isPendingStatus(selectedDispute.status) && (
                    <Button
                      onClick={() => handleResolve(selectedDispute._id)}
                      disabled={isUpdating}
                    >
                      <CheckCircle2 className="h-4 w-4" />
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
