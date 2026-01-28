import {
  Users,
  // Target,
  CheckCircle2,
  // ArrowRight,
  // ShieldCheck,
  Wheat,
  // Landmark,
} from "lucide-react";
// import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/common/home/Navigation";
import Footer from "@/common/home/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
// import { useNavigate } from "react-router";

const AboutPage = () => {
  // const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
      {/* --- NAVIGATION --- */}
      <Navigation />

      {/* 1. Hero Section: The Vision */}
      <section className="relative py-20 lg:py-32 text-center overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent -z-10" />

        <ScrollReveal>
          <div className="flex justify-center mb-6">
            <p className="px-4 py-1.5 text-primary text-xl uppercase tracking-widest font-bold">
              Our Vision & Mission
            </p>
          </div>
          <h1 className="text-4xl md:text-7xl font-extrabold mb-6 tracking-tight leading-[1.1]">
            Digitalizing the heart of <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-green-600">
              Myanmar's Agriculture.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 mb-10 px-6 leading-relaxed">
            AgriBridge isn't just a ledger; it's a commitment to empower the
            millions of farmers who feed our nation with the data they need to
            thrive.
          </p>
        </ScrollReveal>
      </section>

      {/* 2. The Transformation (The Bridge) */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left Side: Content */}
            <ScrollReveal delay={100}>
              <div className="space-y-8">
                <div className="inline-flex p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                  <Wheat className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                  Why we built <br /> AgriBridge
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                  For generations, Myanmar's farmers have managed complex
                  seasonal cycles using nothing but memory and paper. In a
                  rapidly changing market, this lack of data created a gap.
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                  We built the <strong>"Bridge"</strong> to connect hard work
                  with smart data, allowing farmers to see their true net profit
                  in real-time.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-primary h-5 w-5 shrink-0" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Financial Clarity
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-primary h-5 w-5 shrink-0" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Market Transparency
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-primary h-5 w-5 shrink-0" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Verified Merchants
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-primary h-5 w-5 shrink-0" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Secure Storage
                    </span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Right Side: Decorative Card */}
            <ScrollReveal delay={300}>
              <div className="relative group">
                <div className="absolute -inset-4 bg-linear-to-r from-primary/20 to-blue-500/20 rounded-[3rem] blur-3xl opacity-50 group-hover:opacity-80 transition-opacity" />
                <Card className="relative border-none shadow-[0_20px_50px_rgba(0,0,0,0.1)] bg-white dark:bg-slate-900 -rotate-3 group-hover:rotate-0 transition-transform duration-700 overflow-hidden rounded-4xl">
                  <div className="bg-slate-950 p-6 text-white flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest opacity-50">
                      AgriBridge Analytics v2.0
                    </span>
                  </div>
                  <CardContent className="p-10 space-y-8">
                    <div className="space-y-2 text-center">
                      <p className="text-sm font-bold text-primary uppercase tracking-tighter">
                        Impact Statistics
                      </p>
                      <p className="text-5xl font-black tabular-nums">150%</p>
                      <p className="text-slate-500 text-sm">
                        Average increase in financial awareness
                      </p>
                    </div>
                    <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <Users className="text-slate-600 dark:text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">
                          Farmer First Approach
                        </p>
                        <p className="text-xs text-slate-500">
                          Built by developers who grew up in farming families.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 3. Core Values Grid */}
      {/* <section className="py-24 max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              The Values that Drive Us
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              Every line of code we write is designed to protect and promote the
              interests of local farmers.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8">
          <ValueCard
            icon={<ShieldCheck />}
            title="Uncompromising Trust"
            description="We verify every merchant and price point manually. In the AgriBridge ecosystem, your data is your power, and we keep it safe."
          />
          <ValueCard
            icon={<Target />}
            title="Precision Tools"
            description="From automated net-profit calculations to seasonal comparisons, our tools are built for the specific needs of Myanmar's climate."
          />
          <ValueCard
            icon={<Landmark />}
            title="Localized Innovation"
            description="We don't just build software; we build local solutions that work offline, support MMK currency, and respect local traditions."
          />
        </div>
      </section> */}

      {/* 4. Security & Trust Banner */}
      {/* <ScrollReveal>
        <div className="px-6 mb-24">
          <div className="max-w-7xl mx-auto bg-slate-900 rounded-[3rem] p-12 lg:p-20 relative overflow-hidden text-center text-white">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            <div className="relative z-10 space-y-8">
              <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-primary/30">
                <ShieldCheck className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl md:text-5xl font-bold">
                Your Privacy, Guaranteed.
              </h2>
              <p className="max-w-2xl mx-auto text-slate-400 text-lg">
                We use AES-256 industrial-grade encryption. Your financial
                entries, receipts, and seasonal strategies are visible only to
                you. We are a tool for you, not a spy for others.
              </p>
              <div className="flex flex-wrap justify-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                  <div className="w-2 h-2 rounded-full bg-green-500" /> Verified
                  Merchant Database
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                  <div className="w-2 h-2 rounded-full bg-green-500" />{" "}
                  End-to-End Encryption
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal> */}

      {/* 5. Final CTA */}
      {/* <ScrollReveal>
        <section className="py-24 text-center px-6">
          <h2 className="text-3xl md:text-6xl font-black mb-8 tracking-tighter">
            Ready to grow <span className="text-primary">smarter?</span>
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              className="bg-primary px-12 py-8 text-xl rounded-full hover:scale-110 transition-transform duration-500 shadow-2xl"
              onClick={() => navigate("/register")}
            >
              Start Your Journey <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-12 py-8 text-xl rounded-full border-2 hover:bg-slate-50 transition-colors"
              onClick={() => navigate("/contact")}
            >
              Contact Our Team
            </Button>
          </div>
        </section>
      </ScrollReveal> */}

      {/* --- FOOTER --- */}
      <Footer />
    </div>
  );
};

// Internal Sub-component for Value Cards
// function ValueCard({
//   icon,
//   title,
//   description,
// }: {
//   icon: React.ReactNode;
//   title: string;
//   description: string;
// }) {
//   return (
//     <ScrollReveal>
//       <div className="p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 group h-full">
//         <div className="mb-8 p-5 bg-primary/10 w-fit rounded-3xl text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 transform group-hover:rotate-6">
//           {icon}
//         </div>
//         <h3 className="text-2xl font-bold mb-4">{title}</h3>
//         <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-base">
//           {description}
//         </p>
//       </div>
//     </ScrollReveal>
//   );
// }

export default AboutPage;
