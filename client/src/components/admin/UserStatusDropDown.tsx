// import { useChangeUserStatusMutation } from "@/store/slices/userApi";
// import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
// import { Check } from "lucide-react";

// type UserStatus = "active" | "ban";

// interface UserStatusDropDownProps {
//   userId: string;
//   userStatus: UserStatus;
// }

const status = [
  { value: "active", label: "Active" },
  { value: "ban", label: "Ban" },
];

function UserStatusDropDown() {
  //   const [selectedStatus, setSelectedStatus] = useState<UserStatus>(userStatus);
  //   const [changeUserStatus, { isLoading }] = useChangeUserStatusMutation();

  //   const handleChange = async (status: UserStatus) => {
  //     setSelectedStatus(status);
  //     await changeUserStatus({ userId, status });
  //   };

  return (
    <Select
    //   value={selectedStatus}
    //   onValueChange={handleChange}
    //   disabled={isLoading}
    >
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="User Status" />
      </SelectTrigger>
      <SelectContent>
        {status.map((item) => (
          <SelectItem value={item.value} key={item.value}>
            <span className="flex items-center gap-1">
              {item.label}
              {/* {selectedStatus === item.value && (
                <Check className="text-green-500" />
              )} */}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default UserStatusDropDown;
