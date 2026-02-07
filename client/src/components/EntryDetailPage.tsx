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
import { useState } from "react";
import { toast } from "sonner";
import EditEntryDialog from "./EditEntryDialog";
import ConfirmModal from "@/common/ConfirmModel";

function EntryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // States
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: entry, isLoading } = useGetEntryByIdQuery(id as string);
  const [deleteEntry, { isLoading: isDeleting }] = useDeleteEntryMutation();

  console.log(entry);

  const handleDelete = async () => {
    try {
      await deleteEntry(id as string).unwrap();
      toast.success("Entry deleted successfully");
      navigate(-1);
    } catch (err) {
      toast.error("Failed to delete entry");
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

  if (!entry)
    return (
      <div className="p-10 text-center dark:text-slate-400">
        Entry not found
      </div>
    );

  const isExpense = entry.type === "expense";

  return (
    <div className="w-full h-screen p-4 pb-12 animate-in slide-in-from-bottom-4 duration-500">
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Entry"
        description={`Are you sure you want to delete this ${entry.category} entry? This action cannot be undone.`}
        confirmText="Delete Entry"
      />

      {/* Top Navigation Bar */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold mb-6 dark:text-white">
            Entry Details
          </h2>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="dark:border-slate-800 dark:hover:bg-slate-900"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>
      </div>

      <Card className="shadow-xl">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge
                variant={isExpense ? "destructive" : "default"}
                className="rounded-full px-3 uppercase tracking-wider text-[10px]"
              >
                {entry.type}
              </Badge>
              <span className="text-xs font-mono text-muted-foreground flex items-center gap-1 dark:text-slate-500">
                #{entry._id!.slice(-6)}{" "}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* EDIT DIALOG TRIGGER */}
              <EditEntryDialog
                initialData={entry}
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
                Edit
              </Button>
              <Button
                variant="destructive"
                size={"sm"}
                onClick={() => setIsDeleteModalOpen(true)}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>

          <main className="pt-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="lg:col-span-7 space-y-6">
                <section className="space-y-1">
                  <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white capitalize">
                    {entry.category}
                  </h1>
                </section>

                <Card className="border-none shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden bg-white dark:bg-slate-900">
                  <CardHeader
                    className={`${
                      isExpense
                        ? "bg-rose-50/50 dark:bg-rose-950/20"
                        : "bg-primary/15 dark:bg-primary/10"
                    } py-10 text-center transition-colors`}
                  >
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest dark:text-slate-400">
                      Transaction Amount
                    </span>
                    <div className="mt-2 flex items-center justify-center gap-2">
                      {isExpense ? (
                        <Minus className="h-8 w-8 text-rose-600 dark:text-rose-500" />
                      ) : (
                        <Plus className="h-8 w-8 text-primary" />
                      )}
                      <span
                        className={`text-6xl font-black tabular-nums ${
                          isExpense ? "text-destructive" : "text-primary"
                        }`}
                      >
                        {entry.value.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                        <span className="text-2xl ml-2">MMK</span>
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      <DetailRow
                        icon={<Calendar className="h-4 w-4" />}
                        label="Date"
                        value={new Date(entry.date).toLocaleDateString(
                          "en-US",
                          {
                            dateStyle: "full",
                          },
                        )}
                      />
                      <DetailRow
                        icon={<CloudSun className="h-4 w-4" />}
                        label="Season"
                        value={entry.season || "N/A"}
                        capitalize
                      />
                      <DetailRow
                        icon={<Tag className="h-4 w-4" />}
                        label="Category"
                        value={entry.category}
                        capitalize
                      />
                      {entry.quantity && (
                        <DetailRow
                          icon={<Hash className="h-4 w-4" />}
                          label="Quantity"
                          value={`${entry.quantity} ${entry.unit || ""}`}
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>

                {entry.notes && (
                  <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm">
                    <div className="mb-3 flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <FileText className="h-4 w-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Notes
                      </span>
                    </div>
                    <p className="text-primary font-semibold leading-relaxed italic">
                      "{entry.notes}"
                    </p>
                  </div>
                )}
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div>
                  <h3 className="mt-6 mb-4 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Attachment
                  </h3>
                  {entry.billImageUrl ? (
                    <Card className="overflow-hidden border-none ring-1 ring-slate-200 dark:ring-slate-800 shadow-md transition-all hover:shadow-xl dark:bg-slate-900">
                      <div className="group relative cursor-zoom-in">
                        <img
                          src={entry.billImageUrl}
                          alt="Receipt"
                          className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/5 dark:bg-black/20 opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-4 flex justify-between items-center">
                        <span className="text-xs text-muted-foreground dark:text-slate-400">
                          Original Receipt.jpg
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 dark:hover:bg-slate-800"
                        >
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ) : (
                    <div className="flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-400">
                      <ImageIcon className="mb-2 h-10 w-10 opacity-20" />
                      <p className="text-xs italic">No receipt attached</p>
                    </div>
                  )}

                  <div className="mt-8 flex flex-col gap-2 rounded-xl border dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4">
                    <div className="flex justify-between text-sm font-medium text-slate-500 dark:text-slate-400">
                      <span>CREATED</span>
                      <span>{new Date(entry.createdAt!).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </CardContent>
      </Card>
    </div>
  );
}

// ... DetailRow remains the same ...

function DetailRow({
  icon,
  label,
  value,
  capitalize = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  capitalize?: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-5 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
      <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
        <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-2">
          {icon}
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span
        className={`text-sm font-semibold text-slate-900 dark:text-slate-100 ${
          capitalize ? "capitalize" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export default EntryDetailPage;
