import { useTranslation } from "react-i18next";
import { useMemo } from "react"; // Added useMemo for performance
import { ModeToggle } from "@/components/ModeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
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
import { localizeData } from "@/utils/translator";

interface NavBarProps {
  toggleDesktop: () => void;
  openMobile: () => void;
}

function NavBar({ toggleDesktop, openMobile }: NavBarProps) {
  const { t, i18n } = useTranslation();
  const { data: rawUser } = useCurrentUserQuery();
  const navigate = useNavigate();

  useNotifications();

  // 2. Call localizeData inside useMemo to process the user object
  // This will automatically translate the role and name based on your GLOSSARY
  const user = useMemo(() => {
    if (!rawUser) return null;
    return localizeData(rawUser, i18n.language as "en" | "mm");
  }, [rawUser, i18n.language]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="w-full flex items-center justify-between px-4 md:px-8 py-2.5 bg-background/95 backdrop-blur sticky top-0 z-40 border-b-2 border-b-primary/35 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={openMobile}
          className="md:hidden p-2 hover:bg-primary/10 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6 text-muted-foreground" />
        </button>

        <button
          onClick={toggleDesktop}
          className="hidden md:block p-2 hover:bg-primary/10 rounded-lg transition-colors"
        >
          <PanelLeftOpen className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="flex items-center gap-1">
          <ModeToggle />
          <LanguageToggle />
          <NotificationBell />
        </div>

        {user && (
          <div className="flex items-center gap-4 pl-3 border-l border-border/50 ml-1">
            <div className="hidden sm:flex flex-col items-end justify-center">
              <p className="text-sm font-bold tracking-tight text-foreground mm:mb-0">
                {/* Now display the localized name (converted by your function) */}
                {user.name}
              </p>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 mt-1 rounded-full bg-primary/10 text-primary border border-primary/20 leading-none">
                {/* Now display the localized role (converted by your function) */}
                {user.role}
              </span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="relative group cursor-pointer">
                  <div className="relative w-10 h-10 rounded-full border-2 border-background ring-2 ring-primary/20 bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm overflow-hidden">
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
                <DropdownMenuLabel>{t("navbar.my_account")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigate(`/${rawUser?.role}/profile`)}
                  className="cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4" /> {t("navbar.profile")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate(`/${rawUser?.role}/settings`)}
                  className="cursor-pointer"
                >
                  <SettingsIcon className="mr-2 h-4 w-4" />{" "}
                  {t("navbar.settings")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive cursor-pointer"
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
