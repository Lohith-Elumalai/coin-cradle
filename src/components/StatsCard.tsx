
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  className,
}) => {
  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-gold", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
        {icon && <div className="text-gold">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend) && (
          <div className="flex items-center mt-1">
            {trend && (
              <span
                className={cn(
                  "mr-2 text-xs font-medium flex items-center",
                  trend.isPositive ? "text-green-600" : "text-red-600"
                )}
              >
                <span
                  className={cn(
                    "w-0 h-0 border-solid border-transparent inline-block mr-1",
                    trend.isPositive
                      ? "border-t-0 border-b-[6px] border-l-[4px] border-r-[4px] border-b-green-600"
                      : "border-b-0 border-t-[6px] border-l-[4px] border-r-[4px] border-t-red-600"
                  )}
                ></span>
                {trend.value}%
              </span>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
