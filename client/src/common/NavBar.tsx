import { useTranslation } from "react-i18next";
import { ModeToggle } from "@/components/ModeToggle";
import { LanguageToggle } from "@/components/LanguageToggle"; // New Import
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
  const { t } = useTranslation();
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
        {/* Mobile Sidebar Trigger */}
        <button
          onClick={openMobile}
          className="md:hidden p-2 hover:bg-primary/10 rounded-lg transition-colors group"
        >
          <Menu className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
        </button>

        {/* Desktop Sidebar Trigger */}
        <button
          onClick={toggleDesktop}
          className="hidden md:block p-2 hover:bg-primary/10 rounded-lg transition-colors group"
        >
          <PanelLeftOpen className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
        </button>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Control Group: Theme, Language, Notifications */}
        <div className="flex items-center gap-1">
          <ModeToggle />
          <LanguageToggle />
          <NotificationBell />
        </div>

        {user && (
          <div className="flex items-center gap-4 pl-3 border-l border-border/50 ml-1">
            {/* User Info Labels - Improved alignment */}
            <div className="hidden sm:flex flex-col items-end justify-center">
              <p className="text-sm font-bold tracking-tight text-foreground">
                {user.name}
              </p>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 mt-1 mm:-mt-5 rounded-full bg-primary/10 text-primary border border-primary/20 leading-none">
                {user.role}
              </span>
            </div>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="relative group cursor-pointer">
                  {/* Hover Glow Effect */}
                  <div className="absolute -inset-1 bg-linear-to-tr from-primary/40 to-primary/0 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Avatar Container */}
                  <div className="relative w-10 h-10 rounded-full border-2 border-background ring-2 ring-primary/20 bg-linear-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-bold text-sm shadow-md transition-transform group-hover:scale-105 active:scale-95 overflow-hidden">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      // Improved initial slicing for names like "U Kaung"
                      user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)
                    )}
                  </div>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56 mt-2">
                <DropdownMenuLabel>{t("navbar.my_account")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigate(`/${user.role}/profile`)}
                  className="cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4" /> {t("navbar.profile")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate(`/${user.role}/settings`)}
                  className="cursor-pointer"
                >
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  {t("navbar.settings")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" /> {t("navbar.logout")}
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
