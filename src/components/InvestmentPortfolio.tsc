import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { formatCurrency } from "@/lib/formatters";
import { ArrowUp, ArrowDown, Info, BarChart3, PieChart as PieChartIcon, TrendingUp, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock data - in a real application, this would come from a service
const portfolioData = {
  totalValue: 157892.45,
  totalReturn: 34521.18,
  totalReturnPercentage: 28.12,
  todayChange: 1245.67,
  todayChangePercentage: 0.78,
  assetAllocation: [
    { name: 'Stocks', value: 82451.23, percentage: 52.22, color: '#3B82F6' },
    { name: 'ETFs', value: 41237.89, percentage: 26.12, color: '#10B981' },
    { name: 'Bonds', value: 24531.42, percentage: 15.54, color: '#F59E0B' },
    { name: 'Cash', value: 9671.91, percentage: 6.12, color: '#6B7280' }
  ],
  investments: [
    {
      id: 'inv1',
      name: 'Apple Inc.',
      ticker: 'AAPL',
      quantity: 45,
      price: 187.42,
      value: 8433.90,
      cost: 6750.00,
      return: 1683.90,
      returnPercentage: 24.95,
      dayChange: 87.45,
      dayChangePercentage: 1.05,
      type: 'stock'
    },
    {
      id: 'inv2',
      name: 'Microsoft Corp.',
      ticker: 'MSFT',
      quantity: 28,
      price: 397.58,
      value: 11132.24,
      cost: 8680.00,
      return: 2452.24,
      returnPercentage: 28.25,
      dayChange: 112.56,
      dayChangePercentage: 1.02,
      type: 'stock'
    },
    {
      id: 'inv3',
      name: 'Vanguard S&P 500 ETF',
      ticker: 'VOO',
      quantity: 35,
      price: 451.30,
      value: 15795.50,
      cost: 12250.00,
      return: 3545.50,
      returnPercentage: 28.94,
      dayChange: 175.35,
      dayChangePercentage: 1.12,
      type: 'etf'
    },
    {
      id: 'inv4',
      name: 'iShares Core U.S. Aggregate Bond ETF',
      ticker: 'AGG',
      quantity: 120,
      price: 98.32,
      value: 11798.40,
      cost: 12600.00,
      return: -801.60,
      returnPercentage: -6.36,
      dayChange: -48.00,
      dayChangePercentage: -0.41,
      type: 'etf'
    },
    {
      id: 'inv5',
      name: 'Tesla Inc.',
      ticker: 'TSLA',
      quantity: 18,
      price: 176.83,
      value: 3182.94,
      cost: 3150.00,
      return: 32.94,
      returnPercentage: 1.05,
      dayChange: -57.60,
      dayChangePercentage: -1.78,
      type: 'stock'
    }
  ],
  performanceHistory: [
    { date: '2023-01', value: 120000 },
    { date: '2023-02', value: 125000 },
    { date: '2023-03', value: 123000 },
    { date: '2023-04', value: 130000 },
    { date: '2023-05', value: 135000 },
    { date: '2023-06', value: 132000 },
    { date: '2023-07', value: 140000 },
    { date: '2023-08', value: 143000 },
    { date: '2023-09', value: 148000 },
    { date: '2023-10', value: 149000 },
    { date: '2023-11', value: 153000 },
    { date: '2023-12', value: 156000 },
    { date: '2024-01', value: 158000 }
  ]
};

const InvestmentPortfolio = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsDataLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  if (isDataLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="animate-pulse space-y-8">
            <div className="h-32 bg-gray-100 rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-80 bg-gray-100 rounded-lg"></div>
              <div className="h-80 bg-gray-100 rounded-lg"></div>
            </div>
            <div className="h-96 bg-gray-100 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full page-transition">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Investment Portfolio</h1>
            <p className="text-gray-600">
              Track your investments and analyze performance.
            </p>
          </div>
          <Button className="bg-gold hover:bg-gold-dark text-white">
            <Plus className="mr-2 h-4 w-4" />
            Add Investment
          </Button>
        </div>

        {/* Portfolio Summary */}
        <Card className="mb-8 shadow-card">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Total Value</span>
                <span className="text-2xl font-bold">{formatCurrency(portfolioData.totalValue)}</span>
                <div className="flex items-center mt-1">
                  <span className={`inline-flex items-center text-sm ${portfolioData.todayChangePercentage >= 0 ? 'text-success' : 'text-danger'}`}>
                    {portfolioData.todayChangePercentage >= 0 ? 
                      <ArrowUp className="h-3 w-3 mr-1" /> : 
                      <ArrowDown className="h-3 w-3 mr-1" />}
                    {portfolioData.todayChangePercentage.toFixed(2)}% today
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Total Return</span>
                <span className="text-2xl font-bold">{formatCurrency(portfolioData.totalReturn)}</span>
                <div className="flex items-center mt-1">
                  <span className={`inline-flex items-center text-sm ${portfolioData.totalReturnPercentage >= 0 ? 'text-success' : 'text-danger'}`}>
                    {portfolioData.totalReturnPercentage >= 0 ? 
                      <ArrowUp className="h-3 w-3 mr-1" /> : 
                      <ArrowDown className="h-3 w-3 mr-1" />}
                    {portfolioData.totalReturnPercentage.toFixed(2)}% overall
                  </span>
                </div>
              </div>
              
              <div className="col-span-2">
                <div className="h-24 flex items-center justify-end">
                  <div className="flex gap-4">
                    <Button variant="outline" className="text-navy">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                    <Button variant="outline" className="text-navy">
                      <Info className="mr-2 h-4 w-4" />
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Asset Allocation */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <PieChartIcon className="mr-2 h-5 w-5 text-gray-500" />
                Asset Allocation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={portfolioData.assetAllocation}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {portfolioData.assetAllocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {portfolioData.assetAllocation.map((asset, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: asset.color }}></div>
                    <span className="text-gray-700">{asset.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Chart */}
          <Card className="lg:col-span-2 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <TrendingUp className="mr-2 h-5 w-5 text-gray-500" />
                Performance History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={portfolioData.performanceHistory}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#CFB53B" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#CFB53B" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" />
                    <YAxis 
                      orientation="right"
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <Tooltip 
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#CFB53B" 
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Investments Table */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Your Investments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Name</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Quantity</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Price</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Value</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Return</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Day Change</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioData.investments.map((investment) => (
                    <tr key={investment.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{investment.name}</span>
                          <span className="text-sm text-gray-500">{investment.ticker}</span>
                        </div>
                      </td>
                      <td className="text-right py-4 px-4">{investment.quantity}</td>
                      <td className="text-right py-4 px-4">{formatCurrency(investment.price)}</td>
                      <td className="text-right py-4 px-4 font-medium">{formatCurrency(investment.value)}</td>
                      <td className="text-right py-4 px-4">
                        <div className="flex flex-col items-end">
                          <span className={`font-medium ${investment.returnPercentage >= 0 ? 'text-success' : 'text-danger'}`}>
                            {investment.returnPercentage >= 0 ? '+' : ''}{investment.returnPercentage.toFixed(2)}%
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatCurrency(investment.return)}
                          </span>
                        </div>
                      </td>
                      <td className="text-right py-4 px-4">
                        <span className={`inline-flex items-center ${investment.dayChangePercentage >= 0 ? 'text-success' : 'text-danger'}`}>
                          {investment.dayChangePercentage >= 0 ? 
                            <ArrowUp className="h-3 w-3 mr-1" /> : 
                            <ArrowDown className="h-3 w-3 mr-1" />}
                          {Math.abs(investment.dayChangePercentage).toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvestmentPortfolio;
