import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { Link, NavLink } from "react-router";
import { useTranslation } from "react-i18next"; // 1. Import hook
import { LanguageToggle } from "@/components/LanguageToggle"; // 2. Import Toggle
import logo from "@/assets/logo.png";

function Navigation() {
  const { t } = useTranslation();

  return (
    <nav className="fixed top-0 w-full z-50 border-b bg-card/80 backdrop-blur-md">
      {/* Added mm:h-20 to give Burmese text more vertical room */}
      <div className="max-w-7xl mx-auto px-6 h-16 mm:h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Logo" className="h-12 w-auto object-contain" />
            <span className="text-3xl italic font-bold text-primary">
              AgriBridge
            </span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {[
            { to: "/markets", label: "nav.market_prices" },
            { to: "/farmers-landing", label: "nav.farmers" },
            { to: "/merchants-landing", label: "nav.merchants" },
          ].map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `transition-colors mm:text-lg mm:tracking-wide ${
                  isActive
                    ? "text-base font-bold text-primary"
                    : "text-sm font-medium text-slate-600 hover:text-primary"
                }`
              }
            >
              {t(link.label)}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ModeToggle />
          <Button
            variant="outline"
            className="hidden sm:inline-flex mm:text-base"
            asChild
          >
            <Link to="/login">{t("nav.login")}</Link>
          </Button>
          <Button className="bg-primary mm:text-base" asChild>
            <Link to="/register">{t("nav.register")}</Link>
          </Button>
          <LanguageToggle />
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
