import { useState } from "react";
import { Outlet } from "react-router";
import {
  BookOpenText,
  LayoutDashboard,
  Receipt,
  Settings,
  ShieldAlert,
  ShoppingBag,
  // Sprout,
  Store,
  TrendingUp,
} from "lucide-react";
import SideBar from "@/common/SideBar";
import NavBar from "@/common/NavBar";
import type { Page } from "@/types/sidebar";

const pages: Page[] = [
  {
    name: "Dashboard",
    path: "/farmer/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    name: "Market Prices",
    path: "/farmer/markets",
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    name: "Merchants",
    path: "/farmer/merchants",
    icon: <Store className="w-5 h-5" />,
  },
  // {
  //   name: "Profit Calculator",
  //   path: "/farmer/profit-calculator",
  //   icon: <Sprout className="w-5 h-5" />,
  // },
  {
    name: "Records",
    path: "/farmer/records",
    icon: <BookOpenText className="w-5 h-5" />,
  },
  {
    name: "Preorders",
    path: "/farmer/preorders",
    icon: <ShoppingBag className="w-5 h-5" />,
  },
  {
    name: "Invoices",
    path: "/farmer/invoices",
    icon: <Receipt className="w-5 h-5" />,
  },
  {
    name: "Disputes",
    path: "/farmer/disputes",
    icon: <ShieldAlert className="w-5 h-5" />,
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: <Settings className="w-5 h-5" />,
  },
];

function FarmerPanel() {
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
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-secondary">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default FarmerPanel;
