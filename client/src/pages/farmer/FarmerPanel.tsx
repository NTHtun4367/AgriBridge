import { useState, useMemo } from "react";
import { Outlet } from "react-router";
import { useTranslation } from "react-i18next";
import {
  BookOpenText,
  LayoutDashboard,
  Receipt,
  Settings,
  ShieldAlert,
  ShoppingBag,
  Store,
  TrendingUp,
} from "lucide-react";
import SideBar from "@/common/SideBar";
import NavBar from "@/common/NavBar";
import type { Page } from "@/types/sidebar";

function FarmerPanel() {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Map pages using the updated 'farmer_sidebar' namespace
  const pages: Page[] = useMemo(
    () => [
      {
        name: t("farmer_sidebar.dashboard"),
        path: "/farmer/dashboard",
        icon: <LayoutDashboard className="w-5 h-5" />,
      },
      {
        name: t("farmer_sidebar.market_prices"),
        path: "/farmer/markets",
        icon: <TrendingUp className="w-5 h-5" />,
      },
      {
        name: t("farmer_sidebar.merchants"),
        path: "/farmer/merchants",
        icon: <Store className="w-5 h-5" />,
      },
      {
        name: t("farmer_sidebar.records"),
        path: "/farmer/records",
        icon: <BookOpenText className="w-5 h-5" />,
      },
      {
        name: t("farmer_sidebar.preorders"),
        path: "/farmer/preorders",
        icon: <ShoppingBag className="w-5 h-5" />,
      },
      {
        name: t("farmer_sidebar.invoices"),
        path: "/farmer/invoices",
        icon: <Receipt className="w-5 h-5" />,
      },
      {
        name: t("farmer_sidebar.disputes"),
        path: "/farmer/disputes",
        icon: <ShieldAlert className="w-5 h-5" />,
      },
      {
        name: t("farmer_sidebar.settings"),
        path: "/farmer/settings",
        icon: <Settings className="w-5 h-5" />,
      },
    ],
    [t],
  );

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
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
