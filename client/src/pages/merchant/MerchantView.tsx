import { useState } from "react";
import {
  Search,
  MapPin,
  Phone,
  Store,
  //   Info,
  ExternalLink,
  Clock,
  CheckCircle2,
} from "lucide-react";

// Shadcn UI Components (Assuming standard paths)
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  //   DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// 1. Mock Data
const MERCHANTS = [
  {
    id: 1,
    name: "Golden Grain Wholesalers",
    manager: "U Hla Maung",
    phone: "+95 9 123 456 789",
    location: "Hlaing Township, Yangon",
    specialty: "Paddy & Beans",
    rating: "4.8",
    status: "Open",
    joined: "2022",
  },
  {
    id: 2,
    name: "Htoo Thit Agri-Trade",
    manager: "Daw Aye Aye",
    phone: "+95 9 987 654 321",
    location: "Pyin Oo Lwin, Mandalay",
    specialty: "Fertilizers & Seeds",
    rating: "4.9",
    status: "Open",
    joined: "2021",
  },
  {
    id: 3,
    name: "Green Valley Logistics",
    manager: "Ko Zaw Lin",
    phone: "+95 9 444 555 666",
    location: "Bago Region",
    specialty: "Transport & Storage",
    rating: "4.5",
    status: "Closed",
    joined: "2023",
  },
];

// 2. Merchant Detail Modal Component
const MerchantDetail = ({ merchant }: any) => {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-16 w-16 border-2 border-lime-500">
            <AvatarFallback className="bg-lime-100 text-lime-700 text-xl font-bold">
              {merchant.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <DialogTitle className="text-xl">{merchant.name}</DialogTitle>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-blue-500" /> Verified
              Merchant
            </p>
          </div>
        </div>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
          <Store className="h-5 w-5 text-lime-600" />
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold">
              Specialty
            </p>
            <p className="text-sm font-medium">{merchant.specialty}</p>
          </div>
        </div>

        <div className="space-y-3 px-1">
          <div className="flex items-center text-sm">
            <Phone className="mr-3 h-4 w-4 text-slate-400" />
            <span>{merchant.phone}</span>
          </div>
          <div className="flex items-center text-sm">
            <MapPin className="mr-3 h-4 w-4 text-slate-400" />
            <span>{merchant.location}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="mr-3 h-4 w-4 text-slate-400" />
            <span
              className={
                merchant.status === "Open" ? "text-green-600" : "text-red-600"
              }
            >
              Currently {merchant.status}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <Button className="flex-1 bg-lime-600 hover:bg-lime-700">
          Call Merchant
        </Button>
        <Button variant="outline" className="flex-1">
          View Location
        </Button>
      </div>
    </DialogContent>
  );
};

// 3. Main Merchants View
export default function MerchantsView() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMerchants = MERCHANTS.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Merchant Profiles
          </h2>
          <p className="text-muted-foreground text-sm">
            Find and contact trusted buyers and suppliers.
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search name or city..."
            className="pl-10 border-slate-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMerchants.map((merchant) => (
          <Dialog key={merchant.id}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:border-lime-500 hover:shadow-lg transition-all duration-300 group">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <Avatar className="h-12 w-12 border border-slate-100">
                      <AvatarFallback className="bg-slate-100 text-slate-600">
                        {merchant.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                        merchant.status === "Open"
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {merchant.status}
                    </span>
                  </div>
                  <CardTitle className="text-lg mt-4 group-hover:text-lime-700 transition-colors">
                    {merchant.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-600 space-y-2 pb-6">
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-lime-600" />
                    {merchant.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-lime-600" />
                    {merchant.location}
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-slate-50/50 py-3 flex justify-between items-center text-xs text-slate-400 font-medium">
                  <span>Joined {merchant.joined}</span>
                  <div className="flex items-center gap-1 text-lime-600">
                    Details <ExternalLink className="h-3 w-3" />
                  </div>
                </CardFooter>
              </Card>
            </DialogTrigger>
            <MerchantDetail merchant={merchant} />
          </Dialog>
        ))}
      </div>

      {filteredMerchants.length === 0 && (
        <div className="text-center py-20 text-slate-400">
          No merchants found matching your search.
        </div>
      )}
    </div>
  );
}
