import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, User, Store, ChevronRight } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

export function MerchantCard({ user }: { user: any }) {
  const { t } = useTranslation();

  // Helper to determine the path based on role
  const getRolePath = (role: string) => {
    // Standardizing to 'merchant' for the URL slug
    if (role === "ကုန်သည်" || role === "merchant") return "merchant";
    return role;
  };

  return (
    <Card className="relative overflow-hidden hover:border-primary/30 hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row w-full group min-h-[100px]">
      {/* Visual Accent Bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/10 group-hover:bg-primary transition-colors" />

      {/* 1. Left Section: Main Info */}
      <div className="flex-3 p-4 flex flex-col justify-center">
        {/* Header: Name and Status */}
        <div className="flex items-center gap-3 mb-1.5">
          <div className="p-1.5 bg-primary/5 rounded-md">
            <Store className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-lg font-bold tracking-tight mm:leading-loose">
            {user.merchantId?.businessName || user.name}
          </h3>
          <Badge
            variant="secondary"
            className="h-5 text-[10px] bg-green-100/80 text-green-700 border-none px-2 font-bold"
          >
            {/* Updated key from merchant_list to merchant_card */}
            {t("merchant_card.status.verified")}
          </Badge>
        </div>

        {/* Info Row: Distributed horizontally to save height */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 ml-9">
          <div className="flex items-center text-xs text-slate-500">
            <User className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
            <span className="font-medium text-slate-700 mm:leading-loose">
              {user.name}
            </span>
          </div>

          <div className="flex items-center text-xs text-slate-500">
            <Phone className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
            <span className="font-mono">
              {user.merchantId?.businessPhone || user.phone}
            </span>
          </div>

          <div className="flex items-center text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 mr-1.5 text-red-400" />
            <span className="mm:leading-loose">
              {user.township}, {user.division}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Right Section: Action */}
      <div className="p-4 sm:w-52 flex items-center justify-center">
        <Button
          asChild
          variant="outline"
          className="w-full sm:w-auto px-6 h-9 text-xs font-semibold hover:bg-primary hover:text-white transition-all rounded-full"
        >
          <Link
            to={`/${getRolePath(user.role)}/merchants/${user._id}`}
            className="flex items-center gap-2"
          >
            {/* Updated key from merchant_list to merchant_card */}
            {t("merchant_card.actions.view_details")}
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}
