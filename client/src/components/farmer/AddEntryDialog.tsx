import { useState, useMemo, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useNavigate } from "react-router";
import {
  CalendarIcon,
  PlusCircle,
  Landmark,
  Save,
  X,
  UploadCloud,
  Info,
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
import {
  useGetActiveSeasonQuery,
  useGetCropsQuery,
} from "@/store/slices/farmerApi";

const UNIT_OPTIONS: Record<string, string[]> = {
  seeds: ["Bag", "Packet", "Kg", "Grams", "Viss"],
  fertilizer: ["Bag", "Kg", "Liter", "Packet"],
  pesticide: ["Liter", "ml", "Bottle", "Kg"],
  labor: ["Day", "Hour", "Person", "Flat Rate"],
  machinery: ["Hour", "Acre", "Trip", "Liter"],
  transport: ["Trip", "Km", "Tons"],
  other: ["none"],
};

const CROP_UNIT_DEFAULTS = ["Bag", "Packet", "Kg", "Grams", "Viss"];

const AddEntryDialog = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"expense" | "income">("expense");
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // API Hooks
  const { data: activeSeason, isLoading: isSeasonLoading } =
    useGetActiveSeasonQuery();
  const { data: crops } = useGetCropsQuery(activeSeason?._id, {
    skip: !activeSeason?._id,
  });
  const [addEntry, { isLoading }] = useAddEntryMutation();

  const form = useForm<EntryFormValues>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      date: new Date(),
      type: "expense",
      category: "",
      season: "",
      cropId: "",
      quantity: "",
      unit: "",
      value: "",
      notes: "",
      billImage: null,
    },
  });

  const selectedCategory = form.watch("category");

  const availableCategories = useMemo(() => {
    if (type === "expense") {
      return Object.keys(UNIT_OPTIONS);
    } else {
      return crops?.map((c: any) => c.cropName) || ["other"];
    }
  }, [type, crops]);

  const availableUnits = useMemo(() => {
    if (!selectedCategory) return [];
    if (type === "expense") {
      return UNIT_OPTIONS[selectedCategory] || [];
    } else {
      return CROP_UNIT_DEFAULTS;
    }
  }, [selectedCategory, type]);

  useEffect(() => {
    if (activeSeason) {
      form.setValue("season", activeSeason.name);
    }
  }, [activeSeason, form, open]);

  useEffect(() => {
    if (type === "income" && crops) {
      const matchedCrop = crops.find(
        (c: any) => c.cropName === selectedCategory,
      );
      if (matchedCrop) {
        form.setValue("cropId", matchedCrop._id);
      }
    } else if (type === "expense" && selectedCategory !== "seeds") {
      form.setValue("cropId", "");
    }
  }, [selectedCategory, type, crops, form]);

  const handleOpenAttempt = (isOpen: boolean) => {
    if (isOpen) {
      if (!isSeasonLoading && !activeSeason) {
        toast.error("Please start an agricultural season first.");
        navigate("/farmer/agri-manager");
        return;
      }
      setOpen(true);
    } else {
      handleClose();
    }
  };

  const handleTriggerUpload = () => fileInputRef.current?.click();

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldOnChange: any,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (preview) URL.revokeObjectURL(preview);
      setPreview(URL.createObjectURL(file));
      fieldOnChange(file);
    }
  };

  const removeImage = (fieldOnChange: any) => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    fieldOnChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      form.reset({
        date: new Date(),
        season: activeSeason?.name || "",
        type: type,
        category: "",
        cropId: "",
        unit: "",
        quantity: "",
        value: "",
        notes: "",
      });
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
    }, 300);
  };

  const onSubmit = async (data: EntryFormValues) => {
    try {
      const formData = new FormData();
      formData.append("date", data.date.toISOString());
      formData.append("type", type);
      formData.append("season", activeSeason.name);
      formData.append("value", data.value);
      formData.append("notes", data.notes || "");
      formData.append("quantity", data.quantity || "");
      formData.append("unit", data.unit || "");
      if (data.billImage) formData.append("billImage", data.billImage);

      // --- Logic for Category Selection ---
      if (type === "expense" && data.category === "seeds" && data.cropId) {
        // Find the crop name from the crops list using the selected cropId
        const selectedCrop = crops?.find((c: any) => c._id === data.cropId);
        formData.append(
          "category",
          selectedCrop ? selectedCrop.cropName : "seeds",
        );
        formData.append("cropId", data.cropId);
      } else {
        // Default behavior for other expenses or income
        formData.append("category", data.category);
        if (data.cropId) formData.append("cropId", data.cropId);
      }

      await addEntry(formData).unwrap();
      toast.success("Record saved successfully!");
      handleClose();
    } catch (err) {
      toast.error("Failed to save record.");
    }
  };

  return (
    <div className="flex justify-center">
      <Dialog open={open} onOpenChange={handleOpenAttempt}>
        <DialogTrigger asChild>
          <Button className="shadow-lg bg-primary hover:bg-primary/90 transition-all font-bold">
            <PlusCircle className="h-5 w-5" /> Add New Entry
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-[95vw] lg:max-w-[600px] h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-slate-800">
              <Landmark className="h-5 w-5 text-primary" />
              {type === "expense" ? "Record Investment" : "Record Income"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex w-full bg-slate-100 p-1 rounded-xl border border-slate-200 mt-4">
            <div
              onClick={() => {
                setType("expense");
                form.setValue("category", "");
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
              }}
              className={cn(
                "flex-1 flex items-center justify-center py-2.5 rounded-lg cursor-pointer transition-all duration-200 font-bold text-sm",
                type === "income"
                  ? "bg-white text-primary shadow-sm"
                  : "text-slate-500 hover:bg-slate-50",
              )}
            >
              Income
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 py-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
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

                <div className="flex flex-col gap-2">
                  <span className="text-sm text-slate-600 font-semibold">
                    Active Season
                  </span>
                  <div className="flex items-center px-4 bg-primary/5 border border-primary/10 text-primary font-bold overflow-hidden text-ellipsis whitespace-nowrap py-1.5 rounded-md">
                    <Info className="h-4 w-4 mr-2 shrink-0" />
                    {activeSeason?.name || "No active season"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full items-start">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-slate-600 font-semibold">
                        {type === "income" ? "Select Crop" : "Category"}
                      </FormLabel>
                      <Select
                        onValueChange={(val) => {
                          field.onChange(val);
                          form.setValue("unit", "");
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full h-12 border-slate-200 capitalize">
                            <SelectValue
                              placeholder={
                                type === "income"
                                  ? "Select Crop Sold"
                                  : "Select Category"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableCategories.map((cat) => (
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

                {type === "expense" && selectedCategory === "seeds" && (
                  <FormField
                    control={form.control}
                    name="cropId"
                    render={({ field }) => (
                      <FormItem className="w-full animate-in fade-in slide-in-from-left-2 duration-300">
                        <FormLabel className="text-primary font-bold flex items-center gap-1">
                          Linked Crop (Seeds)
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full h-12 border-primary/30 bg-primary/5">
                              <SelectValue placeholder="Which crop?" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {crops?.map((crop: any) => (
                              <SelectItem key={crop._id} value={crop._id}>
                                <div className="flex items-center gap-2">
                                  {crop.cropName}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
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
                          <Input type="number" placeholder="0.00" {...field} />
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
                      Total {type === "income" ? "Sale Price" : "Value"} (MMK)
                    </FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
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
                        placeholder={
                          type === "income"
                            ? "e.g. Sold to wholesale buyer..."
                            : "e.g. Purchased from Aung Market..."
                        }
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
