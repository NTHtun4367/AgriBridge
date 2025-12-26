export interface User {
  _id: string;
  name: string;
  email: string;
  role: "farmer" | "merchant" | "admin";
  status: "active" | "ban";
  verificationStatus: "unverified" | "verified" | "pending";
  homeAddress: string;
  division: string;
  district: string;
  township: string;
  merchantId?: string;
  createdAt: string;
}
