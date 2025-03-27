import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/formatters";
import  {Transaction}  from "@/services/financeService";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

interface TransactionApp {
  name: string;
  logoUrl: string;
}

interface trans extends  Transaction{
  app: TransactionApp;
}

interface RecentTransactionsProps {
  transactions: trans[];
  limit?: number;
  className?: string;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  limit = 5,
  className,
}) => {
  // Sort transactions by date (most recent first) and limit the number
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);

  // Calculate financial stats
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netSavings = totalIncome - totalExpense;

  // Calculate app comparison data
  const expenseTransactions = transactions.filter((t) => t.type === "expense");
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

  const appsExpensesMap = expenseTransactions.reduce((acc, t) => {
    const appKey = t.app.name;
    if (!acc[appKey]) {
      acc[appKey] = { ...t.app, total: 0 };
    }
    acc[appKey].total += t.amount;
    return acc;
  }, {} as Record<string, TransactionApp & { total: number }>);

  const appsArray = Object.values(appsExpensesMap).sort((a, b) => b.total - a.total);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Financial Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-green-600">Total Income</div>
            <div className="text-xl font-semibold">{formatCurrency(totalIncome)}</div>
          </div>
          <div className="p-4 bg-red-50 rounded-lg">
            <div className="text-sm text-red-600">Total Expense</div>
            <div className="text-xl font-semibold">{formatCurrency(totalExpense)}</div>
          </div>
          <div
            className={`p-4 rounded-lg ${
              netSavings >= 0 ? "bg-green-50" : "bg-red-50"
            }`}
          >
            <div className="text-sm">{netSavings >= 0 ? "Net Savings" : "Net Loss"}</div>
            <div
              className={`text-xl font-semibold ${
                netSavings >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatCurrency(Math.abs(netSavings))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Transactions Table */}
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>App</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <span
                        className={`rounded-full p-1 ${
                          transaction.type === "income"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {transaction.type === "income" ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowDownLeft className="h-3 w-3" />
                        )}
                      </span>
                      {transaction.description}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-gold/5 text-gold border-gold/20"
                      >
                        {transaction.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <img
                          src={transaction.app.logoUrl}
                          alt={transaction.app.name}
                          className="h-4 w-4 rounded-full"
                        />
                        <span>{transaction.app.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(transaction.date, "short")}</TableCell>
                    <TableCell
                      className={`text-right font-medium ${
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                  </TableRow>
                ))}
                {recentTransactions.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No transactions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* App Comparison */}
          <div>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">
                  App Expenditure Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {appsArray.length > 0 ? (
                  appsArray.map((app) => {
                    const percentage =
                      totalExpenses > 0 ? (app.total / totalExpenses) * 100 : 0;
                    return (
                      <div
                        key={app.name}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={app.logoUrl}
                            alt={app.name}
                            className="h-6 w-6 rounded-full"
                          />
                          <span className="text-sm font-medium">{app.name}</span>
                        </div>
                        <div className="text-sm text-right">
                          <div>{formatCurrency(app.total)}</div>
                          <div className="text-muted-foreground">
                            {percentage.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No expense data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;