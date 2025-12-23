import SideBar from "@/common/SideBar";
import type { Page } from "@/types/sidebar";
import { ChartLine, CircleDollarSign, LogOut, Settings } from "lucide-react";
import { Link, Outlet } from "react-router";

const pages: Page[] = [
  {
    name: "Dashboard",
    path: "/merchant/dashboard",
    icon: <ChartLine className="w-5 h-5" />,
  },
  {
    name: "Market Prices",
    path: "/merchant/market-prices",
    icon: <CircleDollarSign className="w-5 h-5" />,
  },
  //   {
  //     name: "Merchants",
  //     path: "/farmer/merchants",
  //     icon: <Building2 className="w-5 h-5" />,
  //   },
  //   {
  //     name: "Profit Calculator",
  //     path: "/farmer/profit-calculator",
  //     icon: <Calculator className="w-5 h-5" />,
  //   },
  //   {
  //     name: "History",
  //     path: "/farmer/history",
  //     icon: <History className="w-5 h-5" />,
  //   },
  {
    name: "Settings",
    path: "/merchant/settings",
    icon: <Settings className="w-5 h-5" />,
  },
  {
    name: "Logout",
    path: "/merchant/logout",
    icon: <LogOut className="w-5 h-5" />,
  },
];

function MerchantPanel() {
  return (
    <>
      <nav className="w-full px-8 py-3 shadow">
        <h1 className="text-3xl text-primary font-extrabold italic">
          <Link to={"/"}>AgriBridge</Link>
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

export default MerchantPanel;
