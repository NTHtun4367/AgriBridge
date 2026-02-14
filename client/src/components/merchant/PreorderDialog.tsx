import React, { useMemo, useEffect, useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
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

import nrcDataRaw from "@/utils/nrcData.json";
import { Checkbox } from "../ui/checkbox";
const nrcData = nrcDataRaw as Record<string, string[]>;

const formSchema = z.object({
  name: z.string().min(1, "Required"),
  phone: z.string().min(1, "Required"),
  address: z.string().min(5, "Address too short"),
  items: z
    .array(
      z.object({
        cropName: z.string().min(1, "Required"),
        price: z.string(),
        quantity: z.string().min(1, "Required"),
        unit: z.string(),
      }),
    )
    .min(1),
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
  const { t } = useTranslation();
  const { userId } = useParams();
  const { user } = useSelector((state: RootState) => state.auth);
  const [createPreorder, { isLoading }] = useCreatePreorderMutation();
  const navigate = useNavigate();

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
    if (selectedNrcRegion) form.setValue("nrcTownship", "");
  }, [selectedNrcRegion, form]);

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
      toast.success(t("preorder.success"));
      setIsOpen(false);
      form.reset();
      navigate("/farmer/preorders");
    } catch (err: any) {
      toast.error(err?.data?.message || t("preorder.error"));
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
        <Button className="rounded-full px-8 shadow-md gap-2 mm:leading-loose">
          <ShoppingCart className="w-4 h-4" /> {t("preorder.title")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        {!hasAcceptedTerms ? (
          <div className="space-y-6 py-4 animate-in fade-in zoom-in duration-200">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl mm:leading-loose">
                <Info className="w-5 h-5 text-primary" />{" "}
                {t("preorder.terms_title")}
              </DialogTitle>
              <DialogDescription className="mm:leading-loose">
                {t("preorder.terms_desc")}{" "}
                <span className="font-semibold text-foreground">
                  {merchant.merchantId.businessName}
                </span>
                .
              </DialogDescription>
            </DialogHeader>

            <div className="bg-slate-50 border rounded-lg p-4 text-sm text-slate-600 space-y-4 max-h-[300px] overflow-y-auto">
              <section>
                <h4 className="font-bold text-slate-900 mb-1 mm:leading-loose">
                  {t("preorder.terms.commitment")}
                </h4>
                <p className="mm:leading-loose">
                  {t("preorder.terms.commitment_text")}
                </p>
              </section>
              <section>
                <h4 className="font-bold text-slate-900 mb-1 mm:leading-loose">
                  {t("preorder.terms.data")}
                </h4>
                <p className="mm:leading-loose">
                  {t("preorder.terms.data_text")}
                </p>
              </section>
              <section>
                <h4 className="font-bold text-slate-900 mb-1 mm:leading-loose">
                  {t("preorder.terms.harvest")}
                </h4>
                <p className="mm:leading-loose">
                  {t("preorder.terms.harvest_text")}
                </p>
              </section>
              <section>
                <h4 className="font-bold text-slate-900 mb-1 mm:leading-loose">
                  {t("preorder.terms.price")}
                </h4>
                <p className="mm:leading-loose">
                  {t("preorder.terms.price_text")}
                </p>
              </section>
            </div>

            <div className="flex items-start gap-3 p-2">
              <Checkbox
                id="terms"
                checked={tempCheck}
                onCheckedChange={(checked) => setTempCheck(checked as boolean)}
                className="mt-1 mm:mt-2"
              />
              <label
                htmlFor="terms"
                className="text-sm leading-tight text-slate-600 cursor-pointer mm:leading-loose"
              >
                {t("preorder.terms.checkbox")}
              </label>
            </div>
            <DialogFooter>
              <Button
                className="w-full gap-2 mm:leading-loose"
                disabled={!tempCheck}
                onClick={() => setHasAcceptedTerms(true)}
              >
                {t("preorder.continue_btn")}{" "}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="animate-in slide-in-from-right-4 duration-300">
            <DialogHeader>
              <DialogTitle className="text-xl mm:leading-loose">
                {t("preorder.title")}
              </DialogTitle>
              <DialogDescription>
                {t("preorder.description")}{" "}
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
                          <FormLabel className="flex items-center gap-2 mm:leading-loose">
                            <User className="w-3.5 h-3.5" />{" "}
                            {t("preorder.sections.contact")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t(
                                "preorder.fields.name_placeholder",
                              )}
                              {...field}
                            />
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
                          <FormLabel className="flex items-center gap-2 mm:leading-loose">
                            <Phone className="w-3.5 h-3.5" />{" "}
                            {t("preorder.sections.phone")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t(
                                "preorder.fields.phone_placeholder",
                              )}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-3">
                    <FormLabel className="flex items-center gap-2 mm:leading-loose">
                      <ShieldCheck className="w-3.5 h-3.5" />{" "}
                      {t("preorder.sections.nrc")}
                    </FormLabel>
                    <div className="grid grid-cols-4 gap-2">
                      <FormField
                        control={form.control}
                        name="nrcRegion"
                        render={({ field }) => (
                          <FormItem className="col-span-1">
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full mm:leading-loose">
                                  <SelectValue
                                    placeholder={t(
                                      "preorder.fields.nrc_region",
                                    )}
                                  />
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
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="nrcTownship"
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={!selectedNrcRegion}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full mm:leading-loose">
                                  <SelectValue
                                    placeholder={t(
                                      "preorder.fields.nrc_township",
                                    )}
                                  />
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
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="nrcType"
                        render={({ field }) => (
                          <FormItem className="col-span-1">
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full mm:leading-loose">
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
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="nrcNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder={t("preorder.fields.nrc_number")}
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

                {/* Address */}
                <div className="p-4 border rounded-xl bg-blue-50/30 space-y-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 mm:leading-loose">
                          <MapPin className="w-3.5 h-3.5" />{" "}
                          {t("preorder.sections.address")}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t(
                              "preorder.fields.address_placeholder",
                            )}
                            className="resize-none h-20 bg-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Crops */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase text-slate-500 mm:leading-loose">
                      {t("preorder.selected_crops")}
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
                      className="h-8 border-dashed mm:leading-loose"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />{" "}
                      {t("preorder.add_crop")}
                    </Button>
                  </div>

                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="p-4 border rounded-xl space-y-4 shadow-sm bg-secondary"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400">
                          # {index + 1}
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
                                <SelectTrigger className="mm:leading-loose">
                                  <SelectValue
                                    placeholder={t(
                                      "preorder.fields.crop_placeholder",
                                    )}
                                  />
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
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-3 gap-3">
                        <FormField
                          control={form.control}
                          name={`items.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] mm:leading-loose">
                                {t("preorder.fields.qty")}
                              </FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormItem>
                          <FormLabel className="text-[10px] mm:leading-loose">
                            {t("preorder.fields.price")}
                          </FormLabel>
                          <Input
                            value={form.watch(`items.${index}.price`)}
                            readOnly
                            className="bg-slate-50 font-mono"
                          />
                        </FormItem>
                        <FormItem>
                          <FormLabel className="text-[10px] mm:leading-loose">
                            {t("preorder.fields.unit")}
                          </FormLabel>
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

                {/* Delivery */}
                <div className="p-4 border rounded-xl bg-orange-50/30 space-y-3">
                  <FormLabel className="flex items-center gap-2 mm:leading-loose">
                    <CalendarClock className="w-3.5 h-3.5" />{" "}
                    {t("preorder.sections.delivery")}
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
                              <SelectTrigger className="mm:leading-loose">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="days">
                                {t("preorder.fields.days")}
                              </SelectItem>
                              <SelectItem value="months">
                                {t("preorder.fields.months")}
                              </SelectItem>
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
                      <FormLabel className="flex items-center gap-2 mm:leading-loose">
                        <FileText className="w-3.5 h-3.5" />{" "}
                        {t("preorder.sections.notes")}
                      </FormLabel>
                      <FormControl>
                        <Textarea {...field} className="resize-none h-20" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <DialogFooter className="pt-4 border-t">
                  <Button
                    type="submit"
                    className="w-full h-12 mm:leading-loose mm:h-10"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      t("preorder.confirm_btn")
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
