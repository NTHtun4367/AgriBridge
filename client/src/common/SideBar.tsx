import { Button } from "@/components/ui/button";
import { SelectSeparator } from "@/components/ui/select";
import { persistor } from "@/store";
import { apiSlice } from "@/store/slices/api";
import { clearCredentials } from "@/store/slices/auth";
import type { Page } from "@/types/sidebar";
import { LogOut, X, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, NavLink, useNavigate, useLocation } from "react-router";

interface SideBarProps {
  pages: Page[];
  isCollapsed: boolean;
  closeMobile: () => void;
}

function SideBar({ pages, isCollapsed, closeMobile }: SideBarProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  useEffect(() => {
    pages.forEach((page) => {
      if (page.subItems?.some((sub: any) => location.pathname === sub.path)) {
        if (!openMenus.includes(page.name)) {
          setOpenMenus((prev) => [...prev, page.name]);
        }
      }
    });
  }, [location.pathname, pages]);

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };

  const handleLogout = async () => {
    dispatch(clearCredentials());
    dispatch(apiSlice.util.resetApiState());
    await persistor.purge();
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden border-r border-border">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-6 h-16 shrink-0 relative">
        <h1
          className={`text-2xl text-primary font-extrabold italic transition-all duration-300 ${
            isCollapsed ? "opacity-0 scale-90" : "opacity-100 scale-100"
          }`}
        >
          <Link to="/">AgriBridge</Link>
        </h1>
        {isCollapsed && (
          <span className="absolute left-1/2 -translate-x-1/2 hidden md:block text-primary font-black text-xl">
            AB
          </span>
        )}
        <button onClick={closeMobile} className="md:hidden p-2 hover:bg-accent rounded-full">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="px-4">
        <SelectSeparator className="opacity-20" />
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto mt-4 px-3 custom-scrollbar">
        <nav className="flex flex-col gap-1.5">
          {pages.map((page, index) => {
            const isMenuOpen = openMenus.includes(page.name);
            const isParentActive = page.subItems?.some((sub: any) => location.pathname === sub.path);

            return (
              <div key={index} className="w-full">
                {page.subItems ? (
                  <div className="flex flex-col">
                    <button
                      onClick={() => toggleMenu(page.name)}
                      className={`w-full flex items-center justify-between gap-3 font-semibold text-sm px-3 py-2.5 rounded-lg transition-all ${
                        isParentActive ? "text-primary bg-primary/5" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      } ${isCollapsed ? "md:justify-center" : ""}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="shrink-0">{page.icon}</span>
                        {!isCollapsed && <span>{page.name}</span>}
                      </div>
                      {!isCollapsed && (
                        <ChevronDown size={14} className={`transition-transform duration-300 ${isMenuOpen ? "rotate-180" : ""}`} />
                      )}
                    </button>
                    {isMenuOpen && !isCollapsed && (
                      <div className="ml-6 mt-1 flex flex-col gap-1 border-l border-border pl-4 animate-in slide-in-from-top-1">
                        {page.subItems.map((sub: any) => (
                          <NavLink
                            key={sub.path}
                            to={sub.path}
                            className={({ isActive }) =>
                              `text-sm py-2 px-3 rounded-md transition-colors ${
                                isActive ? "text-primary font-bold bg-primary/5" : "text-muted-foreground hover:text-foreground"
                              }`
                            }
                          >
                            {sub.name}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <NavLink
                    to={page.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 font-semibold text-sm px-3 py-2.5 rounded-lg transition-all ${
                        isActive 
                          ? "bg-primary text-primary-foreground shadow-sm" 
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      } ${isCollapsed ? "md:justify-center" : ""}`
                    }
                  >
                    <span className="shrink-0">{page.icon}</span>
                    <span className={isCollapsed ? "md:hidden" : "opacity-100"}>{page.name}</span>
                  </NavLink>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-background">
        <Button
          variant="ghost"
          className={`w-full flex items-center gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive transition-all ${
            isCollapsed ? "justify-center px-0" : "justify-start px-3"
          }`}
          onClick={handleLogout}
        >
          <LogOut size={18} />
          {!isCollapsed && <span className="font-bold">Logout</span>}
        </Button>
      </div>
    </div>
  );
}

export default SideBar;