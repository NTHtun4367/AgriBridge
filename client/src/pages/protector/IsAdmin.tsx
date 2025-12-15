import type { RootState } from "@/store";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

function IsAdmin({ children }: { children: React.ReactNode }) {
  const userInfo = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo || userInfo.role !== "admin") navigate("/");
  }, [userInfo]);

  return <>{children}</>;
}

export default IsAdmin;
