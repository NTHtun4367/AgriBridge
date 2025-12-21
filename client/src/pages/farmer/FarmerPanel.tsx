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
  LogOut,
  //   Megaphone,
  Settings,
  // ShieldCheck,
  //   TriangleAlert,
  //   Wheat,
} from "lucide-react";
import type { Page } from "@/types/sidebar";

const pages: Page[] = [
  {
    name: "Dashboard",
    path: "/farmer/dashboard",
    icon: <ChartLine className="w-5 h-5" />,
  },
  {
    name: "Market Prices",
    path: "/admin/manage-merchants",
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
    name: "History",
    path: "/farmer/history",
    icon: <History className="w-5 h-5" />,
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: <Settings className="w-5 h-5" />,
  },
  {
    name: "Logout",
    path: "/admin/logout",
    icon: <LogOut className="w-5 h-5" />,
  },
];

function FarmerPanel() {
  return (
    <>
      <nav className="w-full px-8 py-3 shadow">
        <h1 className="text-3xl text-primary font-extrabold italic">
          AgriBridge
        </h1>
      </nav>
      <section className="grid grid-cols-12">
        <div className="col-span-2 mt-6">
          <SideBar pages={pages} />
        </div>
        <div className="col-span-10">
          <Outlet />
        </div>
      </section>
    </>
  );
}

export default FarmerPanel;
