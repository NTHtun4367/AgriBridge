import { useState, useMemo } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Settings2, Search, ArrowUpDown } from "lucide-react";

import { useGetMerchantsAdminQuery } from "@/store/slices/adminApi";
import UserStatusDropDown from "@/components/admin/UserStatusDropDown";
import MerchantVerificationDropDown from "@/components/admin/MerchantVerificationDropDown";

// 1. Updated Data Shape
interface Farmer {
  _id: string;
  name: string;
  email: string;
  status: string;
  verificationStatus: "pending" | "verified" | "rejected"; // New Field
}

const columnHelper = createColumnHelper<Farmer>();

function MerchantManagement() {
  const { data: farmers = [], isLoading } =
    useGetMerchantsAdminQuery(undefined);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // 3. Define Columns
  const columns = useMemo(
    () => [
      columnHelper.accessor("_id", {
        header: "User ID",
        cell: (info) => (
          <span className="font-mono text-xs uppercase text-muted-foreground">
            {info.getValue().slice(-8)}
          </span>
        ),
      }),
      columnHelper.accessor("name", {
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="hover:bg-transparent p-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
      }),
      columnHelper.accessor("email", {
        header: "Email",
      }),
      columnHelper.accessor("status", {
        header: "Account",
        cell: (info) => {
          const status = info.getValue();
          return (
            <Badge
              variant="outline"
              className={
                status === "active"
                  ? "border-primary text-primary"
                  : "border-destructive text-destructive"
              }
            >
              {status}
            </Badge>
          );
        },
      }),
      // --- NEW VERIFICATION STATUS COLUMN ---
      columnHelper.accessor("verificationStatus", {
        header: "Verification",
        cell: (info) => {
          const vStatus = info.getValue();
          const styles = {
            verified:
              "bg-green-500/10 text-green-600 border-green-200 hover:bg-green-500/20",
            pending:
              "bg-yellow-500/10 text-yellow-600 border-yellow-200 hover:bg-yellow-500/20",
            rejected:
              "bg-red-500/10 text-red-600 border-red-200 hover:bg-red-500/20",
          };
          return (
            <Badge
              className={`${styles[vStatus] || ""} capitalize border shadow-none`}
            >
              {vStatus}
            </Badge>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: (info) => (
          <div className="flex justify-end gap-2">
            {/* New Verification Action */}
            <MerchantVerificationDropDown
              merchantId={info.row.original._id}
              currentStatus={info.row.original.verificationStatus}
            />
            {/* Existing Status Action */}
            <UserStatusDropDown
              userId={info.row.original._id}
              userStatus={info.row.original.status}
            />
          </div>
        ),
      }),
    ],
    [],
  );

  const table = useReactTable({
    data: farmers,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight">
          Merchant Management
        </h2>
        <p className="text-muted-foreground text-sm">
          Overview of all verified merchants registered on AgriBridge.
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="pl-9 h-9"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto border-2">
              <Settings2 className="mr-2 h-4 w-4" />
              View
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
                  {column.id}
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
                    {header.isPlaceholder
                      ? null
                      : flexRender(
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
                  Loading data...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/30 transition-colors"
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
                  No merchants found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          Total {farmers.length} merchants found
        </div>
        <div className="flex items-center space-x-4 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-xs font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger className="h-8 w-[70px] border-2">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="h-8 px-3 border-2"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                className="h-8 px-3 border-2"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MerchantManagement;
