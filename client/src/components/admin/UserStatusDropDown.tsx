import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useChangeUserStatusMutation } from "@/store/slices/adminApi";
import { toast } from "sonner";
import { Loader2, ShieldCheck, ShieldAlert } from "lucide-react";

interface UserStatusDropDownProps {
  userId: string;
  userStatus: string;
}

const statusOptions = [
  {
    value: "active",
    label: "Active",
    color: "text-primary",
    icon: <ShieldCheck className="w-4 h-4" />,
  },
  {
    value: "ban",
    label: "Ban",
    color: "text-destructive",
    icon: <ShieldAlert className="w-4 h-4" />,
  },
];

function UserStatusDropDown({ userId, userStatus }: UserStatusDropDownProps) {
  const [changeUserStatus, { isLoading }] = useChangeUserStatusMutation();

  const handleChange = async (newStatus: string) => {
    try {
      await changeUserStatus({ userId, status: newStatus }).unwrap();
      toast.success(`User status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update user status");
      console.error("Status update error:", error);
    }
  };

  return (
    <Select
      value={userStatus}
      onValueChange={handleChange}
      disabled={isLoading}
    >
      <SelectTrigger
        className={`w-[110px] h-8 border-2 text-xs font-bold transition-all focus:ring-primary/20 bg-background ${
          userStatus === "active"
            ? "border-primary/50 text-primary"
            : "border-destructive/50 text-destructive"
        }`}
      >
        <div className="flex items-center gap-2">
          {isLoading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <SelectValue />
          )}
        </div>
      </SelectTrigger>
      <SelectContent align="end" className="min-w-[120px]">
        {statusOptions.map((item) => (
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

export default UserStatusDropDown;
