import { useParams, useNavigate } from "react-router";
import { useGetMerchantInfoQuery } from "@/store/slices/farmerApi";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MerchantMarketPriceTable } from "@/components/merchant/MerchantMarketPriceTable";
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

function MerchantProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { data: response } = useGetMarketPricesQuery({ userId });

  const {
    data: merchant,
    isLoading,
    isError,
  } = useGetMerchantInfoQuery(userId as string);

  // --- Search, Filter & Sort States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc" | null;
  }>({
    key: "cropName", // Default sort
    direction: "asc",
  });

  const rawData = response?.data || [];

  // Generate unique categories for the dropdown
  const categoryOptions = useMemo(() => {
    const unique = Array.from(
      new Set(rawData.map((item: any) => item.category))
    );
    return ["all", ...unique];
  }, [rawData]);

  // Combined logic: Search -> Category Filter -> Sort
  const processedData = useMemo(() => {
    let filtered = [...rawData];

    // 1. Search filter
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.cropName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // 3. Sorting logic
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

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse font-medium">
            Loading merchant details...
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
        <h2 className="text-2xl font-bold">Merchant not found</h2>
        <p className="text-slate-500 mt-2 mb-6">
          The profile you're looking for doesn't exist or has been moved.
        </p>
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 space-y-8 animate-in fade-in duration-500">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="hover:bg-slate-100 -ml-4 text-slate-600"
        >
          <ArrowLeft className="w-4 h-4" /> Back to List
        </Button>
        <Badge
          variant="secondary"
          className="px-3 py-1 text-xs font-semibold uppercase tracking-wider"
        >
          {merchant.role}
        </Badge>
      </div>

      {/* Hero Section */}
      <div className="relative group">
        {/* <div className="absolute inset-0 bg-linear-to-r from-emerald-600 to-teal-500 rounded-4xl blur-xl opacity-10 group-hover:opacity-15 transition-opacity" /> */}
        <div className="relative border border-slate-100 rounded-4xl p-6 md:p-10 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Business Avatar */}
          <div className="shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-slate-50 rounded-3xl border-4 border-white shadow-inner flex items-center justify-center relative">
              <Store className="w-16 h-16 text-primary" />
              <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-full shadow-md">
                <ShieldCheck className="w-6 h-6 text-primary fill-emerald-50" />
              </div>
            </div>
          </div>

          {/* Title and Key Details */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
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
              <Button className="rounded-full px-8 shadow-md shadow-primary/35">
                Contact Merchant
              </Button>
              {/* <Button
                variant="outline"
                className="rounded-full border-slate-200"
              >
                Share Profile
              </Button> */}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden border-slate-100 shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase text-slate-500 tracking-widest">
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 p-2.5 rounded-xl">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">
                    Mobile
                  </p>
                  <p className="font-bold text-slate-700">
                    {merchant.merchantId.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-orange-50 p-2.5 rounded-xl">
                  <Mail className="w-5 h-5 text-orange-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-400 uppercase">
                    Email
                  </p>
                  <p className="font-bold text-slate-700 truncate">
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
                  <p className="text-xs font-semibold text-slate-400 uppercase">
                    Registered On
                  </p>
                  <p className="font-bold text-slate-700">
                    {new Date(merchant.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-100 shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                Business Details
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
                        Primary Location
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
                        Store Address
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
                      Verified Partner
                    </h5>
                    <p className="text-sm text-slate-500">
                      This merchant has completed full verification.
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

      {/* Buying Price */}
      <Card>
        <CardContent>
          <div className="relative flex gap-6 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search crops..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full md:w-[220px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <MerchantMarketPriceTable
            data={processedData}
            onSort={handleSort}
            sortConfig={sortConfig}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default MerchantProfile;
