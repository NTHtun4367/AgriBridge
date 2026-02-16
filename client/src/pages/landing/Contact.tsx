import { useState } from "react";
import { Mail, Phone, MapPin, Send, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/common/home/Navigation";
import Footer from "@/common/home/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useTranslation } from "react-i18next";

export default function ContactPage() {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => setIsSubmitting(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
      {/* --- NAVIGATION --- */}
      <Navigation />

      {/* 1. Hero Section */}
      <section className="relative py-20 lg:py-24 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent -z-10" />
        <ScrollReveal>
          <div className="flex justify-center mb-6">
            <p className="px-4 py-1.5 text-primary text-xl uppercase tracking-widest font-bold mm:mt-5">
              {t("contact.hero_badge")}
            </p>
          </div>
          <h1 className="text-4xl mm:text-[48px] md:text-6xl font-extrabold mb-6 tracking-tight mm:leading-loose mm:-mt-2">
            {t("contact.hero_title_start")}
            <span className="text-primary">
              {t("contact.hero_title_highlight")}
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-500 px-6 mm:leading-loose">
            {t("contact.hero_desc")}
          </p>
        </ScrollReveal>
      </section>

      {/* 2. Main Contact Grid */}
      <section className="pb-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left Side: Info Cards */}
          <div className="lg:col-span-5 space-y-8">
            <ScrollReveal delay={100}>
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">
                  {t("contact.direct_channels_title")}
                </h2>
                <p className="text-slate-500">
                  {t("contact.direct_channels_desc")}
                </p>
              </div>
            </ScrollReveal>

            <div className="space-y-4">
              <ContactMethodCard
                icon={<Mail className="h-6 w-6" />}
                label={t("contact.email_label")}
                value="support@agribridge.com"
                description={t("contact.email_desc")}
                delay={200}
              />
              <ContactMethodCard
                icon={<Phone className="h-6 w-6" />}
                label={t("contact.phone_label")}
                value="+95 9 123 456 789"
                description={t("contact.phone_desc")}
                delay={300}
              />
              <ContactMethodCard
                icon={<MapPin className="h-6 w-6" />}
                label={t("contact.office_label")}
                value={t("contact.office_value")}
                description={t("contact.office_desc")}
                delay={400}
              />
            </div>

            {/* Quick Stats/Trust info */}
            <ScrollReveal delay={500}>
              <div className="p-6 rounded-3xl bg-slate-900 text-white flex items-center gap-6">
                <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                  <Clock className="text-primary h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold">
                    {t("contact.response_title")}
                  </p>
                  <p className="text-xs text-slate-400">
                    {t("contact.response_desc")}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Side: Interactive Form */}
          <div className="lg:col-span-7 relative group">
            <ScrollReveal delay={200}>
              <div className="absolute -inset-4 bg-linear-to-r from-primary/10 to-blue-500/10 rounded-[3rem] blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
              <Card className="relative border-none shadow-[0_20px_50px_rgba(0,0,0,0.1)] bg-white dark:bg-slate-900 rotate-1 group-hover:rotate-0 transition-transform duration-700 overflow-hidden rounded-[2.5rem]">
                <div className="h-2 bg-primary w-full" />
                <CardContent className="p-8 md:p-12">
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-slate-500 ml-1">
                          {t("contact.form_name_label")}
                        </label>
                        <Input
                          placeholder={t("contact.form_name_placeholder")}
                          className="h-14 rounded-2xl border-slate-100 bg-slate-50 dark:bg-slate-800 dark:border-none focus-visible:ring-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-slate-500 ml-1">
                          {t("contact.form_email_label")}
                        </label>
                        <Input
                          type="email"
                          placeholder={t("contact.form_email_placeholder")}
                          className="h-14 rounded-2xl border-slate-100 bg-slate-50 dark:bg-slate-800 dark:border-none focus-visible:ring-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold uppercase tracking-wider text-slate-500 ml-1">
                        {t("contact.form_subject_label")}
                      </label>
                      <Input
                        placeholder={t("contact.form_subject_placeholder")}
                        className="h-14 rounded-2xl border-slate-100 bg-slate-50 dark:bg-slate-800 dark:border-none focus-visible:ring-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold uppercase tracking-wider text-slate-500 ml-1">
                        {t("contact.form_message_label")}
                      </label>
                      <Textarea
                        placeholder={t("contact.form_message_placeholder")}
                        className="min-h-40 rounded-2xl border-slate-100 bg-slate-50 dark:bg-slate-800 dark:border-none focus-visible:ring-primary p-4"
                      />
                    </div>

                    <Button
                      disabled={isSubmitting}
                      className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 text-lg font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          {t("contact.form_sending")}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="h-5 w-5" />{" "}
                          {t("contact.form_button")}
                        </div>
                      )}
                    </Button>

                    <p className="text-center text-xs text-slate-400">
                      {t("contact.form_disclaimer")}
                    </p>
                  </form>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>
      {/* --- FOOTER --- */}
      <Footer />
    </div>
  );
}

// Sub-component for Contact Methods
function ContactMethodCard({
  icon,
  label,
  value,
  description,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
  delay: number;
}) {
  return (
    <ScrollReveal delay={delay}>
      <div className="p-6 rounded-4xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group flex items-start gap-5">
        <div className="p-4 bg-primary/10 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
          {icon}
        </div>
        <div className="space-y-1 mm:space-y-0">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mm:leading-loose">
            {label}
          </p>
          <p className="text-lg font-bold mm:leading-loose">{value}</p>
          <p className="text-sm text-slate-500 mm:leading-loose">{description}</p>
        </div>
      </div>
    </ScrollReveal>
  );
}
