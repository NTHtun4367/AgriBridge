import { useState, useMemo, useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  CalendarIcon,
  PlusCircle,
  Store,
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
import { toast } from "sonner";
import { useAddEntryMutation } from "@/store/slices/entryApi";

const PURCHASE_OPTIONS: Record<string, string[]> = {
  labor: ["Person", "Day", "Hour"],
  transport: ["Trip", "Km", "Tons"],
  store: ["Month", "Day", "Sqft"],
  other: ["None"],
};

interface MerchantEntryDialogProps {
  rawData?: any; // Kept as any to handle potential object wrappers from API
}

const MerchantEntryDialog = ({ rawData }: MerchantEntryDialogProps) => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"expense" | "income">("expense");
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [addEntry, { isLoading }] = useAddEntryMutation();

  // Ensure rawData is an array for mapping, even if an object is passed
  const cropsArray = Array.isArray(rawData)
    ? rawData
    : rawData?.data || rawData?.prices || [];

  const form = useForm<EntryFormValues>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      date: new Date(),
      type: "expense",
      category: "",
      quantity: "",
      unit: "",
      price: "",
      value: "",
      notes: "",
      billImage: null,
    },
  });

  const selectedCategory = useWatch({
    control: form.control,
    name: "category",
  });
  const qty = useWatch({ control: form.control, name: "quantity" });
  const unitPrice = useWatch({ control: form.control, name: "price" });

  useEffect(() => {
    if (type === "income" && qty && unitPrice) {
      const total = parseFloat(qty) * parseFloat(unitPrice);
      form.setValue("value", total.toString());
    }
  }, [qty, unitPrice, type, form]);

  const availableUnits = useMemo(() => {
    if (!selectedCategory) return [];
    if (type === "expense") {
      return PURCHASE_OPTIONS[selectedCategory] || [];
    } else {
      const crop = cropsArray.find((c: any) => c.cropName === selectedCategory);
      return crop ? [crop.unit] : ["Unit"];
    }
  }, [selectedCategory, type, cropsArray]);

  const handleIncomeCropSelect = (cropName: string) => {
    const selectedCrop = cropsArray.find(
      (item: any) => item.cropName === cropName,
    );
    if (selectedCrop) {
      form.setValue("category", cropName);
      form.setValue("unit", selectedCrop.unit);
      form.setValue("price", selectedCrop.buyingPrice?.toString() || "");
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldOnChange: (file: File | null) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (preview) URL.revokeObjectURL(preview);
      setPreview(URL.createObjectURL(file));
      fieldOnChange(file);
    }
  };

  const removeImage = (fieldOnChange: (file: null) => void) => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    fieldOnChange(null);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      form.reset();
      setPreview(null);
    }, 300);
  };

  const onSubmit = async (data: EntryFormValues) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, val]) => {
        if (key === "date") formData.append(key, (val as Date).toISOString());
        else if (key === "billImage" && val instanceof File)
          formData.append(key, val);
        else if (val) formData.append(key, val.toString());
      });
      formData.set("type", type);

      await addEntry(formData).unwrap();
      toast.success("Transaction saved!");
      handleClose();
    } catch (err) {
      toast.error("Failed to save transaction.");
    }
  };

  return (
    <div className="flex justify-center">
      <Dialog
        open={open}
        onOpenChange={(val) => (!val ? handleClose() : setOpen(true))}
      >
        <DialogTrigger asChild>
          <Button className="shadow-lg bg-indigo-600 hover:bg-indigo-700 transition-all">
            <PlusCircle className="h-5 w-5 mr-2" /> New Transaction
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-[95vw] lg:max-w-[600px] h-[85vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-slate-800">
              <Store className="h-5 w-5 text-indigo-600" />
              {type === "expense"
                ? "Record Purchase/Expense"
                : "Record Sales/Income"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex w-full bg-slate-100 p-1 rounded-xl border border-slate-200 mt-4">
            <div
              onClick={() => {
                setType("expense");
                form.setValue("category", "");
                form.setValue("unit", "");
              }}
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
              onClick={() => {
                setType("income");
                form.setValue("category", "");
                form.setValue("unit", "");
              }}
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
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-600 font-semibold">
                      {type === "expense" ? "Expense Category" : "Crop Name"}
                    </FormLabel>
                    <Select
                      onValueChange={(val) =>
                        type === "expense"
                          ? field.onChange(val)
                          : handleIncomeCropSelect(val)
                      }
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full h-12 border-slate-200 capitalize">
                          <SelectValue
                            placeholder={
                              type === "expense"
                                ? "Select Category"
                                : "Select Crop"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {type === "expense"
                          ? Object.keys(PURCHASE_OPTIONS).map((cat) => (
                              <SelectItem
                                key={cat}
                                value={cat}
                                className="capitalize"
                              >
                                {cat}
                              </SelectItem>
                            ))
                          : cropsArray.map((item: any) => (
                              <SelectItem key={item._id} value={item.cropName}>
                                {item.cropName}
                              </SelectItem>
                            ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                          <Input type="number" placeholder="0.00" {...field} />
                        </FormControl>
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
                          <SelectTrigger className="h-11 border-slate-200">
                            <SelectValue placeholder="Unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableUnits.map((u: string) => (
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

              {type === "income" && (
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-600 font-semibold">
                        Unit Price (Buying Price)
                      </FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-600 font-semibold">
                      Total Amount (MMK)
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="text-lg font-bold bg-indigo-50/30 border-indigo-100"
                        type="number"
                        placeholder="0"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-600 font-semibold">
                      Description / Notes
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Customer name, voucher number, etc..."
                        className="resize-none h-20"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="billImage"
                render={({
                  field: { onChange, ref: _formRef, ...fieldProps },
                }) => (
                  <FormItem>
                    <FormLabel className="text-slate-600 font-semibold">
                      Upload Invoice / Receipt
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
                          <div className="relative group w-full aspect-video rounded-2xl overflow-hidden border-2 border-slate-100 bg-slate-50">
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
                            onClick={() => fileInputRef.current?.click()}
                            className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50 hover:bg-slate-100 cursor-pointer group"
                          >
                            <UploadCloud className="h-8 w-8 text-indigo-500 mb-2" />
                            <p className="text-sm font-bold text-slate-700">
                              Tap to upload receipt
                            </p>
                          </div>
                        )}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-2">
                <Button
                  type="submit"
                  className="w-full h-12"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Saving..."
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

export default MerchantEntryDialog;
