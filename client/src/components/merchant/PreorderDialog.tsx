import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ShoppingCart, Plus, Trash2 } from "lucide-react";

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

// --- Schema ---
// Now contains an array of items
const formSchema = z.object({
  items: z
    .array(
      z.object({
        cropId: z.string().min(1, "Required"),
        price: z.string(),
        quantity: z.string().min(1, "Required"),
        unit: z.string(),
      })
    )
    .min(1, "Add at least one crop"),
  day: z.string().min(1, "Day is required"),
  month: z.string().min(1, "Month is required"),
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
  const form = useForm<PreorderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: [{ cropId: "", price: "", quantity: "", unit: "" }],
      day: "",
      month: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "items",
    control: form.control,
  });

  const onSubmit = (values: PreorderFormValues) => {
    console.log("Submitting Multiple Preorders:", values);
    setIsOpen(false);
    form.reset();
  };

  // Helper to update price/unit when a specific crop is selected in a row
  const handleCropChange = (index: number, cropId: string) => {
    const selectedCrop = rawData.find((item) => item.cropId === cropId);
    if (selectedCrop) {
      form.setValue(
        `items.${index}.price`,
        selectedCrop.currentPrice.toString()
      );
      form.setValue(`items.${index}.unit`, selectedCrop.unit);
      form.setValue(`items.${index}.cropId`, cropId);
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
          <DialogTitle>Place Preorder</DialogTitle>
          <DialogDescription>
            Add multiple crops for{" "}
            <span className="font-bold">
              {merchant.merchantId.businessName}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 py-4"
          >
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 border rounded-lg bg-slate-50 relative space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium text-slate-500">
                      Crop #{index + 1}
                    </h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name={`items.${index}.cropId`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Crop</FormLabel>
                        <Select
                          onValueChange={(val) => handleCropChange(index, val)}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a crop" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {rawData?.map((item) => (
                              <SelectItem key={item.cropId} value={item.cropId}>
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
                          <FormLabel>Qty</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <Input {...field} readOnly className="bg-slate-100" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.unit`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit</FormLabel>
                          <Input {...field} readOnly className="bg-slate-100" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full border-dashed"
              onClick={() =>
                append({ cropId: "", price: "", quantity: "", unit: "" })
              }
            >
              <Plus className="w-4 h-4 mr-2" /> Add Another Crop
            </Button>

            <div className="grid gap-2 border-t pt-4">
              <FormLabel>Expected Delivery Date</FormLabel>
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="day"
                  render={({ field }) => (
                    <FormItem className="w-24">
                      <Input type="number" placeholder="DD" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="month"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="January">January</SelectItem>
                          <SelectItem value="February">February</SelectItem>
                          {/* Add other months */}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" className="w-full">
                Confirm All Preorders
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
