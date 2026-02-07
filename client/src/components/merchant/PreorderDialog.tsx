import React, { useMemo, useEffect, useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ShoppingCart,
  Plus,
  Trash2,
  Phone,
  FileText,
  CalendarClock,
  Loader2,
  ShieldCheck,
  User,
  MapPin,
  ChevronRight,
  Info,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePreorderMutation } from "@/store/slices/preorderApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useNavigate, useParams } from "react-router";

// Import NRC Data
import nrcDataRaw from "@/utils/nrcData.json";
import { Checkbox } from "../ui/checkbox";
const nrcData = nrcDataRaw as Record<string, string[]>;

const formSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(5, "Please provide a complete delivery address"),
  items: z
    .array(
      z.object({
        cropName: z.string().min(1, "Required"),
        price: z.string(),
        quantity: z.string().min(1, "Required"),
        unit: z.string(),
      }),
    )
    .min(1, "Add at least one crop"),
  nrcRegion: z.string().min(1, "Required"),
  nrcTownship: z.string().min(1, "Required"),
  nrcType: z.string().min(1, "Required"),
  nrcNumber: z.string().length(6, "Must be 6 digits"),
  notes: z.string().optional(),
  deliveryCount: z.string().min(1, "Required"),
  deliveryUnit: z.enum(["days", "months"]),
});

type PreorderFormValues = z.infer<typeof formSchema>;

interface PreorderDialogProps {
  merchant: { merchantId: { _id: string; businessName: string } };
  rawData: any[];
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

export const PreorderDialog: React.FC<PreorderDialogProps> = ({
  merchant,
  rawData,
  isOpen,
  setIsOpen,
}) => {
  const { userId } = useParams();
  const { user } = useSelector((state: RootState) => state.auth);
  const [createPreorder, { isLoading }] = useCreatePreorderMutation();
  const navigate = useNavigate();

  // --- New State for Terms Gate ---
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [tempCheck, setTempCheck] = useState(false);

  const form = useForm<PreorderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      items: [{ cropName: "", price: "", quantity: "", unit: "" }],
      nrcRegion: "",
      nrcTownship: "",
      nrcType: "(N)",
      nrcNumber: "",
      notes: "",
      deliveryCount: "1",
      deliveryUnit: "days",
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "items",
    control: form.control,
  });

  const selectedNrcRegion = useWatch({
    control: form.control,
    name: "nrcRegion",
  });

  const nrcTownshipOptions = useMemo(() => {
    return selectedNrcRegion ? nrcData[selectedNrcRegion] || [] : [];
  }, [selectedNrcRegion]);

  useEffect(() => {
    if (selectedNrcRegion) {
      form.setValue("nrcTownship", "");
    }
  }, [selectedNrcRegion, form]);

  // Reset terms gate when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setHasAcceptedTerms(false);
      setTempCheck(false);
    }
  }, [isOpen]);

  const onSubmit = async (values: PreorderFormValues) => {
    const payload = {
      farmerId: user?.id,
      merchantId: userId,
      fullName: values.name,
      phone: values.phone,
      address: values.address,
      items: values.items.map((item) => ({
        ...item,
        quantity: Number(item.quantity),
        price: Number(item.price),
      })),
      nrc: {
        region: values.nrcRegion,
        township: values.nrcTownship,
        type: values.nrcType,
        number: values.nrcNumber,
      },
      notes: values.notes,
      deliveryTimeline: {
        count: Number(values.deliveryCount),
        unit: values.deliveryUnit,
      },
    };

    try {
      await createPreorder(payload).unwrap();
      toast.success("Preorder successful!");
      setIsOpen(false);
      form.reset();
      navigate("/farmer/preorders");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to place preorder");
    }
  };

  const handleCropChange = (index: number, cropName: string) => {
    const selectedCrop = rawData.find((item) => item.cropName === cropName);
    if (selectedCrop) {
      form.setValue(
        `items.${index}.price`,
        selectedCrop.currentPrice.toString(),
      );
      form.setValue(`items.${index}.unit`, selectedCrop.unit);
      form.setValue(`items.${index}.cropName`, cropName);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full px-8 shadow-md gap-2">
          <ShoppingCart className="w-4 h-4" /> Pre-Selling
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        {!hasAcceptedTerms ? (
          /* SECTION 1: TERMS AND PRIVACY POLICY */
          <div className="space-y-6 py-4 animate-in fade-in zoom-in duration-200">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Info className="w-5 h-5 text-primary" /> Terms & Conditions
              </DialogTitle>
              <DialogDescription>
                Please review our terms and privacy policy before placing a
                preorder with{" "}
                <span className="font-semibold text-foreground">
                  {merchant.merchantId.businessName}
                </span>
                .
              </DialogDescription>
            </DialogHeader>

            <div className="bg-slate-50 border rounded-lg p-4 text-sm text-slate-600 space-y-4 max-h-[300px] overflow-y-auto">
              <section>
                <h4 className="font-bold text-slate-900 mb-1">
                  1. Farmer Commitment
                </h4>
                <p>
                  By participating in this preorder, you are required to provide
                  a valid NRC and active contact information. Please be aware
                  that your request is contingent upon the merchant's current
                  capacity and stock availability.
                </p>
              </section>
              <section>
                <h4 className="font-bold text-slate-900 mb-1">
                  2. Data Usage Notice
                </h4>
                <p>
                  To process your order, your personal details (Name, Phone,
                  NRC, and Address) will be shared with the designated merchant.
                  This information is used strictly for logistical fulfillment.
                </p>
              </section>
              <section>
                <h4 className="font-bold text-slate-900 mb-1">
                  3. Harvest & Logistics Warning
                </h4>
                <p>
                  The delivery schedule is a preliminary estimate only. You must
                  acknowledge that actual timing depends entirely on crop
                  maturity, weather-related harvest conditions, and
                  transportation availability.
                </p>
              </section>
              <section>
                <h4 className="font-bold text-slate-900 mb-1">
                  4. Price Adjustment Policy
                </h4>
                <p>
                  Note that pricing is subject to change based on the quality
                  and specifications of the goods for delivery.
                </p>
              </section>
            </div>

            <div className="flex items-start gap-3 p-2">
              <Checkbox
                id="terms"
                checked={tempCheck}
                onCheckedChange={(checked) => setTempCheck(checked as boolean)}
                className="mt-1"
              />
              <label
                htmlFor="terms"
                className="text-sm leading-tight text-slate-600 cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I have read and agree to the <strong>Terms of Service</strong>{" "}
                and <strong>Privacy Policy</strong>. I understand my information
                will be processed to complete this transaction.
              </label>
            </div>
            <DialogFooter>
              <Button
                className="w-full gap-2"
                disabled={!tempCheck}
                onClick={() => setHasAcceptedTerms(true)}
              >
                Continue to Preorder <ChevronRight className="w-4 h-4" />
              </Button>
            </DialogFooter>
          </div>
        ) : (
          /* SECTION 2: EXISTING PREORDER FORM UI */
          <div className="animate-in slide-in-from-right-4 duration-300">
            <DialogHeader>
              <DialogTitle className="text-xl">Place Preorder</DialogTitle>
              <DialogDescription>
                Requesting crops from{" "}
                <span className="font-bold text-primary">
                  {merchant.merchantId.businessName}
                </span>
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 py-2"
              >
                {/* Contact & Identity Section */}
                <div className="p-4 border rounded-xl bg-slate-50/50 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5" /> Full Name
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5" /> Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="+95..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* NRC Section */}
                  <div className="space-y-3">
                    <FormLabel className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5" /> Identity (NRC)
                    </FormLabel>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="col-span-1">
                        <FormField
                          control={form.control}
                          name="nrcRegion"
                          render={({ field }) => (
                            <FormItem>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="No." />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Object.keys(nrcData).map((reg) => (
                                    <SelectItem key={reg} value={reg}>
                                      {reg}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-2">
                        <FormField
                          control={form.control}
                          name="nrcTownship"
                          render={({ field }) => (
                            <FormItem>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                disabled={!selectedNrcRegion}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Township" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {nrcTownshipOptions.map((t) => (
                                    <SelectItem key={t} value={t}>
                                      {t}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-1">
                        <FormField
                          control={form.control}
                          name="nrcType"
                          render={({ field }) => (
                            <FormItem>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {["(N)", "(P)", "(E)"].map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {type}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div className="col-span-12">
                      <FormField
                        control={form.control}
                        name="nrcNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="6-digit serial number"
                                {...field}
                                maxLength={6}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="p-4 border rounded-xl bg-blue-50/30 space-y-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5" /> Your Address
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter your full street address, village, or landmark"
                            className="resize-none h-20 bg-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Crops Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase text-slate-500">
                      Selected Crops
                    </h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        append({
                          cropName: "",
                          price: "",
                          quantity: "",
                          unit: "",
                        })
                      }
                      className="h-8 border-dashed"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add Crop
                    </Button>
                  </div>

                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="p-4 border rounded-xl space-y-4 shadow-sm bg-secondary"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400">
                          Crop #{index + 1}
                        </span>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            className="h-7 w-7 text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <FormField
                        control={form.control}
                        name={`items.${index}.cropName`}
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={(val) =>
                                handleCropChange(index, val)
                              }
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a crop" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {rawData?.map((item) => (
                                  <SelectItem
                                    key={item.cropName}
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

                      <div className="grid grid-cols-3 gap-3">
                        <FormField
                          control={form.control}
                          name={`items.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px]">Qty</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormItem>
                          <FormLabel className="text-[10px]">Price</FormLabel>
                          <Input
                            value={form.watch(`items.${index}.price`)}
                            readOnly
                            className="bg-slate-50 font-mono"
                          />
                        </FormItem>
                        <FormItem>
                          <FormLabel className="text-[10px]">Unit</FormLabel>
                          <Input
                            value={form.watch(`items.${index}.unit`)}
                            readOnly
                            className="bg-slate-50"
                          />
                        </FormItem>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Timeline */}
                <div className="p-4 border rounded-xl bg-orange-50/30 space-y-3">
                  <FormLabel className="flex items-center gap-2">
                    <CalendarClock className="w-3.5 h-3.5" /> Expected Delivery
                    Timing
                  </FormLabel>
                  <div className="flex gap-2">
                    <FormField
                      control={form.control}
                      name="deliveryCount"
                      render={({ field }) => (
                        <FormItem className="w-24">
                          <FormControl>
                            <Input type="number" min="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="deliveryUnit"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="days">Day(s)</SelectItem>
                              <SelectItem value="months">Month(s)</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5" />
                        Additional Notes (Optional)
                      </FormLabel>
                      <FormControl>
                        <Textarea {...field} className="resize-none h-20" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="pt-4 border-t">
                  <Button
                    type="submit"
                    className="w-full h-12"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Confirm Preorder"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
