import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useGetEntryByIdQuery } from "@/store/slices/farmerApi";
import {
  Calendar,
  ChevronLeft,
  Copy,
  FileText,
  Hash,
  ImageIcon,
  Loader2,
  Minus,
  Pencil,
  Plus,
  Tag,
  Trash2,
} from "lucide-react";
import { useParams, useNavigate } from "react-router";

function EntryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: entry, isLoading } = useGetEntryByIdQuery(id as string);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!entry) return <div className="p-10 text-center">Entry not found</div>;

  const isExpense = entry.type === "expense";

  return (
    <div className="bg-secondary w-full h-screen overflow-y-scroll p-4 pb-12 animate-in slide-in-from-bottom-4 duration-500">
      {/* Top Navigation Bar */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold mb-6">Entry Details</h2>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ChevronLeft />
            Back
          </Button>
        </div>
      </div>
      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge
                variant={isExpense ? "destructive" : "default"}
                className="rounded-full px-3 uppercase tracking-wider text-[10px]"
              >
                {entry.type}
              </Badge>
              <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                #{entry._id!.slice(-6)}{" "}
                <Copy className="h-3 w-3 cursor-pointer hover:text-primary" />
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size={"sm"}>
                <Pencil />
                Edit
              </Button>
              <Button variant="destructive" size={"sm"}>
                <Trash2 />
                Delete
              </Button>
            </div>
          </div>

          <main className="pt-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Left Column: Primary Details */}
              <div className="lg:col-span-7 space-y-6">
                <section className="space-y-1">
                  <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 capitalize">
                    {entry.category}
                  </h1>
                </section>

                <Card className="border-none shadow-sm ring-1 ring-slate-200">
                  <CardHeader
                    className={`${
                      isExpense ? "bg-rose-50/50" : "bg-primary/15"
                    } py-10 text-center transition-colors`}
                  >
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                      Transaction Amount
                    </span>
                    <div className="mt-2 flex items-center justify-center gap-2">
                      {isExpense ? (
                        <Minus className="h-8 w-8 text-rose-600" />
                      ) : (
                        <Plus className="h-8 w-8 text-primary" />
                      )}
                      <span
                        className={`text-6xl font-black tabular-nums ${
                          isExpense ? "text-slate-900" : "text-primary"
                        }`}
                      >
                        {entry.value.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                        MMK
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                      <DetailRow
                        icon={<Calendar className="h-4 w-4" />}
                        label="Date"
                        value={new Date(entry.date).toLocaleDateString(
                          "en-US",
                          {
                            dateStyle: "full",
                          }
                        )}
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

                {/* Notes Section */}
                {entry.notes && (
                  <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200 shadow-sm">
                    <div className="mb-3 flex items-center gap-2 text-slate-500">
                      <FileText className="h-4 w-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Notes
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed italic">
                      "{entry.notes}"
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column: Attachment & Metadata */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <h3 className="mt-6 mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">
                    Attachment
                  </h3>
                  {entry.billImageUrl ? (
                    <Card className="overflow-hidden border-none ring-1 ring-slate-200 shadow-md transition-all hover:shadow-xl">
                      <div className="group relative cursor-zoom-in">
                        <img
                          src={entry.billImageUrl}
                          alt="Receipt"
                          className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                      <div className="bg-white p-4 flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          Original Receipt.jpg
                        </span>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ) : (
                    <div className="flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 text-slate-400">
                      <ImageIcon className="mb-2 h-10 w-10 opacity-20" />
                      <p className="text-xs italic">No receipt attached</p>
                    </div>
                  )}

                  <div className="mt-8 flex flex-col gap-2 rounded-xl border bg-slate-50/50 p-4">
                    <div className="flex justify-between text-sm font-medium text-slate-500">
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

// Helper Component for the Detail Rows
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
    <div className="flex items-center justify-between p-5 transition-colors hover:bg-slate-50/50">
      <div className="flex items-center gap-3 text-slate-500">
        <div className="rounded-full bg-slate-100 p-2">{icon}</div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span
        className={`text-sm font-semibold text-slate-900 ${
          capitalize ? "capitalize" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export default EntryDetailPage;
