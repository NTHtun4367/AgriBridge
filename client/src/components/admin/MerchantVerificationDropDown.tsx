import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useUpdateUserVerificationStatusMutation } from "@/store/slices/adminApi"; // Ensure this exists in your API slice
import { toast } from "sonner";
import { Loader2, CheckCircle, Clock, XCircle } from "lucide-react";

interface Props {
  merchantId: string;
  currentStatus: string;
}

const verificationOptions = [
  {
    value: "pending",
    label: "Pending",
    color: "text-yellow-600",
    icon: <Clock className="w-4 h-4" />,
  },
  {
    value: "verified",
    label: "Verified",
    color: "text-green-600",
    icon: <CheckCircle className="w-4 h-4" />,
  },
  {
    value: "rejected",
    label: "Rejected",
    color: "text-red-600",
    icon: <XCircle className="w-4 h-4" />,
  },
];

function MerchantVerificationDropDown({ merchantId, currentStatus }: Props) {
  // Replace with your actual mutation hook name
  const [updateVerification, { isLoading }] =
    useUpdateUserVerificationStatusMutation();

  const handleChange = async (newStatus: string) => {
    try {
      await updateVerification({
        userId: merchantId,
        status: newStatus,
      }).unwrap();
      toast.success(`Merchant is now ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update verification status");
    }
  };

  const getBorderColor = () => {
    if (currentStatus === "verified")
      return "border-green-500/50 text-green-600";
    if (currentStatus === "rejected") return "border-red-500/50 text-red-600";
    return "border-yellow-500/50 text-yellow-600";
  };

  return (
    <Select
      value={currentStatus}
      onValueChange={handleChange}
      disabled={isLoading}
    >
      <SelectTrigger
        className={`w-[125px] h-8 border-2 text-[10px] font-bold transition-all bg-background uppercase ${getBorderColor()}`}
      >
        <div className="flex items-center gap-2">
          {isLoading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <SelectValue placeholder="Verify" />
          )}
        </div>
      </SelectTrigger>
      <SelectContent align="end" className="min-w-[140px]">
        {verificationOptions.map((item) => (
          <SelectItem
            value={item.value}
            key={item.value}
            className="cursor-pointer focus:bg-accent"
          >
            <div className="flex items-center gap-2 py-1">
              <span className={item.color}>{item.icon}</span>
              <span className={`text-xs font-semibold ${item.color}`}>
                {item.label}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default MerchantVerificationDropDown;
