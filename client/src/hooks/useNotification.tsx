import { useEffect } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { TrendingUp, Clock } from "lucide-react";
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
          <div className="flex w-[400px] flex-col gap-3 rounded-xl border bg-white p-4 shadow-2xl dark:bg-slate-900">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold leading-none">
                    {data.marketName} Updated
                  </h3>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(data.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium dark:bg-slate-800">
                #{data.updateCount}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {data.message}
            </p>
            <div className="flex w-full gap-3 mt-2">
              <Button
                onClick={() => {
                  navigate("/farmer/markets");
                  toast.dismiss(t);
                }}
                className="flex-2"
                size={"sm"}
              >
                View Prices
              </Button>

              <Button
                onClick={() => toast.dismiss(t)}
                variant={"outline"}
                className="flex-1"
                size={"sm"}
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
  }, []);
};
