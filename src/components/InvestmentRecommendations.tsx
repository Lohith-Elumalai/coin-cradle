import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from "@/lib/formatters";
import { 
  ArrowUp, 
  ArrowDown, 
  TrendingUp, 
  LineChart as LineChartIcon, 
  ShieldAlert, 
  Clock, 
  DollarSign,
  Info,
  Sparkles,
  Flame
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock data - in a real application, this would come from a service
const recommendations = [
  {
    id: "rec1",
    name: "Vanguard Total Stock Market ETF",
    ticker: "VTI",
    type: "etf",
    price: 243.87,
    analysis: {
      riskLevel: "low",
      potentialReturn: "moderate",
      timeHorizon: "long",
      rationale: "Broad market exposure with low expense ratio. Good for long-term wealth building."
    },
    metrics: {
      expenseRatio: 0.03,
      dividendYield: 1.32,
      peRatio: 22.8
    },
    priceHistory: [
      { date: 'Jan', value: 220 },
      { date: 'Feb', value: 230 },
      { date: 'Mar', value: 225 },
      { date: 'Apr', value: 232 },
      { date: 'May', value: 240 },
      { date: 'Jun', value: 238 },
      { date: 'Jul', value: 245 }
    ]
  },
  {
    id: "rec2",
    name: "iShares MSCI Emerging Markets ETF",
    ticker: "EEM",
    type: "etf",
    price: 41.43,
    analysis: {
      riskLevel: "high",
      potentialReturn: "high",
      timeHorizon: "long",
      rationale: "Emerging markets exposure for portfolio diversification. Higher risk but potential for higher returns."
    },
    metrics: {
      expenseRatio: 0.68,
      dividendYield: 2.26,
      peRatio: 16.2
    },
    priceHistory: [
      { date: 'Jan', value: 38 },
      { date: 'Feb', value: 36 },
      { date: 'Mar', value: 35 },
      { date: 'Apr', value: 39 },
      { date: 'May', value: 40 },
      { date: 'Jun', value: 42 },
      { date: 'Jul', value: 41 }
    ]
  },
  {
    id: "rec3",
    name: "Nvidia Corporation",
    ticker: "NVDA",
    type: "stock",
    price: 874.15,
    analysis: {
      riskLevel: "high",
      potentialReturn: "high",
      timeHorizon: "medium",
      rationale: "Leader in AI and GPU technology with strong growth potential in emerging technologies."
    },
    metrics: {
      marketCap: 2150000000000,
      peRatio: 65.3,
      dividendYield: 0.03
    },
    priceHistory: [
      { date: 'Jan', value: 600 },
      { date: 'Feb', value: 650 },
      { date: 'Mar', value: 700 },
      { date: 'Apr', value: 750 },
      { date: 'May', value: 800 },
      { date: 'Jun', value: 850 },
      { date: 'Jul', value: 875 }
    ]
  },
  {
    id: "rec4",
    name: "Vanguard Total Bond Market ETF",
    ticker: "BND",
    type: "etf",
    price: 72.85,
    analysis: {
      riskLevel: "low",
      potentialReturn: "low",
      timeHorizon: "medium",
      rationale: "Broad exposure to U.S. investment-grade bonds. Good for stability and income."
    },
    metrics: {
      expenseRatio: 0.03,
      dividendYield: 4.12,
      avgMaturity: "8.5 years"
    },
    priceHistory: [
      { date: 'Jan', value: 73 },
      { date: 'Feb', value: 72.5 },
      { date: 'Mar', value: 71 },
      { date: 'Apr', value: 71.5 },
      { date: 'May', value: 72 },
      { date: 'Jun', value: 73 },
      { date: 'Jul', value: 73 }
    ]
  },
  {
    id: "rec5",
    name: "Alphabet Inc.",
    ticker: "GOOGL",
    type: "stock",
    price: 164.32,
    analysis: {
      riskLevel: "moderate",
      potentialReturn: "moderate",
      timeHorizon: "long",
      rationale: "Dominant position in search, AI advances, and diverse revenue streams across multiple tech sectors."
    },
    metrics: {
      marketCap: 2070000000000,
      peRatio: 28.6,
      dividendYield: 0.0
    },
    priceHistory: [
      { date: 'Jan', value: 140 },
      { date: 'Feb', value: 152 },
      { date: 'Mar', value: 148 },
      { date: 'Apr', value: 155 },
      { date: 'May', value: 160 },
      { date: 'Jun', value: 158 },
      { date: 'Jul', value: 165 }
    ]
  },
  {
    id: "rec6",
    name: "iShares Treasury Floating Rate Bond ETF",
    ticker: "TFLO",
    type: "etf",
    price: 50.58,
    analysis: {
      riskLevel: "low",
      potentialReturn: "low",
      timeHorizon: "short",
      rationale: "Low-risk treasury exposure with adjustable rates. Good for short-term cash management."
    },
    metrics: {
      expenseRatio: 0.15,
      dividendYield: 5.32,
      avgMaturity: "< 1 year"
    },
    priceHistory: [
      { date: 'Jan', value: 50.4 },
      { date: 'Feb', value: 50.45 },
      { date: 'Mar', value: 50.47 },
      { date: 'Apr', value: 50.5 },
      { date: 'May', value: 50.53 },
      { date: 'Jun', value: 50.56 },
      { date: 'Jul', value: 50.58 }
    ]
  }
];

const InvestmentRecommendations = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [riskFilter, setRiskFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [filteredRecommendations, setFilteredRecommendations] = useState(recommendations);

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

  // Apply filters
  useEffect(() => {
    let filtered = [...recommendations];
    
    if (riskFilter !== "all") {
      filtered = filtered.filter(rec => rec.analysis.riskLevel === riskFilter);
    }
    
    if (typeFilter !== "all") {
      filtered = filtered.filter(rec => rec.type === typeFilter);
    }
    
    setFilteredRecommendations(filtered);
  }, [riskFilter, typeFilter]);

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
            <div className="h-24 bg-gray-100 rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getRiskBadgeColor = (riskLevel) => {
    switch(riskLevel) {
      case "low": return "bg-success-light text-success-dark";
      case "moderate": return "bg-warning-light text-warning-dark";
      case "high": return "bg-danger-light text-danger-dark";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getReturnBadgeColor = (returnLevel) => {
    switch(returnLevel) {
      case "low": return "bg-muted text-muted-foreground";
      case "moderate": return "bg-info-light text-info-dark";
      case "high": return "bg-gold bg-opacity-20 text-gold-dark";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getTimeHorizonBadgeColor = (timeHorizon) => {
    switch(timeHorizon) {
      case "short": return "bg-muted text-muted-foreground";
      case "medium": return "bg-info-light text-info-dark";
      case "long": return "bg-navy bg-opacity-10 text-navy-dark";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full page-transition">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Investment Recommendations</h1>
            <p className="text-gray-600">
              Personalized investment suggestions based on your risk profile.
            </p>
          </div>
          <Button className="bg-gold hover:bg-gold-dark text-white">
            <Sparkles className="mr-2 h-4 w-4" />
            Update Preferences
          </Button>
        </div>

        {/* Risk Appetite Summary */}
        <Card className="mb-8 shadow-card bg-white">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gold bg-opacity-10 rounded-full">
                  <ShieldAlert className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-navy">Risk Appetite</h3>
                  <p className="text-sm text-gray-500">Moderate</p>
                  <p className="text-xs text-gray-400 mt-1">Based on your financial profile and preferences</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gold bg-opacity-10 rounded-full">
                  <TrendingUp className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-navy">Target Return</h3>
                  <p className="text-sm text-gray-500">8-12% annually</p>
                  <p className="text-xs text-gray-400 mt-1">Balanced growth with manageable volatility</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gold bg-opacity-10 rounded-full">
                  <Clock className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-navy">Investment Horizon</h3>
                  <p className="text-sm text-gray-500">5-10 years</p>
                  <p className="text-xs text-gray-400 mt-1">Medium to long-term investment strategy</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Risk Level</label>
            <Tabs 
              value={riskFilter} 
              onValueChange={setRiskFilter}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid grid-cols-4 w-full sm:w-[400px]">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="low">Low</TabsTrigger>
                <TabsTrigger value="moderate">Moderate</TabsTrigger>
                <TabsTrigger value="high">High</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Investment Type</label>
            <Tabs 
              value={typeFilter} 
              onValueChange={setTypeFilter}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid grid-cols-4 w-full sm:w-[400px]">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="stock">Stocks</TabsTrigger>
                <TabsTrigger value="etf">ETFs</TabsTrigger>
                <TabsTrigger value="bond">Bonds</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredRecommendations.length === 0 ? (
            <div className="col-span-full py-12 text-center">
              <p className="text-gray-500">No recommendations match your current filters.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setRiskFilter("all");
                  setTypeFilter("all");
                }}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            filteredRecommendations.map((recommendation) => (
              <Card key={recommendation.id} className="hover-scale shadow-card">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-bold">{recommendation.ticker}</CardTitle>
                      <CardDescription className="text-sm">{recommendation.name}</CardDescription>
                    </div>
                    {recommendation.type === "stock" ? (
                      <Badge variant="outline" className="bg-navy bg-opacity-10 text-navy border-navy border-opacity-20">
                        Stock
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-info bg-opacity-10 text-info border-info border-opacity-20">
                        ETF
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="h-[150px] mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={recommendation.priceHistory}>
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis domain={['auto', 'auto']} hide />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                        <Tooltip formatter={(value) => [`$${value}`, 'Price']} />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#CFB53B" 
                          strokeWidth={2}
                          dot={false} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold">{formatCurrency(recommendation.price)}</span>
                    <div className="flex gap-2">
                      <Badge className={getRiskBadgeColor(recommendation.analysis.riskLevel)}>
                        {recommendation.analysis.riskLevel} risk
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Return Potential</span>
                      <Badge variant="outline" className={getReturnBadgeColor(recommendation.analysis.potentialReturn)}>
                        {recommendation.analysis.potentialReturn}
                      </Badge>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Time Horizon</span>
                      <Badge variant="outline" className={getTimeHorizonBadgeColor(recommendation.analysis.timeHorizon)}>
                        {recommendation.analysis.timeHorizon}-term
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p>{recommendation.analysis.rationale}</p>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    {recommendation.metrics.peRatio && (
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-1">P/E:</span>
                        <span>{recommendation.metrics.peRatio}</span>
                      </div>
                    )}
                    {recommendation.metrics.dividendYield && (
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-1">Yield:</span>
                        <span>{recommendation.metrics.dividendYield}%</span>
                      </div>
                    )}
                    {recommendation.metrics.expenseRatio && (
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-1">Expense:</span>
                        <span>{recommendation.metrics.expenseRatio}%</span>
                      </div>
                    )}
                    {recommendation.metrics.marketCap && (
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-1">Cap:</span>
                        <span>${(recommendation.metrics.marketCap / 1000000000).toFixed(1)}B</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-1">
                  <div className="flex justify-between w-full">
                    <Button variant="outline" size="sm">
                      <Info className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                    <Button size="sm" className="bg-gold hover:bg-gold-dark text-white">
                      <DollarSign className="h-4 w-4 mr-1" />
                      Invest
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
        
        {/* Trending Investments */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Flame className="mr-2 h-5 w-5 text-danger" />
              Trending Investments
            </CardTitle>
            <CardDescription>
              Popular investments among users with similar profiles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="bg-info-light p-2 rounded-md">
                  <LineChartIcon className="h-5 w-5 text-info" />
                </div>
                <div>
                  <div className="font-medium">TSLA</div>
                  <div className="text-sm text-gray-500">Tesla Inc.</div>
                  <div className="text-xs text-success flex items-center mt-1">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    4.21%
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="bg-info-light p-2 rounded-md">
                  <LineChartIcon className="h-5 w-5 text-info" />
                </div>
                <div>
                  <div className="font-medium">QQQ</div>
                  <div className="text-sm text-gray-500">Invesco QQQ Trust</div>
                  <div className="text-xs text-success flex items-center mt-1">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    1.85%
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="bg-info-light p-2 rounded-md">
                  <LineChartIcon className="h-5 w-5 text-info" />
                </div>
                <div>
                  <div className="font-medium">AMZN</div>
                  <div className="text-sm text-gray-500">Amazon.com Inc.</div>
                  <div className="text-xs text-success flex items-center mt-1">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    2.34%
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvestmentRecommendations;
