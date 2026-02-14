import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Search,
  Inbox,
  FilterX,
  ArrowUpRight,
  ArrowDownLeft,
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
import { format, isValid } from "date-fns";
import { useNavigate } from "react-router";
import { useCurrentUserQuery } from "@/store/slices/userApi";
import { Card, CardContent } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { type RootState } from "@/store";
import { localizeData, toMyanmarNumerals } from "@/utils/translator";
import { GLOSSARY } from "@/utils/glossary";

function Records() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { lang } = useSelector((state: RootState) => state.settings);
  const { data: user } = useCurrentUserQuery();
  const { data: rawEntries, isLoading } = useGetAllEntriesQuery();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSeason, setSelectedSeason] = useState("all");

  // Localize Entries (English မှာလည်း comma ထည့်ရန် ပြင်ထားသော helper ကို သုံးပါသည်)
  const entries = useMemo(() => {
    return localizeData(rawEntries, lang) || [];
  }, [rawEntries, lang]);

  // Season Dropdown Options
  const seasonOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const seasonKeys = ["Summer", "Rainy", "Winter"];
    const years = [currentYear - 1, currentYear, currentYear + 1];
    const options: { label: string; value: string }[] = [];

    years.forEach((y) =>
      seasonKeys.forEach((key) => {
        // Year (y) ကို toMyanmarNumerals ခေါ်သော်လည်း logic အရ ၄ လုံးတည်းဖြစ်၍ comma ပါမည်မဟုတ်ပါ
        const label =
          lang === "mm"
            ? `${GLOSSARY[key.toLowerCase()]} ${toMyanmarNumerals(y)}`
            : `${t(`farmer_records.seasons.${key}`)} ${y}`;

        options.push({
          label,
          value: `${key} ${y}`,
        });
      }),
    );
    return options;
  }, [t, lang]);

  // Filter Logic
  const filteredEntries = useMemo(() => {
    if (!entries) return [];
    return entries.filter((en: any) => {
      const raw = rawEntries?.find((r) => r._id === en._id);
      if (!raw) return false;

      const categoryMatch = en.category?.toLowerCase() || "";
      const notesMatch = en.notes?.toLowerCase() || "";
      const matchesSearch =
        categoryMatch.includes(searchTerm.toLowerCase()) ||
        notesMatch.includes(searchTerm.toLowerCase());

      const matchesType = selectedType === "all" || raw.type === selectedType;
      const matchesSeason =
        selectedSeason === "all" || raw.season === selectedSeason;

      return matchesSearch && matchesType && matchesSeason;
    });
  }, [entries, searchTerm, selectedType, selectedSeason, rawEntries]);

  // Helper for English Comma Formatting in specific UI elements
  const formatResultsCount = (count: number) => {
    if (lang === "mm") return toMyanmarNumerals(count);
    return count.toLocaleString("en-US");
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mm:leading-loose">
              {t("farmer_records.title")}
            </h2>
            <p className="text-slate-500 font-medium mt-2 mm:leading-loose">
              {t("farmer_records.subtitle")}
            </p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mm:mb-0">
              {t("farmer_records.total_results")}
            </p>
            <p className="text-lg font-black text-primary">
              {formatResultsCount(filteredEntries.length)}
            </p>
          </div>
        </div>

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
                {lang === "mm" ? GLOSSARY.income : t("farmer_records.income")}
              </SelectItem>
              <SelectItem value="expense">
                {lang === "mm" ? GLOSSARY.expense : t("farmer_records.expense")}
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
              className="text-slate-500 hover:text-red-500"
            >
              <FilterX className="h-4 w-4 mr-2" />
              {t("farmer_records.clear_filters")}
            </Button>
          )}
        </div>

        <Card>
          <CardContent className="overflow-x-auto p-0 md:p-6">
            <Table>
              <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
                <TableRow>
                  <TableHead className="w-[120px] font-bold">
                    {t("farmer_records.table_date")}
                  </TableHead>
                  <TableHead className="font-bold">
                    {t("farmer_records.table_category")}
                  </TableHead>
                  <TableHead className="hidden md:table-cell font-bold">
                    {t("farmer_records.table_season")}
                  </TableHead>
                  <TableHead className="font-bold">
                    {t("farmer_records.table_type")}
                  </TableHead>
                  <TableHead className="text-right font-bold">
                    {t("farmer_records.table_amount")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center">
                      {t("farmer_records.loading")}
                    </TableCell>
                  </TableRow>
                ) : filteredEntries.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-64 text-center text-slate-400"
                    >
                      <Inbox className="h-10 w-10 mb-2 opacity-20 mx-auto" />
                      <p>{t("farmer_records.no_records")}</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEntries.map((en: any) => {
                    const isIncome =
                      en.type === GLOSSARY.income || en.type === "income";
                    const entryDate = en.date ? new Date(en.date) : new Date();

                    return (
                      <TableRow
                        key={en._id}
                        className="cursor-pointer hover:bg-slate-50/50"
                        onClick={() =>
                          navigate(`/${user?.role}/records/${en._id}`)
                        }
                      >
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-bold">
                              {isValid(entryDate)
                                ? lang === "mm"
                                  ? `${toMyanmarNumerals(format(entryDate, "dd"))} ${GLOSSARY[format(entryDate, "MMM").toLowerCase()] || format(entryDate, "MMM")}`
                                  : format(entryDate, "dd MMM")
                                : "N/A"}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {isValid(entryDate)
                                ? lang === "mm"
                                  ? toMyanmarNumerals(format(entryDate, "yyyy"))
                                  : format(entryDate, "yyyy")
                                : ""}
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
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase">
                            {en.season}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div
                            className={`flex items-center gap-1.5 font-bold text-xs uppercase ${isIncome ? "text-emerald-600" : "text-red-500"}`}
                          >
                            {isIncome ? (
                              <ArrowUpRight size={14} />
                            ) : (
                              <ArrowDownLeft size={14} />
                            )}
                            {en.type}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col items-end">
                            <span
                              className={`font-black text-base ${isIncome ? "text-emerald-600" : "text-destructive"}`}
                            >
                              {isIncome ? "+" : "-"} {en.value}
                            </span>
                            <span className="text-[9px] font-black text-slate-400">
                              {lang === "mm" ? GLOSSARY.mmk : "MMK"}
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
      </div>
    </div>
  );
}

export default Records;
