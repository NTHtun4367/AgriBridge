export interface User {
  _id: string;
  name: string;
  email?: string; // Optional because farmers might use phone
  phone?: string;
  avatar?: string;
  avatarPublicId?: string;
  bio?: string;
  role: "farmer" | "merchant" | "admin";
  status: "active" | "ban";
  verificationStatus: "unverified" | "verified" | "pending";
  homeAddress: string;
  division: string;
  district: string;
  township: string;
  merchantId?: any;
  createdAt: string;
}
