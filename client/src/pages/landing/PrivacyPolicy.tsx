import {
  ShieldCheck,
  Lock,
  EyeOff,
  Database,
  FileText,
  RefreshCw,
  Trash2,
  Wheat,
  Scale,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/common/home/Navigation";
import Footer from "@/common/home/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function PrivacyPolicy() {
  const lastUpdated = "January 2026";

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
      {/* --- NAVIGATION --- */}
      <Navigation />

      {/* 1. Hero Section */}
      <section className="relative py-16 md:py-24 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent -z-10" />

        <ScrollReveal>
          <div className="flex justify-center mb-6">
            <Badge
              variant="outline"
              className="px-4 py-1.5 border-primary/20 bg-primary/5 text-primary text-xs uppercase tracking-widest font-bold"
            >
              Trust & Transparency
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">
            Protecting Your{" "}
            <span className="text-primary">Digital Harvest</span>
          </h1>
          <p className="text-slate-500 font-medium italic">
            Effective Date: {lastUpdated}
          </p>
        </ScrollReveal>
      </section>

      {/* 2. Main Content (Single Column) */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <ScrollReveal delay={100}>
          {/* Summary Callout */}
          <div className="mb-12 p-8 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
              <Wheat size={100} />
            </div>
            <div className="relative z-10 text-center space-y-4">
              <div className="flex justify-center mb-2">
                <ShieldCheck className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">The Agri-Trust Commitment</h2>
              <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
                We believe your farm data is as valuable as your land.
                AgriBridge is built to be your trusted digital partner, ensuring
                your records are never sold, never leaked, and always under your
                control.
              </p>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden">
            <div className="h-2 bg-linear-to-r from-primary via-emerald-500 to-primary w-full" />
            <CardContent className="p-8 md:p-16 space-y-16">
              {/* Section 1: Collection */}
              <div className="space-y-6">
                <SectionHeader
                  icon={<Database />}
                  title="1. The Information We Guard"
                />
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                  To provide you with accurate profit analysis and seasonal
                  history, we only record the details you choose to share:
                </p>
                <div className="grid gap-4">
                  <DataRow
                    label="Profile"
                    text="Your name and phone number for secure access."
                  />
                  <DataRow
                    label="Farm Logs"
                    text="Expenses for fertilizer, seeds, labor, and your total income from harvests."
                  />
                  <DataRow
                    label="Visual Records"
                    text="Images of receipts or bills you upload for your own bookkeeping."
                  />
                </div>
              </div>

              {/* Section 2: Usage */}
              <div className="space-y-6 border-t border-slate-100 dark:border-slate-800 pt-12">
                <SectionHeader
                  icon={<RefreshCw />}
                  title="2. Cultivating Your Growth"
                />
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  We use your data strictly to help you run a more profitable
                  farm business. We use it to:
                </p>
                <ul className="space-y-4">
                  <li className="flex gap-4">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-1" />
                    <div>
                      <span className="font-bold block">
                        Calculate Your Real Profit
                      </span>
                      <span className="text-sm text-slate-500">
                        Turning raw numbers into clear reports so you know
                        exactly how much you earned.
                      </span>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-1" />
                    <div>
                      <span className="font-bold block">
                        Secure Your Records
                      </span>
                      <span className="text-sm text-slate-500">
                        Backing up your digital book so you never lose your
                        data, even if your phone is damaged.
                      </span>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Section 3: Security */}
              <div className="space-y-6 border-t border-slate-100 dark:border-slate-800 pt-12">
                <SectionHeader
                  icon={<Lock />}
                  title="3. A Digital Fence Around Your Records"
                />
                <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
                  <p className="text-slate-700 dark:text-slate-300 font-medium">
                    We use industrial-grade encryption—think of it as a
                    high-security lock on your digital barn.
                  </p>
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-900 dark:text-white">
                    <Scale className="h-5 w-5 text-primary" />
                    <span>
                      No data is ever sold to third-party merchants or
                      advertisers.
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 4: Rights */}
              <div className="space-y-6 border-t border-slate-100 dark:border-slate-800 pt-12">
                <SectionHeader icon={<EyeOff />} title="4. You Hold the Keys" />
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  You are the owner of your information. AgriBridge is simply
                  the tool. You have the right to:
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 px-5 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold">
                    <FileText className="h-4 w-4" /> Review All Entries
                  </div>
                  <div className="flex items-center gap-2 px-5 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold">
                    <Trash2 className="h-4 w-4 text-red-500" /> Permanently
                    Delete
                  </div>
                </div>
              </div>

              {/* Closing Quote */}
              <div className="pt-12 text-center">
                <p className="text-sm italic text-slate-400 max-w-md mx-auto">
                  "AgriBridge honors the tradition of Myanmar's farming families
                  by protecting their digital future."
                </p>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>

      {/* --- FOOTER --- */}
      <Footer />
    </div>
  );
}

// Helper Components
function SectionHeader({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="p-3 bg-primary/10 rounded-2xl text-primary">{icon}</div>
      <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
        {title}
      </h2>
    </div>
  );
}

function DataRow({ label, text }: { label: string; text: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
      <Badge className="w-fit px-3 py-1 bg-white dark:bg-slate-700 shadow-sm border-none font-bold uppercase text-[10px] tracking-widest text-primary shrink-0">
        {label}
      </Badge>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        {text}
      </p>
    </div>
  );
}
