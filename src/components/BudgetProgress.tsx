
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/formatters";
import { Budget } from "@/services/financeService";
import { cn } from "@/lib/utils";

interface BudgetProgressProps {
  budgets: Budget[];
  className?: string;
}

const BudgetProgress: React.FC<BudgetProgressProps> = ({ budgets, className }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Budget Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {budgets.map((budget) => {
            const percentage = (budget.spent / budget.limit) * 100;
            const isOverBudget = percentage > 100;
            const progressColor = isOverBudget
              ? "bg-red-500"
              : percentage > 80
              ? "bg-yellow-500"
              : "bg-gold";

            return (
              <div key={budget.id} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{budget.category}</span>
                  <span>
                    {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                  </span>
                </div>
                <Progress
                  value={Math.min(percentage, 100)}
                  className={cn("h-2", progressColor)}
                />
                {isOverBudget && (
                  <p className="text-xs text-red-500 font-medium">
                    Over budget by {formatCurrency(budget.spent - budget.limit)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetProgress;
