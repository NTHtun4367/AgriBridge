import { useNavigate } from "react-router";
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  Ban,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PendingApproval() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-4">
      <Card className="max-w-[600px] w-full shadow-2xl border-none text-center p-6 animate-in fade-in zoom-in duration-500">
        <CardContent className="pt-6 space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce duration-1000">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-full shadow-md">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Application Received!
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              Your merchant verification documents have been submitted. Our team
              is currently reviewing your details.
            </p>
          </div>

          {/* Permissions / Status Section */}
          <div className="text-left bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-4 h-4 text-emerald-600" />
                <p className="text-sm font-bold text-slate-700">
                  What you can do now:
                </p>
              </div>
              <ul className="grid grid-cols-1 gap-2">
                <li className="flex items-center gap-2 text-xs text-slate-600">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{" "}
                  View real-time market prices
                </li>
                <li className="flex items-center gap-2 text-xs text-slate-600">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{" "}
                  Complete your business profile
                </li>
              </ul>
            </div>

            <div className="p-4 bg-slate-100/30">
              <div className="flex items-center gap-2 mb-3">
                <Ban className="w-4 h-4 text-amber-600" />
                <p className="text-sm font-bold text-slate-700">
                  Restricted until verified:
                </p>
              </div>
              <ul className="grid grid-cols-1 gap-2">
                <li className="flex items-center gap-2 text-xs text-slate-500 italic">
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />{" "}
                  Posting trade offers or setting prices
                </li>
                <li className="flex items-center gap-2 text-xs text-slate-500 italic">
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />{" "}
                  Finalizing transactions with farmers
                </li>
              </ul>
            </div>
          </div>

          {/* Review Timeline Info */}
          <div className="flex items-center justify-center gap-2 py-2 px-4 bg-primary/5 rounded-full w-fit mx-auto">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
              Verification usually takes 24-48 hours
            </span>
          </div>

          {/* Navigation Buttons */}
          <div className="pt-2 space-y-3">
            {/* <Button
              className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20 gap-2"
              onClick={() => navigate("/merchant/dashboard")}
            >
              <LayoutDashboard className="w-4 h-4" />
              Go to Dashboard
            </Button> */}

            <Button
              // variant="ghost"
              className="w-full"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </Button>
          </div>

          <p className="text-[10px] text-slate-400">
            Questions? Contact us at{" "}
            <span className="text-primary font-medium">
              support@agribridge.com
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
