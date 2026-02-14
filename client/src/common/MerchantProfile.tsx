import { useParams, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import {
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  BadgeCheck,
  Calendar,
  Store,
  User as UserIcon,
  Loader2,
  ShieldCheck,
  Search,
  EllipsisVertical,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MarketPriceTable } from "@/components/market/MarketPriceTable";
import { useGetMarketPricesQuery } from "@/store/slices/marketApi";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PreorderDialog } from "@/components/merchant/PreorderDialog";
import { ReportDisputeDialog } from "@/components/merchant/ReportDisputeDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useCurrentUserQuery,
  useGetMerchantInfoQuery,
} from "@/store/slices/userApi";
import { format } from "date-fns";

// Import the functions from your translator file
import { localizeData, toMyanmarNumerals } from "@/utils/translator";

function MerchantProfile() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "mm";
  const { userId } = useParams();
  const navigate = useNavigate();
  const { data: currentUser } = useCurrentUserQuery();

  const [isPreorderOpen, setIsPreorderOpen] = useState(false);
  const [isDisputeOpen, setIsDisputeOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc" | null;
  }>({
    key: "cropName",
    direction: "asc",
  });

  const { data: response } = useGetMarketPricesQuery({ userId });
  const {
    data: merchantRaw,
    isLoading,
    isError,
  } = useGetMerchantInfoQuery(userId as string);

  // 1. Localize Merchant Profile Data
  const merchant = useMemo(
    () => localizeData(merchantRaw, lang),
    [merchantRaw, lang],
  );

  // 2. Localize Market Table Data
  const rawData = useMemo(
    () => localizeData(response?.data || [], lang),
    [response, lang],
  );

  console.log(merchant, rawData);

  const lastUpdatedDate = useMemo(() => {
    if (!response?.data || response.data.length === 0) return null;
    const dates = response.data.map((item: any) =>
      new Date(item.updatedAt || item.date).getTime(),
    );
    return new Date(Math.max(...dates));
  }, [response]);

  const categoryOptions = useMemo(() => {
    const unique = Array.from(
      new Set((response?.data || []).map((item: any) => item.category)),
    );
    return ["all", ...unique];
  }, [response]);

  const processedData = useMemo(() => {
    let filtered = [...rawData];
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.cropName.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }
    if (sortConfig.key && sortConfig.direction) {
      filtered.sort((a: any, b: any) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [rawData, searchTerm, selectedCategory, sortConfig]);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse font-medium">
            {t("merchant_profile.loading")}
          </p>
        </div>
      </div>
    );
  }

  if (isError || !merchant) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center p-8 text-center">
        <div className="bg-red-50 p-4 rounded-full mb-4">
          <Store className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold">
          {t("merchant_profile.not_found.title")}
        </h2>
        <p className="text-slate-500 mt-2 mb-6">
          {t("merchant_profile.not_found.desc")}
        </p>
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />{" "}
          {t("merchant_profile.not_found.back")}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="hover:bg-slate-100 -ml-4 text-slate-600"
        >
          <ArrowLeft className="w-4 h-4" />{" "}
          {t("merchant_profile.nav.back_to_list")}
        </Button>
        <Badge
          variant="secondary"
          className="px-3 py-1 text-xs font-semibold uppercase tracking-wider"
        >
          {merchant.role}
        </Badge>
      </div>

      <Card className="relative group">
        <CardContent className="p-6 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-slate-50 rounded-3xl border-4 border-white shadow-inner flex items-center justify-center relative">
              <Store className="w-16 h-16 text-primary" />
              <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-full shadow-md">
                <ShieldCheck className="w-6 h-6 text-primary fill-emerald-50" />
              </div>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                {merchant.merchantId.businessName}
              </h1>
              <Badge className="bg-primary/15 text-primary border-none px-3">
                {merchant.verificationStatus}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-2 gap-x-6 text-slate-500">
              <span className="flex items-center gap-1.5 font-medium">
                <UserIcon className="w-4 h-4 text-primary" /> {merchant.name}
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 text-primary" /> {merchant.division}
              </span>
            </div>

            <div className="pt-4 flex flex-wrap justify-center md:justify-start gap-3">
              {currentUser?.role !== "merchant" && (
                <PreorderDialog
                  merchant={merchant}
                  rawData={response?.data || []}
                  isOpen={isPreorderOpen}
                  setIsOpen={setIsPreorderOpen}
                />
              )}
            </div>
          </div>

          {currentUser?.role !== "merchant" && (
            <div className="absolute top-6 right-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                  >
                    <EllipsisVertical className="h-5 w-5 text-slate-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                    onClick={() => setIsDisputeOpen(true)}
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    {/* Using custom merchant_disputes label */}
                    <span>{t("merchant_profile.actions.report_dispute")}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          <ReportDisputeDialog
            merchant={merchant}
            isOpen={isDisputeOpen}
            setIsOpen={setIsDisputeOpen}
          />
        </CardContent>
      </Card>

      {merchant.bio && (
        <Card className="shadow-sm rounded-2xl">
          <CardContent className="p-8">
            <div className="flex items-center gap-2 mb-4 text-primary font-bold uppercase text-xs tracking-widest">
              <UserIcon size={16} /> {t("merchant_profile.sections.bio")}
            </div>
            <p className="text-lg text-slate-600 leading-relaxed italic">
              "{merchant.bio}"
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase text-slate-500 tracking-widest">
                {t("merchant_profile.sections.contact")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 p-2.5 rounded-xl">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">
                    {t("merchant_profile.labels.mobile")}
                  </p>
                  <p className="font-bold text-slate-700 mm:-mt-7">
                    {merchant.merchantId.businessPhone}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-orange-50 p-2.5 rounded-xl">
                  <Mail className="w-5 h-5 text-orange-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-400 uppercase">
                    {t("merchant_profile.labels.email")}
                  </p>
                  <p className="font-bold text-slate-700 truncate mm:-mt-7">
                    {merchant.email}
                  </p>
                </div>
              </div>
              <Separator className="bg-slate-100" />
              <div className="flex items-center gap-4">
                <div className="bg-purple-50 p-2.5 rounded-xl">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase mm:mb-0">
                    {t("merchant_profile.labels.registered_on")}
                  </p>
                  <p className="font-bold text-slate-700 mm:mb-0">
                    {/* Manual call to toMyanmarNumerals for the formatted date string */}
                    {lang === "mm"
                      ? toMyanmarNumerals(
                          format(new Date(merchantRaw.createdAt), "MMMM yyyy"),
                        )
                      : format(new Date(merchantRaw.createdAt), "MMMM yyyy")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                {t("merchant_profile.sections.business_details")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-emerald-50 p-2.5 rounded-xl mt-1">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">
                        {t("merchant_profile.labels.primary_location")}
                      </h4>
                      <p className="text-slate-600 leading-relaxed">
                        {merchant.township}, {merchant.district}
                        <br />
                        <span className="text-slate-400 text-sm font-medium">
                          {merchant.division}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-slate-50 p-2.5 rounded-xl mt-1">
                      <Store className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">
                        {t("merchant_profile.labels.store_address")}
                      </h4>
                      <p className="text-slate-600 leading-relaxed">
                        {merchant.homeAddress}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-dashed border-slate-200">
                <div className="flex items-center gap-4 text-center sm:text-left">
                  <div className="bg-white p-3 rounded-full shadow-sm">
                    <BadgeCheck className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800">
                      {t("merchant_profile.labels.verified_partner")}
                    </h5>
                    <p className="text-sm text-slate-500 mm:leading-loose">
                      {t("merchant_profile.labels.verified_desc")}
                    </p>
                  </div>
                </div>
                <Badge className="bg-primary/65 px-4 py-1.5">
                  {merchant.verificationStatus}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="shadow-sm rounded-2xl overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-xl font-bold mm:leading-loose">
                {t("merchant_profile.sections.live_rates")}
              </CardTitle>
              <CardDescription className="text-slate-500 mt-1 mm:leading-loose">
                {t("merchant_profile.sections.live_rates_desc")}
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              {lastUpdatedDate && (
                <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-destructive">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold">
                    {t("merchant_profile.labels.last_updated")}:{" "}
                    {lang === "mm"
                      ? toMyanmarNumerals(
                          format(lastUpdatedDate, "MMM dd, yyyy"),
                        )
                      : format(lastUpdatedDate, "MMM dd, yyyy")}
                  </span>
                </div>
              )}
              <Badge className="bg-primary/15 text-primary animate-pulse">
                ● {t("merchant_profile.actions.live_updates")}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative flex flex-col md:flex-row gap-6 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("merchant_profile.labels.search_placeholder")}
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full md:w-[220px] mm:leading-loose">
                <SelectValue
                  placeholder={t("merchant_profile.labels.all_categories")}
                />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat === "all"
                      ? t("merchant_profile.labels.all_categories")
                      : lang === "mm"
                        ? toMyanmarNumerals(cat)
                        : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <MarketPriceTable
            data={processedData}
            onSort={(key) => {
              let direction: "asc" | "desc" = "asc";
              if (sortConfig.key === key && sortConfig.direction === "asc")
                direction = "desc";
              setSortConfig({ key, direction });
            }}
            sortConfig={sortConfig}
            onRowClick={(cropId, marketId) =>
              navigate(
                `/crop-price-history?cropId=${cropId}&marketId=${marketId}`,
              )
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default MerchantProfile;
