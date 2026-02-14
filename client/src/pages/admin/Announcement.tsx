import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
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

interface AnnouncementData {
  _id: string;
  title: string;
  target: string;
  content: string;
  createdAt: string;
}

const columnHelper = createColumnHelper<AnnouncementData>();

function Announcement() {
  const { t } = useTranslation();
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
      toast.success(t("announcement.create_card.success"));
      form.reset({ title: "", content: "", target: "All" });
    } catch (error) {
      toast.error(t("announcement.create_card.error"));
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
            {t("announcement.history_card.columns.title")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
      }),
      columnHelper.accessor("target", {
        header: t("announcement.history_card.columns.target"),
        cell: (info) => (
          <span className="capitalize px-2 py-1 rounded-md bg-muted text-xs font-medium">
            {t(`announcement.targets.${info.getValue().toLowerCase()}`)}
          </span>
        ),
      }),
      columnHelper.accessor("createdAt", {
        header: t("announcement.history_card.columns.date"),
        cell: (info) => (
          <span className="text-sm text-muted-foreground">
            {new Date(info.getValue()).toLocaleDateString()}
          </span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: () => (
          <div className="text-right">
            {t("announcement.history_card.columns.action")}
          </div>
        ),
        cell: (info) => (
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setSelectedAnnouncement(info.row.original)}
            >
              <Eye className="h-4 w-4" />
              {t("announcement.history_card.table.details")}
            </Button>
          </div>
        ),
      }),
    ],
    [t],
  );

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
      <h1 className="text-2xl font-bold flex items-center gap-2 mm:leading-loose">
        <Megaphone className="w-6 h-6" /> {t("announcement.title")}
      </h1>

      {/* --- CREATE FORM SECTION --- */}
      <Card>
        <CardHeader>
          <CardTitle className="mm:leading-loose">
            {t("announcement.create_card.title")}
          </CardTitle>
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
                      <FormLabel>
                        {t("announcement.create_card.fields.title")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "announcement.create_card.fields.title_placeholder",
                          )}
                          {...field}
                        />
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
                      <FormLabel>
                        {t("announcement.create_card.fields.target")}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="mm:leading-loose">
                            <SelectValue
                              placeholder={t(
                                "announcement.create_card.fields.target_placeholder",
                              )}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="All">
                            {t("announcement.targets.all")}
                          </SelectItem>
                          <SelectItem value="Farmers">
                            {t("announcement.targets.farmers")}
                          </SelectItem>
                          <SelectItem value="Merchants">
                            {t("announcement.targets.merchants")}
                          </SelectItem>
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
                    <FormLabel className="pb-2">
                      {t("announcement.create_card.fields.message")}
                    </FormLabel>
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
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    {t("announcement.create_card.sending")}
                  </>
                ) : (
                  t("announcement.create_card.submit")
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* --- HISTORY TABLE SECTION --- */}
      <Card>
        <CardHeader>
          <CardTitle>{t("announcement.history_card.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("announcement.history_card.search_placeholder")}
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
                  {t("announcement.history_card.view_toggle")}
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
                        {t("announcement.history_card.table.loading")}
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
                      {t("announcement.history_card.table.empty")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between px-2">
            <div className="flex-1 text-sm text-muted-foreground">
              {t("announcement.history_card.table.total", {
                count: history.length,
              })}
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
              <div className="flex items-center space-x-2">
                <p className="text-xs font-medium mm:mb-0">
                  {t("announcement.history_card.table.rows_per_page")}
                </p>
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
                  {t("announcement.history_card.table.page_info", {
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
                    {t("announcement.history_card.table.prev")}
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 px-3 border-2"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    {t("announcement.history_card.table.next")}
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
            <DialogTitle className="mm:leading-loose">
              {selectedAnnouncement?.title}
            </DialogTitle>
            <DialogDescription className="mm:mb-0">
              {/* Note: I'm leaving the dynamic sent-to text as a template literal for brevity, 
                  but you could further localize the "Sent to... on..." string if needed */}
              {t("announcement.history_card.columns.target")}:{" "}
              {selectedAnnouncement &&
                t(
                  `announcement.targets.${selectedAnnouncement.target.toLowerCase()}`,
                )}{" "}
              |{" "}
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
