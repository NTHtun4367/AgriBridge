import { Navigate, Outlet } from "react-router";
import { useCurrentUserQuery } from "@/store/slices/userApi";

const IsVerified = () => {
  const { data: user, isLoading } = useCurrentUserQuery();

  if (isLoading) return null; // Or a loading spinner

  if (user?.verificationStatus !== "verified") {
    // Redirect to dashboard or a "Pending Approval" page
    return <Navigate to="/merchant/dashboard" replace />;
  }

  return <Outlet />;
};

export default IsVerified;
