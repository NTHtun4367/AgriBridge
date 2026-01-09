import { Button } from "@/components/ui/button";
import { SelectSeparator } from "@/components/ui/select";
import { persistor } from "@/store";
import { apiSlice } from "@/store/slices/api";
import { clearCredentials } from "@/store/slices/auth";
import type { Page } from "@/types/sidebar";
import { LogOut, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router";

interface SideBarProps {
  pages: Page[];
  isCollapsed: boolean;
  closeMobile: () => void;
}

function SideBar({ pages, isCollapsed, closeMobile }: SideBarProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    dispatch(clearCredentials());
    dispatch(apiSlice.util.resetApiState());
    await persistor.purge();
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-6 h-16">
        <h1
          className={`text-2xl text-primary font-extrabold italic transition-all duration-300 ${
            isCollapsed ? "md:hidden" : "block"
          }`}
        >
          <Link to="/">AgriBridge</Link>
        </h1>
        {isCollapsed && (
          <span className="hidden md:block text-primary font-bold text-xl mx-auto">
            AB
          </span>
        )}

        {/* Close button for mobile only */}
        <button
          onClick={closeMobile}
          className="md:hidden p-2 hover:bg-accent rounded"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="px-4">
        <SelectSeparator />
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto mt-4 px-3">
        <div className="flex flex-col gap-1">
          {pages.map((page, index) => (
            <NavLink
              to={page.path}
              key={index}
              onClick={() => {
                if (window.innerWidth < 768) closeMobile();
              }}
              className={({ isActive }) =>
                `flex items-center gap-3 font-medium text-sm px-3 py-3 rounded transition-colors ${
                  isCollapsed ? "md:justify-center" : ""
                } ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`
              }
            >
              <div className="shrink-0">{page.icon}</div>
              <span
                className={`transition-all duration-300 ${
                  isCollapsed ? "md:hidden" : "block"
                }`}
              >
                {page.name}
              </span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-primary/10">
        <Button
          className={`w-full flex items-center gap-2 border-2 border-destructive bg-transparent text-destructive hover:bg-destructive hover:text-white transition-all duration-300 ease-out hover:-translate-y-px hover:shadow-md active:translate-y-0 active:shadow-sm ${
            isCollapsed ? "md:justify-center px-0" : ""
          } `}
          onClick={handleLogout}
        >
          <LogOut size={16} />
          {!isCollapsed && <span className="md:block">Logout</span>}
          <span className="md:hidden">Logout</span>
        </Button>
      </div>
    </div>
  );
}

export default SideBar;
