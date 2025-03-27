
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import StatsCard from "@/components/StatsCard";
import ExpenseChart from "@/components/ExpenseChart";
import BudgetProgress from "@/components/BudgetProgress";
import RecentTransactions from "@/components/RecentTransactions";
import FinancialChatbot from "@/components/FinancialChatbot";
import financeService, { 
  Transaction, 
  Budget, 
  FinancialSummary
} from "@/services/financeService";
import { formatCurrency } from "@/lib/formatters";
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  Wallet, 
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      const loadData = async () => {
        setIsDataLoading(true);
        try {
          const [transactionsData, summaryData] = await Promise.all([
            financeService.getTransactions(),
            financeService.getFinancialSummary()
          ]);
          
          setTransactions(transactionsData);
          setSummary(summaryData);
        } catch (error) {
          console.error("Error loading dashboard data:", error);
          toast({
            title: "Error",
            description: "Failed to load dashboard data",
            variant: "destructive",
          });
        } finally {
          setIsDataLoading(false);
        }
      };
      
      loadData();
    }
  }, [isAuthenticated]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin h-12 w-12 border-4 border-gold border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (isDataLoading || !summary) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="animate-pulse space-y-8">
            {/* Stats Cards Placeholder */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
            
            {/* Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-80 bg-gray-100 rounded-lg"></div>
              <div className="h-80 bg-gray-100 rounded-lg"></div>
            </div>
            
            {/* Table Placeholder */}
            <div className="h-64 bg-gray-100 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name.split(' ')[0]}
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your finances today.
            </p>
          </div>
          <Button className="bg-gold hover:bg-gold-dark text-white">
            <Plus className="mr-2 h-4 w-4" />
            Add App
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Balance"
            value={formatCurrency(summary.totalIncome - summary.totalExpenses)}
            icon={<Wallet className="h-5 w-5" />}
            description="Current balance"
          />
          <StatsCard
            title="Income"
            value={formatCurrency(summary.totalIncome)}
            icon={<DollarSign className="h-5 w-5" />}
            trend={{ value: 12, isPositive: true }}
            description="vs. last month"
          />
          <StatsCard
            title="Expenses"
            value={formatCurrency(summary.totalExpenses)}
            icon={<CreditCard className="h-5 w-5" />}
            trend={{ value: 8, isPositive: false }}
            description="vs. last month"
          />
          <StatsCard
            title="Savings"
            value={formatCurrency(summary.netSavings)}
            icon={<TrendingUp className="h-5 w-5" />}
            trend={{ value: 23, isPositive: true }}
            description="vs. last month"
          />
        </div>

        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="bg-white border border-gray-100 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gold/10 data-[state=active]:text-gold">
              Overview
            </TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-gold/10 data-[state=active]:text-gold">
              Transactions
            </TabsTrigger>
            <TabsTrigger value="budgets" className="data-[state=active]:bg-gold/10 data-[state=active]:text-gold">
              Budgets
            </TabsTrigger>
            <TabsTrigger value="advisor" className="data-[state=active]:bg-gold/10 data-[state=active]:text-gold">
              AI Advisor
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <ExpenseChart 
                data={summary.expensesByCategory} 
                className="lg:col-span-2"
              />
              <BudgetProgress budgets={summary.budgets} />
            </div>
            <RecentTransactions transactions={transactions} limit={5} />
          </TabsContent>
          
          <TabsContent value="transactions" className="mt-4">
            <RecentTransactions transactions={transactions} limit={10} />
          </TabsContent>
          
          <TabsContent value="budgets" className="mt-4">
            <BudgetProgress budgets={summary.budgets} />
          </TabsContent>
          
          <TabsContent value="advisor" className="mt-4">
            <div className="h-[600px] bg-white rounded-lg shadow-sm border border-gray-100">
              <FinancialChatbot className="h-full" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
