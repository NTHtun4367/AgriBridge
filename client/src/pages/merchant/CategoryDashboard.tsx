import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useGetCategoryStatsQuery } from "@/store/slices/entryApi";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpDown,
  Search,
  Settings2,
} from "lucide-react";

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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// --- TYPES ---
interface CategoryItem {
  category: string;
  income: number;
  expense: number;
  profit: number;
}

const columnHelper = createColumnHelper<CategoryItem>();

// --- BEAUTIFUL CUSTOM TOOLTIP ---
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-lg border-t-4 border-t-indigo-500">
        <p className="text-[10px] font-black text-slate-500 uppercase mb-2 tracking-wider">
          {label}
        </p>
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between gap-6"
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: entry.fill.includes("url")
                      ? entry.name === "Income"
                        ? "#10b981"
                        : "#f43f5e"
                      : entry.fill,
                  }}
                />
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {entry.name}
                </p>
              </div>
              <p className="text-xs font-black text-slate-800 dark:text-slate-100">
                {entry.value.toLocaleString()} MMK
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const CategoryDashboard = () => {
  const { data, isLoading, error } = useGetCategoryStatsQuery();

  // Table State
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  // 1. Prepare Chart Data
  const chartData = useMemo(() => {
    return (
      data?.categories.map((item) => ({
        name: item.category.charAt(0).toUpperCase() + item.category.slice(1),
        Income: item.income,
        Expense: item.expense,
        Profit: item.profit,
      })) || []
    );
  }, [data]);

  // 2. Table Columns
  const columns = useMemo(
    () => [
      columnHelper.accessor("category", {
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="hover:bg-transparent p-0 font-bold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Category
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: (info) => (
          <span className="capitalize font-medium">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("income", {
        header: "Income",
        cell: (info) => (
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
            +{info.getValue().toLocaleString()}{" "}
            <span className="text-[10px] opacity-70">MMK</span>
          </span>
        ),
      }),
      columnHelper.accessor("expense", {
        header: "Expense",
        cell: (info) => (
          <span className="text-rose-500 dark:text-rose-400 font-semibold">
            -{info.getValue().toLocaleString()}{" "}
            <span className="text-[10px] opacity-70">MMK</span>
          </span>
        ),
      }),
      columnHelper.accessor("profit", {
        header: "Net Profit",
        cell: (info) => {
          const val = info.getValue();
          return (
            <Badge
              className={cn(
                "shadow-none border",
                val >= 0
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:bg-emerald-500/20"
                  : "bg-rose-500/10 text-rose-600 border-rose-200 dark:bg-rose-500/20",
              )}
            >
              {val.toLocaleString()} MMK
            </Badge>
          );
        },
      }),
    ],
    [],
  );

  const table = useReactTable({
    data: data?.categories || [],
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

  if (isLoading) {
    return (
      <div className="p-20 text-center animate-pulse">
        <div className="h-12 w-12 mx-auto animate-spin rounded-full border-4 border-indigo-500 border-t-transparent mb-4"></div>
        <p className="text-slate-500 dark:text-slate-400 font-medium uppercase tracking-widest text-xs">
          Calculating category analytics...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-rose-500 bg-rose-50 dark:bg-rose-950/20 rounded-xl m-6 border border-rose-100 dark:border-rose-900/50">
        <p className="font-bold">Error loading stats</p>
        <p className="text-sm">Please check your connection and try again.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8 min-h-screen animate-in fade-in duration-500">
      {/* 1. HEADER SECTION */}
      <div className="space-y-1">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Category Profitability
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          Detailed performance audit across procurement categories.
        </p>
      </div>

      {/* 2. OVERALL SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Income"
          value={data?.overall.income}
          icon={<TrendingUp className="text-emerald-500 w-5 h-5" />}
          color="bg-emerald-500/10 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20"
        />
        <StatCard
          title="Total Expenses"
          value={data?.overall.expense}
          icon={<TrendingDown className="text-rose-500 w-5 h-5" />}
          color="bg-rose-500/10 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20"
        />
        <StatCard
          title="Net Profit"
          value={data?.overall.profit}
          icon={<Wallet className="text-indigo-500 w-5 h-5" />}
          color="bg-indigo-500/10 border-indigo-100 dark:bg-indigo-500/10 dark:border-indigo-500/20"
          isBold
        />
      </div>

      {/* 3. BEAUTIFIED CHART SECTION */}
      <Card className="border-none shadow-sm overflow-hidden bg-white dark:bg-slate-900">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-6">
          <div>
            <CardTitle className="text-xl font-black">
              Performance Analytics
            </CardTitle>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">
              Revenue vs Expense Comparison
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm bg-emerald-500" />
              <span className="text-[10px] font-bold text-slate-500 uppercase">
                Income
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm bg-rose-500" />
              <span className="text-[10px] font-bold text-slate-500 uppercase">
                Expense
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
                barGap={8}
              >
                <defs>
                  <linearGradient
                    id="incomeGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient
                    id="expenseGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity={1} />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                  opacity={0.1}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
                  interval={0}
                  height={50}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                  tickFormatter={(val) => `${val / 1000}k`}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc", opacity: 0.1 }}
                  content={<CustomTooltip />}
                />
                <Bar
                  name="Income"
                  dataKey="Income"
                  fill="url(#incomeGradient)"
                  radius={[6, 6, 0, 0]}
                  barSize={24}
                />
                <Bar
                  name="Expense"
                  dataKey="Expense"
                  fill="url(#expenseGradient)"
                  radius={[6, 6, 0, 0]}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 4. SHADCN TABLE BREAKDOWN */}
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full max-sm:max-w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by category..."
              value={
                (table.getColumn("category")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("category")?.setFilterValue(event.target.value)
              }
              className="pl-9 h-9 border-2"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto border-2">
                <Settings2 className="mr-2 h-4 w-4" /> View
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
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="rounded-xl border-2 bg-card shadow-sm overflow-hidden">
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
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-4">
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
                    No data found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground">
            Total {data?.categories.length || 0} categories
          </div>
          <div className="flex items-center gap-6 lg:gap-8">
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium">Rows</p>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger className="h-8 w-[70px] border-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 30].map((size) => (
                    <SelectItem key={size} value={`${size}`}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
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
};

const StatCard = ({ title, value, icon, color, isBold = false }: any) => (
  <div
    className={cn(
      "p-6 rounded-2xl border flex items-center gap-5 transition-all duration-300",
      "hover:-translate-y-1 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700",
      color,
    )}
  >
    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
      {icon}
    </div>
    <div>
      <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wide mb-0.5">
        {title}
      </p>
      <p
        className={cn(
          "text-2xl font-bold tracking-tight",
          isBold
            ? "text-indigo-900 dark:text-indigo-300"
            : "text-slate-800 dark:text-slate-100",
        )}
      >
        {(value || 0).toLocaleString()}{" "}
        <span className="text-sm font-medium opacity-60">MMK</span>
      </p>
    </div>
  </div>
);

export default CategoryDashboard;
