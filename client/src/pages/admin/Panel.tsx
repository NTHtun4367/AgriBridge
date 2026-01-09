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
import { useState } from "react";

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

export default Panel;
