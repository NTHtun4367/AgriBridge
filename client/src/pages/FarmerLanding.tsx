import {
  Calculator,
  ShieldCheck,
  ArrowRight,
  ClipboardList,
  BarChart3,
  Globe,
  MessageSquare,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/common/home/Navigation";
import Footer from "@/common/home/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useNavigate } from "react-router";

const FarmerLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* --- NAVIGATION --- */}
      <Navigation />

      {/* 1. Hero Section */}
      <section className=" py-20 lg:py-32 text-center animate-in slide-in-from-bottom-15 duration-1000">
        <Badge
          variant="outline"
          className="mb-4 border-primary text-primary px-4 py-1 font-semibold"
        >
          Empowering Farmers
        </Badge>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Maximize your harvest <br />
          <span className="text-primary">with data-driven farming.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-slate-600 mb-10">
          AgriBridge provides comprehensive tools to manage your farm as a
          business. Track finances, monitor national trends, and connect
          directly to the source.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            size="lg"
            className="rounded-full px-8 bg-primary hover:bg-primary/90 text-md h-12"
            onClick={() => navigate("/register")}
          >
            Create Account <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full px-8 text-md h-12"
            onClick={() => navigate("/markets")}
          >
            View Market Prices
          </Button>
        </div>
      </section>

      {/* 2. Detailed Features Section */}
      <ScrollReveal delay={100}>
        <section className="bg-secondary">
          <div className="py-24 max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">
                    Financial Clarity & Market Access
                  </h2>
                  <p className="text-slate-500 text-lg">
                    Everything you need to move from manual logging to a
                    professional digital ecosystem.
                  </p>
                </div>

                <div className="grid gap-6">
                  {/* Feature: Income & Outcome */}
                  <div className="flex gap-4 p-4 rounded-xl transition-colors hover:bg-slate-50">
                    <div className="bg-primary/10 p-3 rounded-lg h-fit">
                      <Calculator className="text-primary w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base">
                        Income & Outcome Tracking
                      </h4>
                      {/* Font size changed to small (text-sm) */}
                      <p className="text-slate-600 text-sm">
                        Log every expense and sale with our simplified ledger.
                        Keep records of sales income and{" "}
                        <strong>automatically calculate net profit</strong>{" "}
                        without manual math.
                      </p>
                    </div>
                  </div>

                  {/* Feature: Seasonal Records */}
                  <div className="flex gap-4 p-4 rounded-xl transition-colors hover:bg-slate-50">
                    <div className="bg-primary/10 p-3 rounded-lg h-fit">
                      <Calendar className="text-primary w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base">
                        Seasonal & Annual Summaries
                      </h4>
                      {/* Font size changed to small (text-sm) */}
                      <p className="text-slate-600 text-sm">
                        Record your expenses for each farming season and
                        conveniently view a detailed{" "}
                        <strong>annual expense summary</strong> to plan for next
                        year.
                      </p>
                    </div>
                  </div>

                  {/* Feature: National Prices */}
                  <div className="flex gap-4 p-4 rounded-xl transition-colors hover:bg-slate-50">
                    <div className="bg-primary/10 p-3 rounded-lg h-fit">
                      <Globe className="text-primary w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base">
                        Country-wide Market Analytics
                      </h4>
                      {/* Font size changed to small (text-sm) */}
                      <p className="text-slate-600 text-sm">
                        View commodity prices from markets{" "}
                        <strong>across the entire country</strong>. Monitor
                        benchmark prices updated daily by regional
                        administrators.
                      </p>
                    </div>
                  </div>

                  {/* Feature: Merchant Communication */}
                  <div className="flex gap-4 p-4 rounded-xl transition-colors hover:bg-slate-50">
                    <div className="bg-primary/10 p-3 rounded-lg h-fit">
                      <MessageSquare className="text-primary w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base">
                        Direct Communication
                      </h4>
                      {/* Font size changed to small (text-sm) */}
                      <p className="text-slate-600 text-sm">
                        Eliminate middlemen. You can easily{" "}
                        <strong>communicate directly with merchants</strong>
                        to negotiate better deals for your harvest.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual Mockup Component with Hover Rotation */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-linear-to-r from-primary/20 to-blue-500/20 rounded-2xl blur-2xl"></div>
                {/* Added transition and hover:rotate-2 */}
                <Card className="relative shadow-2xl border-slate-200 transition-transform duration-500 ease-in-out rotate-2 group-hover:rotate-0">
                  <CardHeader className="bg-slate-900 text-white rounded-t-xl py-4">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm font-medium">
                        Profitability Report: Season 2025
                      </CardTitle>
                      <Badge className="bg-green-500">Auto-Calculated</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      {/* Summary Stats Preview */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-slate-500 uppercase font-bold">
                            Annual Expenses
                          </p>
                          <p className="text-xl font-bold text-red-500">
                            $2,840.00
                          </p>
                        </div>
                        <div className="space-y-1 text-right">
                          <p className="text-xs text-slate-500 uppercase font-bold">
                            Total Sales
                          </p>
                          <p className="text-xl font-bold text-green-600">
                            $7,120.00
                          </p>
                        </div>
                      </div>

                      {/* Benchmark Preview */}
                      <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-slate-700">
                          <TrendingUp className="w-4 h-4 text-primary" />{" "}
                          National Market Price (Rice)
                        </div>
                        <div className="flex justify-between items-end">
                          <p className="text-2xl font-bold text-slate-900">
                            $0.95
                            <span className="text-sm font-normal text-slate-500">
                              /kg
                            </span>
                          </p>
                          <p className="text-xs text-blue-600">
                            +4% from last week
                          </p>
                        </div>
                      </div>

                      {/* Net Profit Preview */}
                      <div className="bg-green-50 p-6 rounded-xl text-center border border-green-100">
                        <p className="text-sm text-green-800 font-medium mb-1">
                          Net Seasonal Profit
                        </p>
                        <p className="text-4xl font-black text-green-700">
                          $4,280.00
                        </p>
                        <div className="mt-4 flex justify-center gap-2">
                          <Badge
                            variant="secondary"
                            className="bg-green-200/50 text-green-800 border-none"
                          >
                            Record Logged
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="bg-green-200/50 text-green-800 border-none"
                          >
                            Verified Sale
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 3. The Trust Factor */}
      <ScrollReveal delay={100}>
        <section className="py-20 bg-slate-900 text-white">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-12">
              How AgriBridge Protects Your Business
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <Card className="bg-slate-800 border-slate-700 text-white text-center shadow-lg">
                <CardHeader>
                  <ShieldCheck className="w-10 h-10 text-primary mx-auto mb-4" />
                  <CardTitle className="text-xl">Admin Verified</CardTitle>
                  <CardDescription className="text-slate-400">
                    Every price update and merchant account is manually verified
                    by our team to prevent fraud.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-slate-800 border-slate-700 text-white text-center shadow-lg">
                <CardHeader>
                  <BarChart3 className="w-10 h-10 text-primary mx-auto mb-4" />
                  <CardTitle className="text-xl">Automated Reporting</CardTitle>
                  <CardDescription className="text-slate-400">
                    Generate instant profitability reports to help you plan your
                    next season with data-driven confidence.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-slate-800 border-slate-700 text-white text-center shadow-lg">
                <CardHeader>
                  <ClipboardList className="w-10 h-10 text-primary mx-auto mb-4" />
                  <CardTitle className="text-xl">Ledger Integrity</CardTitle>
                  <CardDescription className="text-slate-400">
                    Your digital records are kept safe and organized, making it
                    easier to apply for agricultural loans.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 4. Final CTA */}
      <ScrollReveal delay={100}>
        <section className="py-24 text-center px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to digitalize your farm?
          </h2>
          <p className="text-slate-500 mb-10 max-w-lg mx-auto">
            Join a community of farmers who are using data to grow their profits
            and secure their future.
          </p>
          <Button
            className="bg-primary px-8 py-7 text-lg rounded-full"
            onClick={() => navigate("/register")}
          >
            Register as a Farmer
          </Button>
        </section>
      </ScrollReveal>

      {/* --- FOOTER --- */}
      <Footer />
    </div>
  );
};

export default FarmerLanding;
