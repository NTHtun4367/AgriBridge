import { Users, CheckCircle2, Wheat } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/common/home/Navigation";
import Footer from "@/common/home/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useTranslation } from "react-i18next";

const AboutPage = () => {
  const { t } = useTranslation();

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
              {t("about.hero_badge")}
            </p>
          </div>
          <h1 className="text-4xl md:text-7xl font-extrabold mb-6 tracking-tight leading-[1.1] mm:text-[48px] mm:leading-loose">
            <span className="block mm:pb-1">{t("about.hero_title_line1")}</span>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-green-600 mm:py-4 mm:leading-loose">
              {t("about.hero_title_highlight")}
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 mb-10 px-6 leading-relaxed mm:leading-loose">
            {t("about.hero_desc")}
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
                <h2 className="text-3xl mm:text-[40px] md:text-5xl font-bold leading-tight">
                  {t("about.why_title_line1")} <br />
                  {t("about.why_title_line2")}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mm:leading-loose">
                  {t("about.why_desc1")}
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mm:leading-loose">
                  {t("about.why_desc2_start")}{" "}
                  <strong>"{t("about.bridge_quote")}"</strong>{" "}
                  {t("about.why_desc2_end")}
                </p>

                <div className="grid sm:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-primary h-5 w-5 shrink-0" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {t("about.feature1")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-primary h-5 w-5 shrink-0" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {t("about.feature2")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-primary h-5 w-5 shrink-0" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {t("about.feature3")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-primary h-5 w-5 shrink-0" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {t("about.feature4")}
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
                      {t("about.card_version")}
                    </span>
                  </div>
                  <CardContent className="p-10 space-y-8">
                    <div className="space-y-2 text-center">
                      <p className="text-sm font-bold text-primary uppercase tracking-tighter">
                        {t("about.stats_label")}
                      </p>
                      <p className="text-5xl font-black tabular-nums">150%</p>
                      <p className="text-slate-500 text-sm">
                        {t("about.stats_desc")}
                      </p>
                    </div>
                    <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mm:mb-5">
                        <Users className="text-slate-600 dark:text-slate-400" />
                      </div>
                      <div className="mm:space-y-0">
                        <p className="text-sm font-bold mm:leading-loose">
                          {t("about.approach_title")}
                        </p>
                        <p className="text-xs text-slate-500 mm:leading-loose">
                          {t("about.approach_desc")}
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
      <Footer />
    </div>
  );
};

export default AboutPage;
