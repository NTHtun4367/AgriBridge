import {
  useGetMerchantInfoForAdminQuery,
  useUpdateUserVerificationStatusMutation,
} from "@/store/slices/adminApi";
import type { User } from "@/types/user";
import {
  Dialog,
  DialogContent,
  //   DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
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

interface VerificationDetailsProps {
  user: User;
}

function VerificationDetails({ user }: VerificationDetailsProps) {
  const [updateUserVerificationStatus, { isLoading: vLoading }] =
    useUpdateUserVerificationStatusMutation();
  const { data: merchant, isLoading } = useGetMerchantInfoForAdminQuery(
    user.merchantId!
  );

  const handleVerificationStatus = async (
    userId: string,
    status: "unverified" | "verified"
  ) => {
    await updateUserVerificationStatus({ userId, status });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="hover:bg-primary hover:text-white transition-all cursor-pointer"
        >
          View Details
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[95vw] lg:max-w-[1200px] h-[90vh] p-0 gap-0 overflow-hidden flex flex-col">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">
                {user.name}
              </DialogTitle>
              <p className="text-xs text-muted-foreground">ID: {user._id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 pr-8">
            <Badge variant="outline" className="bg-white text-black">
              Merchant Account
            </Badge>
            <Badge className="bg-amber-500">Pending Review</Badge>
          </div>
        </div>

        <div className="flex overflow-hidden">
          {/* LEFT SIDE: Information Scroll Area */}
          <div className="w-full lg:w-2/5 overflow-y-auto p-6 border-r">
            <div className="space-y-8">
              {/* Account Section */}
              <section>
                <div className="flex items-center gap-2 mb-4 text-primary font-bold">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm tracking-widest uppercase">
                    Contact & Account
                  </span>
                </div>
                <div className="grid gap-4 text-sm">
                  <div className="flex justify-between py-2 border-b border-dashed">
                    <span className="text-slate-500">Email</span>
                    <span className="font-medium">{user.email}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-dashed">
                    <span className="text-slate-500">Phone</span>
                    <span className="font-medium">{merchant?.phone}</span>
                  </div>
                </div>
              </section>

              {/* Business Section */}
              <section className="bg-secondary p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-4 text-primary font-bold">
                  <Store className="w-4 h-4" />
                  <span className="text-sm tracking-widest uppercase">
                    Business Info
                  </span>
                </div>
                <div className="space-y-1 mb-4">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">
                    Legal Business Name
                  </p>
                  <p className="text-lg font-bold">{merchant?.businessName}</p>
                </div>
                <div className="bg-white p-3 rounded border border-slate-300">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">
                    NRC Identification
                  </p>
                  <p className="text-md font-mono font-bold tracking-tighter text-black">
                    {merchant &&
                      `${merchant.nrcRegion}/${merchant.nrcTownship}(${merchant.nrcType})${merchant.nrcNumber}`}
                  </p>
                </div>
              </section>

              {/* Address Section */}
              <section>
                <div className="flex items-center gap-2 mb-4 text-primary font-bold">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm tracking-widest uppercase">
                    Registered Address
                  </span>
                </div>
                <div className="space-y-1 bg-secondary p-4 rounded-xl">
                  {/* <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white p-2 rounded border">
                      <p className="text-[10px] text-slate-400">Division</p>
                      <p className="text-xs font-bold">{user.division}</p>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <p className="text-[10px] text-slate-400">District</p>
                      <p className="text-xs font-bold">{user.district}</p>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <p className="text-[10px] text-slate-400">Township</p>
                      <p className="text-xs font-bold">{user.township}</p>
                    </div>
                  </div> */}
                  <div className="p-2">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">
                      Division
                    </p>
                    <p className="text-sm italic">"{user.division}"</p>
                  </div>
                  <div className="p-2">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">
                      District
                    </p>
                    <p className="text-sm italic">"{user.district}"</p>
                  </div>
                  <div className="p-2">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">
                      Township
                    </p>
                    <p className="text-sm italic">"{user.township}"</p>
                  </div>
                  <div className="p-2">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">
                      Full Home Address
                    </p>
                    <p className="text-sm italic">"{user.homeAddress}"</p>
                  </div>
                </div>
              </section>

              {/* Action Buttons inside scroll area for mobile, or fixed bottom */}
              <div className="flex items-center gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1 text-red-500 hover:bg-red-50 border-red-200 cursor-pointer"
                  onClick={() =>
                    handleVerificationStatus(user._id, "unverified")
                  }
                  disabled={vLoading}
                >
                  <UserX className="h-5 w-5" /> Reject & Ban
                </Button>
                <Button
                  className="flex-1 bg-primary text-md font-bold shadow-md cursor-pointer"
                  onClick={() => handleVerificationStatus(user._id, "verified")}
                  disabled={vLoading}
                >
                  <UserCheck className="h-5 w-5" /> Approve Merchant
                </Button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Document Viewer (The "Evidence" Wall) */}
          <div className="hidden lg:flex flex-1 p-8 flex-col items-center justify-start overflow-y-auto space-y-6">
            <div className="w-full flex justify-between items-center mb-2">
              <h3 className="text-sm font-bold flex items-center gap-2 text-slate-600 uppercase tracking-widest">
                <IdCard className="w-4 h-4" /> Identity Verification
              </h3>
              <span className="text-[10px] text-slate-400">
                Tip: Scroll to see back side
              </span>
            </div>

            {isLoading ? (
              <Loader2 className="w-10 h-10 animate-spin text-slate-300 mt-20" />
            ) : (
              <>
                {/* Image Container 1 */}
                <div className="w-full max-w-lg space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-bold text-slate-500">
                      NRC FRONT PHOTO
                    </span>
                    <a
                      href={merchant?.nrcFrontImage?.url}
                      target="_blank"
                      className="text-[10px] text-blue-500 hover:underline flex items-center"
                    >
                      Open Full <ExternalLink className="w-2 h-2 ml-1" />
                    </a>
                  </div>
                  <div className="rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-slate-200 aspect-[1.58/1]">
                    <img
                      src={merchant?.nrcFrontImage?.url}
                      className="w-full h-full object-cover"
                      alt="Front"
                    />
                  </div>
                </div>

                {/* Image Container 2 */}
                <div className="w-full max-w-lg space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-bold text-slate-500">
                      NRC BACK PHOTO
                    </span>
                    <a
                      href={merchant?.nrcBackImage?.url}
                      target="_blank"
                      className="text-[10px] text-blue-500 hover:underline flex items-center"
                    >
                      Open Full <ExternalLink className="w-2 h-2 ml-1" />
                    </a>
                  </div>
                  <div className="rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-slate-200 aspect-[1.58/1]">
                    <img
                      src={merchant?.nrcBackImage?.url}
                      className="w-full h-full object-cover"
                      alt="Back"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-blue-50 p-4 rounded-lg border border-blue-100 max-w-lg">
                  <Info className="w-4 h-4 text-blue-500 mt-1 shrink-0" />
                  <p className="text-[11px] text-blue-700 leading-tight">
                    Check if the person's photo on the NRC matches the account
                    name and ensure the document is not expired or blurred.
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
