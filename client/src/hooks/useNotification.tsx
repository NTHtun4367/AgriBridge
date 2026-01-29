import { useEffect } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { TrendingUp, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useNavigate } from "react-router";

interface PriceUpdateData {
  message: string;
  timestamp: string;
  marketName: string;
  updateCount: number;
}

const socket = io("http://localhost:4000");

export const useNotifications = () => {
  const userInfo = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo?.role !== "admin") {
      socket.on("price_updated", (data: PriceUpdateData) => {
        toast.custom((t) => (
          <div
            className="
              flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur-md 
              dark:border-slate-800 dark:bg-slate-900/95 
              /* Mobile: Full width minus margins | Desktop: Fixed 400px */
              w-[calc(100vw-32px)] sm:w-[400px]
              transition-all duration-300
            "
          >
            {/* Header Section */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                  <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-bold leading-tight text-slate-900 dark:text-slate-100">
                    {data.marketName} Updated
                  </h3>
                  <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(data.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden xs:inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
                  #{data.updateCount} items
                </span>
                <button
                  onClick={() => toast.dismiss(t)}
                  className="rounded-full p-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="h-4 w-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Message Body */}
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {data.message}
            </p>

            {/* Action Buttons - Stacked on tiny screens, side-by-side on mobile/laptop */}
            <div className="flex w-full gap-2 mt-1">
              <Button
                onClick={() => {
                  navigate("/farmer/markets");
                  toast.dismiss(t);
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                size="sm"
              >
                View Prices
              </Button>

              <Button
                onClick={() => toast.dismiss(t)}
                variant="outline"
                className="flex-1 border-slate-200 dark:border-slate-700 font-medium"
                size="sm"
              >
                Dismiss
              </Button>
            </div>
          </div>
        ));
      });

      return () => {
        socket.off("price_updated");
      };
    }
  }, [userInfo, navigate]);
};
