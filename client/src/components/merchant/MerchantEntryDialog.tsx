import { useState, useMemo, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useTranslation } from "react-i18next"; // i18n Hook
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
  rawData?: any;
}

const MerchantEntryDialog = ({ rawData }: MerchantEntryDialogProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [addEntry, { isLoading }] = useAddEntryMutation();

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
      value: "",
      notes: "",
      billImage: null,
    },
  });

  // Single Source of Truth for Type
  const currentType = form.watch("type");
  const selectedCategory = form.watch("category");

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const availableUnits = useMemo(() => {
    if (!selectedCategory) return [];
    if (currentType === "expense") {
      return PURCHASE_OPTIONS[selectedCategory] || [];
    } else {
      const crop = cropsArray.find((c: any) => c.cropName === selectedCategory);
      return crop ? [crop.unit] : ["Unit"];
    }
  }, [selectedCategory, currentType, cropsArray]);

  const handleTypeToggle = (newType: "expense" | "income") => {
    if (newType === currentType) return;
    // Reset specific fields but preserve Date and Notes
    form.setValue("type", newType);
    form.setValue("category", "");
    form.setValue("unit", "");
    form.setValue("value", "");
    form.clearErrors();
  };

  const handleIncomeCropSelect = (cropName: string) => {
    const selectedCrop = cropsArray.find(
      (item: any) => item.cropName === cropName,
    );
    if (selectedCrop) {
      form.setValue("category", cropName);
      form.setValue("unit", selectedCrop.unit);
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
    if (fileInputRef.current) fileInputRef.current.value = "";
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
        if (val === null || val === undefined) return;
        if (key === "date") {
          formData.append(key, (val as Date).toISOString());
        } else if (key === "billImage" && val instanceof File) {
          formData.append(key, val);
        } else {
          formData.append(key, val.toString());
        }
      });

      await addEntry(formData).unwrap();
      toast.success(t("transaction.success"));
      handleClose();
    } catch (err) {
      toast.error(t("transaction.error"));
    }
  };

  return (
    <div className="flex justify-center">
      <Dialog
        open={open}
        onOpenChange={(val) => (!val ? handleClose() : setOpen(true))}
      >
        <DialogTrigger asChild>
          <Button className="shadow-lg bg-indigo-600 hover:bg-indigo-700 transition-all mm:leading-loose">
            <PlusCircle className="h-5 w-5" /> {t("transaction.new")}
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-[95vw] lg:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-slate-800 mm:leading-loose">
              <Store className="h-5 w-5 text-indigo-600" />
              {currentType === "expense"
                ? t("transaction.record_expense")
                : t("transaction.record_income")}
            </DialogTitle>
          </DialogHeader>

          {/* Toggle Switch */}
          <div className="flex w-full bg-slate-100 p-1 rounded-xl border border-slate-200 mt-4">
            <button
              type="button"
              onClick={() => handleTypeToggle("expense")}
              className={cn(
                "flex-1 py-2.5 rounded-lg transition-all duration-200 font-bold text-sm mm:leading-loose",
                currentType === "expense"
                  ? "bg-white text-red-500 shadow-sm"
                  : "text-slate-500",
              )}
            >
              {t("transaction.expense")}
            </button>
            <button
              type="button"
              onClick={() => handleTypeToggle("income")}
              className={cn(
                "flex-1 py-2.5 rounded-lg transition-all duration-200 font-bold text-sm",
                currentType === "income"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500",
              )}
            >
              {t("transaction.income")}
            </button>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 py-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-slate-600 font-semibold mm:leading-loose">
                        {t("transaction.date")}
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
                                : t("transaction.select_date")}
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
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-600 font-semibold mm:leading-loose">
                        {currentType === "expense"
                          ? t("transaction.category")
                          : t("transaction.crop_name")}
                      </FormLabel>
                      <Select
                        onValueChange={(val) =>
                          currentType === "expense"
                            ? field.onChange(val)
                            : handleIncomeCropSelect(val)
                        }
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full h-12 border-slate-200 capitalize mm:leading-loose">
                            <SelectValue
                              placeholder={
                                currentType === "expense"
                                  ? t("transaction.select_category")
                                  : t("transaction.select_crop")
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {currentType === "expense"
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
                                <SelectItem
                                  key={item._id || item.cropName}
                                  value={item.cropName}
                                >
                                  {item.cropName}
                                </SelectItem>
                              ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-600 font-semibold mm:leading-loose">
                        {t("transaction.quantity")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-600 font-semibold mm:leading-loose">
                        {t("transaction.unit")}
                      </FormLabel>
                      <Select
                        disabled={!selectedCategory}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full border-slate-200 mm:leading-loose">
                            <SelectValue placeholder={t("transaction.unit")} />
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

              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-600 font-semibold mm:leading-loose">
                      {t("transaction.amount")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="text-lg font-bold bg-indigo-50/30 border-indigo-100 mm:leading-loose"
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
                    <FormLabel className="text-slate-600 font-semibold mm:leading-loose">
                      {t("transaction.notes")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("transaction.notes_placeholder")}
                        className="resize-none h-20 mm:leading-loose"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="billImage"
                render={({ field: { onChange } }) => (
                  <FormItem>
                    <FormLabel className="text-slate-600 font-semibold mm:leading-loose">
                      {t("transaction.receipt")}
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, onChange)}
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
                                <X className="h-4 w-4 mr-2" />{" "}
                                {t("transaction.remove")}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50 hover:bg-slate-100 cursor-pointer"
                          >
                            <UploadCloud className="h-8 w-8 text-indigo-500 mb-2" />
                            <p className="text-sm font-bold text-slate-700">
                              {t("transaction.upload")}
                            </p>
                          </div>
                        )}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="submit"
                  className="w-full h-12"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    t("transaction.saving")
                  ) : (
                    <>
                      <Save className="h-5 w-5" /> {t("transaction.save")}
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
