import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/formatters";
import { Budget } from "@/services/financeService";
import { cn } from "@/lib/utils";

interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
}

interface BudgetProgressProps {
  budgets: Budget[];
  className?: string;
}

const BudgetProgress: React.FC<BudgetProgressProps> = ({ budgets, className }) => {
  const [monthlyBudget, setMonthlyBudget] = React.useState<number>(0);
  const [goals, setGoals] = React.useState<Goal[]>([]);
  const [newGoal, setNewGoal] = React.useState({
    name: "",
    target: 0,
    current: 0,
  });

  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const remainingBudget = monthlyBudget - totalSpent;
  const totalPercentage = monthlyBudget > 0 ? (totalSpent / monthlyBudget) * 100 : 0;
  const isOverTotalBudget = totalPercentage > 100;
  
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoal.name && newGoal.target > 0) {
      setGoals([...goals, { ...newGoal, id: Date.now().toString() }]);
      setNewGoal({ name: "", target: 0, current: 0 });
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Budget & Goals Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Monthly Budget Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Monthly Budget</label>
              <input
                type="number"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                className="w-full p-2 border rounded-md"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Spent:</span>
                <span className="font-medium">
                  {formatCurrency(totalSpent)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Remaining:</span>
                <span className={cn(remainingBudget < 0 ? "text-red-500" : "text-green-500")}>
                  {formatCurrency(remainingBudget)}
                </span>
              </div>
              <Progress
                value={Math.min(totalPercentage, 100)}
                className={cn(
                  "h-3",
                  isOverTotalBudget
                    ? "bg-red-500"
                    : totalPercentage > 80
                    ? "bg-yellow-500"
                    : "bg-green-500"
                )}
              />
              {isOverTotalBudget && (
                <p className="text-xs text-red-500 font-medium">
                  Over budget by {formatCurrency(totalSpent - monthlyBudget)}
                </p>
              )}
            </div>
          </div>

          {/* Category Budgets */}
          <div className="space-y-4">
            <h3 className="font-medium">Category Breakdown</h3>
            {budgets.map((budget) => {
              const percentage = (budget.spent / budget.limit) * 100;
              const isOverBudget = percentage > 100;
              const progressColor = isOverBudget
                ? "bg-red-500"
                : percentage > 80
                ? "bg-yellow-500"
                : "bg-green-500";

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

          {/* Savings Goals */}
          <div className="space-y-4">
            <h3 className="font-medium">Savings Goals</h3>
            <form onSubmit={handleAddGoal} className="space-y-3">
              <input
                type="text"
                placeholder="Goal name"
                value={newGoal.name}
                onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                className="w-full p-2 border rounded-md"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Target amount"
                  value={newGoal.target || ""}
                  onChange={(e) => setNewGoal({ ...newGoal, target: Number(e.target.value) })}
                  className="p-2 border rounded-md"
                  min="0"
                />
                <input
                  type="number"
                  placeholder="Current amount"
                  value={newGoal.current || ""}
                  onChange={(e) => setNewGoal({ ...newGoal, current: Number(e.target.value) })}
                  className="p-2 border rounded-md"
                  min="0"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Add Goal
              </button>
            </form>

            {goals.map((goal) => {
              const goalPercentage = (goal.current / goal.target) * 100;
              const progressColor = goalPercentage >= 100 ? "bg-green-500" : "bg-blue-500";

              return (
                <div key={goal.id} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{goal.name}</span>
                    <span>
                      {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
                    </span>
                  </div>
                  <Progress
                    value={goalPercentage}
                    className={cn("h-2", progressColor)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetProgress;