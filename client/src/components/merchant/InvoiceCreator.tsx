import { useState, useEffect, useMemo, useRef } from "react";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
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
const nrcData = nrcDataRaw as Record<string, string[]>;

export const UNITS = [
  "Viss (1.63kg)",
  "Bag",
  "Tin",
  "Basket",
  "Metric Ton",
  "Pound (lb)",
];

interface InvoiceFormValues {
  farmerId: string;
  preorderId: string;
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
  const [isPreorderMode, setIsPreorderMode] = useState(mode === "preorder");
  const navigate = useNavigate();
  const invoicePreviewRef = useRef<HTMLDivElement>(null);

  const { data: user } = useCurrentUserQuery();
  const { data: preorderData } = useGetMerchantPreordersQuery(user?._id, {
    skip: !user?._id,
  });
  const { data: marketResponse } = useGetMarketPricesQuery({
    userId: user?._id,
  });

  const marketPrices = marketResponse?.data || [];

  // Get crop names from market price data
  const merchantCrops = useMemo(() => {
    return marketPrices.map((item: any) => item.cropName);
  }, [marketPrices]);

  const preorders =
    preorderData &&
    preorderData.filter((order: any) => order.status === "confirmed");

  const [createInvoice, { isLoading: isCreating }] = useCreateInvoiceMutation();
  const [addEntry] = useAddEntryMutation();

  const { register, control, handleSubmit, reset, setValue } =
    useForm<InvoiceFormValues>({
      defaultValues: {
        farmerId: "",
        preorderId: "",
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
        items: [{ cropName: "", quantity: 0, unit: "Bag", price: 0 }],
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

  const selectedNrcRegion = formValues.nrcRegion;
  const nrcTownshipOptions = useMemo(() => {
    return selectedNrcRegion ? nrcData[selectedNrcRegion] || [] : [];
  }, [selectedNrcRegion]);

  useEffect(() => {
    if (selectedNrcRegion) {
      setValue("nrcTownship", "");
    }
  }, [selectedNrcRegion, setValue]);

  useEffect(() => {
    if (initialData) reset(initialData);
  }, [initialData, reset]);

  // Logic to auto-fill Unit and Price when CropName changes
  useEffect(() => {
    formValues.items?.forEach((item, index) => {
      if (item.cropName) {
        const cropDetails = marketPrices.find(
          (p: any) => p.cropName === item.cropName,
        );
        if (cropDetails) {
          setValue(`items.${index}.unit`, cropDetails.unit);
          setValue(`items.${index}.price`, Number(cropDetails.currentPrice));
        }
      }
    });
  }, [
    formValues.items?.map((item) => item.cropName).join(","),
    marketPrices,
    setValue,
  ]);

  const handleSelectPreorder = (preorderId: string) => {
    const selected = preorders?.find((p: any) => p._id === preorderId);
    if (selected) {
      reset({
        preorderId: selected._id,
        farmerId: selected.farmerId,
        farmerName: selected.fullName || selected.farmerName,
        email: selected.email || "",
        phone: selected.phone,
        address: selected.address || "",
        nrcRegion: selected.nrc?.region || "",
        nrcTownship: selected.nrc?.township || "",
        nrcType: selected.nrc?.type || "(N)",
        nrcNumber: selected.nrc?.number || "",
        saveToEntry: true,
        items: selected.items.map((item: any) => ({
          cropName: item.cropName,
          quantity: Number(item.quantity),
          unit: item.unit,
          price: Number(item.price),
        })),
        notes: "",
      });
    }
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

  const autoSaveToEntry = async (
    data: InvoiceFormValues,
    invoiceId: string,
  ) => {
    for (const item of data.items) {
      const quantity = Number(item.quantity) || 0;
      const price = Number(item.price) || 0;

      if (!item.cropName || quantity === 0) continue;

      const formData = new FormData();
      formData.append("date", new Date().toISOString());
      formData.append("type", "expense");
      formData.append("category", item.cropName);
      formData.append("quantity", quantity.toString());
      formData.append("unit", item.unit);
      formData.append("value", (quantity * price).toString());
      formData.append(
        "notes",
        `Invoice #${invoiceId} | ${item.cropName} (${quantity} ${item.unit})`,
      );

      await addEntry(formData).unwrap();
    }
  };

  const onSubmit = async (data: InvoiceFormValues) => {
    if (mode === "preorder" && !data.farmerId) {
      toast.error("Farmer identification is required.");
      return;
    }

    try {
      const fullNRC = `${data.nrcRegion}/${data.nrcTownship}${data.nrcType}${data.nrcNumber}`;

      await createInvoice({
        farmerId: mode === "preorder" ? data.farmerId : undefined,
        preorderId: data.preorderId || undefined,
        invoiceId,
        farmerName: data.farmerName,
        farmerPhone: data.phone,
        farmerAddress: data.address,
        farmerNRC: fullNRC,
        items: data.items,
        notes: data.notes,
        totalAmount: subtotal,
        status: mode === "preorder" ? "pending" : "paid",
      }).unwrap();

      await autoSaveToEntry(data, invoiceId);

      toast.success("Invoice created & saved to ledger automatically!");
      navigate("/merchant/invoices");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create invoice");
    }
  };

  const formatNRC = () => {
    if (!formValues.nrcRegion || !formValues.nrcNumber) return "N/A";
    return `${formValues.nrcRegion}/${formValues.nrcTownship}${formValues.nrcType}${formValues.nrcNumber}`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-[1600px] mx-auto"
    >
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
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: auto;
            margin: 0;
            padding: 40px;
            box-shadow: none !important;
            border: none !important;
          }

          .no-print { display: none !important; }
          
          @page { margin: 0; size: auto; }
        }
      `,
        }}
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* FORM INPUTS */}
        <div className="xl:col-span-7 space-y-6 no-print">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Receipt className="text-primary" /> Invoice Details
                  </CardTitle>
                  <CardDescription>
                    Fill in farmer info or auto-fill from a preorder.
                  </CardDescription>
                </div>
                <div className="bg-slate-100 p-1.5 rounded-xl flex items-center">
                  <button
                    type="button"
                    onClick={() => setIsPreorderMode(false)}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                      !isPreorderMode
                        ? "bg-white shadow-sm text-primary"
                        : "text-slate-500"
                    }`}
                  >
                    Manual
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPreorderMode(true)}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                      isPreorderMode
                        ? "bg-white shadow-sm text-primary"
                        : "text-slate-500"
                    }`}
                  >
                    Preorder
                  </button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-8 pt-4">
              {isPreorderMode && (
                <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-3">
                  <Label className="text-primary font-bold">
                    Search Existing Preorders
                  </Label>
                  <Select onValueChange={handleSelectPreorder}>
                    <SelectTrigger className="bg-white border-blue-200 h-12 shadow-sm">
                      <SelectValue placeholder="Select a preorder..." />
                    </SelectTrigger>
                    <SelectContent>
                      {preorders?.map((po: any) => (
                        <SelectItem key={po._id} value={po._id}>
                          {po._id.slice(-6).toUpperCase()} —{" "}
                          {po.fullName || po.farmerName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                    Full Name
                  </Label>
                  <Input
                    {...register("farmerName")}
                    placeholder="Farmer Name"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 size-4 text-slate-400" />
                    <Input
                      {...register("phone")}
                      placeholder="+95..."
                      className="h-11 pl-10"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-3">
                  <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
                    <ShieldCheck size={14} /> Identity (NRC)
                  </Label>
                  <div className="grid grid-cols-7 gap-2">
                    <div className="col-span-1">
                      <Controller
                        control={control}
                        name="nrcRegion"
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="No." />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(nrcData).map((reg) => (
                                <SelectItem key={reg} value={reg}>
                                  {reg}
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
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={!selectedNrcRegion}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Township" />
                            </SelectTrigger>
                            <SelectContent>
                              {nrcTownshipOptions.map((t) => (
                                <SelectItem key={t} value={t}>
                                  {t}
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
                            <SelectTrigger className="w-full px-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="(N)">(N)</SelectItem>
                              <SelectItem value="(P)">(P)</SelectItem>
                              <SelectItem value="(E)">(E)</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        {...register("nrcNumber")}
                        placeholder="123456"
                        className="w-full"
                        maxLength={6}
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                    Address
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 size-4 text-slate-400" />
                    <Input
                      {...register("address")}
                      placeholder="Farm Location"
                      className="h-11 pl-10"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Package size={18} className="text-primary" /> Line Items
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
                    <Plus size={16} className="mr-1" /> Add Row
                  </Button>
                </div>

                <div className="grid grid-cols-12 gap-3 px-2">
                  <div className="col-span-3">
                    <Label className="text-[10px] font-bold uppercase text-slate-400">
                      Crop Name
                    </Label>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-[10px] font-bold uppercase text-slate-400">
                      Qty
                    </Label>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-[10px] font-bold uppercase text-slate-400">
                      Unit
                    </Label>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-[10px] font-bold uppercase text-slate-400">
                      Price
                    </Label>
                  </div>
                  <div className="col-span-3 text-right pr-10">
                    <Label className="text-[10px] font-bold uppercase text-slate-400">
                      Total
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid grid-cols-12 gap-3 items-center group p-2 rounded-xl transition-colors hover:bg-slate-50/50"
                    >
                      <div className="col-span-3">
                        <Controller
                          control={control}
                          name={`items.${index}.cropName`}
                          render={({ field: selectField }) => (
                            <Select
                              onValueChange={selectField.onChange}
                              value={selectField.value}
                            >
                              <SelectTrigger className="w-full h-10 bg-white">
                                <SelectValue placeholder="Select Crop" />
                              </SelectTrigger>
                              <SelectContent>
                                {merchantCrops.length > 0 ? (
                                  merchantCrops.map((crop: string) => (
                                    <SelectItem key={crop} value={crop}>
                                      {crop}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem value="none" disabled>
                                    No crops found
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          {...register(`items.${index}.quantity`, {
                            valueAsNumber: true,
                          })}
                          className="h-10 text-center"
                        />
                      </div>
                      <div className="col-span-2">
                        <Controller
                          control={control}
                          name={`items.${index}.unit`}
                          render={({ field }) => (
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled // Unit is now auto-filled and disabled
                            >
                              <SelectTrigger className="h-10 bg-slate-50 opacity-80">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {UNITS.map((u) => (
                                  <SelectItem key={u} value={u}>
                                    {u}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          {...register(`items.${index}.price`, {
                            valueAsNumber: true,
                          })}
                          className="h-10 bg-slate-50 opacity-80"
                          disabled // Price is now auto-filled and disabled
                        />
                      </div>
                      <div className="col-span-3 flex items-center justify-end gap-2">
                        <div className="text-right">
                          <span className="font-mono text-xs font-bold text-slate-700">
                            {(
                              (Number(formValues.items?.[index]?.quantity) ||
                                0) *
                              (Number(formValues.items?.[index]?.price) || 0)
                            ).toLocaleString()}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          className="h-8 w-8 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-5 bg-secondary rounded-2xl flex justify-between items-center">
                  <span className="font-bold text-xs uppercase tracking-widest">
                    Total Amount Due
                  </span>
                  <div className="text-right">
                    <span className="text-3xl font-black">
                      {subtotal.toLocaleString()}
                    </span>
                    <span className="font-bold ml-2">MMK</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
                  <FileText size={14} /> Notes & Payment Terms
                </Label>
                <Textarea
                  {...register("notes")}
                  placeholder="e.g. Please pay within 7 days. Thank you for your business!"
                  className="min-h-[100px] bg-slate-50/50 border-slate-200 resize-none"
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
                    <div className="bg-primary text-white p-2 inline-block rounded-lg mb-4 no-print">
                      <Receipt size={24} />
                    </div>
                    <h2 className="text-2xl font-black tracking-tighter">
                      INVOICE
                    </h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                      {invoiceId}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl text-primary italic">
                      AgriBridge
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">
                      Farm-to-Market Digital Platform
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-12 text-sm">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">
                      Billed To
                    </p>
                    <p className="font-bold text-slate-900">
                      {formValues.farmerName || "—"}
                    </p>
                    <p className="text-[10px] text-primary font-bold mt-1">
                      {formatNRC()}
                    </p>
                    <p className="text-slate-500">
                      {formValues.address || "No address provided"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">
                      Date Issued
                    </p>
                    <p className="font-bold">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex-1">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-slate-100 text-[10px] uppercase text-slate-400 font-bold">
                        <th className="text-left pb-3">Item</th>
                        <th className="text-center pb-3">Qty</th>
                        <th className="text-right pb-3">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formValues.items?.map(
                        (item, i) =>
                          item.cropName && (
                            <tr key={i} className="border-b border-slate-50">
                              <td className="py-4 font-medium text-slate-800">
                                {item.cropName}
                              </td>
                              <td className="py-4 text-center text-slate-500">
                                {item.quantity} {item.unit}
                              </td>
                              <td className="py-4 text-right font-mono font-bold">
                                {(
                                  (Number(item.quantity) || 0) *
                                  (Number(item.price) || 0)
                                ).toLocaleString()}{" "}
                                MMK
                              </td>
                            </tr>
                          ),
                      )}
                    </tbody>
                  </table>
                </div>

                {formValues.notes && (
                  <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                      Notes
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed italic">
                      "{formValues.notes}"
                    </p>
                  </div>
                )}

                <div className="mt-8 pt-4 border-t-2 border-slate-900 flex justify-between items-center text-xl font-black">
                  <span>Amount Due</span>
                  <span className="text-primary">
                    {subtotal.toLocaleString()} MMK
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4 no-print">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrint}
                className="py-7 font-bold flex items-center gap-2 border-2"
              >
                <Printer size={20} /> Print Preview
              </Button>

              <Button
                type="submit"
                disabled={isCreating}
                className="bg-primary text-white font-black py-7 text-lg shadow-xl flex items-center gap-2"
              >
                {isCreating ? (
                  "Processing..."
                ) : (
                  <>
                    <Send size={20} /> Send Invoice
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
