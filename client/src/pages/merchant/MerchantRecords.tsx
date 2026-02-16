import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Search,
  Inbox,
  FilterX,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { useGetAllEntriesQuery } from "@/store/slices/entryApi";
import { useCurrentUserQuery } from "@/store/slices/userApi";
import { format } from "date-fns";
import { useNavigate } from "react-router";
import { localizeData, toMyanmarNumerals } from "@/utils/translator";

function MerchantRecords() {
  const { t, i18n } = useTranslation();
  const { data: entries, isLoading } = useGetAllEntriesQuery();
  const { data: user } = useCurrentUserQuery();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  // Determine current language for localization functions
  const currentLang =
    i18n.language === "mm" || i18n.language === "my" ? "mm" : "en";

  // Filter logic: Search (Category/Notes) and Transaction Type
  const filteredEntries = useMemo(() => {
    if (!entries) return [];

    // 1. Filter the raw data first
    const filtered = entries.filter((en: any) => {
      const categoryMatch = en.category?.toLowerCase() || "";
      const notesMatch = en.notes?.toLowerCase() || "";
      const term = searchTerm.toLowerCase();

      const matchesSearch =
        categoryMatch.includes(term) || notesMatch.includes(term);
      const matchesType = selectedType === "all" || en.type === selectedType;

      return matchesSearch && matchesType;
    });

    // 2. Apply your localizeData function to the filtered result
    return localizeData(filtered, currentLang);
  }, [entries, searchTerm, selectedType, currentLang]);

  return (
    <div className="w-full min-h-screen p-4 md:p-8 bg-slate-50/30 dark:bg-transparent animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mm:leading-loose">
              {t("merchant_records.title")}
            </h2>
            <p className="text-slate-500 font-medium mm:leading-loose">
              {t("merchant_records.subtitle")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right hidden md:block">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mm:leading-loose mm:-mb-1">
                {t("merchant_records.total_records")}
              </p>
              <p className="text-lg font-black text-primary">
                {/* Localize the length number */}
                {currentLang === "mm"
                  ? toMyanmarNumerals(filteredEntries.length)
                  : filteredEntries.length}
              </p>
            </div>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder={t("merchant_records.search_placeholder")}
              className="pl-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm mm:leading-loose"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[180px] bg-white dark:bg-slate-900 mm:leading-loose">
              <SelectValue placeholder={t("merchant_records.filter_type")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("merchant_records.all_types")}
              </SelectItem>
              <SelectItem value="income">
                {t("merchant_records.income_only")}
              </SelectItem>
              <SelectItem value="expense">
                {t("merchant_records.expense_only")}
              </SelectItem>
            </SelectContent>
          </Select>

          {(searchTerm || selectedType !== "all") && (
            <Button
              variant="ghost"
              onClick={() => {
                setSearchTerm("");
                setSelectedType("all");
              }}
              className="text-slate-500 hover:text-red-500 transition-colors"
            >
              <FilterX className="h-4 w-4 mr-2" />
              {t("merchant_records.clear_filters")}
            </Button>
          )}
        </div>

        {/* Table Section */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
                <TableRow className="hover:bg-transparent border-slate-200 dark:border-slate-800">
                  <TableHead className="font-bold text-slate-700 dark:text-slate-300">
                    {t("merchant_records.table.date")}
                  </TableHead>
                  <TableHead className="font-bold text-slate-700 dark:text-slate-300">
                    {t("merchant_records.table.category")}
                  </TableHead>
                  <TableHead className="font-bold text-slate-700 dark:text-slate-300">
                    {t("merchant_records.table.type")}
                  </TableHead>
                  <TableHead className="text-right font-bold text-slate-700 dark:text-slate-300">
                    {t("merchant_records.table.amount")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-64 text-center text-slate-400 font-medium"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="animate-pulse bg-slate-200 dark:bg-slate-800 h-2 w-32 rounded" />
                        {t("merchant_records.status.loading")}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <Inbox className="h-12 w-12 mb-3 opacity-20" />
                        <p className="text-lg font-semibold">
                          {t("merchant_records.status.no_records")}
                        </p>
                        <p className="text-sm">
                          {t("merchant_records.status.try_adjusting")}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEntries.map((en: any) => {
                    const isIncome = en.type === "income";

                    // Format dates manually to handle numeral localization
                    const dateObj = new Date(en.date);
                    const dayMonth = format(dateObj, "dd MMM");
                    const year = format(dateObj, "yyyy");

                    return (
                      <TableRow
                        key={en._id}
                        className="cursor-pointer group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors border-slate-100 dark:border-slate-800"
                        onClick={() =>
                          navigate(`/${user?.role}/records/${en._id}`)
                        }
                      >
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-slate-900 dark:text-slate-200 font-bold">
                              {currentLang === "mm"
                                ? toMyanmarNumerals(dayMonth)
                                : dayMonth}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
                              {currentLang === "mm"
                                ? toMyanmarNumerals(year)
                                : year}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 dark:text-slate-100 capitalize">
                              {en.category}
                            </span>
                            {en.notes && (
                              <span className="text-xs text-slate-400 line-clamp-1 max-w-[250px]">
                                {en.notes}
                              </span>
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div
                            className={`flex items-center gap-1.5 font-bold text-xs uppercase ${
                              isIncome
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-red-500 dark:text-red-400"
                            }`}
                          >
                            {isIncome ? (
                              <ArrowUpRight size={14} className="shrink-0" />
                            ) : (
                              <ArrowDownLeft size={14} className="shrink-0" />
                            )}
                            {isIncome
                              ? t("transaction.income")
                              : t("transaction.expense")}
                          </div>
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex flex-col items-end">
                            <span
                              className={`font-black text-base ${
                                isIncome
                                  ? "text-emerald-600"
                                  : "text-destructive"
                              }`}
                            >
                              {isIncome ? "+" : "-"} {en.value}
                            </span>
                            <span className="text-[9px] font-black text-slate-400 tracking-tighter">
                              {t("merchant_records.mmk")}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Footer info */}
        <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 dark:text-slate-600 text-xs font-medium">
          <Calendar size={14} />
          <span>
            {t("merchant_records.status.system_updated")}:{" "}
            {/* Localize footer date */}
            {currentLang === "mm"
              ? toMyanmarNumerals(format(new Date(), "PPpp"))
              : format(new Date(), "PPpp")}
          </span>
        </div>
      </div>
    </div>
  );
}

export default MerchantRecords;
