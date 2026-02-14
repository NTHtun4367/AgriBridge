import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  useGetEntryByIdQuery,
  useDeleteEntryMutation,
} from "@/store/slices/entryApi";
import {
  Calendar,
  ChevronLeft,
  FileText,
  Hash,
  ImageIcon,
  Loader2,
  Minus,
  Pencil,
  Plus,
  Tag,
  Trash2,
  CloudSun,
} from "lucide-react";
import { useParams, useNavigate } from "react-router";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { type RootState } from "@/store";
import { toMyanmarNumerals, localizeData } from "@/utils/translator";
import EditEntryDialog from "./EditEntryDialog";
import ConfirmModal from "@/common/ConfirmModel";
import { cn } from "@/lib/utils";

function EntryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { lang } = useSelector((state: RootState) => state.settings);
  const isMyanmar = lang === "mm";

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: rawEntry, isLoading } = useGetEntryByIdQuery(id as string);
  const [deleteEntry, { isLoading: isDeleting }] = useDeleteEntryMutation();

  /**
   * Use the central localizeData utility for the entire object
   */
  const entry = useMemo(() => {
    if (!rawEntry) return null;
    return localizeData(rawEntry, lang as "en" | "mm");
  }, [rawEntry, lang]);

  const formatLocalizedDate = (
    dateString: string | Date | undefined,
    includeTime = false,
  ) => {
    if (!dateString) return "N/A";
    const dateObj = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = includeTime
      ? {
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "long",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }
      : {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        };

    const formatted = dateObj.toLocaleDateString("en-US", options);
    return isMyanmar ? toMyanmarNumerals(formatted) : formatted;
  };

  const mmLeading = isMyanmar ? "leading-[1.8] py-0.5" : "leading-normal";

  const handleDelete = async () => {
    try {
      await deleteEntry(id as string).unwrap();
      toast.success(t("modals.success"));
      navigate(-1);
    } catch (err) {
      toast.error(t("modals.error"));
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!entry || !rawEntry)
    return (
      <div className="p-10 text-center dark:text-slate-400">
        Entry not found
      </div>
    );

  const isExpense = rawEntry.type === "expense";

  return (
    <div className="w-full h-screen p-4 pb-12 animate-in slide-in-from-bottom-4 duration-500">
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title={t("modals.deleteTitle")}
        description={t("modals.deleteDescription", {
          category: entry.category,
        })}
        confirmText={t("modals.confirmDelete")}
      />

      <div className="flex items-center justify-between mb-6">
        <h2 className={cn("text-2xl font-bold dark:text-white", mmLeading)}>
          {t("details.title")}
        </h2>
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="dark:border-slate-800 dark:hover:bg-slate-900"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span className={mmLeading}>{t("details.back")}</span>
        </Button>
      </div>

      <Card className="shadow-xl">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge
                variant={isExpense ? "destructive" : "default"}
                className={cn(
                  "rounded-full px-3 uppercase tracking-wider text-[10px]",
                  mmLeading,
                )}
              >
                {/* Localized type (Income/Expense) */}
                {isExpense ? t("entry.type_expense") : t("entry.type_income")}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <EditEntryDialog
                initialData={rawEntry}
                open={isEditDialogOpen}
                setOpen={setIsEditDialogOpen}
              />
              <Button
                variant="outline"
                size={"sm"}
                onClick={() => setIsEditDialogOpen(true)}
                className="dark:border-slate-800 dark:hover:bg-slate-800"
              >
                <Pencil className="h-4 w-4 mr-1" />
                <span className={mmLeading}>{t("details.edit")}</span>
              </Button>
              <Button
                variant="destructive"
                size={"sm"}
                onClick={() => setIsDeleteModalOpen(true)}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                <span className={mmLeading}>
                  {isDeleting ? t("details.deleting") : t("details.delete")}
                </span>
              </Button>
            </div>
          </div>

          <main className="pt-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="lg:col-span-7 space-y-6">
                <h1
                  className={cn(
                    "text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white",
                    mmLeading,
                  )}
                >
                  {entry.category}
                </h1>

                <Card className="border-none shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden bg-white dark:bg-slate-900">
                  <CardHeader
                    className={cn(
                      "py-10 text-center",
                      isExpense
                        ? "bg-rose-50/50 dark:bg-rose-950/20"
                        : "bg-primary/15 dark:bg-primary/10",
                    )}
                  >
                    <span
                      className={cn(
                        "text-sm font-medium text-muted-foreground uppercase tracking-widest dark:text-slate-400",
                        mmLeading,
                      )}
                    >
                      {t("details.amount")}
                    </span>
                    <div className="mt-2 flex items-center justify-center gap-2">
                      {isExpense ? (
                        <Minus className="h-8 w-8 text-rose-600" />
                      ) : (
                        <Plus className="h-8 w-8 text-primary" />
                      )}
                      <span
                        className={cn(
                          "text-5xl md:text-6xl font-black tabular-nums",
                          isExpense ? "text-destructive" : "text-primary",
                        )}
                      >
                        {entry.value}
                        <span className="text-2xl ml-2 font-bold">
                          {t("details.currency")}
                        </span>
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      <DetailRow
                        icon={<Calendar className="h-4 w-4" />}
                        label={t("details.date")}
                        value={formatLocalizedDate(rawEntry.date)}
                        mmLeading={mmLeading}
                      />
                      <DetailRow
                        icon={<CloudSun className="h-4 w-4" />}
                        label={t("details.season")}
                        value={entry.season}
                        mmLeading={mmLeading}
                      />
                      <DetailRow
                        icon={<Tag className="h-4 w-4" />}
                        label={t("details.category")}
                        value={entry.category}
                        mmLeading={mmLeading}
                      />
                      {rawEntry.quantity && (
                        <DetailRow
                          icon={<Hash className="h-4 w-4" />}
                          label={t("details.quantity")}
                          value={`${entry.quantity} ${entry.unit}`}
                          mmLeading={mmLeading}
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>

                {entry.notes && (
                  <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 ring-1 ring-slate-200 dark:ring-slate-800">
                    <div className="mb-3 flex items-center gap-2 text-slate-500">
                      <FileText className="h-4 w-4" />
                      <span
                        className={cn(
                          "text-xs font-bold uppercase tracking-wider",
                          mmLeading,
                        )}
                      >
                        {t("details.notes")}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "text-primary font-semibold italic",
                        mmLeading,
                      )}
                    >
                      "{entry.notes}"
                    </p>
                  </div>
                )}
              </div>

              <div className="lg:col-span-5 space-y-6">
                <h3
                  className={cn(
                    "text-sm font-bold uppercase tracking-wider text-slate-500",
                    mmLeading,
                  )}
                >
                  {t("details.attachment")}
                </h3>
                {rawEntry.billImageUrl ? (
                  <Card className="overflow-hidden border-none ring-1 ring-slate-200 dark:ring-slate-800 shadow-md">
                    <div className="group relative cursor-zoom-in">
                      <img
                        src={rawEntry.billImageUrl}
                        alt="Receipt"
                        className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-4 flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        Original Receipt.jpg
                      </span>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <div className="flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400">
                    <ImageIcon className="mb-2 h-10 w-10 opacity-20" />
                    <p className={cn("text-xs italic", mmLeading)}>
                      {t("details.noReceipt")}
                    </p>
                  </div>
                )}

                <div className="mt-8 flex justify-between text-sm font-medium text-slate-500 dark:bg-slate-900/40 p-4 rounded-xl border dark:border-slate-800">
                  <span className={mmLeading}>{t("details.created")}</span>
                  <span className="tabular-nums text-right mm:text-xs mm:mt-1">
                    {formatLocalizedDate(rawEntry.createdAt, true)}
                  </span>
                </div>
              </div>
            </div>
          </main>
        </CardContent>
      </Card>
    </div>
  );
}

function DetailRow({ icon, label, value, mmLeading }: any) {
  return (
    <div className="flex items-center justify-between p-5 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
      <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
        <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-2">
          {icon}
        </div>
        <span className={cn("text-sm font-medium", mmLeading)}>{label}</span>
      </div>
      <span
        className={cn(
          "text-sm font-semibold text-slate-900 dark:text-slate-100 text-right",
          mmLeading,
        )}
      >
        {value}
      </span>
    </div>
  );
}

export default EntryDetailPage;
