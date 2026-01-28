import NavBar from "@/common/NavBar";
import SideBar from "@/common/SideBar";
import type { Page } from "@/types/sidebar";
import { useState, useMemo } from "react";
import { Outlet } from "react-router";
import { useCurrentUserQuery } from "@/store/slices/userApi"; // Ensure path is correct
import {
  LayoutDashboard,
  TrendingUp,
  Settings,
  BarChart3,
  ShoppingBag,
  Receipt,
  BookOpenText,
} from "lucide-react";

function MerchantPanel() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Fetch current user info
  const { data: user } = useCurrentUserQuery();

  // Dynamically filter pages based on verification status
  const filteredPages = useMemo(() => {
    const allPages: Page[] = [
      {
        name: "Dashboard",
        path: "/merchant/dashboard",
        icon: <LayoutDashboard className="w-5 h-5" />,
      },
      {
        name: "Market Prices",
        path: "/merchant/markets",
        icon: <TrendingUp className="w-5 h-5" />,
      },
      {
        name: "Market Management",
        path: "/merchant/manage-market",
        icon: <BarChart3 className="w-5 h-5" />,
        protected: true, // Custom flag to identify restricted routes
      },
      {
        name: "Records",
        path: "/merchant/records",
        icon: <BookOpenText className="w-5 h-5" />,
      },
      {
        name: "Preorders",
        path: "/merchant/preorders",
        icon: <ShoppingBag className="w-5 h-5" />,
        protected: true,
      },
      {
        name: "Invoices",
        path: "/merchant/invoices",
        icon: <Receipt className="w-5 h-5" />,
        protected: true,
      },
      {
        name: "Settings",
        path: "/merchant/settings",
        icon: <Settings className="w-5 h-5" />,
      },
    ];

    // If user is verified, show everything.
    // Otherwise, filter out the protected items.
    if (user?.verificationStatus === "verified") {
      return allPages;
    }

    return allPages.filter((page: any) => !page.protected);
  }, [user]);

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
          pages={filteredPages} // Passing the filtered list here
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
          {/* Optional: Add a verification alert if not verified */}
          {user && user.verificationStatus !== "verified" && (
            <div className="mb-4 p-4 bg-orange-100 border-l-4 border-orange-500 text-orange-700 text-sm">
              <p className="font-bold">Account Verification Pending</p>
              <p>
                Please complete your verification to access Market Management,
                Preorders, and Invoices.
              </p>
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MerchantPanel;
