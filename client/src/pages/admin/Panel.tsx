import SideBar from "@/common/SideBar";
import { Outlet } from "react-router";
import type { Page } from "@/types/sidebar";
import NavBar from "@/common/NavBar";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Users,
  Store,
  BarChart3,
  ShieldCheck,
  Megaphone,
  Gavel,
  Settings,
} from "lucide-react";

function Panel() {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Define pages inside useMemo to handle dynamic translation updates
  const pages: Page[] = useMemo(
    () => [
      {
        name: t("sidebar.dashboard"),
        path: "/admin/dashboard",
        icon: <LayoutDashboard className="w-5 h-5" />,
      },
      {
        name: t("sidebar.farmer_mgmt"),
        path: "/admin/manage-farmers",
        icon: <Users className="w-5 h-5" />,
      },
      {
        name: t("sidebar.merchant_mgmt"),
        path: "/admin/manage-merchants",
        icon: <Store className="w-5 h-5" />,
      },
      {
        name: t("sidebar.market_mgmt"),
        path: "/admin/manage-market",
        icon: <BarChart3 className="w-5 h-5" />,
        subItems: [
          { name: t("sidebar.add_crops"), path: "/admin/manage-market/crops" },
          {
            name: t("sidebar.add_markets"),
            path: "/admin/manage-market/markets",
          },
          {
            name: t("sidebar.update_prices"),
            path: "/admin/manage-market/prices",
          },
        ],
      },
      {
        name: t("sidebar.verification"),
        path: "/admin/verification",
        icon: <ShieldCheck className="w-5 h-5" />,
      },
      {
        name: t("sidebar.announcements"),
        path: "/admin/announcements",
        icon: <Megaphone className="w-5 h-5" />,
      },
      {
        name: t("sidebar.merchant_disputes"), // Corrected nomenclature
        path: "/admin/disputes",
        icon: <Gavel className="w-5 h-5" />,
      },
      {
        name: t("sidebar.settings"),
        path: "/admin/settings",
        icon: <Settings className="w-5 h-5" />,
      },
    ],
    [t],
  );

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden font-sans text-foreground">
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-all animate-in fade-in"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 bg-background transition-all duration-300 ease-in-out
          md:relative md:translate-x-0 whitespace-nowrap
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <NavBar
          toggleDesktop={() => setIsCollapsed(!isCollapsed)}
          openMobile={() => setIsMobileOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-secondary">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Panel;
