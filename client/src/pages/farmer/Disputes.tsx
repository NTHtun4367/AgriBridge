import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetMyDisputesQuery } from "@/store/slices/disputeApi";
import { format } from "date-fns";
import {
  Clock,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export default function FarmerDisputes() {
  const { t } = useTranslation();
  const { data: disputesRes, isLoading } = useGetMyDisputesQuery(undefined);
  const [selectedDispute, setSelectedDispute] = useState<any>(null);

  const disputes = disputesRes?.data || [];

  const stats = {
    total: disputes.length,
    pending: disputes.filter((d: any) => d.status === "pending").length,
    resolved: disputes.filter((d: any) => d.status !== "pending").length,
  };

  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm tracking-tight mm:leading-loose">
              <ShieldCheck className="h-4 w-4" />
              <span>{t("farmer_disputes.trust_safety")}</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mm:leading-loose">
              {t("farmer_disputes.title")}
            </h1>
            <p className="text-slate-500 text-sm mm:leading-loose">
              {t("farmer_disputes.subtitle")}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <StatBox
              label={t("farmer_disputes.stats.total")}
              value={stats.total}
              bgColor="bg-blue-500/35"
            />
            <StatBox
              label={t("farmer_disputes.stats.pending")}
              value={stats.pending}
              bgColor="bg-yellow-500/35"
              highlight="text-amber-600"
            />
            <StatBox
              label={t("farmer_disputes.stats.resolved")}
              value={stats.resolved}
              bgColor="bg-green-500/35"
              highlight="text-emerald-600"
            />
          </div>
        </header>

        <main>
          {isLoading ? (
            <LoadingSkeleton />
          ) : disputes.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-4">
              {disputes.map((dispute: any) => (
                <DisputeRow
                  key={dispute._id}
                  dispute={dispute}
                  onClick={() => setSelectedDispute(dispute)}
                />
              ))}
            </div>
          )}
        </main>

        <Dialog
          open={!!selectedDispute}
          onOpenChange={() => setSelectedDispute(null)}
        >
          <DialogContent className="max-w-2xl p-0 overflow-hidden border-none rounded-2xl shadow-2xl">
            {selectedDispute && (
              <div>
                <div
                  className={`px-8 py-4 border-b ${selectedDispute.status === "pending" ? "bg-amber-50/50" : "bg-emerald-50/50"}`}
                >
                  <div className="flex justify-between items-start mb-4 mm:mb-0">
                    <Badge
                      variant="outline"
                      className="font-mono text-[10px] uppercase tracking-widest"
                    >
                      {t("farmer_disputes.labels.id")}:{" "}
                      {selectedDispute._id.slice(-8)}
                    </Badge>
                    <StatusBadge status={selectedDispute.status} />
                  </div>
                  <h2 className="text-2xl font-bold capitalize">
                    {t(`farmer_disputes.reasons.${selectedDispute.reason}`, {
                      defaultValue: selectedDispute.reason.replace("_", " "),
                    })}
                  </h2>
                </div>

                <div className="p-8 space-y-8 mm:space-y-4">
                  <section className="space-y-3">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                      {t("farmer_disputes.labels.description")}
                    </h4>
                    <p className="text-slate-600 leading-relaxed text-sm p-4 rounded-xl border italic">
                      "{selectedDispute.description}"
                    </p>
                  </section>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                        {t("farmer_disputes.labels.merchant")}
                      </h4>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-slate-500" />
                        </div>
                        <div className="mm:-mb-4">
                          <p className="text-sm font-bold mm:-mb-0.5">
                            {selectedDispute.merchantId?.merchantId
                              ?.businessName ||
                              selectedDispute.merchantId?.name}
                          </p>
                          <p className="text-[10px] text-slate-400 uppercase font-semibold">
                            {t("farmer_disputes.labels.verified_merchant")}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                        {t("farmer_disputes.labels.timeline")}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        {format(
                          new Date(selectedDispute.createdAt),
                          "MMMM dd, yyyy",
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <section className="space-y-4">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                      {t("farmer_disputes.labels.location")}
                    </h4>
                    <div className="flex items-start gap-3 p-4 rounded-xl border">
                      <MapPin className="h-5 w-5 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-slate-700 font-medium leading-relaxed">
                          {selectedDispute.merchantId?.merchantAddress ||
                            t("farmer_disputes.labels.no_location")}
                        </p>
                      </div>
                    </div>
                  </section>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ContactItem
                      icon={<Mail />}
                      label={t("farmer_disputes.labels.email")}
                      value={selectedDispute.merchantId?.email}
                    />
                    <ContactItem
                      icon={<Phone />}
                      label={t("farmer_disputes.labels.support")}
                      value={
                        selectedDispute.merchantId?.merchantId?.businessPhone ||
                        selectedDispute.merchantId?.businessPhone
                      }
                    />
                  </div>
                </div>

                <div className="px-8 py-5 flex items-center justify-between border-t">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
                    <Clock className="h-3 w-3" />{" "}
                    {t("farmer_disputes.labels.resolution_time")}
                  </span>
                  <button
                    onClick={() => setSelectedDispute(null)}
                    className="px-6 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-all shadow-md active:scale-95"
                  >
                    {t("farmer_disputes.actions.close")}
                  </button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function DisputeRow({ dispute, onClick }: any) {
  const { t } = useTranslation();
  const isPending = dispute.status === "pending";
  return (
    <Card
      onClick={onClick}
      className="relative p-0 group overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
    >
      <div
        className={`absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300 ${isPending ? "bg-amber-400" : "bg-emerald-400"}`}
      />
      <div className="flex items-center p-5 md:p-7 gap-6">
        <div
          className={`hidden md:flex h-14 w-14 rounded-2xl items-center justify-center ${isPending ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}`}
        >
          {isPending ? (
            <Clock className="h-7 w-7" />
          ) : (
            <CheckCircle2 className="h-7 w-7" />
          )}
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-4 mm:-mb-6">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1.5 mm:leading-loose">
              {t("farmer_disputes.labels.merchant_partner")}
            </p>
            <p className="font-bold text-lg tracking-tight truncate group-hover:text-primary transition-colors mm:leading-loose">
              {dispute.merchantId?.merchantId?.businessName ||
                dispute.merchantId?.name}
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1.5">
              {t("farmer_disputes.labels.case_reason")}
            </p>
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${isPending ? "bg-amber-400" : "bg-emerald-400"}`}
              />
              <span className="text-sm font-semibold text-slate-600 capitalize">
                {t(`farmer_disputes.reasons.${dispute.reason}`, {
                  defaultValue: dispute.reason.replace("_", " "),
                })}
              </span>
            </div>
          </div>

          <div className="md:col-span-3 text-left md:text-center mm:-mb-6">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1.5">
              {t("farmer_disputes.labels.submission_date")}
            </p>
            <div className="flex items-center md:justify-center gap-2 text-slate-600">
              <Calendar className="h-3.5 w-3.5 text-slate-300 mm:mb-6" />
              <p className="text-sm font-medium">
                {format(new Date(dispute.createdAt), "MMM dd, yyyy")}
              </p>
            </div>
          </div>

          <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-4">
            <StatusBadge status={dispute.status} />
            <div className="h-8 w-8 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
              <ChevronRight className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();
  const isPending = status === "pending";
  return (
    <div
      className={`text-[10px] font-black px-4 py-1.5 rounded-lg border-2 shadow-sm ${isPending ? "bg-amber-50 text-amber-700 border-amber-100/50" : "bg-green-600/15 text-emerald-700 border-emerald-100/50"}`}
    >
      {t(`farmer_disputes.status.${status}`).toUpperCase()}
    </div>
  );
}

function EmptyState() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-200 rounded-[2.5rem]">
      <div className="bg-slate-50 p-8 rounded-full mb-6">
        <ShieldCheck className="h-12 w-12 text-slate-300" />
      </div>
      <h3 className="text-xl font-bold tracking-tight">
        {t("farmer_disputes.empty.title")}
      </h3>
      <p className="text-slate-500 text-sm max-w-xs text-center mt-2 leading-relaxed">
        {t("farmer_disputes.empty.desc")}
      </p>
    </div>
  );
}

function StatBox({ label, value, bgColor, highlight = "text-slate-900" }: any) {
  return (
    <div
      className={`flex-1 md:w-36 border p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow ${bgColor}`}
    >
      <div className="mm:-mb-6">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1 mm:leading-loose">
          {label}
        </p>
        <p className={`text-2xl font-black ${highlight}`}>{value}</p>
      </div>
    </div>
  );
}

function ContactItem({ icon, label, value }: any) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        {React.cloneElement(icon, { className: "h-3 w-3" })} {label}
      </p>
      <p className="text-sm font-semibold text-slate-700 truncate">
        {value || "Not provided"}
      </p>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-28 w-full border animate-pulse rounded-2xl" />
      ))}
    </div>
  );
}
