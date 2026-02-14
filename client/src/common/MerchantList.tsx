import {
  useCurrentUserQuery,
  useGetMerchantsQuery,
} from "@/store/slices/userApi";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "@/components/ui/switch";
import { Loader2, Info } from "lucide-react";
import { MerchantCard } from "@/components/merchant/MerchantCard";
import { localizeData } from "@/utils/translator";

function MerchantList() {
  const { t, i18n } = useTranslation();
  const [showAll, setShowAll] = useState(false);
  const { data: currentUser } = useCurrentUserQuery();

  // Define query parameters based on toggle state
  const queryParams = useMemo(() => {
    return showAll
      ? {}
      : {
          division: currentUser?.division,
          district: currentUser?.district,
          township: currentUser?.township,
        };
  }, [showAll, currentUser]);

  const {
    data: merchantsData,
    isLoading,
    isFetching,
  } = useGetMerchantsQuery(queryParams, { skip: !showAll && !currentUser });

  // Apply localization to the merchant list
  const localizedMerchants = useMemo(() => {
    const rawData = merchantsData || [];
    return localizeData(rawData, i18n.language as "en" | "mm");
  }, [merchantsData, i18n.language]);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-6 rounded-2xl">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mm:leading-loose">
            {t("merchant_list.title")}
          </h1>
          <p className="text-muted-foreground mt-1 mm:leading-loose">
            {showAll
              ? t("merchant_list.subtitle_all")
              : t("merchant_list.subtitle_region")}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-secondary p-2 px-4 rounded-full border-2 border-primary">
          <span className="text-sm font-semibold">
            {t("merchant_list.toggle_all")}
          </span>
          <Switch checked={showAll} onCheckedChange={setShowAll} />
        </div>
      </div>

      {/* Loading & Content States */}
      {isLoading || isFetching ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium">
            {t("merchant_list.loading")}
          </p>
        </div>
      ) : localizedMerchants && localizedMerchants.length > 0 ? (
        <div className="space-y-3">
          {localizedMerchants.map((merchant: any) => (
            <div key={merchant._id}>
              {currentUser?._id !== merchant._id && (
                <MerchantCard user={merchant} />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-2xl bg-secondary">
          <Info className="w-12 h-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold">
            {t("merchant_list.no_merchants.title")}
          </h3>
          <p className="text-muted-foreground max-w-xs text-center">
            {t("merchant_list.no_merchants.desc")}
          </p>
        </div>
      )}
    </div>
  );
}

export default MerchantList;
