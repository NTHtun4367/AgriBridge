import {
  Store,
  ShieldCheck,
  ArrowRight,
  BarChart3,
  Truck,
  Users,
  Search,
  LineChart,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/common/home/Navigation";
import Footer from "@/common/home/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useNavigate } from "react-router";

const MerchantLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
      {/* --- NAVIGATION --- */}
      <Navigation />

      {/* 1. Hero Section */}
      <section className="relative py-20 lg:py-32 text-center">
        {/* Themed background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent -z-10" />

        <ScrollReveal>
          <p className="mb-4 text-primary px-4 py-1 font-medium">
            Supply Chain Excellence
          </p>
          <h1 className="text-4xl md:text-7xl font-extrabold mb-6 tracking-tighter">
            Source Directly. <br />
            <span className="text-primary">Buy with Confidence.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 mb-10 px-6">
            AgriBridge connects professional merchants to a verified network of
            farmers. Set your rates, manage collections, and stabilize your
            supply chain with real-time data.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Button
              size="lg"
              className="rounded-full px-10 bg-primary hover:bg-primary/90 text-md h-14 shadow-xl hover:scale-110 transition-transform duration-500"
              onClick={() => navigate("/register?role=merchant")}
            >
              Create Account <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-10 text-md h-14 hover:scale-110 transition-transform duration-500"
              onClick={() => navigate("/markets")}
            >
              View Market Prices
            </Button>
          </div>
        </ScrollReveal>
      </section>

      {/* 2. Professional Tools Section */}
      <section className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <ScrollReveal delay={100}>
            <div className="space-y-10">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Modern Solutions for <br /> Bulk Sourcing
                </h2>
                <p className="text-slate-500 text-lg">
                  Stop relying on fragmented phone calls. Manage your entire
                  buying operation from a single dashboard.
                </p>
              </div>

              <div className="space-y-6">
                <MerchantFeature
                  icon={<LineChart />}
                  title="Dynamic Price Management"
                  desc="Set your custom buying rates based on regional demand. Your prices are broadcasted directly to farmers in your environment."
                />
                <MerchantFeature
                  icon={<Users />}
                  title="Focus on Relationships & Loyalty"
                  desc="Build long-term partnerships with a curated directory of local farmers. View historical yield data and reliability ratings to secure your supply chain with trusted partners."
                />
                <MerchantFeature
                  icon={<Truck />}
                  title="Digital Collection Logs"
                  desc="Eliminate paperwork. Log every bag received and every payment made with instant digital receipts."
                />
              </div>
            </div>
          </ScrollReveal>

          {/* Visual Mockup - Merchant View with Rotation Effect */}
          <ScrollReveal delay={300}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-primary/20 to-emerald-500/20 rounded-2xl blur-2xl opacity-50"></div>
              {/* Rotation class applied here to match Farmer page */}
              <Card className="relative shadow-2xl border-slate-200 transition-transform duration-500 ease-in-out rotate-2 group-hover:rotate-0 overflow-hidden bg-white dark:bg-slate-900">
                <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Store className="h-5 w-5 text-primary" />
                    <span className="font-medium tracking-tight uppercase text-xs">
                      Merchant Buying Portal
                    </span>
                  </div>
                  <Badge className="bg-primary text-primary-foreground border-none">
                    Live Market Sync
                  </Badge>
                </div>
                <CardContent className="p-10 space-y-8">
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      Your Active Buying Rate (Rice)
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-slate-900 dark:text-white">
                        0.98 MMK
                      </span>
                      <span className="text-sm text-slate-500">/bag</span>
                      <Badge className="ml-auto bg-green-100 text-green-700 border-none">
                        +2% vs Market
                      </Badge>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      Recent Collection Logs
                    </p>
                    <div className="space-y-3">
                      <CollectionItem
                        name="U Myint Kyaw"
                        qty="50 Bags"
                        status="Verified"
                      />
                      <CollectionItem
                        name="Daw Hla"
                        qty="120 Bags"
                        status="Pending"
                      />
                      <CollectionItem
                        name="Ko Zaw"
                        qty="85 Bags"
                        status="Verified"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3. Global Trust Section (Single Column) */}
      <section className="py-24 max-w-4xl mx-auto px-6 text-center">
        <ScrollReveal>
          <div className="inline-flex p-3 bg-primary/10 rounded-2xl text-primary mb-6">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Built on Integrity
          </h2>
          <p className="text-slate-500 text-lg mb-16">
            AgriBridge isn't just a platform; it's a verification layer for
            Myanmar's agriculture. We ensure that every transaction builds a
            data history that benefits both the buyer and the seller.
          </p>

          <div className="grid sm:grid-cols-2 gap-8 text-left">
            <div className="p-8 rounded-4xl bg-slate-900 text-white space-y-4 shadow-xl">
              <Search className="h-8 w-8 text-primary" />
              <h4 className="text-xl font-bold">Source Transparency</h4>
              <p className="text-slate-400 text-sm">
                Every farmer on our platform is verified. Know the origin of
                your produce and build long-term buying partnerships.
              </p>
            </div>
            <div className="p-8 rounded-4xl bg-primary text-white space-y-4 shadow-xl shadow-primary/20">
              <BarChart3 className="h-8 w-8 text-white" />
              <h4 className="text-xl font-bold">Market Competitiveness</h4>
              <p className="text-primary-foreground/80 text-sm">
                Compare your rates against national averages. Stay competitive
                and attract the best harvests in your region.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 4. Final CTA */}
      <section className="py-24 text-center px-6">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
              Ready to optimize your <br /> supply chain?
            </h2>
            <p className="text-slate-500 mb-10 text-lg">
              Join the growing network of merchants digitizing their collection
              points and securing high-quality produce directly from the source.
            </p>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 px-10 py-7 text-lg rounded-full hover:scale-110 transition-transform duration-500"
              onClick={() => navigate("/register?role=merchant")}
            >
              Register as a Merchant
            </Button>
          </div>
        </ScrollReveal>
      </section>

      {/* --- FOOTER --- */}
      <Footer />
    </div>
  );
};

// --- Helper Components ---

function MerchantFeature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-5 group p-4 rounded-xl transition-colors hover:bg-white/50 dark:hover:bg-slate-800">
      <div className="bg-primary/10 p-4 rounded-2xl h-fit text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <div className="space-y-1">
        <h4 className="font-bold text-xl text-slate-900 dark:text-white">
          {title}
        </h4>
        <p className="text-slate-600 leading-relaxed text-sm">{desc}</p>
      </div>
    </div>
  );
}

function CollectionItem({
  name,
  qty,
  status,
}: {
  name: string;
  qty: string;
  status: "Verified" | "Pending";
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
      <div className="flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-primary" />
        <span className="font-bold text-sm text-slate-700 dark:text-slate-200">
          {name}
        </span>
      </div>
      <span className="text-xs text-slate-500 font-medium">{qty}</span>
      <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
        {status === "Verified" ? (
          <span className="text-emerald-600 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> {status}
          </span>
        ) : (
          <span className="text-amber-500">{status}</span>
        )}
      </div>
    </div>
  );
}

export default MerchantLanding;
