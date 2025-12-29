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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/ScrollReveal";
import Navigation from "@/common/home/Navigation";
import Footer from "@/common/home/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router"

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* --- NAVIGATION --- */}
      <Navigation />

      {/* --- HERO SECTION --- */}
      <header className="relative overflow-hidden py-20 lg:py-32 animate-in slide-in-from-bottom-15 duration-1000">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <Badge
            variant="outline"
            className="mb-4 px-4 py-2 border-primary bg-primary/15 text-primary"
          >
            Digitalizing the Agriculture Supply Chain
          </Badge>
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Bridging the gap from <br />
            <span className="text-primary">Farm to Market.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            A specialized digital ecosystem empowerering farmers with financial
            clarity and connecting merchants directly to the source. Transparent
            pricing, better profits.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
            <Button
              size="lg"
              className="rounded-full px-8 bg-primary hover:bg-primary/90 text-md h-12"
              onClick={() => navigate("/farmers-landing")}
            >
              I am Farmer <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 text-md h-12"
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
                          See benchmark prices updated by regional
                          administrators.
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
                        <h4 className="font-bold text-sm">Benchmark Feeds</h4>
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
                          Digital Procurement
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

      {/* --- FOOTER --- */}
      <Footer />
    </div>
  );
};

export default HomePage;
