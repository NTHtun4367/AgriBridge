import {
  Store,
  TrendingUp,
  BarChart3,
  ArrowRight,
  Wallet,
  ShieldCheck,
  ChevronRight,
  LineChart,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollReveal } from "@/components/ScrollReveal";
import Navigation from "@/common/home/Navigation";
import Footer from "@/common/home/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

// --- IMAGE IMPORTS ---
// Importing from the same directory as Home.tsx
import heroBg from "@/assets/farm.jpg";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      {/* --- NAVIGATION --- */}
      <Navigation />

      {/* --- HERO SECTION --- */}
      <header className="relative min-h-[90vh] flex items-center overflow-hidden py-20 lg:py-32">
        <div
          className="absolute inset-0 z-0 bg-cover bg-fixed bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
          <div className="animate-in slide-in-from-top-85 duration-800">
            <p className="mb-6 px-4 py-2 text-white text-sm font-bold">
              Digitalizing the Agriculture Supply Chain
            </p>
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-8xl text-white animate-in zoom-in slide-in-from-bottom-8 duration-1500 ease-out">
            Bridging the gap from <br />
            <span className="text-primary-foreground drop-shadow-lg">
              Farm to Market.
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-100 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            A specialized digital ecosystem empowering farmers with financial
            clarity and connecting merchants directly to the source. Transparent
            pricing, better profits.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 mt-12">
            <Button
              size="lg"
              className="rounded-full px-10 bg-primary hover:bg-primary/90 text-md h-14 shadow-xl hover:scale-110 transition-transform animate-in slide-in-from-left-35 duration-1000"
              onClick={() => navigate("/farmers-landing")}
            >
              I am Farmer <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-10 text-md h-14 bg-white/10 text-white border-white/40 hover:bg-white/20 backdrop-blur-md hover:scale-110 transition-transform  animate-in slide-in-from-right-35 duration-1000"
              onClick={() => navigate("/merchants-landing")}
            >
              I am Merchant
            </Button>
          </div>
        </div>
      </header>

      {/* --- DUAL PATHWAY SECTION --- */}
      <ScrollReveal>
        <section className="w-full bg-secondary">
          <div className="max-w-7xl mx-auto px-6 pb-24 pt-20">
            <h2 className="text-3xl font-bold text-center mb-12">
              Tailored Experiences for Every Role
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              {/* Farmer Path */}
              <ScrollReveal delay={100}>
                <Card
                  id="farmer"
                  className="shadow-xl shadow-emerald-900/5 relative overflow-hidden group transition-transform duration-300 hover:-translate-y-1"
                >
                  {/* <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Sprout size={120} />
            </div> */}
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/30 rounded-xl flex items-center justify-center text-primary mb-4">
                      <TrendingUp size={24} />
                    </div>
                    <CardTitle className="text-2xl">
                      Empowering Farmers
                    </CardTitle>
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
                          See standard prices updated by regional merchants.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/15 p-2 rounded-lg text-primary">
                        <LineChart size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">
                          Profitability Reports
                        </h4>
                        <p className="text-sm text-slate-500">
                          Automated harvest reports to help you plan for the
                          next season.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>

              {/* Merchant Path */}
              <ScrollReveal delay={100}>
                <Card
                  id="merchant"
                  className="shadow-xl shadow-blue-900/5 relative overflow-hidden group transition-transform duration-300 hover:-translate-y-1"
                >
                  {/* <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Store size={120} />
            </div> */}
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                      <Store size={24} />
                    </div>
                    <CardTitle className="text-2xl">
                      Merchant Solutions
                    </CardTitle>
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
                        <h4 className="font-bold text-sm">
                          Custom Buying Prices
                        </h4>
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
                        <h4 className="font-bold text-sm">Standard Prices</h4>
                        <p className="text-sm text-slate-500">
                          Compare your offers against admin-verified market
                          rates.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                        <ChevronRight size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">
                          Digital Buying/Collection
                        </h4>
                        <p className="text-sm text-slate-500">
                          Streamline how you receive and verify produce from
                          your farmers.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <Footer />
    </div>
  );
};

export default HomePage;
