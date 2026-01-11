import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { useParams } from "react-router";

// --- Schema ---
const formSchema = z.object({
  items: z
    .array(
      z.object({
        cropName: z.string().min(1, "Required"),
        price: z.string(),
        quantity: z.string().min(1, "Required"),
        unit: z.string(),
      })
    )
    .min(1, "Add at least one crop"),
  phone: z.string().optional(),
  notes: z.string().optional(),
  deliveryCount: z.string().min(1, "Required"),
  deliveryUnit: z.enum(["days", "months"]),
});

type PreorderFormValues = z.infer<typeof formSchema>;

interface PreorderDialogProps {
  merchant: { merchantId: { businessName: string } };
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

  const form = useForm<PreorderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: [{ cropName: "", price: "", quantity: "", unit: "" }],
      phone: "",
      notes: "",
      deliveryCount: "1",
      deliveryUnit: "days",
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "items",
    control: form.control,
  });

  const onSubmit = async (values: PreorderFormValues) => {
    const payload = {
      farmerId: user?.id,
      merchantId: userId,
      items: values.items.map((item) => ({
        ...item,
        quantity: Number(item.quantity),
        price: Number(item.price),
      })),
      phone: values.phone,
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
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to place preorder");
    }
  };

  const handleCropChange = (index: number, cropName: string) => {
    const selectedCrop = rawData.find((item) => item.cropName === cropName);
    if (selectedCrop) {
      form.setValue(
        `items.${index}.price`,
        selectedCrop.currentPrice.toString()
      );
      form.setValue(`items.${index}.unit`, selectedCrop.unit);
      form.setValue(`items.${index}.cropName`, cropName);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full px-8 shadow-md gap-2">
          <ShoppingCart className="w-4 h-4" /> Preorder Now
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
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
            {/* --- Contact Info Section --- */}
            <div className="p-4 border rounded-xl bg-slate-50/50 space-y-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5" /> Phone Number (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="+95..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* --- Crops Section --- */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                  Selected Crops
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({ cropName: "", price: "", quantity: "", unit: "" })
                  }
                  className="h-8 border-dashed"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Crop
                </Button>
              </div>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 border rounded-xl relative space-y-4 shadow-sm bg-secondary"
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
                        className="h-7 w-7 text-destructive hover:bg-red-50"
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
                          onValueChange={(val) => handleCropChange(index, val)}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Search crop list..." />
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
                          <FormLabel className="text-[10px] uppercase">
                            Qty
                          </FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase">
                        Price
                      </FormLabel>
                      <Input
                        value={form.watch(`items.${index}.price`)}
                        readOnly
                        className="bg-slate-50 border-none font-mono"
                      />
                    </FormItem>
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase">
                        Unit
                      </FormLabel>
                      <Input
                        value={form.watch(`items.${index}.unit`)}
                        readOnly
                        className="bg-slate-50 border-none"
                      />
                    </FormItem>
                  </div>
                </div>
              ))}
            </div>

            {/* --- Delivery Timing Section --- */}
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

            {/* --- Notes Section --- */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5" /> Additional Notes
                    (Optional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g. Please ensure packaging is waterproof..."
                      className="resize-none h-20"
                      {...field}
                    />
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
              </Button>{" "}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
