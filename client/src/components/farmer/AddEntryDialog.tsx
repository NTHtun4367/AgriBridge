import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import SeedsForm from "./SeedsForm";
import { Separator } from "../ui/separator";

export function AddEntryDialog() {
  const [category, setCategory] = useState("");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#68a611] hover:bg-[#568a0e] text-white">
          <PlusCircle className="w-4 h-4" /> Add Entry
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Entry</DialogTitle>
        </DialogHeader>
        <Select onValueChange={setCategory} defaultValue={category}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="seeds">Seeds</SelectItem>
            <SelectItem value="pesticide">Pesticide / Fertilizer</SelectItem>
            <SelectItem value="labor">Labor / Employee</SelectItem>
            <SelectItem value="fuel">Machinery & Fuel</SelectItem>
            <SelectItem value="packaging">Packaging & Transport</SelectItem>
            <SelectItem value="other">Other Expense</SelectItem>
          </SelectContent>
        </Select>
        <Separator />
        {category && category === "seeds" && <SeedsForm />}
      </DialogContent>
    </Dialog>
  );
}
