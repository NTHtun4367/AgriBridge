import { useState, useMemo, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  CalendarIcon,
  PlusCircle,
  Landmark,
  Save,
  X,
  UploadCloud,
} from "lucide-react";
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
  DialogTrigger,
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
import { useAddEntryMutation } from "@/store/slices/farmerApi";
import { toast } from "sonner";

const UNIT_OPTIONS: Record<string, string[]> = {
  seeds: ["Bag", "Packet", "Kg", "Grams", "Viss"],
  fertilizer: ["Bag", "Kg", "Liter", "Packet"],
  pesticide: ["Liter", "ml", "Bottle", "Kg"],
  labor: ["Day", "Hour", "Person", "Flat Rate"],
  machinery: ["Hour", "Acre", "Trip", "Liter"],
  transport: ["Trip", "Km", "Tons"],
  other: ["none"],
};

const CROP_OPTIONS: Record<string, string[]> = {
  crops: ["Bag", "Packet", "Kg", "Grams", "Viss"],
  beans: ["Bag", "Packet", "Kg", "Grams", "Viss"],
  other: ["none"],
};

const AddEntryDialog = () => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"expense" | "income">("expense");
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [addEntry, { isLoading }] = useAddEntryMutation();

  const form = useForm<EntryFormValues>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      date: new Date(),
      type: "expense",
      category: "",
      quantity: "",
      unit: "",
      value: "",
      notes: "",
      billImage: null,
    },
  });

  const selectedCategory = form.watch("category");

  const availableUnits = useMemo(() => {
    if (!selectedCategory) return [];
    const options = type === "expense" ? UNIT_OPTIONS : CROP_OPTIONS;
    return options[selectedCategory] || [];
  }, [selectedCategory, type]);

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldOnChange: (file: File | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (preview) URL.revokeObjectURL(preview);
      const url = URL.createObjectURL(file);
      setPreview(url);
      fieldOnChange(file);
    }
  };

  const removeImage = (fieldOnChange: (file: null) => void) => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    fieldOnChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    setOpen(false);
    // Reset form and cleanup preview
    setTimeout(() => {
      form.reset();
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
    }, 300);
  };

  const onSubmit = async (data: EntryFormValues) => {
    try {
      const formData = new FormData();
      formData.append("date", data.date.toISOString());
      formData.append("type", type); // Taking type from local state toggle
      formData.append("category", data.category);
      formData.append("quantity", data.quantity || "");
      formData.append("unit", data.unit || "");
      formData.append("value", data.value);
      formData.append("notes", data.notes || "");
      if (data.billImage) formData.append("billImage", data.billImage);

      await addEntry(formData).unwrap();
      toast.success("Entry added successfully!");
      handleClose();
    } catch (err) {
      console.error("Failed to save:", err);
      toast.error("Error saving record.");
    }
  };

  useEffect(() => {
    form.setValue("category", "");
    form.setValue("unit", "");
  }, [type, form]);

  return (
    <div className="flex justify-center">
      <Dialog
        open={open}
        onOpenChange={(val) => (!val ? handleClose() : setOpen(true))}
      >
        <DialogTrigger asChild>
          <Button className="shadow-lg bg-primary hover:bg-primary/90 transition-all">
            <PlusCircle className="h-5 w-5 mr-2" /> Add New Entry
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-[95vw] lg:max-w-[600px] h-[90vh] overflow-y-auto rounded-3xl">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-slate-800">
              <Landmark className="h-5 w-5 text-primary" />
              {type === "expense" ? "Record Expenditure" : "Record Income"}
            </DialogTitle>
          </DialogHeader>

          {/* Type Toggle Segment */}
          <div className="flex w-full bg-slate-100 p-1 rounded-xl border border-slate-200 mt-4">
            <div
              onClick={() => setType("expense")}
              className={cn(
                "flex-1 flex items-center justify-center py-2.5 rounded-lg cursor-pointer transition-all duration-200 font-bold text-sm",
                type === "expense"
                  ? "bg-white text-red-500 shadow-sm"
                  : "text-slate-500 hover:bg-slate-50"
              )}
            >
              Expense
            </div>
            <div
              onClick={() => setType("income")}
              className={cn(
                "flex-1 flex items-center justify-center py-2.5 rounded-lg cursor-pointer transition-all duration-200 font-bold text-sm",
                type === "income"
                  ? "bg-white text-primary shadow-sm"
                  : "text-slate-500 hover:bg-slate-50"
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
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-slate-600 font-semibold">
                        Date
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "pl-3 text-left font-normal border-slate-200",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? format(field.value, "PPP")
                                : "Pick a date"}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0 rounded-2xl shadow-xl"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date()}
                            initialFocus
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
                      <Select
                        onValueChange={(val) => {
                          field.onChange(val);
                          form.setValue("unit", "");
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full border-slate-200 capitalize">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.keys(
                            type === "expense" ? UNIT_OPTIONS : CROP_OPTIONS
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
                          <Input
                            type="number"
                            placeholder="0.00"
                            {...field}
                          />
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
                      <Select
                        disabled={!selectedCategory}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full border-slate-200">
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
                      <FormMessage />
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
                      Total Value (MMK)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                      />
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
                      Additional Notes
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g. Purchased from Aung Market..."
                        className="resize-none h-24"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="billImage"
                // Destructure 'ref' here to prevent it from being passed into fieldProps
                render={({
                  field: { onChange, value: _, ref: fieldRef, ...fieldProps },
                }) => (
                  <FormItem>
                    <FormLabel className="text-slate-600 font-semibold">
                      Bill Photo / Receipt
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <input
                          type="file"
                          // Now you can safely use your custom ref
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, onChange)}
                          {...fieldProps}
                        />

                        {preview ? (
                          <div className="relative group w-full aspect-video rounded-2xl overflow-hidden border-2 border-slate-100 bg-slate-50 shadow-inner">
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
                                className="rounded-full gap-2"
                                onClick={() => removeImage(onChange)}
                              >
                                <X className="h-4 w-4" /> Remove Photo
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={handleTriggerUpload}
                            className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-8 bg-slate-50 hover:bg-slate-100 hover:border-primary/50 transition-all cursor-pointer group"
                          >
                            <div className="bg-white p-4 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                              <UploadCloud className="h-8 w-8 text-primary" />
                            </div>
                            <p className="text-sm font-bold text-slate-700">
                              Click to upload bill
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              PNG, JPG up to 5MB
                            </p>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4">
                <Button
                  type="submit"
                  className="w-full font-bold shadow-lg shadow-primary/20"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Processing..."
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" /> Save Entry
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddEntryDialog;
