import SideBar from "@/common/SideBar";
import { Outlet } from "react-router";
import {
  ChartLine,
  ChartNoAxesCombined,
  CircleDollarSign,
  HandCoins,
  Megaphone,
  Settings,
  ShieldCheck,
  TriangleAlert,
  Wheat,
} from "lucide-react";
import type { Page } from "@/types/sidebar";
import NavBar from "@/common/NavBar";

const pages: Page[] = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <ChartLine className="w-5 h-5" />,
  },
  {
    name: "Farmer Management",
    path: "/admin/manage-farmers",
    icon: <Wheat className="w-5 h-5" />,
  },
  {
    name: "Merchant Management",
    path: "/admin/manage-merchants",
    icon: <HandCoins className="w-5 h-5" />,
  },
  {
    name: "Market Management",
    path: "/admin/manage-market",
    icon: <CircleDollarSign className="w-5 h-5" />,
  },
  {
    name: "Verification",
    path: "/admin/verification",
    icon: <ShieldCheck className="w-5 h-5" />,
  },
  {
    name: "Analytics",
    path: "/admin/analytics",
    icon: <ChartNoAxesCombined className="w-5 h-5" />,
  },
  {
    name: "Announcements",
    path: "/admin/announcements",
    icon: <Megaphone className="w-5 h-5" />,
  },
  {
    name: "User Disputes",
    path: "/admin/disputes",
    icon: <TriangleAlert className="w-5 h-5" />,
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: <Settings className="w-5 h-5" />,
  },
];

function Panel() {
  return (
    <>
      <section className="grid grid-cols-12">
        <div className="col-span-2 border-r-2 border-r-primary/35">
          <SideBar pages={pages} />
        </div>
        <div className="col-span-10">
          <NavBar />
          <Outlet />
        </div>
      </section>
    </>
  );
}

export default Panel;
