export interface Farmer {
  _id: string;
  name: string;
  email: string;
  role: "farmer";
  status: "active" | "ban";
  homeAddress: string;
  division: string;
  district: string;
  township: string;
}
