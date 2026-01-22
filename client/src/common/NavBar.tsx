import { ModeToggle } from "@/components/ModeToggle";
import { useNotifications } from "@/hooks/useNotification";
import { useCurrentUserQuery } from "@/store/slices/userApi";
import {
  Menu,
  PanelLeftOpen,
  User,
  Settings as SettingsIcon,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router";
import { NotificationBell } from "./NotificationBell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavBarProps {
  toggleDesktop: () => void;
  openMobile: () => void;
}

function NavBar({ toggleDesktop, openMobile }: NavBarProps) {
  const { data: user } = useCurrentUserQuery();
  const navigate = useNavigate();

  useNotifications();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="w-full flex items-center justify-between px-4 md:px-8 py-2.5 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-40 border-b-2 border-b-primary/35 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={openMobile}
          className="md:hidden p-2 hover:bg-primary/10 rounded-lg transition-colors group"
        >
          <Menu className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
        </button>

        <button
          onClick={toggleDesktop}
          className="hidden md:block p-2 hover:bg-primary/10 rounded-lg transition-colors group"
        >
          <PanelLeftOpen className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
        </button>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <ModeToggle />
        <NotificationBell />

        {user && (
          <div className="flex items-center gap-3 pl-2 border-l border-border/50 ml-1">
            <div className="hidden sm:flex flex-col items-end justify-center">
              <p className="text-sm font-bold tracking-tight leading-none text-foreground">
                {user.name}
              </p>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 mt-1 rounded-md bg-primary/10 text-primary border border-primary/20 leading-none">
                {user.role}
              </span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="relative group cursor-pointer">
                  <div className="absolute -inset-1 bg-linear-to-tr from-primary/40 to-primary/0 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative w-10 h-10 rounded-full border-2 border-background ring-2 ring-primary/20 bg-linear-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-bold text-sm shadow-md transition-transform group-hover:scale-105 active:scale-95 overflow-hidden">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user.name.slice(0, 2).toUpperCase()
                    )}
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigate(`/${user.role}/profile`)}
                  className="cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate(`/${user.role}/settings`)}
                  className="cursor-pointer"
                >
                  <SettingsIcon className="mr-2 h-4 w-4" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
