import { useState, useMemo, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Store, Save, X, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { entrySchema, type EntryFormValues } from "@/schema/entry";
import { toast } from "sonner";
import { useUpdateEntryMutation } from "@/store/slices/entryApi";
import { type Entry } from "@/types/entry";

const PURCHASE_OPTIONS: Record<string, string[]> = {
  labor: ["Person", "Day", "Hour"],
  transport: ["Trip", "Km", "Tons"],
  store: ["Month", "Day", "Sqft"],
  other: ["None"],
};

const SALES_OPTIONS: Record<string, string[]> = {
  paddy: ["Bag", "Basket", "Kg", "Tons"],
  beans: ["Bag", "Viss", "Kg", "Basket"],
  other: ["Unit"],
};

interface EditEntryDialogProps {
  initialData: Entry;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const EditEntryDialog = ({
  initialData,
  open,
  setOpen,
}: EditEntryDialogProps) => {
  const [type, setType] = useState<"expense" | "income">(initialData.type);
  const [preview, setPreview] = useState<string | null>(
    initialData.billImageUrl || null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [updateEntry, { isLoading }] = useUpdateEntryMutation();

  const form = useForm<EntryFormValues>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      date: new Date(initialData.date),
      type: initialData.type,
      category: initialData.category,
      quantity: initialData.quantity?.toString() || "",
      unit: initialData.unit || "",
      value: initialData.value.toString(),
      notes: initialData.notes || "",
      billImage: null,
    },
  });

  // Re-sync form if initialData changes or dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        date: new Date(initialData.date),
        type: initialData.type,
        category: initialData.category,
        quantity: initialData.quantity?.toString() || "",
        unit: initialData.unit || "",
        value: initialData.value.toString(),
        notes: initialData.notes || "",
        billImage: null,
      });
      setType(initialData.type);
      setPreview(initialData.billImageUrl || null);
    }
  }, [open, initialData, form]);

  const selectedCategory = form.watch("category");

  const availableUnits = useMemo(() => {
    if (!selectedCategory) return [];
    const options = type === "expense" ? PURCHASE_OPTIONS : SALES_OPTIONS;
    return options[selectedCategory] || [];
  }, [selectedCategory, type]);

  const handleTriggerUpload = () => fileInputRef.current?.click();

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldOnChange: (file: File | null) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      fieldOnChange(file);
    }
  };

  const removeImage = (fieldOnChange: (file: null) => void) => {
    setPreview(null);
    fieldOnChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (data: EntryFormValues) => {
    try {
      const formData = new FormData();
      formData.append("date", data.date.toISOString());
      formData.append("type", type);
      formData.append("category", data.category);
      formData.append("quantity", data.quantity || "");
      formData.append("unit", data.unit || "");
      formData.append("value", data.value);
      formData.append("notes", data.notes || "");
      if (data.billImage) formData.append("billImage", data.billImage);

      await updateEntry({ id: initialData._id!, formData }).unwrap();
      toast.success("Entry updated successfully!");
      setOpen(false);
    } catch (err) {
      toast.error("Failed to update transaction.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[95vw] lg:max-w-[600px] h-[85vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-slate-800">
            <Store className="h-5 w-5 text-indigo-600" />
            Edit Transaction
          </DialogTitle>
        </DialogHeader>

        <div className="flex w-full bg-slate-100 p-1 rounded-xl border border-slate-200 mt-4">
          <div
            onClick={() => setType("expense")}
            className={cn(
              "flex-1 flex items-center justify-center py-2.5 rounded-lg cursor-pointer transition-all duration-200 font-bold text-sm",
              type === "expense"
                ? "bg-white text-red-500 shadow-sm"
                : "text-slate-500 hover:bg-slate-50",
            )}
          >
            Expense
          </div>
          <div
            onClick={() => setType("income")}
            className={cn(
              "flex-1 flex items-center justify-center py-2.5 rounded-lg cursor-pointer transition-all duration-200 font-bold text-sm",
              type === "income"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-500 hover:bg-slate-50",
            )}
          >
            Income
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 py-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-slate-600 font-semibold">
                      Transaction Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value
                              ? format(field.value, "PPP")
                              : "Select Date"}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-600 font-semibold">
                      Category
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="capitalize">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(
                          type === "expense" ? PURCHASE_OPTIONS : SALES_OPTIONS,
                        ).map((cat) => (
                          <SelectItem
                            key={cat}
                            value={cat}
                            className="capitalize"
                          >
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-600 font-semibold">
                        Quantity
                      </FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-600 font-semibold">
                      Unit
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableUnits.map((u) => (
                          <SelectItem key={u} value={u.toLowerCase()}>
                            {u}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-600 font-semibold">
                    Total Amount (MMK)
                  </FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-600 font-semibold">
                    Notes
                  </FormLabel>
                  <FormControl>
                    <Textarea className="resize-none h-20" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="billImage"
              render={({ field: { onChange, value: _, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel className="text-slate-600 font-semibold">
                    Invoice / Receipt
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, onChange)}
                        {...fieldProps}
                      />
                      {preview ? (
                        <div className="relative group w-full aspect-video rounded-2xl overflow-hidden border-2 bg-slate-50">
                          <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-contain"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeImage(onChange)}
                            >
                              <X className="h-4 w-4 mr-2" /> Remove
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={handleTriggerUpload}
                          className="flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 bg-slate-50 cursor-pointer"
                        >
                          <UploadCloud className="h-8 w-8 text-indigo-500 mb-2" />
                          <p className="text-sm font-bold">
                            Tap to upload receipt
                          </p>
                        </div>
                      )}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" /> Update Entry
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEntryDialog;
