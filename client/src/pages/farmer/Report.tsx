import SeasonalReports from "@/components/farmer/SeasonalReports";
import { useCurrentUserQuery } from "@/store/slices/userApi";

function Report() {
  const { data: user } = useCurrentUserQuery();
  return (
    <div>
      <SeasonalReports userId={user?._id!} />
    </div>
  );
}

export default Report;
