import {
  ChartLine,
  ChartNoAxesCombined,
  CircleDollarSign,
  HandCoins,
  LogOut,
  Megaphone,
  Settings,
  ShieldCheck,
  TriangleAlert,
  Wheat,
} from "lucide-react";
import type React from "react";
import { NavLink } from "react-router";

interface Page {
  name: string;
  path: string;
  icon: React.ReactNode;
}

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
    name: "User Complaints",
    path: "/admin/complaints",
    icon: <TriangleAlert className="w-5 h-5" />,
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

function SideBar() {
  return (
    <nav className="mx-4">
      <div className="flex flex-col gap-1 space-y-1">
        {pages.map((page, index) => (
          <NavLink
            to={page.path}
            key={index}
            className={({ isActive }) =>
              `flex items-center gap-1 font-medium text-sm text-black px-4 py-3 rounded ${
                isActive
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`
            }
          >
            {page.icon}
            {page.name}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default SideBar;
