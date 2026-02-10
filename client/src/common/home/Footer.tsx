import { Link, NavLink } from "react-router";
import logo from "@/assets/logo.png";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="px-8 py-12 bg-slate-900 text-slate-300">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="Logo"
                className="h-12 w-auto object-contain"
              />
              <span className="text-3xl italic font-bold text-primary">
                AgriBridge
              </span>
            </Link>
          </div>
          {/* mm:leading-loose prevents character overlap in descriptions */}
          <p className="max-w-xs mm:leading-loose mm:text-lg">
            {t(
              "footer.description",
              "Making agriculture transparent, profitable, and accessible through technology.",
            )}
          </p>
        </div>

        {/* Helper for Footer Links */}
        {[
          {
            title: "footer.roles",
            links: [
              { to: "/farmers-landing", label: "nav.farmers" },
              { to: "/merchants-landing", label: "nav.merchants" },
            ],
          },
          {
            title: "footer.company",
            links: [
              { to: "/about", label: "nav.about" },
              { to: "/contact", label: "nav.contact" },
              { to: "/privacy-policy", label: "nav.privacy" },
            ],
          },
        ].map((section) => (
          <div key={section.title}>
            <h4 className="text-white font-bold mb-4 mm:text-xl">
              {t(section.title)}
            </h4>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `transition-colors mm:leading-relaxed ${
                        isActive
                          ? "text-base font-bold text-primary"
                          : "text-sm hover:text-primary"
                      }`
                    }
                  >
                    {t(link.label)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}

export default Footer;
