import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface StatusCardProps {
  title: string;
  description: string;
  //   bgColor: string;
  value: string;
  trend?: string;
  icon: React.ReactNode;
}

function StatusCard({
  title,
  value,
  icon,
  description,
  trend,
}: StatusCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {/* <Icon className="h-4 w-4 text-muted-foreground" /> */}
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
          {trend && (
            <span className="text-green-600 flex items-center">
              <ArrowUpRight className="h-3 w-3" /> {trend}
            </span>
          )}
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

export default StatusCard;
