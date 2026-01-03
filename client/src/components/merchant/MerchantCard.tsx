import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, User, Store, ChevronRight } from "lucide-react";
import { Link } from "react-router";

export function MerchantCard({ user }: { user: any }) {
  return (
    <Card className="relative overflow-hidden border-slate-200 hover:border-primary/30 hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row w-full group min-h-[100px]">
      {/* Visual Accent Bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/10 group-hover:bg-primary transition-colors" />

      {/* 1. Left Section: Main Info */}
      <div className="flex-3 p-4 flex flex-col justify-center">
        {/* Header: Name and Status */}
        <div className="flex items-center gap-3 mb-1.5">
          <div className="p-1.5 bg-primary/5 rounded-md">
            <Store className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            {user.merchantId?.businessName}
          </h3>
          <Badge
            variant="secondary"
            className="h-5 text-[10px] bg-green-100/80 text-green-700 border-none px-2"
          >
            Verified
          </Badge>
        </div>

        {/* Info Row: Distributed horizontally to save height */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 ml-9">
          <div className="flex items-center text-xs text-slate-500">
            <User className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
            <span className="font-medium text-slate-700">{user.name}</span>
          </div>

          <div className="flex items-center text-xs text-slate-500">
            <Phone className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
            <span className="font-mono">{user.merchantId?.phone}</span>
          </div>

          <div className="flex items-center text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 mr-1.5 text-red-400" />
            <span>
              {user.township}, {user.division}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Right Section: Action */}
      <div className="bg-slate-50/40 sm:border-l border-slate-100 p-4 sm:w-52 flex items-center justify-center">
        <Button
          asChild
          variant="outline"
          className="w-full sm:w-auto px-6 h-9 text-xs font-semibold group-hover:bg-primary group-hover:text-white transition-all rounded-full"
        >
          <Link
            to={`/farmer/merchants/${user.merchantId?._id}`}
            className="flex items-center gap-2"
          >
            View Details
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}
