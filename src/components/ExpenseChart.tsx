
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercentage } from "@/lib/formatters";

interface ExpenseChartProps {
  data: {
    category: string;
    amount: number;
    percentage: number;
  }[];
  className?: string;
}

// Generate colors for each category
const COLORS = [
  "#D4AF37", // Gold
  "#B18E2B", // Dark Gold
  "#E5C56E", // Light Gold
  "#F8F0E3", // Gold Tint
  "#A39661", // Olive Gold
  "#8A7B46", // Antique Gold
  "#CDB07E", // Sand Gold
  "#D6C291", // Champagne Gold
  "#BFA663", // Golden Olive
  "#9C885F", // Tan Gold
];

const ExpenseChart: React.FC<ExpenseChartProps> = ({ data, className }) => {
  const totalExpenses = data.reduce((acc, curr) => acc + curr.amount, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { category, amount, percentage } = payload[0].payload;
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100">
          <p className="font-medium text-gray-900">{category}</p>
          <p className="text-sm text-gray-700">{formatCurrency(amount)}</p>
          <p className="text-xs text-gray-500">{formatPercentage(percentage)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Expense Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="amount"
                animationDuration={800}
                animationBegin={0}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="#fff"
                    strokeWidth={1}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                formatter={(value, entry, index) => {
                  const item = data[index];
                  return (
                    <span className="text-sm text-gray-700">
                      {value} ({formatPercentage(item.percentage)})
                    </span>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 text-center text-sm text-gray-500">
          Total Expenses: {formatCurrency(totalExpenses)}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseChart;
