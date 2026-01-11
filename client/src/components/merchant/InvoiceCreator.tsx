import { useState, useEffect, useMemo } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  Receipt,
  Mail,
  Phone,
  MapPin,
  Package,
  Plus,
  Trash2,
  Send,
  Printer,
  Download,
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
import { MOCK_PREORDERS } from "@/types/order";
import { useNavigate } from "react-router";
import { useCreateInvoiceMutation } from "@/store/slices/merchantApi";
import { toast } from "sonner";

// Define Form Schema
interface InvoiceFormValues {
  farmerName: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
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

  const [createInvoice, { isLoading: isCreating }] = useCreateInvoiceMutation();

  const { register, control, handleSubmit, reset, watch } =
    useForm<InvoiceFormValues>({
      defaultValues: {
        farmerName: "",
        email: "",
        phone: "",
        address: "",
        notes: "",
        items: [{ cropName: "", quantity: 0, unit: "kg", price: 0 }],
      },
    });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const formValues = watch();

  useEffect(() => {
    if (initialData) reset(initialData);
  }, [initialData, reset]);

  const handleSelectPreorder = (preorderId: string) => {
    const selected = MOCK_PREORDERS.find((p) => p.id === preorderId);
    if (selected) {
      reset({
        ...formValues,
        farmerName: selected.farmerName,
        email: selected.email || "",
        phone: selected.phone,
        address: selected.address,
        items: selected.items.map((item) => ({
          ...item,
          quantity: Number(item.quantity),
          price: Number(item.price),
        })),
      });
    }
  };

  const subtotal = useMemo(() => {
    return (
      formValues.items?.reduce(
        (acc, item) =>
          acc + Number(item.quantity || 0) * Number(item.price || 0),
        0
      ) || 0
    );
  }, [formValues.items]);

  const onSubmit = async (data: InvoiceFormValues) => {
    try {
      // Mapping form data to match the CreateInvoiceRequest interface
      // Note: In a real app, you'd send the farmerId instead of just name if available
      const payload = {
        farmerId: initialData?.farmerId || "65a1...your_logic_here",
        items: data.items.map((item) => ({
          ...item,
          quantity: Number(item.quantity),
          price: Number(item.price),
        })),
        notes: data.notes,
      };

      await createInvoice(payload).unwrap();

      toast.success("Invoice created successfully!");
      navigate("/dashboard/invoices"); // Redirect after success
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create invoice");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-[1600px] mx-auto"
    >
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* LEFT SIDE: FORM INPUTS */}
        <div className="xl:col-span-7 space-y-6">
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
                      {MOCK_PREORDERS.map((po) => (
                        <SelectItem key={po.id} value={po.id}>
                          {po.id} — {po.farmerName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* FARMER INFO */}
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
                    Contact Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 size-4 text-slate-400" />
                    <Input
                      {...register("email")}
                      placeholder="email@example.com"
                      className="h-11 pl-10"
                    />
                  </div>
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
                <div className="space-y-2">
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

              {/* LINE ITEMS SECTION */}
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
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
                        unit: "kg",
                        price: 0,
                      })
                    }
                    className="rounded-full border-dashed px-4"
                  >
                    <Plus size={16} className="mr-1" /> Add Row
                  </Button>
                </div>

                {/* TABLE HEADER */}
                <div className="grid grid-cols-12 gap-3 px-2">
                  <div className="col-span-4">
                    <Label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                      Crop / Item
                    </Label>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest text-center">
                      Qty
                    </Label>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                      Unit
                    </Label>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                      Price
                    </Label>
                  </div>
                  <div className="col-span-2 text-right">
                    <Label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                      Total
                    </Label>
                  </div>
                </div>

                {/* FIELDS LOOP */}
                <div className="space-y-2">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid grid-cols-12 gap-3 items-center group p-2 rounded-xl transition-colors hover:bg-slate-50/50"
                    >
                      <div className="col-span-3">
                        <Input
                          {...register(`items.${index}.cropName`)}
                          placeholder="e.g. Rice"
                          className="h-10"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          {...register(`items.${index}.quantity`)}
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
                            >
                              <SelectTrigger className="h-10 bg-white">
                                <SelectValue placeholder="Unit" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="kg">kg</SelectItem>
                                <SelectItem value="Ton">Ton</SelectItem>
                                <SelectItem value="lb">lb</SelectItem>
                                <SelectItem value="Basket">Basket</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          {...register(`items.${index}.price`)}
                          className="h-10"
                        />
                      </div>
                      <div className="col-span-3 flex items-center justify-end gap-2">
                        <div className="text-right">
                          <span className="font-mono text-sm font-bold text-slate-700">
                            {(
                              watch(`items.${index}.quantity`) *
                              watch(`items.${index}.price`)
                            ).toLocaleString()}
                          </span>
                          <span className="text-[10px] ml-1 text-slate-400 font-bold uppercase">
                            MMK
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

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                  Notes & Payment Terms
                </Label>
                <Textarea
                  {...register("notes")}
                  placeholder="e.g. Payment due within 30 days..."
                  className="min-h-[100px] resize-none border-slate-200 focus:border-primary"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT SIDE: LIVE PREVIEW */}
        <div className="xl:col-span-5">
          <div className="space-y-6 sticky top-4">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">
                Live Preview
              </h3>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white shadow-sm hover:bg-slate-50"
                >
                  <Printer size={14} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white shadow-sm hover:bg-slate-50"
                >
                  <Download size={14} />
                </Button>
              </div>
            </div>
            <Card className="border-none shadow-2xl overflow-hidden bg-white min-h-[700px] flex flex-col">
              <div className="h-2 bg-primary w-full" />
              <CardContent className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <div className="bg-primary text-white p-2 inline-block rounded-lg mb-4">
                      <Receipt size={24} />
                    </div>
                    <h2 className="text-2xl font-black tracking-tighter">
                      INVOICE
                    </h2>
                    <p className="text-xs text-slate-400 uppercase tracking-widest">
                      INV-{new Date().getFullYear()}-001
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-primary italic">
                      AgriBridge
                    </p>
                    <p className="text-xs text-slate-500">
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
                                  Number(item.quantity || 0) *
                                  Number(item.price || 0)
                                ).toLocaleString()}
                                MMK
                              </td>
                            </tr>
                          )
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-8 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-mono text-slate-700">
                      {subtotal.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                      MMK
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xl font-black pt-4 border-t-2 border-slate-900">
                    <span>Amount Due</span>
                    <span className="text-primary">
                      {subtotal.toLocaleString()} MMK
                    </span>
                  </div>
                </div>

                {formValues.notes && (
                  <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-widest">
                      Notes
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed italic">
                      {formValues.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            <Button
              type="submit"
              disabled={isCreating}
              className="w-full bg-primary text-white font-black py-7 text-lg shadow-xl shadow-blue-100 transition-all hover:scale-[1.01] hover:shadow-blue-200 flex items-center gap-2"
            >
              {isCreating ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </span>
              ) : (
                <>
                  <Send size={20} /> Complete & Send Invoice
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
