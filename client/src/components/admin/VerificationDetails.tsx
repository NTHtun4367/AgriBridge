import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  useGetMerchantInfoForAdminQuery,
  useUpdateUserVerificationStatusMutation,
} from "@/store/slices/adminApi";
import type { User } from "@/types/user";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  UserCheck,
  UserX,
  MapPin,
  IdCard,
  Store,
  Mail,
  Loader2,
  ExternalLink,
  Info,
} from "lucide-react";
import { localizeData, toMyanmarNumerals } from "@/utils/translator";

interface VerificationDetailsProps {
  user: User;
}

function VerificationDetails({ user: rawUser }: VerificationDetailsProps) {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language as "en" | "mm") || "en";

  // Localize user name and address fields
  const user = useMemo(() => {
    return localizeData([rawUser], currentLang)[0];
  }, [rawUser, currentLang]);

  const [updateUserVerificationStatus, { isLoading: vLoading }] =
    useUpdateUserVerificationStatusMutation();

  const { data: merchant, isLoading } = useGetMerchantInfoForAdminQuery(
    user.merchantId!,
  );

  // Helper for localizing UI strings and numbers
  const formatUI = (val: string | number | undefined) => {
    if (!val) return "—";
    return currentLang === "mm" ? toMyanmarNumerals(val) : val.toString();
  };

  const handleVerificationStatus = async (
    userId: string,
    status: "unverified" | "verified",
  ) => {
    await updateUserVerificationStatus({ userId, status });
  };

  const nrcDisplay = useMemo(() => {
    if (!merchant) return "—";
    const rawNrc = `${merchant.nrcRegion}/${merchant.nrcTownship}(${merchant.nrcType})${merchant.nrcNumber}`;
    return currentLang === "mm" ? toMyanmarNumerals(rawNrc) : rawNrc;
  }, [merchant, currentLang]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="hover:bg-primary hover:text-white transition-all cursor-pointer"
        >
          {String(t("verification_details.view_button"))}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[95vw] lg:max-w-[1200px] h-[90vh] p-0 gap-0 overflow-hidden flex flex-col">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="mm:mt-1">
              <DialogTitle className="text-xl font-bold mm:leading-loose">
                {user.name}
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                {String(t("verification_details.id_label"))}: {user._id}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 pr-8">
            <Badge
              variant="outline"
              className="bg-white text-black mm:leading-loose border-2"
            >
              {String(t(`roles.${user.role}`, { defaultValue: user.role }))}
            </Badge>
            <Badge className="bg-amber-500 mm:leading-loose">
              {String(user.verificationStatus)}
            </Badge>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* LEFT SIDE: Information Scroll Area */}
          <div className="w-full lg:w-2/5 overflow-y-auto p-6 border-r">
            <div className="space-y-8">
              {/* Account Section */}
              <section>
                <div className="flex items-center gap-2 mb-4 text-primary font-bold">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm tracking-widest uppercase mm:leading-loose">
                    {String(t("verification_details.sections.contact"))}
                  </span>
                </div>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-dashed">
                    <span className="text-slate-500">
                      {String(t("verification_details.labels.email"))}
                    </span>
                    <span className="font-medium">{user.email}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-dashed">
                    <span className="text-slate-500">
                      {String(t("verification_details.labels.phone"))}
                    </span>
                    <span className="font-medium">
                      {formatUI(merchant?.businessPhone)}
                    </span>
                  </div>
                </div>
              </section>

              {/* Business Section */}
              <section className="bg-secondary p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-4 text-primary font-bold">
                  <Store className="w-4 h-4" />
                  <span className="text-sm tracking-widest uppercase mm:leading-loose">
                    {String(t("verification_details.sections.business"))}
                  </span>
                </div>
                <div className="space-y-1 mb-4">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">
                    {String(t("verification_details.labels.legal_name"))}
                  </p>
                  <p className="text-lg font-bold mm:leading-relaxed">
                    {merchant?.businessName || "—"}
                  </p>
                </div>
                <div className="bg-white p-3 rounded border border-slate-300">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">
                    {String(t("verification_details.labels.nrc"))}
                  </p>
                  <p className="text-md font-mono font-bold tracking-tighter text-black">
                    {nrcDisplay}
                  </p>
                </div>
              </section>

              {/* Address Section */}
              <section>
                <div className="flex items-center gap-2 mb-4 text-primary font-bold">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm tracking-widest uppercase mm:leading-loose">
                    {String(t("verification_details.sections.address"))}
                  </span>
                </div>
                <div className="space-y-1 bg-secondary p-4 rounded-xl mm:space-y-0">
                  {[
                    {
                      label: t("verification_details.labels.division"),
                      val: user.division,
                    },
                    {
                      label: t("verification_details.labels.district"),
                      val: user.district,
                    },
                    {
                      label: t("verification_details.labels.township"),
                      val: user.township,
                    },
                    {
                      label: t("verification_details.labels.home_address"),
                      val: user.homeAddress,
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="p-2">
                      <p className="text-[10px] text-slate-400 uppercase font-bold mm:mb-0">
                        {String(item.label)}
                      </p>
                      <p className="text-sm italic mm:mb-0 mm:leading-loose">
                        "{item.val || "—"}"
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1 text-red-500 hover:bg-red-50 border-red-200 cursor-pointer"
                  onClick={() =>
                    handleVerificationStatus(user._id, "unverified")
                  }
                  disabled={vLoading}
                >
                  <UserX className="h-5 w-5 mr-2" />
                  {String(t("verification_details.actions.reject"))}
                </Button>
                <Button
                  className="flex-1 bg-primary text-md font-bold shadow-md cursor-pointer mm:text-sm"
                  onClick={() => handleVerificationStatus(user._id, "verified")}
                  disabled={vLoading}
                >
                  <UserCheck className="h-5 w-5 mr-2" />
                  {String(t("verification_details.actions.approve"))}
                </Button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Document Viewer */}
          <div className="hidden lg:flex flex-1 p-8 flex-col items-center justify-start overflow-y-auto space-y-6">
            <div className="w-full flex justify-between items-center mb-2">
              <h3 className="text-sm font-bold flex items-center gap-2 text-slate-600 uppercase tracking-widest mm:leading-loose">
                <IdCard className="w-4 h-4" />
                {String(t("verification_details.sections.identity"))}
              </h3>
              <span className="text-[10px] text-slate-400">
                {String(t("verification_details.labels.tip_scroll"))}
              </span>
            </div>

            {isLoading ? (
              <Loader2 className="w-10 h-10 animate-spin text-slate-300 mt-20" />
            ) : (
              <>
                {[
                  {
                    label: t("verification_details.labels.nrc_front"),
                    img: merchant?.nrcFrontImage,
                  },
                  {
                    label: t("verification_details.labels.nrc_back"),
                    img: merchant?.nrcBackImage,
                  },
                ].map((item, idx) => (
                  <div key={idx} className="w-full max-w-lg space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-bold text-slate-500">
                        {String(item.label)}
                      </span>
                      <a
                        href={item.img?.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-blue-500 hover:underline flex items-center"
                      >
                        {String(t("verification_details.labels.open_full"))}
                        <ExternalLink className="w-2 h-2 ml-1" />
                      </a>
                    </div>
                    <div className="rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-slate-200 aspect-[1.58/1]">
                      <img
                        src={item.img?.url}
                        className="w-full h-full object-cover"
                        alt={String(item.label)}
                      />
                    </div>
                  </div>
                ))}

                <div className="flex items-start gap-2 bg-blue-50 p-4 rounded-lg border border-blue-100 max-w-lg">
                  <Info className="w-4 h-4 text-blue-500 mt-1 shrink-0" />
                  <p className="text-[11px] text-blue-700 leading-tight mm:leading-loose">
                    {String(t("verification_details.labels.instruction"))}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default VerificationDetails;
