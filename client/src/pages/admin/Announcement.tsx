import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Megaphone,
  Loader2,
  Eye,
  Search,
  Settings2,
  ArrowUpDown,
} from "lucide-react";
import { toast } from "sonner";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  announcementSchema,
  type AnnouncementFormValues,
} from "@/schema/announcement";
import Tiptap from "@/components/editor/Tiptap";

import {
  useCreateAnnouncementMutation,
  useGetAnnouncementHistoryQuery,
} from "@/store/slices/notificationApi";

// 1. Define Data Shape for Table
interface AnnouncementData {
  _id: string;
  title: string;
  target: string;
  content: string;
  createdAt: string;
}

const columnHelper = createColumnHelper<AnnouncementData>();

function Announcement() {
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<AnnouncementData | null>(null);

  // --- RTK QUERY ---
  const { data: history = [], isLoading: isHistoryLoading } =
    useGetAnnouncementHistoryQuery();
  const [createAnnouncement, { isLoading: isSubmitting }] =
    useCreateAnnouncementMutation();

  // --- FORM SETUP ---
  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: "",
      content: "",
      target: "All",
    },
  });

  const onSubmit = async (values: AnnouncementFormValues) => {
    try {
      await createAnnouncement(values).unwrap();
      toast.success("Announcement sent successfully!");
      form.reset({ title: "", content: "", target: "All" });
    } catch (error) {
      toast.error("Failed to send announcement.");
    }
  };

  // --- TABLE STATE ---
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // --- COLUMN DEFINITIONS ---
  const columns = useMemo(
    () => [
      columnHelper.accessor("title", {
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="hover:bg-transparent p-0 font-bold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
      }),
      columnHelper.accessor("target", {
        header: "Target Group",
        cell: (info) => (
          <span className="capitalize px-2 py-1 rounded-md bg-muted text-xs font-medium">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("createdAt", {
        header: "Date Sent",
        cell: (info) => (
          <span className="text-sm text-muted-foreground">
            {new Date(info.getValue()).toLocaleDateString()}
          </span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: () => <div className="text-right">Action</div>,
        cell: (info) => (
          <div className="flex justify-end">
            {/* FIXED: Removed size="icon" and adjusted width to fit text */}
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setSelectedAnnouncement(info.row.original)}
            >
              <Eye className="h-4 w-4" />
              View Details
            </Button>
          </div>
        ),
      }),
    ],
    [],
  );

  // --- INITIALIZE TABLE ---
  const table = useReactTable({
    data: history,
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
    <div className="h-screen p-6 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Megaphone className="w-6 h-6" /> Announcements
      </h1>

      {/* --- CREATE FORM SECTION --- */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Announcement</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Announcement Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="target"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Users</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select target" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="All">All Users</SelectItem>
                          <SelectItem value="Farmers">Farmers</SelectItem>
                          <SelectItem value="Merchants">Merchants</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="pb-2">Message</FormLabel>
                    <FormControl>
                      <Tiptap value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                  </>
                ) : (
                  "Send Announcement"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* --- HISTORY TABLE SECTION --- */}
      <Card>
        <CardHeader>
          <CardTitle>Announcement History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search announcements..."
                value={
                  (table.getColumn("title")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("title")?.setFilterValue(event.target.value)
                }
                className="pl-9 h-9"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto border-2"
                >
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

          <div className="rounded-md border-2 bg-card overflow-hidden">
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
                {isHistoryLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        Loading history...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
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
                      No announcements found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between px-2">
            <div className="flex-1 text-sm text-muted-foreground">
              Total {history.length} items
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
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
                    {[10, 20, 30, 40, 50].map((size) => (
                      <SelectItem key={size} value={`${size}`}>
                        {size}
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
        </CardContent>
      </Card>

      {/* --- DETAILS DIALOG --- */}
      <Dialog
        open={!!selectedAnnouncement}
        onOpenChange={() => setSelectedAnnouncement(null)}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedAnnouncement?.title}</DialogTitle>
            <DialogDescription>
              Sent to: {selectedAnnouncement?.target} on{" "}
              {selectedAnnouncement &&
                new Date(selectedAnnouncement.createdAt).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          <div
            className="prose prose-sm dark:prose-invert mt-4 border-t pt-4 pl-4"
            dangerouslySetInnerHTML={{
              __html: selectedAnnouncement?.content || "",
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Announcement;
