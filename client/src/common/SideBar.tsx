import type { Page } from "@/types/sidebar";
import { NavLink } from "react-router";

interface SideBarProps {
  pages: Page[];
}

function SideBar({ pages }: SideBarProps) {
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
