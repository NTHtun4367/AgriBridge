import type React from "react";

export interface Page {
  name: string;
  path: string;
  icon: React.ReactNode;
  subItems?: any;
}
