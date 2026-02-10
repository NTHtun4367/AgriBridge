import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navigation />

      {/* 1. Hero Section */}
      <section className=" py-20 lg:py-32 text-center animate-in slide-in-from-bottom-15 duration-1000">
        <p className="mb-4 text-primary px-4 py-1 font-medium mm:leading-loose">
          {t("farmer.hero_badge")}
        </p>
        <h1 className="text-4xl mm:text-[55px] md:text-6xl font-extrabold mb-6 tracking-tight mm:mb-12">
          <span className="block mm:mb-12">{t("farmer.hero_title")}</span>
          <span className="text-primary">{t("farmer.hero_title_accent")}</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-slate-600 mb-10 mm:leading-loose">
          {t("farmer.hero_desc")}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Button
            size="lg"
            className="rounded-full px-10 bg-primary hover:bg-primary/90 text-md h-14 shadow-xl hover:scale-110 transition-transform duration-500"
            onClick={() => navigate("/register")}
          >
            {t("farmer.cta_create")} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full px-10 text-md h-14 hover:scale-110 transition-transform duration-500"
            onClick={() => navigate("/markets")}
          >
            {t("farmer.cta_markets")}
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
                  <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white mm:leading-loose">
                    {t("farmer.features_heading")}
                  </h2>
                  <p className="text-slate-500 text-lg mm:leading-loose">
                    {t("farmer.features_subheading")}
                  </p>
                </div>

                <div className="grid gap-6">
                  <FarmerFeature
                    icon={<Calculator className="w-5 h-5" />}
                    title={t("farmer.feature_income_title")}
                    desc={t("farmer.feature_income_desc")}
                  />
                  <FarmerFeature
                    icon={<Calendar className="w-5 h-5" />}
                    title={t("farmer.feature_seasonal_title")}
                    desc={t("farmer.feature_seasonal_desc")}
                  />
                  <FarmerFeature
                    icon={<Globe className="w-5 h-5" />}
                    title={t("farmer.feature_market_title")}
                    desc={t("farmer.feature_market_desc")}
                  />
                  <FarmerFeature
                    icon={<MessageSquare className="w-5 h-5" />}
                    title={t("farmer.feature_direct_title")}
                    desc={t("farmer.feature_direct_desc")}
                  />
                </div>
              </div>

              {/* Visual Mockup */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-linear-to-r from-primary/20 to-blue-500/20 rounded-2xl blur-2xl opacity-50"></div>
                <Card className="relative shadow-2xl border-slate-200 transition-transform duration-500 ease-in-out rotate-2 group-hover:rotate-0 overflow-hidden bg-white dark:bg-slate-900">
                  <CardHeader className="bg-slate-900 text-white py-4">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm font-medium">
                        {t("farmer.mockup_title")}
                      </CardTitle>
                      <Badge className="bg-green-500">
                        {t("farmer.mockup_badge")}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-slate-500 uppercase font-bold">
                            {t("farmer.mockup_label_exp")}
                          </p>
                          <p className="text-xl font-bold text-red-500">
                            {t("farmer.mockup_val_exp")}
                          </p>
                        </div>
                        <div className="space-y-1 text-right">
                          <p className="text-xs text-slate-500 uppercase font-bold">
                            {t("farmer.mockup_label_sales")}
                          </p>
                          <p className="text-xl font-bold text-green-600">
                            {t("farmer.mockup_val_sales")}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                          <TrendingUp className="w-4 h-4 text-primary" />
                          {t("farmer.mockup_market_price")}
                        </div>
                        <div className="flex justify-between items-end">
                          <p className="text-2xl font-bold">
                            {t("farmer.mockup_val_market")}
                            <span className="text-sm font-normal text-slate-500 ml-1">
                              {t("farmer.mockup_unit")}
                            </span>
                          </p>
                          <p className="text-xs text-blue-600">
                            {t("farmer.mockup_trend")}
                          </p>
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl text-center border border-green-100 dark:border-green-900/30">
                        <p className="text-sm text-green-800 dark:text-green-400 font-medium mb-1">
                          {t("farmer.mockup_net_profit_label")}
                        </p>
                        <p className="text-4xl font-black text-green-700 dark:text-green-500">
                          {t("farmer.mockup_net_profit_val")}
                        </p>
                        <div className="mt-4 flex justify-center gap-2">
                          <Badge
                            variant="secondary"
                            className="bg-green-200/50 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-none"
                          >
                            {t("farmer.mockup_badge_logged")}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="bg-green-200/50 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-none"
                          >
                            {t("farmer.mockup_badge_verified")}
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
              {t("farmer.trust_heading")}
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <TrustCard
                icon={
                  <ShieldCheck className="w-10 h-10 text-primary mx-auto mb-4" />
                }
                title={t("farmer.trust_1_title")}
                desc={t("farmer.trust_1_desc")}
              />
              <TrustCard
                icon={
                  <BarChart3 className="w-10 h-10 text-primary mx-auto mb-4" />
                }
                title={t("farmer.trust_2_title")}
                desc={t("farmer.trust_2_desc")}
              />
              <TrustCard
                icon={
                  <ClipboardList className="w-10 h-10 text-primary mx-auto mb-4" />
                }
                title={t("farmer.trust_3_title")}
                desc={t("farmer.trust_3_desc")}
              />
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 4. Final CTA */}
      <ScrollReveal delay={100}>
        <section className="py-24 text-center px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t("farmer.cta_final_title")}
          </h2>
          <p className="text-slate-500 mb-10 max-w-lg mx-auto">
            {t("farmer.cta_final_desc")}
          </p>
          <Button
            className="bg-primary px-8 py-7 text-lg rounded-full hover:scale-110 transition-transform duration-500"
            onClick={() => navigate("/register")}
          >
            {t("farmer.cta_final_btn")}
          </Button>
        </section>
      </ScrollReveal>

      <Footer />
    </div>
  );
};

// --- Helper Components ---

function FarmerFeature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-5 group p-4 rounded-xl transition-all duration-300 hover:bg-white/50 dark:hover:bg-slate-800">
      <div className="bg-primary/10 p-4 rounded-2xl h-fit text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <div className="space-y-1">
        <h4 className="font-bold text-xl text-slate-900 dark:text-white mm:leading-loose">
          {title}
        </h4>
        <p className="text-slate-600 leading-relaxed text-sm mm:leading-loose">
          {desc}
        </p>
      </div>
    </div>
  );
}

function TrustCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Card className="bg-slate-800 border-slate-700 text-white text-center shadow-lg">
      <CardHeader>
        {icon}
        <CardTitle className="text-xl mm:leading-loose">{title}</CardTitle>
        <CardDescription className="text-slate-400 mm:leading-loose">{desc}</CardDescription>
      </CardHeader>
    </Card>
  );
}

export default FarmerLanding;
