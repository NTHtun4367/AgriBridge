import SideBar from "@/common/SideBar";
import { Outlet } from "react-router";
import {
  Building2,
  Calculator,
  ChartLine,
  //   ChartNoAxesCombined,
  CircleDollarSign,
  History,
  //   HandCoins,
  // LayersPlus,
  // LogOut,
  //   Megaphone,
  Settings,
  // ShieldCheck,
  //   TriangleAlert,
  //   Wheat,
} from "lucide-react";
import type { Page } from "@/types/sidebar";
import NavBar from "@/common/NavBar";

const pages: Page[] = [
  {
    name: "Dashboard",
    path: "/farmer/dashboard",
    icon: <ChartLine className="w-5 h-5" />,
  },
  {
    name: "Market Prices",
    path: "/farmer/markets",
    icon: <CircleDollarSign className="w-5 h-5" />,
  },
  {
    name: "Merchants",
    path: "/farmer/merchants",
    icon: <Building2 className="w-5 h-5" />,
  },
  {
    name: "Profit Calculator",
    path: "/farmer/profit-calculator",
    icon: <Calculator className="w-5 h-5" />,
  },
  {
    name: "Records",
    path: "/farmer/history",
    icon: <History className="w-5 h-5" />,
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: <Settings className="w-5 h-5" />,
  },
];

function FarmerPanel() {
  return (
    <>
      <section className="grid grid-cols-12">
        <div className="col-span-2 mt-6">
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

export default FarmerPanel;
