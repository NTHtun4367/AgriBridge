import { useState, useMemo, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
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

import { type RootState } from "@/store";
import { localizeData } from "@/utils/translator";
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

const AddEntryDialog = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"expense" | "income">("expense");
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { lang } = useSelector((state: RootState) => state.settings);

  // Localized Unit Options Logic
  const UNIT_OPTIONS: Record<string, string[]> = useMemo(
    () => ({
      seeds: [
        t("units.bag"),
        t("units.packet"),
        t("units.kg"),
        t("units.grams"),
        t("units.viss"),
      ],
      fertilizer: [
        t("units.bag"),
        t("units.kg"),
        t("units.liter"),
        t("units.packet"),
      ],
      pesticide: [
        t("units.liter"),
        t("units.ml"),
        t("units.bottle"),
        t("units.kg"),
      ],
      labor: [
        t("units.day"),
        t("units.hour"),
        t("units.person"),
        t("units.flat_rate"),
      ],
      machinery: [
        t("units.hour"),
        t("units.acre"),
        t("units.trip"),
        t("units.liter"),
      ],
      transport: [t("units.trip"), t("units.km"), t("units.tons")],
      other: [t("units.none")],
    }),
    [t],
  );

  const CROP_UNIT_DEFAULTS = useMemo(
    () => [
      t("units.bag"),
      t("units.packet"),
      t("units.kg"),
      t("units.grams"),
      t("units.viss"),
    ],
    [t],
  );

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
  }, [type, crops, UNIT_OPTIONS]);

  const availableUnits = useMemo(() => {
    if (!selectedCategory) return [];
    return type === "expense"
      ? UNIT_OPTIONS[selectedCategory] || []
      : CROP_UNIT_DEFAULTS;
  }, [selectedCategory, type, UNIT_OPTIONS, CROP_UNIT_DEFAULTS]);

  useEffect(() => {
    if (activeSeason) form.setValue("season", activeSeason.name);
  }, [activeSeason, form, open]);

  useEffect(() => {
    if (type === "income" && crops) {
      const matchedCrop = crops.find(
        (c: any) => c.cropName === selectedCategory,
      );
      if (matchedCrop) form.setValue("cropId", matchedCrop._id);
    } else if (type === "expense" && selectedCategory !== "seeds") {
      form.setValue("cropId", "");
    }
  }, [selectedCategory, type, crops, form]);

  const handleOpenAttempt = (isOpen: boolean) => {
    if (isOpen) {
      if (!isSeasonLoading && !activeSeason) {
        toast.error(t("entry.toast.season_required"));
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
      formData.append("season", activeSeason?.name || "");
      formData.append("value", data.value);
      formData.append("notes", data.notes || "");
      formData.append("quantity", data.quantity || "");
      formData.append("unit", data.unit || "");
      if (data.billImage) formData.append("billImage", data.billImage);

      if (type === "expense" && data.category === "seeds" && data.cropId) {
        const selectedCrop = crops?.find((c: any) => c._id === data.cropId);
        formData.append(
          "category",
          selectedCrop ? selectedCrop.cropName : "seeds",
        );
        formData.append("cropId", data.cropId);
      } else {
        formData.append("category", data.category);
        if (data.cropId) formData.append("cropId", data.cropId);
      }

      await addEntry(formData).unwrap();
      toast.success(t("entry.toast.success"));
      handleClose();
    } catch (err) {
      toast.error(t("entry.toast.error"));
    }
  };

  return (
    <div className="flex justify-center">
      <Dialog open={open} onOpenChange={handleOpenAttempt}>
        <DialogTrigger asChild>
          <Button className="shadow-lg bg-primary hover:bg-primary/90 transition-all font-bold mm:leading-loose">
            <PlusCircle className="h-5 w-5" /> {t("entry.add_btn")}
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-[95vw] lg:max-w-[600px] h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-slate-800 mm:leading-loose">
              <Landmark className="h-5 w-5 text-primary" />
              {type === "expense"
                ? t("entry.title_expense")
                : t("entry.title_income")}
            </DialogTitle>
          </DialogHeader>

          <div className="flex w-full bg-slate-100 p-1 rounded-xl border border-slate-200 mt-4">
            <div
              onClick={() => {
                setType("expense");
                form.setValue("category", "");
              }}
              className={cn(
                "flex-1 flex items-center justify-center py-2.5 rounded-lg cursor-pointer transition-all duration-200 font-bold text-sm mm:leading-loose",
                type === "expense"
                  ? "bg-white text-red-500 shadow-sm"
                  : "text-slate-500 hover:bg-slate-50",
              )}
            >
              {t("entry.type_expense")}
            </div>
            <div
              onClick={() => {
                setType("income");
                form.setValue("category", "");
              }}
              className={cn(
                "flex-1 flex items-center justify-center py-2.5 rounded-lg cursor-pointer transition-all duration-200 font-bold text-sm mm:leading-loose",
                type === "income"
                  ? "bg-white text-primary shadow-sm"
                  : "text-slate-500 hover:bg-slate-50",
              )}
            >
              {t("entry.type_income")}
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
                      <FormLabel className="text-slate-600 font-semibold mm:leading-loose">
                        {t("entry.date")}
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "pl-3 text-left font-normal border-slate-200 mm:h-11 mm:leading-loose",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value
                                ? lang === "mm"
                                  ? localizeData(
                                      format(field.value, "PPP"),
                                      "mm",
                                    )
                                  : format(field.value, "PPP")
                                : t("entry.date_placeholder")}
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
                  <span className="text-sm text-slate-600 font-semibold mm:leading-loose">
                    {t("entry.active_season")}
                  </span>
                  <div className="flex items-center px-4 bg-primary/5 border border-primary/10 text-primary font-bold overflow-hidden text-ellipsis whitespace-nowrap py-1.5 rounded-md mm:leading-loose">
                    <Info className="h-4 w-4 mr-2 shrink-0" />
                    {activeSeason?.name
                      ? lang === "mm"
                        ? localizeData(activeSeason.name, "mm")
                        : activeSeason.name
                      : t("entry.no_season")}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full items-start">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-slate-600 font-semibold mm:leading-loose">
                        {type === "income"
                          ? t("entry.crop_label")
                          : t("entry.category_label")}
                      </FormLabel>
                      <Select
                        onValueChange={(val) => {
                          field.onChange(val);
                          form.setValue("unit", "");
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full h-12 border-slate-200 capitalize mm:leading-loose">
                            <SelectValue
                              placeholder={
                                type === "income"
                                  ? t("entry.crop_sold_placeholder")
                                  : t("entry.category_placeholder")
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableCategories.map((cat) => (
                            <SelectItem
                              key={cat}
                              value={cat}
                              className="capitalize mm:leading-loose"
                            >
                              {String(
                                t(`categories.${cat}`, { defaultValue: cat }),
                              )}
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
                        <FormLabel className="text-primary font-bold flex items-center gap-1 mm:leading-loose">
                          {t("entry.linked_crop")}
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full h-12 border-primary/30 bg-primary/5 mm:leading-loose">
                              <SelectValue
                                placeholder={t("entry.which_crop")}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {crops?.map((crop: any) => (
                              <SelectItem
                                key={crop._id}
                                value={crop._id}
                                className="mm:leading-loose"
                              >
                                {crop.cropName}
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
                        <FormLabel className="text-slate-600 font-semibold mm:leading-loose">
                          {t("entry.quantity")}
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
                      <FormLabel className="text-slate-600 font-semibold mm:leading-loose">
                        {t("entry.unit")}
                      </FormLabel>
                      <Select
                        disabled={!selectedCategory}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full border-slate-200 mm:leading-loose">
                            <SelectValue
                              placeholder={t("entry.unit_placeholder")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableUnits.map((u) => (
                            <SelectItem
                              key={u}
                              value={u}
                              className="mm:leading-loose"
                            >
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
                    <FormLabel className="text-slate-600 font-semibold mm:leading-loose">
                      {type === "income"
                        ? t("entry.value_income")
                        : t("entry.value_expense")}
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
                    <FormLabel className="text-slate-600 font-semibold mm:leading-loose">
                      {t("entry.notes")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={
                          type === "income"
                            ? t("entry.notes_placeholder_income")
                            : t("entry.notes_placeholder_expense")
                        }
                        className="resize-none h-24 mm:leading-loose"
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
                    <FormLabel className="text-slate-600 font-semibold mm:leading-loose">
                      {t("entry.bill_photo")}
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
                                className="rounded-full gap-2 mm:leading-loose"
                                onClick={() => removeImage(onChange)}
                              >
                                <X className="h-4 w-4" />{" "}
                                {t("entry.remove_photo")}
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
                            <p className="text-sm font-bold text-slate-700 mm:leading-loose">
                              {t("entry.upload_click")}
                            </p>
                            <p className="text-xs text-slate-400 mt-1 mm:leading-loose">
                              {t("entry.upload_limit")}
                            </p>
                          </div>
                        )}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4">
                <Button
                  type="submit"
                  className="w-full font-bold shadow-lg shadow-primary/20 mm:leading-loose"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    t("entry.processing")
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" /> {t("entry.save_btn")}
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
