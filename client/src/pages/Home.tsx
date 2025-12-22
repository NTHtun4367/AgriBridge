import {
  // Sprout,
  Store,
  TrendingUp,
  BarChart3,
  ArrowRight,
  Wallet,
  ShieldCheck,
  LineChart,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router";
// import { ModeToggle } from "@/components/ModeToggle";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* --- NAVIGATION --- */}
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
            <a
              href="#market"
              className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
            >
              Market Prices
            </a>
            <a
              href="#farmer"
              className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
            >
              For Farmers
            </a>
            <a
              href="#merchant"
              className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
            >
              For Merchants
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="hidden sm:inline-flex cursor-pointer"
              asChild
            >
              <Link to={"/login"}>Login</Link>
            </Button>
            <Button className="bg-primary cursor-pointer">Get Started</Button>
            {/* <ModeToggle /> */}
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative overflow-hidden bg-white py-20 lg:py-32 animate-in fade-in zoom-in duration-700">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <Badge
            variant="outline"
            className="mb-4 px-4 py-2 border-primary bg-primary/15 text-primary"
          >
            Digitalizing the Agriculture Supply Chain
          </Badge>{" "}
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
            Bridging the gap from <br />
            <span className="text-primary">Farm to Market.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            A specialized digital ecosystem empowerering farmers with financial
            clarity and connecting merchants directly to the source. Transparent
            pricing, better profits.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-bold text-white shadow-xl transition-transform hover:scale-105 sm:w-auto cursor-pointer">
              I am a Farmer <ArrowRight size={20} />
            </button>
            <button className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-8 py-4 text-lg font-bold text-slate-700 transition-all hover:border-primary hover:bg-primary/15 sm:w-auto cursor-pointer">
              I am a Merchant
            </button>
          </div>
        </div>
      </header>

      {/* --- MARKET TICKER --- */}
      {/* <div
        id="market"
        className="w-full bg-slate-900 py-4 overflow-hidden border-y border-slate-800"
      >
        <div className="flex whitespace-nowrap animate-pulse gap-12 px-6">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              Live Market Index:
            </span>
          </div>
          {[
            { crop: "Corn", price: "₱18.50/kg", trend: "+2.1%" },
            { crop: "Rice (Palay)", price: "₱22.00/kg", trend: "-0.5%" },
            { crop: "Sugar", price: "₱44.00/kg", trend: "+1.2%" },
            { crop: "Soybeans", price: "₱31.20/kg", trend: "+4.0%" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-white font-medium">{item.crop}</span>
              <span className="text-emerald-400 font-bold">{item.price}</span>
              <span
                className={`text-[10px] ${
                  item.trend.includes("+") ? "text-emerald-500" : "text-red-400"
                }`}
              >
                {item.trend}
              </span>
            </div>
          ))}
        </div>
      </div> */}

      {/* --- DUAL PATHWAY SECTION --- */}
      <section className="w-full bg-secondary">
        <div className="max-w-7xl mx-auto px-6 pb-24 pt-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">
            Tailored Experiences for Every Role
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Farmer Path */}
            <Card
              id="farmer"
              className="border-emerald-100 shadow-xl shadow-emerald-900/5 relative overflow-hidden group"
            >
              {/* <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Sprout size={120} />
            </div> */}
              <CardHeader>
                <div className="w-12 h-12 bg-primary/30 rounded-xl flex items-center justify-center text-primary mb-4">
                  <TrendingUp size={24} />
                </div>
                <CardTitle className="text-2xl">Empowering Farmers</CardTitle>
                <CardDescription>
                  Comprehensive tools to manage your farm as a business.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/15 p-2 rounded-lg text-primary">
                    <Wallet size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">
                      Income & Outcome Tracking
                    </h4>
                    <p className="text-sm text-slate-500">
                      Log every expense and sale with our simplified ledger
                      system.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/15 p-2 rounded-lg text-primary">
                    <BarChart3 size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">
                      Market Price Analytics
                    </h4>
                    <p className="text-sm text-slate-500">
                      See benchmark prices updated by regional administrators.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/15 p-2 rounded-lg text-primary">
                    <LineChart size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Profitability Reports</h4>
                    <p className="text-sm text-slate-500">
                      Automated harvest reports to help you plan for the next
                      season.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Merchant Path */}
            <Card
              id="merchant"
              className="border-blue-100 shadow-xl shadow-blue-900/5 relative overflow-hidden group"
            >
              {/* <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Store size={120} />
            </div> */}
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                  <Store size={24} />
                </div>
                <CardTitle className="text-2xl">Merchant Solutions</CardTitle>
                <CardDescription>
                  Source directly and manage your competitive buying rates.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Custom Buying Prices</h4>
                    <p className="text-sm text-slate-500">
                      Update your own prices to attract farmers in your
                      vicinity.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                    <LineChart size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Benchmark Feeds</h4>
                    <p className="text-sm text-slate-500">
                      Compare your offers against admin-verified market rates.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                    <ChevronRight size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Digital Procurement</h4>
                    <p className="text-sm text-slate-500">
                      Streamline how you receive and verify produce from your
                      farmers.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="px-8 py-12 bg-slate-900 text-slate-300">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              {/* <Sprout className="text-emerald-500" size={24} /> */}
              <span className="text-3xl italic font-bold text-white">
                AgriBridge
              </span>
            </div>
            <p className="max-w-xs">
              Making agriculture transparent, profitable, and accessible through
              technology.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Roles</h4>
            <ul className="space-y-2 text-sm">
              <li>Farmers</li>
              <li>Merchants</li>
              {/* <li>Admin Portal</li> */}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>About Us</li>
              <li>Contact</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
