import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ShoppingCart } from "lucide-react";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// --- Schema ---
const formSchema = z.object({
  cropId: z.string().min(1, "Please select a crop"),
  price: z.string(),
  quantity: z.string().min(1, "Quantity is required"),
  unit: z.string(),
  status: z.enum(["finished", "not_finished"]),
  day: z.string().min(1, "Day is required"),
  month: z.string().min(1, "Month is required"),
});

type PreorderFormValues = z.infer<typeof formSchema>;

interface PreorderDialogProps {
  merchant: {
    merchantId: {
      businessName: string;
    };
  };
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
      cropId: "",
      price: "",
      quantity: "",
      unit: "",
      status: "not_finished",
      day: "",
      month: "",
    },
  });

  const selectedCropId = form.watch("cropId");

  // FIX 1: Change item._id to item.cropId to match your console log
  useEffect(() => {
    if (selectedCropId && rawData) {
      const selectedCrop = rawData.find(
        (item) => item.cropId === selectedCropId
      );
      if (selectedCrop) {
        form.setValue("price", selectedCrop.currentPrice.toString());
        form.setValue("unit", selectedCrop.unit);
      }
    }
  }, [selectedCropId, rawData, form]);

  const onSubmit = (values: PreorderFormValues) => {
    console.log("Submitting Preorder:", values);
    setIsOpen(false);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full px-8 shadow-md shadow-primary/35 gap-2">
          <ShoppingCart className="w-4 h-4" /> Preorder Now
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Place Preorder</DialogTitle>
          <DialogDescription>
            Fill in the details to send a procurement request to{" "}
            <span className="font-bold text-slate-900">
              {merchant.merchantId.businessName}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="cropId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Crop</FormLabel>
                  {/* FIX 2: Ensure value and onValueChange are properly linked */}
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a crop" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {rawData && rawData.length > 0 ? (
                        rawData.map((item) => (
                          // FIX 3: Changed key and value to item.cropId
                          <SelectItem key={item.cropId} value={item.cropId}>
                            {item.cropName}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          No crops available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (Current)</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly className="bg-slate-100" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly className="bg-slate-100" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="finished" id="finished" />
                        <label
                          htmlFor="finished"
                          className="text-sm cursor-pointer"
                        >
                          Finished
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="not_finished"
                          id="not_finished"
                        />
                        <label
                          htmlFor="not_finished"
                          className="text-sm cursor-pointer"
                        >
                          Not Finished
                        </label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Expected Date Section */}
            <div className="grid gap-2">
              <FormLabel>Expected Date</FormLabel>
              <div className="flex gap-2">
                {/* 1st: DAY Select Box */}
                <FormField
                  control={form.control}
                  name="day"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        {...field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 2nd: MONTH Select Box */}
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
                            <SelectValue placeholder="Day" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="day">Day</SelectItem>
                          <SelectItem value="month">Month</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="submit" className="w-full">
                Confirm Preorder
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
