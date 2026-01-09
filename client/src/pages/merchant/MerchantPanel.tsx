import NavBar from "@/common/NavBar";
import SideBar from "@/common/SideBar";
import type { Page } from "@/types/sidebar";
import { ChartLine, CircleDollarSign, Settings } from "lucide-react";
import { useState } from "react";
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
  {
    name: "Market Management",
    path: "/merchant/manage-market",
    icon: <CircleDollarSign className="w-5 h-5" />,
  },
  {
    name: "Settings",
    path: "/merchant/settings",
    icon: <Settings className="w-5 h-5" />,
  },
];

function MerchantPanel() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Mobile Overlay (Backdrop) */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 bg-background transition-all duration-300 ease-in-out
          md:relative md:translate-x-0
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "md:w-20" : "md:w-64"}
          border-r-2 border-r-primary/35 shadow-sm
        `}
      >
        <SideBar
          pages={pages}
          isCollapsed={isCollapsed}
          closeMobile={() => setIsMobileOpen(false)}
        />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <NavBar
          toggleDesktop={() => setIsCollapsed(!isCollapsed)}
          openMobile={() => setIsMobileOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-secondary/5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MerchantPanel;
