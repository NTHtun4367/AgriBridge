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
import { useGetAllEntriesQuery } from "@/store/slices/entryApi";
import { format } from "date-fns";
import { useNavigate } from "react-router";
import { useCurrentUserQuery } from "@/store/slices/userApi";
import { Card, CardContent } from "@/components/ui/card";

function Records() {
  const { t } = useTranslation();
  const { data: entries, isLoading } = useGetAllEntriesQuery();
  const { data: user } = useCurrentUserQuery();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSeason, setSelectedSeason] = useState("all");

  const seasonOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const seasonKeys = ["Summer", "Rainy", "Winter"];
    const years = [currentYear - 1, currentYear, currentYear + 1];
    const options: { label: string; value: string }[] = [];

    years.forEach((y) =>
      seasonKeys.forEach((key) => {
        options.push({
          label: `${t(`farmer_records.seasons.${key}`)} ${y}`,
          value: `${key} ${y}`,
        });
      }),
    );
    return options;
  }, [t]);

  const filteredEntries = useMemo(() => {
    if (!entries) return [];
    return entries.filter((en: any) => {
      const matchesSearch =
        en.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        en.notes?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === "all" || en.type === selectedType;
      const matchesSeason =
        selectedSeason === "all" || en.season === selectedSeason;
      return matchesSearch && matchesType && matchesSeason;
    });
  }, [entries, searchTerm, selectedType, selectedSeason]);

  return (
    <div className="w-full min-h-screen p-4 md:p-8 bg-slate-50/30 dark:bg-transparent">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mm:leading-loose">
              {t("farmer_records.title")}
            </h2>
            <p className="text-slate-500 font-medium mt-2 mm:leading-loose">
              {t("farmer_records.subtitle")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right hidden md:block">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {t("farmer_records.total_results")}
              </p>
              <p className="text-lg font-black text-primary mm:-mt-6">
                {filteredEntries.length}
              </p>
            </div>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder={t("farmer_records.search_placeholder")}
              className="pl-10 bg-white dark:bg-slate-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[150px] bg-white dark:bg-slate-900 mm:leading-loose">
              <SelectValue placeholder={t("farmer_records.filter_type")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("farmer_records.all_types")}
              </SelectItem>
              <SelectItem value="income">
                {t("farmer_records.income")}
              </SelectItem>
              <SelectItem value="expense">
                {t("farmer_records.expense")}
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedSeason} onValueChange={setSelectedSeason}>
            <SelectTrigger className="w-[180px] bg-white dark:bg-slate-900 mm:leading-loose">
              <SelectValue placeholder={t("farmer_records.filter_season")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("farmer_records.all_seasons")}
              </SelectItem>
              {seasonOptions.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(searchTerm ||
            selectedType !== "all" ||
            selectedSeason !== "all") && (
            <Button
              variant="ghost"
              onClick={() => {
                setSearchTerm("");
                setSelectedType("all");
                setSelectedSeason("all");
              }}
              className="text-slate-500 hover:text-red-500 transition-colors"
            >
              <FilterX className="h-4 w-4 mr-2" />
              {t("farmer_records.clear_filters")}
            </Button>
          )}
        </div>

        <Card>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
                <TableRow className="hover:bg-transparent border-slate-200 dark:border-slate-800">
                  <TableHead className="w-[120px] font-bold text-slate-700 dark:text-slate-300">
                    {t("farmer_records.table_date")}
                  </TableHead>
                  <TableHead className="font-bold text-slate-700 dark:text-slate-300">
                    {t("farmer_records.table_category")}
                  </TableHead>
                  <TableHead className="hidden md:table-cell font-bold text-slate-700 dark:text-slate-300">
                    {t("farmer_records.table_season")}
                  </TableHead>
                  <TableHead className="font-bold text-slate-700 dark:text-slate-300">
                    {t("farmer_records.table_type")}
                  </TableHead>
                  <TableHead className="text-right font-bold text-slate-700 dark:text-slate-300">
                    {t("farmer_records.table_amount")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-64 text-center text-slate-400 font-medium"
                    >
                      {t("farmer_records.loading")}
                    </TableCell>
                  </TableRow>
                ) : filteredEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <Inbox className="h-10 w-10 mb-2 opacity-20" />
                        <p>{t("farmer_records.no_records")}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEntries.map((en: any) => {
                    const isIncome = en.type === "income";
                    return (
                      <TableRow
                        key={en._id}
                        className="cursor-pointer group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors border-slate-100 dark:border-slate-800"
                        onClick={() =>
                          navigate(`/${user?.role}/records/${en._id}`)
                        }
                      >
                        <TableCell className="font-medium text-slate-600 dark:text-slate-400">
                          <div className="flex flex-col">
                            <span className="text-slate-900 dark:text-slate-200 font-bold">
                              {format(new Date(en.date), "dd MMM")}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {format(new Date(en.date), "yyyy")}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 dark:text-slate-100 capitalize">
                              {en.category}
                            </span>
                            {en.notes && (
                              <span className="text-xs text-slate-400 line-clamp-1 max-w-[200px]">
                                {en.notes}
                              </span>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="hidden md:table-cell">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-black uppercase tracking-wider">
                            {en.season}
                          </span>
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
                              ? t("farmer_records.income")
                              : t("farmer_records.expense")}
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
                              {isIncome ? "+" : "-"} {en.value.toLocaleString()}
                            </span>
                            <span className="text-[9px] font-black text-slate-400 tracking-tighter">
                              MMK
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

        <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 dark:text-slate-600 text-xs font-medium">
          <Calendar size={14} />
          <span>{t("farmer_records.footer_sync")}</span>
        </div>
      </div>
    </div>
  );
}

export default Records;
