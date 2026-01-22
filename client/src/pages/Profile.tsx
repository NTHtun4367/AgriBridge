import React from "react";
import { useCurrentUserQuery } from "@/store/slices/userApi";
import {
  MapPin,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  User as UserIcon,
  Loader2,
  Edit3,
  ExternalLink,
  Globe,
  Building2,
  Navigation,
  Compass,
} from "lucide-react";
import { useNavigate } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const Profile: React.FC = () => {
  const { data: user, isLoading } = useCurrentUserQuery();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50/50 dark:bg-slate-950/50">
        <div className="text-center">
          <Loader2 className="animate-spin text-primary h-10 w-10 mx-auto mb-4" />
          <p className="text-muted-foreground animate-pulse">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
      day: "numeric",
    });
  };

  const renderValue = (val: any) => {
    if (val === null || val === undefined) return "Not Set";
    if (typeof val === "object") return "Not Set";
    return String(val);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
      {/* Header Profile Cover */}
      <div className="h-40 w-full bg-linear-to-br from-indigo-500 via-primary to-emerald-500 opacity-50 relative">
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 -mt-24 relative z-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT SIDE: Identity */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden">
              <CardContent className="pt-10 pb-8 flex flex-col items-center">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-linear-to-r from-primary to-emerald-400 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                  <Avatar className="h-40 w-40 border-4 border-white dark:border-slate-900 shadow-2xl relative">
                    <AvatarImage src={user.avatar} className="object-cover" />
                    <AvatarFallback className="text-4xl font-bold bg-slate-100 dark:bg-slate-800">
                      {user.name ? user.name.slice(0, 2).toUpperCase() : "US"}
                    </AvatarFallback>
                  </Avatar>
                  {user.verificationStatus === "verified" && (
                    <div className="absolute bottom-2 right-4 bg-primary text-white p-2 rounded-full border-4 border-white dark:border-slate-900 shadow-lg">
                      <ShieldCheck size={20} />
                    </div>
                  )}
                </div>

                <div className="mt-6 text-center">
                  <h1 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">
                    {renderValue(user.name)}
                  </h1>
                  <Badge
                    variant="outline"
                    className="mt-2 uppercase tracking-tighter border-primary/30 text-primary bg-primary/5"
                  >
                    {renderValue(user.role)}
                  </Badge>
                </div>

                <div className="w-full mt-8 space-y-3">
                  <QuickInfo
                    icon={<Mail size={14} />}
                    label="Email"
                    value={renderValue(user.email)}
                  />

                  {/* FIXED: Added optional chaining to prevent crash if merchantId is null */}
                  <QuickInfo
                    icon={<Phone size={14} />}
                    label="Contact"
                    value={renderValue(user.phone || user.merchantId?.phone)}
                  />

                  <QuickInfo
                    icon={<Calendar size={14} />}
                    label="Joined"
                    value={formatDate(user.createdAt)}
                  />
                </div>

                <Button
                  onClick={() => navigate(`/${user.role}/settings`)}
                  className="w-full mt-8 rounded-xl bg-slate-900 dark:bg-primary hover:scale-[1.02] transition-transform py-6"
                >
                  <Edit3 size={18} className="mr-2" /> Edit Profile
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT SIDE: Details */}
          <div className="lg:col-span-8 space-y-6">
            {/* About Section */}
            <Card className="border-none shadow-md bg-white dark:bg-slate-900">
              <CardContent className="p-8">
                <div className="flex items-center gap-2 mb-4 text-primary font-bold uppercase text-xs tracking-widest">
                  <UserIcon size={16} /> User Biography
                </div>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed italic">
                  "
                  {renderValue(user.bio) === "Not Set"
                    ? "No bio available."
                    : user.bio}
                  "
                </p>
              </CardContent>
            </Card>

            {/* Address & Location Section */}
            <div className="grid grid-cols-1 gap-6">
              <Card className="border-none shadow-2xl overflow-hidden bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800">
                <div className="bg-slate-50 dark:bg-slate-800/50 px-8 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <h3 className="font-bold flex items-center gap-2">
                    <Navigation size={18} className="text-primary" />
                    Registered Address
                  </h3>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-none">
                    Active Location
                  </Badge>
                </div>

                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-3">
                    <AddressNode
                      label="Division"
                      value={renderValue(user.division)}
                      icon={<Globe size={18} />}
                    />
                    <AddressNode
                      label="District"
                      value={renderValue(user.district)}
                      icon={<Building2 size={18} />}
                    />
                    <AddressNode
                      label="Township"
                      value={renderValue(user.township)}
                      icon={<Compass size={18} />}
                    />
                  </div>

                  <Separator className="dark:bg-slate-800" />

                  <div className="p-8 bg-linear-to-r from-slate-900 to-slate-800 text-white relative group overflow-hidden">
                    <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <MapPin size={120} />
                    </div>

                    <div className="relative z-10">
                      <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 mb-2">
                        Street & Home Address
                      </p>
                      <p className="text-2xl font-medium tracking-tight leading-snug max-w-2xl">
                        {renderValue(user.homeAddress)}
                      </p>

                      {/* <div className="mt-6 flex items-center gap-4">
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-xs text-slate-400 font-mono tracking-widest">
                          SECURE_LOCATION_VERIFIED
                        </span>
                      </div> */}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Merchant / Account IDs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {user.role === "merchant" && (
                  <Card className="border-none shadow-md bg-blue-600 text-white">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-white/60 uppercase">
                          Merchant ID
                        </p>
                        {/* FIXED: Render specific string property ID instead of the whole object */}
                        <p className="text-xl font-mono font-black mt-1 uppercase">
                          {renderValue(user.merchantId?._id)}
                        </p>
                      </div>
                      <ExternalLink size={24} className="text-white/20" />
                    </CardContent>
                  </Card>
                )}

                <Card className="border-none shadow-md bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase">
                        System UID
                      </p>
                      <p className="text-sm font-mono mt-1 text-slate-500 uppercase">
                        {renderValue(user._id)}
                      </p>
                    </div>
                    <ShieldCheck size={24} className="text-primary/20" />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- Internal Sub-components --- */

const QuickInfo = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-sm">
    <span className="text-muted-foreground flex items-center gap-2">
      {icon} {label}
    </span>
    <span className="font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[140px]">
      {value}
    </span>
  </div>
);

const AddressNode = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) => (
  <div className="p-8 border-r last:border-r-0 border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
    <div className="text-primary mb-3">{icon}</div>
    <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">
      {label}
    </p>
    <p className="text-lg font-bold text-slate-900 dark:text-white leading-none">
      {value}
    </p>
  </div>
);

export default Profile;
