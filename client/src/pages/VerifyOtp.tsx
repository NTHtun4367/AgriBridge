import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { ShieldCheck, Timer, RefreshCw } from "lucide-react";
import {
  useVerifyOtpMutation,
  useResendOtpMutation,
} from "@/store/slices/userApi";

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
});

type OtpFormValues = z.infer<typeof otpSchema>;

function VerifyOtp() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Mutations
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  const [counter, setCounter] = useState(60);

  // Get identifier from navigation state (passed from Register)
  const identifier = state?.identifier;

  useEffect(() => {
    // Redirect back to register if no identifier is present in state
    if (!identifier) {
      navigate("/register");
      return;
    }

    let timer: any;
    if (counter > 0) {
      timer = setInterval(() => setCounter((prev) => prev - 1), 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [counter, identifier, navigate]);

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const onSubmit = async (data: OtpFormValues) => {
    try {
      const response = await verifyOtp({
        identifier,
        otp: data.otp,
      }).unwrap();

      toast.success("Verification successful!");

      // Route based on backend verification status
      // Merchants go to "pending" (verificationStatus: 'pending')
      // Farmers go to "login" (verificationStatus: 'verified')
      if (response.user.verificationStatus === "pending") {
        navigate("/pending-approval");
      } else {
        navigate("/login");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Verification failed");
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp({ identifier }).unwrap();
      setCounter(60);
      toast.success("A new 6-digit code has been sent!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to resend code");
    }
  };

  return (
    <div className="max-w-[450px] lg:mx-auto mx-6 mt-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="border-t-4 border-t-primary shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="text-primary" size={28} />
          </div>
          <CardTitle className="text-2xl font-bold">Verify Identity</CardTitle>
          <CardDescription>
            We've sent a 6-digit code to <br />
            <span className="font-semibold text-foreground">{identifier}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        className="text-center text-2xl tracking-[0.5em] font-bold h-14"
                        placeholder="000000"
                        maxLength={6}
                        disabled={isVerifying}
                      />
                    </FormControl>
                    <FormMessage className="text-center" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-12 text-lg font-semibold"
                disabled={isVerifying}
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Confirm Code"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-8 text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Timer size={16} />
              <span>
                {counter > 0 ? `Resend in ${counter}s` : "Code expired"}
              </span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleResend}
              disabled={counter > 0 || isResending}
              className="text-primary hover:text-primary/80 hover:bg-primary/5"
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isResending ? "animate-spin" : ""}`}
              />
              Resend Code
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default VerifyOtp;
