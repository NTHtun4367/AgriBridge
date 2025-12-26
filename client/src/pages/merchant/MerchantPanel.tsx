import NavBar from "@/common/NavBar";
import SideBar from "@/common/SideBar";
import type { Page } from "@/types/sidebar";
import { ChartLine, CircleDollarSign, Settings } from "lucide-react";
import { Outlet } from "react-router";

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
];

function MerchantPanel() {
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

export default MerchantPanel;
