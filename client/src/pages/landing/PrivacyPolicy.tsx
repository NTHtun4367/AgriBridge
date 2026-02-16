import {
  ShieldCheck,
  Lock,
  EyeOff,
  Database,
  RefreshCw,
  Wheat,
  Scale,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/common/home/Navigation";
import Footer from "@/common/home/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useTranslation } from "react-i18next";

export default function PrivacyPolicy() {
  const { t } = useTranslation();
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
            <p className="px-4 py-1.5 text-primary text-xl uppercase tracking-widest font-bold mm:mt-8">
              {t("privacy.hero_badge")}
            </p>
          </div>
          <h1 className="text-4xl mm:text-[48px] md:text-6xl font-black mb-4 tracking-tighter">
            {t("privacy.hero_title_start")}{" "}
            <span className="text-primary">
              {t("privacy.hero_title_highlight")}
            </span>
          </h1>
          <p className="text-slate-500 font-medium italic mm:leading-loose mm:mt-12">
            {t("privacy.effective_date")}: {lastUpdated}
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
              <h2 className="text-2xl font-bold">
                {t("privacy.commitment_title")}
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed mm:leading-loose">
                {t("privacy.commitment_desc")}
              </p>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden">
            <div className="h-2 bg-linear-to-r from-primary via-emerald-500 to-primary w-full" />
            <CardContent className="p-8 md:p-16 space-y-16">
              {/* Section 1: Collection */}
              <div className="space-y-3">
                <SectionHeader
                  icon={<Database />}
                  title={t("privacy.section1_title")}
                />
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg mm:leading-loose">
                  {t("privacy.section1_desc")}
                </p>
                <div className="grid gap-4">
                  <DataRow
                    label={t("privacy.data_profile_label")}
                    text={t("privacy.data_profile_text")}
                  />
                  <DataRow
                    label={t("privacy.data_logs_label")}
                    text={t("privacy.data_logs_text")}
                  />
                  <DataRow
                    label={t("privacy.data_visual_label")}
                    text={t("privacy.data_visual_text")}
                  />
                </div>
              </div>

              {/* Section 2: Usage */}
              <div className="space-y-6 border-t border-slate-100 dark:border-slate-800 pt-6">
                <SectionHeader
                  icon={<RefreshCw />}
                  title={t("privacy.section2_title")}
                />
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t("privacy.section2_desc")}
                </p>
                <ul className="space-y-4">
                  <li className="flex gap-4">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-1" />
                    <div>
                      <span className="font-bold block">
                        {t("privacy.usage_item1_title")}
                      </span>
                      <span className="text-sm text-slate-500">
                        {t("privacy.usage_item1_desc")}
                      </span>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-1" />
                    <div>
                      <span className="font-bold block">
                        {t("privacy.usage_item2_title")}
                      </span>
                      <span className="text-sm text-slate-500">
                        {t("privacy.usage_item2_desc")}
                      </span>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Section 3: Security */}
              <div className="space-y-6 border-t border-slate-100 dark:border-slate-800 pt-6">
                <SectionHeader
                  icon={<Lock />}
                  title={t("privacy.section3_title")}
                />
                <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
                  <p className="text-slate-700 dark:text-slate-300 font-medium">
                    {t("privacy.security_highlight")}
                  </p>
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-900 dark:text-white">
                    <Scale className="h-5 w-5 text-primary" />
                    <span>{t("privacy.security_promise")}</span>
                  </div>
                </div>
              </div>

              {/* Section 4: Rights */}
              <div className="space-y-6 border-t border-slate-100 dark:border-slate-800 pt-6">
                <SectionHeader
                  icon={<EyeOff />}
                  title={t("privacy.section4_title")}
                />
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t("privacy.section4_desc")}
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-1" />
                    <span className="font-medium">
                      {t("privacy.rights_item1")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-1" />
                    <span className="font-medium">
                      {t("privacy.rights_item2")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Closing Quote */}
              <div className="pt-12 text-center">
                <p className="text-sm italic text-slate-400 max-w-md mx-auto mm:leading-loose">
                  {t("privacy.closing_quote")}
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
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mm:leading-loose mm:mb-0">
        {text}
      </p>
    </div>
  );
}
