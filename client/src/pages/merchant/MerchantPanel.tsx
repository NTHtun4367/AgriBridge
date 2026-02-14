import NavBar from "@/common/NavBar";
import SideBar from "@/common/SideBar";
import type { Page } from "@/types/sidebar";
import { useState, useMemo } from "react";
import { Outlet } from "react-router";
import { useCurrentUserQuery } from "@/store/slices/userApi";
import { useTranslation } from "react-i18next"; // Added i18next hook
import {
  LayoutDashboard,
  TrendingUp,
  Settings,
  BarChart3,
  ShoppingBag,
  Receipt,
  BookOpenText,
  Store,
} from "lucide-react";

function MerchantPanel() {
  const { t } = useTranslation(); // Initialize translation function
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Fetch current user info
  const { data: user } = useCurrentUserQuery();

  // Dynamically filter pages based on verification status
  const filteredPages = useMemo(() => {
    const allPages: Page[] = [
      {
        name: t("merchant_panel.nav.dashboard"),
        path: "/merchant/dashboard",
        icon: <LayoutDashboard className="w-5 h-5" />,
      },
      {
        name: t("merchant_panel.nav.market_prices"),
        path: "/merchant/markets",
        icon: <TrendingUp className="w-5 h-5" />,
      },
      {
        name: t("merchant_panel.nav.merchants"),
        path: "/merchant/merchants",
        icon: <Store className="w-5 h-5" />,
      },
      {
        name: t("merchant_panel.nav.market_management"),
        path: "/merchant/manage-market",
        icon: <BarChart3 className="w-5 h-5" />,
        protected: true,
      },
      {
        name: t("merchant_panel.nav.records"),
        path: "/merchant/records",
        icon: <BookOpenText className="w-5 h-5" />,
        protected: true,
      },
      {
        name: t("merchant_panel.nav.preorders"),
        path: "/merchant/preorders",
        icon: <ShoppingBag className="w-5 h-5" />,
        protected: true,
      },
      {
        name: t("merchant_panel.nav.invoices"),
        path: "/merchant/invoices",
        icon: <Receipt className="w-5 h-5" />,
        protected: true,
      },
      {
        name: t("merchant_panel.nav.settings"),
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
  }, [user, t]); // Added 't' to dependency array

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
          pages={filteredPages}
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
          {/* Verification alert translated */}
          {user && user.verificationStatus !== "verified" && (
            <div className="mb-4 p-4 bg-orange-100 border-l-4 border-orange-500 text-orange-700 text-sm rounded-r-md">
              <p className="font-bold mm:leading-loose">
                {t("merchant_panel.verification.title")}
              </p>
              <p className="mm:leading-loose">{t("merchant_panel.verification.message")}</p>
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MerchantPanel;
