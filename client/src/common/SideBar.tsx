import { Button } from "@/components/ui/button";
import { SelectSeparator } from "@/components/ui/select";
import { persistor } from "@/store";
import { apiSlice } from "@/store/slices/api";
import { clearCredentials } from "@/store/slices/auth";
import type { Page } from "@/types/sidebar";
import { LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router";

interface SideBarProps {
  pages: Page[];
}

function SideBar({ pages }: SideBarProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    // clear auth state
    dispatch(clearCredentials());

    // clear RTK query cache
    dispatch(apiSlice.util.resetApiState());

    // clear persisted redux state
    await persistor.purge();

    // redirect to login
    navigate("/login");
  };

  return (
    <nav className="flex flex-col h-screen mx-4">
      {/* Logo */}
      <h1 className="text-3xl text-primary font-extrabold italic pl-4 pb-4 mt-6">
        <Link to="/">AgriBridge</Link>
      </h1>

      <SelectSeparator />

      {/* Scrollable menu */}
      <div className="flex-1 overflow-y-auto mt-4">
        <div className="flex flex-col gap-1">
          {pages.map((page, index) => (
            <NavLink
              to={page.path}
              key={index}
              className={({ isActive }) =>
                `flex items-center gap-2 font-medium text-sm px-4 py-3 rounded ${
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
      </div>

      {/* Logout always visible */}
      <Button
        variant="destructive"
        className="w-full flex items-center gap-2 mt-4 mb-12 cursor-pointer"
        onClick={() => handleLogout()}
      >
        <LogOut size={16} />
        Logout
      </Button>
    </nav>
  );
}

export default SideBar;
