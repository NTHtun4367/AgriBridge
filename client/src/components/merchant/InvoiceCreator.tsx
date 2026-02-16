import { useState, useEffect, useMemo, useRef } from "react";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Receipt,
  Phone,
  MapPin,
  Package,
  Plus,
  Trash2,
  Send,
  ShieldCheck,
  FileText,
  Printer,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router";
import { useCreateInvoiceMutation } from "@/store/slices/invoiceApi";
import { toast } from "sonner";
import { useGetMerchantPreordersQuery } from "@/store/slices/preorderApi";
import { useAddEntryMutation } from "@/store/slices/entryApi";

// NRC Data Import
import nrcDataRaw from "@/utils/nrcData.json";
import { useGetMarketPricesQuery } from "@/store/slices/marketApi";
import { useCurrentUserQuery } from "@/store/slices/userApi";
import { localizeData } from "@/utils/translator";

const nrcData = nrcDataRaw as Record<string, string[]>;

interface InvoiceFormValues {
  farmerId: string;
  merchant_preordersId: string;
  farmerName: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  nrcRegion: string;
  nrcTownship: string;
  nrcType: string;
  nrcNumber: string;
  saveToEntry: boolean;
  items: {
    cropName: string;
    quantity: number;
    unit: string;
    price: number;
  }[];
}

export function InvoiceCreator({
  initialData,
  mode,
}: {
  initialData: any;
  mode: "preorder" | "manual";
}) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language === "mm" ? "mm" : "en";
  const [isPreorderMode, setIsPreorderMode] = useState(mode === "preorder");
  const navigate = useNavigate();
  const invoicePreviewRef = useRef<HTMLDivElement>(null);

  // Queries
  const { data: user } = useCurrentUserQuery();
  const { data: merchant_preordersData } = useGetMerchantPreordersQuery(
    user?._id,
    {
      skip: !user?._id,
    },
  );
  const { data: marketResponse } = useGetMarketPricesQuery({
    userId: user?._id,
  });

  const marketPrices = marketResponse?.data || [];

  // Filtered confirmed merchant_preorders
  const merchant_preorders = useMemo(() => {
    if (!merchant_preordersData) return [];

    return merchant_preordersData
      .filter((order: any) => order.status === "confirmed")
      .map((order: any) => ({
        ...order,

        // Top level fields
        fullName:
          currentLang === "mm"
            ? localizeData(order.fullName, "mm")
            : order.fullName,

        farmerName:
          currentLang === "mm"
            ? localizeData(order.farmerName, "mm")
            : order.farmerName,

        address:
          currentLang === "mm"
            ? localizeData(order.address, "mm")
            : order.address,

        phone:
          currentLang === "mm" ? localizeData(order.phone, "mm") : order.phone,

        // NRC object
        nrc: order.nrc
          ? {
              ...order.nrc,
              region:
                currentLang === "mm"
                  ? localizeData(order.nrc.region, "mm")
                  : order.nrc.region,
              township:
                currentLang === "mm"
                  ? localizeData(order.nrc.township, "mm")
                  : order.nrc.township,
              type:
                currentLang === "mm"
                  ? localizeData(order.nrc.type, "mm")
                  : order.nrc.type,
              number:
                currentLang === "mm"
                  ? localizeData(order.nrc.number, "mm")
                  : order.nrc.number,
            }
          : null,

        // Items array
        items: order.items?.map((item: any) => ({
          ...item,
          cropName:
            currentLang === "mm"
              ? localizeData(item.cropName, "mm")
              : item.cropName,
          unit:
            currentLang === "mm" ? localizeData(item.unit, "mm") : item.unit,
          quantity:
            currentLang === "mm"
              ? localizeData(item.quantity?.toString(), "mm")
              : item.quantity,
          price:
            currentLang === "mm"
              ? localizeData(item.price?.toString(), "mm")
              : item.price,
        })),
      }));
  }, [merchant_preordersData, currentLang]);

  // Localized Crops for selection
  const merchantCrops = useMemo(() => {
    return marketPrices.map((item: any) => ({
      value: item.cropName,
      label:
        currentLang === "mm"
          ? localizeData(item.cropName, "mm")
          : item.cropName,
    }));
  }, [marketPrices, currentLang]);

  const [createInvoice, { isLoading: isCreating }] = useCreateInvoiceMutation();
  const [addEntry] = useAddEntryMutation();

  const { register, control, handleSubmit, reset, setValue } =
    useForm<InvoiceFormValues>({
      defaultValues: {
        farmerId: "",
        merchant_preordersId: "",
        farmerName: "",
        email: "",
        phone: "",
        address: "",
        notes: "",
        nrcRegion: "",
        nrcTownship: "",
        nrcType: "(N)",
        nrcNumber: "",
        saveToEntry: true,
        items: [
          {
            cropName: "",
            quantity: 0,
            unit: currentLang === "mm" ? "အိတ်" : "Bag",
            price: 0,
          },
        ],
      },
    });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const formValues = useWatch({ control });

  const invoiceId = useMemo(
    () =>
      `INV-${new Date().getFullYear()}-${Math.floor(
        1000 + Math.random() * 9000,
      )}`,
    [],
  );

  // NRC Township Options
  const nrcTownshipOptions = useMemo(() => {
    if (!formValues.nrcRegion) return [];

    return (nrcData[formValues.nrcRegion] || []).map((ts) => ({
      value: ts,
      label: currentLang === "mm" ? localizeData(ts, "mm") : ts,
    }));
  }, [formValues.nrcRegion, currentLang]);

  useEffect(() => {
    if (formValues.nrcRegion && nrcTownshipOptions.length > 0) {
      // Only auto-select if township is empty
      if (!formValues.nrcTownship) {
        setValue("nrcTownship", nrcTownshipOptions[0].value);
      }
    }
  }, [
    formValues.nrcRegion,
    nrcTownshipOptions,
    formValues.nrcTownship,
    setValue,
  ]);

  useEffect(() => {
    if (initialData) reset(initialData);
  }, [initialData, reset]);

  // Auto-fill price and unit
  useEffect(() => {
    formValues.items?.forEach((item, index) => {
      if (item?.cropName) {
        const cropDetails = marketPrices.find(
          (p: any) => p.cropName === item.cropName,
        );
        if (cropDetails) {
          if (item.unit !== cropDetails.unit) {
            setValue(`items.${index}.unit`, cropDetails.unit);
          }
          const priceNum = Number(cropDetails.currentPrice);
          if (item.price !== priceNum) {
            setValue(`items.${index}.price`, priceNum);
          }
        }
      }
    });
  }, [formValues.items, marketPrices, setValue]);

  const handleSelectPreorder = (preorderId: string) => {
    const selected = merchant_preorders?.find((p: any) => p._id === preorderId);
    if (!selected) return;

    reset({
      merchant_preordersId: selected._id,
      farmerId: selected.farmerId,
      farmerName: selected.fullName || selected.farmerName,
      email: selected.email || "",
      phone: selected.phone,
      address: selected.address || "",
      saveToEntry: true,
      items: selected.items.map((item: any) => ({
        cropName: item.cropName,
        quantity: Number(item.quantity),
        unit: item.unit,
        price: Number(item.price),
      })),
      notes: "",
      nrcRegion: selected.nrc?.region || "",
      nrcTownship: selected.nrc?.township || "",
      nrcType: selected.nrc?.type || "(N)",
      nrcNumber: selected.nrc?.number || "",
    });
  };

  const subtotal = useMemo(() => {
    return (
      formValues.items?.reduce(
        (acc, item) =>
          acc + (Number(item?.quantity) || 0) * (Number(item?.price) || 0),
        0,
      ) || 0
    );
  }, [formValues.items]);

  const onSubmit = async (data: InvoiceFormValues) => {
    if (isPreorderMode && !data.farmerId) {
      toast.error(t("merchant_dash.errors.select_preorder"));
      return;
    }

    if (!data.items?.length || !data.items[0].cropName) {
      toast.error(t("merchant_dash.errors.no_items"));
      return;
    }

    try {
      const fullNRC = data.nrcRegion
        ? `${data.nrcRegion}/${data.nrcTownship}${data.nrcType}${data.nrcNumber}`
        : "";

      await createInvoice({
        farmerId: isPreorderMode ? data.farmerId : undefined,
        preorderId: data.merchant_preordersId || undefined,
        invoiceId,
        farmerName: data.farmerName,
        farmerPhone: data.phone,
        farmerAddress: data.address,
        farmerNRC: fullNRC,
        items: data.items,
        notes: data.notes,
        totalAmount: subtotal,
        status: isPreorderMode ? "pending" : "paid",
      }).unwrap();

      // Auto-save logic
      if (data.saveToEntry) {
        for (const item of data.items) {
          const qty = Number(item.quantity) || 0;
          if (!item.cropName || qty === 0) continue;
          const formData = new FormData();
          formData.append("date", new Date().toISOString());
          formData.append("type", "expense");
          formData.append("category", item.cropName);
          formData.append("quantity", qty.toString());
          formData.append("unit", item.unit);
          formData.append(
            "value",
            (qty * (Number(item.price) || 0)).toString(),
          );
          formData.append("notes", `Invoice #${invoiceId}`);
          await addEntry(formData).unwrap();
        }
      }

      toast.success(t("merchant_dash.errors.create_success"));
      navigate("/merchant/invoices");
    } catch (err: any) {
      toast.error(
        err?.data?.message || t("merchant_dash.errors.create_failed"),
      );
    }
  };

  const formatNRC = () => {
    if (!formValues.nrcRegion || !formValues.nrcNumber)
      return t("merchant_dash.common.na");
    return `${localizeData(formValues.nrcRegion, currentLang)}/${localizeData(formValues.nrcTownship, currentLang)}${localizeData(formValues.nrcType, currentLang)}${localizeData(formValues.nrcNumber, currentLang)}`;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full mx-auto h-screen">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          body * { visibility: hidden; }
          #invoice-print-area, #invoice-print-area * { 
            visibility: visible; 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important;
          }
          #invoice-print-area {
            position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 20px;
            box-shadow: none !important; border: none !important;
          }
          .no-print { display: none !important; }
        }
      `,
        }}
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* INPUT SECTION */}
        <div className="xl:col-span-7 space-y-6 no-print">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold flex items-center gap-2 mm:leading-loose">
                    <Receipt className="text-primary" />
                    {t("merchant_dash.invoice.title")}
                  </CardTitle>
                  <CardDescription className="mm:leading-loose">
                    {t("merchant_dash.invoice.description")}
                  </CardDescription>
                </div>
                <div className="bg-slate-100 p-1 rounded-xl flex items-center">
                  <button
                    type="button"
                    onClick={() => setIsPreorderMode(false)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all mm:text-[10px] ${
                      !isPreorderMode
                        ? "bg-white shadow-sm text-primary"
                        : "text-slate-500"
                    }`}
                  >
                    {t("merchant_dash.invoice.mode_manual")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPreorderMode(true)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all mm:text-[10px] ${
                      isPreorderMode
                        ? "bg-white shadow-sm text-primary"
                        : "text-slate-500"
                    }`}
                  >
                    {t("merchant_dash.invoice.mode_preorder")}
                  </button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-8 pt-4">
              {isPreorderMode && (
                <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-3">
                  <Label>{t("merchant_dash.invoice.preorder_label")}</Label>
                  <p className="text-xs text-muted-foreground">
                    {t("merchant_dash.invoice.preorder_search")}
                  </p>
                  <Select
                    value={formValues.merchant_preordersId} // bind value to form
                    onValueChange={handleSelectPreorder} // call handler
                  >
                    <SelectTrigger className="bg-white border-blue-200 h-12 shadow-sm mm:leading-loose">
                      <SelectValue
                        placeholder={t(
                          "merchant_dash.invoice.preorder_placeholder",
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {merchant_preorders?.length > 0 ? (
                        merchant_preorders.map((po: any) => (
                          <SelectItem key={po._id} value={po._id}>
                            {localizeData(
                              po._id.slice(-6).toUpperCase(),
                              currentLang,
                            )}{" "}
                            —
                            {currentLang === "mm"
                              ? localizeData(po.fullName || po.farmerName, "mm")
                              : po.fullName || po.farmerName}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          {t("merchant_dash.invoice.no_preorders")}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider mm:leading-loose">
                    {t("merchant_dash.invoice.field_name")}
                  </Label>
                  <Input
                    {...register("farmerName", { required: true })}
                    placeholder={t("merchant_dash.invoice.farmer_name")}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider mm:leading-loose">
                    {t("merchant_dash.invoice.field_phone")}
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 size-4 text-slate-400" />
                    <Input
                      {...register("phone", { required: true })}
                      placeholder={t("merchant_dash.invoice.farmer_phone")}
                      className="h-11 pl-10"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-3">
                  <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2 mm:leading-loose">
                    <ShieldCheck size={14} />
                    {t("merchant_dash.invoice.field_nrc")}
                  </Label>
                  <div className="grid grid-cols-7 gap-2">
                    <div className="col-span-1">
                      <Controller
                        control={control}
                        name="nrcRegion"
                        render={({ field }) => (
                          <Select
                            key={currentLang}
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full mm:leading-loose">
                              <SelectValue
                                placeholder={t(
                                  "merchant_dash.common.number_short",
                                )}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(nrcData).map((reg) => (
                                <SelectItem key={reg} value={reg}>
                                  {currentLang === "mm"
                                    ? localizeData(reg, "mm")
                                    : reg}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div className="col-span-2">
                      <Controller
                        control={control}
                        name="nrcTownship"
                        render={({ field }) => (
                          <Select
                            key={currentLang + formValues.nrcRegion}
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={!formValues.nrcRegion}
                          >
                            <SelectTrigger className="w-full mm:leading-loose">
                              <SelectValue
                                placeholder={t("merchant_dash.common.township")}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {nrcTownshipOptions.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div className="col-span-1">
                      <Controller
                        control={control}
                        name="nrcType"
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full px-2 mm:leading-loose">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="(N)">
                                {localizeData("(N)", currentLang)}
                              </SelectItem>
                              <SelectItem value="(P)">
                                {localizeData("(P)", currentLang)}
                              </SelectItem>
                              <SelectItem value="(E)">
                                {localizeData("(E)", currentLang)}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        {...register("nrcNumber")}
                        placeholder={t("merchant_dash.invoice.nrc_number")}
                        className="w-full"
                        maxLength={6}
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider mm:leading-loose">
                    {t("merchant_dash.invoice.field_address")}
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 size-4 text-slate-400" />
                    <Input
                      {...register("address")}
                      placeholder={t("merchant_dash.invoice.farm_location")}
                      className="h-11 pl-10"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* ITEM LIST */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Package size={18} className="text-primary" />
                    {t("merchant_dash.invoice.items_title")}
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      append({
                        cropName: "",
                        quantity: 0,
                        unit: "Bag",
                        price: 0,
                      })
                    }
                    className="rounded-full border-dashed px-4"
                  >
                    <Plus size={16} className="mr-1" />
                    {t("merchant_dash.invoice.add_row")}
                  </Button>
                </div>

                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end p-4 border rounded-xl hover:bg-slate-50/50"
                    >
                      <div className="md:col-span-3 space-y-1">
                        <Label className="text-[10px] uppercase font-bold text-slate-400 mm:leading-loose">
                          {t("merchant_dash.invoice.col_item")}
                        </Label>
                        <Controller
                          control={control}
                          name={`items.${index}.cropName`}
                          render={({ field: selectField }) => (
                            <Select
                              key={currentLang}
                              onValueChange={selectField.onChange}
                              value={selectField.value}
                            >
                              <SelectTrigger className="bg-white mm:leading-loose">
                                <SelectValue
                                  placeholder={t(
                                    "merchant_dash.common.select_crop",
                                  )}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {merchantCrops.map((crop) => (
                                  <SelectItem
                                    key={crop.value}
                                    value={crop.value}
                                  >
                                    {crop.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                      <div className="md:col-span-2 space-y-1">
                        <Label className="text-[10px] uppercase font-bold text-slate-400 mm:leading-loose">
                          {t("merchant_dash.invoice.col_qty")}
                        </Label>
                        <Input
                          type="number"
                          {...register(`items.${index}.quantity`, {
                            valueAsNumber: true,
                          })}
                        />
                      </div>
                      <div className="md:col-span-2 space-y-1">
                        <Label className="text-[10px] uppercase font-bold text-slate-400 mm:leading-loose">
                          {t("merchant_dash.invoice.col_unit")}
                        </Label>
                        <Input
                          value={
                            formValues.items?.[index]?.cropName
                              ? localizeData(
                                  formValues.items?.[index]?.unit || "",
                                  currentLang,
                                )
                              : t("merchant_dash.common.unit")
                          }
                          disabled
                          className="bg-slate-50 mm:pt-4"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-1">
                        <Label className="text-[10px] uppercase font-bold text-slate-400 mm:leading-loose">
                          {t("merchant_dash.invoice.col_price")}
                        </Label>
                        <Input
                          value={localizeData(
                            formValues.items?.[index]?.price?.toString() || "0",
                            currentLang,
                          )}
                          disabled
                          className="bg-slate-50 mm:pt-3"
                        />
                      </div>
                      <div className="md:col-span-3 flex items-center justify-between gap-2">
                        <div className="text-right flex-1">
                          <Label className="text-[10px] uppercase font-bold text-slate-400 block mm:leading-loose">
                            {t("merchant_dash.invoice.col_total")}
                          </Label>
                          <span className="font-mono text-sm font-bold mm:mb-2">
                            {localizeData(
                              (
                                (Number(formValues.items?.[index]?.quantity) ||
                                  0) *
                                (Number(formValues.items?.[index]?.price) || 0)
                              ).toLocaleString(),
                              currentLang,
                            )}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          className="text-slate-300 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-5 bg-secondary rounded-2xl flex justify-between items-center">
                  <span className="font-bold text-xs uppercase tracking-widest">
                    {t("merchant_dash.invoice.total_due")}
                  </span>
                  <div className="text-right">
                    <span className="text-3xl font-black">
                      {localizeData(subtotal.toLocaleString(), currentLang)}
                    </span>
                    <span className="font-bold ml-2">
                      {t("merchant_dash.mmk")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2 mm:leading-loose">
                  <FileText size={14} />
                  {t("merchant_dash.invoice.notes_label")}
                </Label>
                <Textarea
                  {...register("notes")}
                  placeholder={t("merchant_dash.invoice.notes_placeholder")}
                  className="min-h-[100px] resize-none"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* PREVIEW PANEL */}
        <div className="xl:col-span-5">
          <div className="space-y-6 sticky top-4">
            <Card
              id="invoice-print-area"
              ref={invoicePreviewRef}
              className="border-none shadow-2xl overflow-hidden bg-white min-h-[700px] flex flex-col"
            >
              <div className="h-3 bg-primary w-full" />
              <CardContent className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <h2 className="text-2xl font-black tracking-tighter">
                      {t("merchant_dash.invoice.invoice_label")}
                    </h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                      {localizeData(invoiceId, currentLang)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl text-primary italic">
                      AgriBridge
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">
                      {t("merchant_dash.invoice.brand_subtitle")}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-12 text-sm">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">
                      {t("merchant_dash.invoice.preview_billed_to")}
                    </p>
                    <p className="font-bold text-slate-900">
                      {formValues.farmerName || "—"}
                    </p>
                    <p className="text-[10px] text-primary font-bold mt-1">
                      {formatNRC()}
                    </p>
                    <p className="text-slate-500 text-xs">
                      {formValues.address ||
                        t("merchant_dash.common.no_address")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">
                      {t("merchant_dash.invoice.preview_date")}
                    </p>
                    <p className="font-bold">
                      {localizeData(
                        new Date().toLocaleDateString(),
                        currentLang,
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex-1">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-slate-100 text-[10px] uppercase text-slate-400 font-bold">
                        <th className="text-left pb-3">
                          {t("merchant_dash.invoice.col_item")}
                        </th>
                        <th className="text-center pb-3">
                          {t("merchant_dash.invoice.col_qty")}
                        </th>
                        <th className="text-right pb-3">
                          {t("merchant_dash.invoice.col_total")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {formValues.items?.map(
                        (item, i) =>
                          item.cropName && (
                            <tr key={i} className="border-b border-slate-50">
                              <td className="py-4 font-medium text-slate-800">
                                {localizeData(item.cropName, currentLang)}
                              </td>
                              <td className="py-4 text-center text-slate-500">
                                {localizeData(
                                  item.quantity!.toString(),
                                  currentLang,
                                )}
                                {localizeData(item.unit, currentLang)}
                              </td>
                              <td className="py-4 text-right font-mono font-bold">
                                {localizeData(
                                  (
                                    (Number(item.quantity) || 0) *
                                    (Number(item.price) || 0)
                                  ).toLocaleString(),
                                  currentLang,
                                )}
                                {t("merchant_dash.mmk")}
                              </td>
                            </tr>
                          ),
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-8 pt-4 border-t-2 border-slate-900 flex justify-between items-center text-xl font-black">
                  <span>{t("merchant_dash.invoice.total_due")}</span>
                  <span className="text-primary">
                    {localizeData(subtotal.toLocaleString(), currentLang)}
                    {t("merchant_dash.mmk")}
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4 no-print">
              <Button
                type="button"
                variant="outline"
                onClick={() => window.print()}
                className="py-7 font-bold flex items-center gap-2 border-2"
              >
                <Printer size={20} /> {t("merchant_dash.invoice.btn_print")}
              </Button>

              <Button
                type="submit"
                disabled={isCreating || !formValues.items?.length}
                className="bg-primary hover:bg-primary/90 text-white font-black py-7 text-lg shadow-xl flex items-center gap-2"
              >
                {isCreating ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <Send size={20} /> {t("merchant_dash.invoice.btn_send")}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
