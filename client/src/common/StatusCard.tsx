import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type React from "react";

interface StatusCardProps {
  title: string;
  //   isLoading: boolean;
  bgColor: string;
  value: number;
  icon: React.ReactNode;
}

function StatusCard({
  title,
  //   isLoading,
  bgColor,
  value,
  icon,
}: StatusCardProps) {
  return (
    <Card className={bgColor}>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-sm">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div>
          <span className="text-2xl font-bold">{value} MMK</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default StatusCard;
