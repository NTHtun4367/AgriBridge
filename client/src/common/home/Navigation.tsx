import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { Link, NavLink } from "react-router";

function Navigation() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* <div className="bg-primary p-1.5 rounded-lg">
              <Sprout className="text-white" size={24} />
            </div> */}
          <span className="text-3xl italic font-bold text-primary">
            <Link to={"/"}>AgriBridge</Link>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <NavLink
            to={"/markets"}
            className={({ isActive }) =>
              isActive
                ? "text-base font-bold text-primary"
                : "text-sm font-medium text-slate-600 hover:text-primary transition-colors"
            }
          >
            Market Prices
          </NavLink>
          <NavLink
            to={"/farmers-landing"}
            className={({ isActive }) =>
              isActive
                ? "text-base font-bold text-primary"
                : "text-sm font-medium text-slate-600 hover:text-primary transition-colors"
            }
          >
            Farmers
          </NavLink>
          <NavLink
            to={"/merchants-landing"}
            className={({ isActive }) =>
              isActive
                ? "text-base font-bold text-primary"
                : "text-sm font-medium text-slate-600 hover:text-primary transition-colors"
            }
          >
            Merchants
          </NavLink>
        </div>

        <div className="flex items-center gap-3">
          <ModeToggle />
          <Button
            variant={"outline"}
            className="hidden sm:inline-flex cursor-pointer"
            asChild
          >
            <Link to={"/login"}>Login</Link>
          </Button>
          <Button className="bg-primary cursor-pointer">
            <Link to={"/register"}>Register</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
