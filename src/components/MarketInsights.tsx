import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from "@/lib/formatters";
import { 
  ArrowUp, 
  ArrowDown, 
  TrendingUp, 
  BarChart3, 
  Globe, 
  Newspaper, 
  AlertCircle,
  ChevronRight,
  Calendar,
  Clock,
  Filter
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock data - in a real application, this would come from a service
const marketIndicesData = [
  {
    id: "index1",
    name: "S&P 500",
    value: 5315.95,
    change: 43.25,
    changePercentage: 0.82,
    color: "#3B82F6",
    chartData: [
      { date: 'Mon', value: 5250 },
      { date: 'Tue', value: 5260 },
      { date: 'Wed', value: 5240 },
      { date: 'Thu', value: 5280 },
      { date: 'Fri', value: 5316 }
    ]
  },
  {
    id: "index2",
    name: "Dow Jones",
    value: 39176.47,
    change: 276.58,
    changePercentage: 0.71,
    color: "#10B981",
    chartData: [
      { date: 'Mon', value: 38800 },
      { date: 'Tue', value: 39000 },
      { date: 'Wed', value: 38900 },
      { date: 'Thu', value: 39100 },
      { date: 'Fri', value: 39176 }
    ]
  },
  {
    id: "index3",
    name: "NASDAQ",
    value: 16682.10,
    change: 187.90,
    changePercentage: 1.14,
    color: "#F59E0B",
    chartData: [
      { date: 'Mon', value: 16400 },
      { date: 'Tue', value: 16500 },
      { date: 'Wed', value: 16450 },
      { date: 'Thu', value: 16600 },
      { date: 'Fri', value: 16682 }
    ]
  },
  {
    id: "index4",
    name: "Russell 2000",
    value: 2032.75,
    change: -8.23,
    changePercentage: -0.40,
    color: "#EF4444",
    chartData: [
      { date: 'Mon', value: 2050 },
      { date: 'Tue', value: 2045 },
      { date: 'Wed', value: 2040 },
      { date: 'Thu', value: 2035 },
      { date: 'Fri', value: 2033 }
    ]
  }
];

const topMovers = {
  gainers: [
    { id: "g1", name: "Nvidia Corp", ticker: "NVDA", change: 5.24, price: 874.15 },
    { id: "g2", name: "Advanced Micro Devices", ticker: "AMD", change: 4.82, price: 165.28 },
    { id: "g3", name: "Netflix Inc", ticker: "NFLX", change: 3.76, price: 673.96 },
    { id: "g4", name: "Tesla Inc", ticker: "TSLA", change: 3.14, price: 176.83 },
    { id: "g5", name: "Apple Inc", ticker: "AAPL", change: 2.57, price: 187.42 }
  ],
  losers: [
    { id: "l1", name: "ExxonMobil Corp", ticker: "XOM", change: -2.86, price: 115.42 },
    { id: "l2", name: "Verizon Communications", ticker: "VZ", change: -2.34, price: 40.63 },
    { id: "l3", name: "Pfizer Inc", ticker: "PFE", change: -1.92, price: 26.78 },
    { id: "l4", name: "Bank of America Corp", ticker: "BAC", change: -1.45, price: 37.85 },
    { id: "l5", name: "Coca-Cola Co", ticker: "KO", change: -1.21, price: 60.43 }
  ]
};

const marketNews = [
  {
    id: "news1",
    title: "Fed Signals Potential Rate Cut as Inflation Cools",
    source: "Financial Times",
    date: "2024-07-09",
    summary: "The Federal Reserve has signaled it may consider rate cuts in upcoming meetings as inflation shows signs of moderating. Markets reacted positively to the news.",
    category: "economy",
    sentiment: "positive",
    url: "#"
  },
  {
    id: "news2",
    title: "Tech Stocks Rally on Strong Earnings Reports",
    source: "Wall Street Journal",
    date: "2024-07-08",
    summary: "Technology sector stocks surged following better-than-expected earnings reports from major companies. The NASDAQ index reached a new all-time high.",
    category: "stock",
    sentiment: "positive",
    url: "#"
  },
  {
    id: "news3",
    title: "Oil Prices Drop Amid Supply Concerns",
    source: "Bloomberg",
    date: "2024-07-08",
    summary: "Crude oil prices declined by over 3% today due to reports of increased production from OPEC+ members. Energy sector stocks felt pressure from the news.",
    category: "market",
    sentiment: "negative",
    url: "#"
  },
  {
    id: "news4",
    title: "Regulatory Concerns Impact Crypto Markets",
    source: "CoinDesk",
    date: "2024-07-07",
    summary: "Cryptocurrency markets experienced volatility as regulators announced plans for stricter oversight. Bitcoin briefly dipped below $60,000 before recovering.",
    category: "crypto",
    sentiment: "negative",
    url: "#"
  },
  {
    id: "news5",
    title: "Housing Market Shows Signs of Cooling",
    source: "Reuters",
    date: "2024-07-07",
    summary: "Recent data indicates a slowdown in housing price growth across major metropolitan areas. Analysts suggest higher mortgage rates are affecting demand.",
    category: "economy",
    sentiment: "neutral",
    url: "#"
  },
  {
    id: "news6",
    title: "AI Sector Continues to Attract Investment",
    source: "TechCrunch",
    date: "2024-07-06",
    summary: "Venture capital funding for artificial intelligence startups reached record levels in Q2 2024. Major tech companies are also increasing their AI investment allocations.",
    category: "market",
    sentiment: "positive",
    url: "#"
  }
];

const marketSectors = [
  { name: "Technology", change: 1.42, marketCap: 14.5 },
  { name: "Health Care", change: 0.76, marketCap: 8.2 },
  { name: "Financial", change: -0.32, marketCap: 7.8 },
  { name: "Consumer Cyclical", change: 0.94, marketCap: 6.7 },
  { name: "Communication Services", change: 1.21, marketCap: 5.9 },
  { name: "Industrials", change: 0.12, marketCap: 5.1 },
  { name: "Energy", change: -1.85, marketCap: 4.8 },
  { name: "Utilities", change: -0.65, marketCap: 3.4 },
  { name: "Real Estate", change: -0.86, marketCap: 3.0 },
  { name: "Materials", change: 0.54, marketCap: 2.8 }
];

const MarketInsights = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [newsFilter, setNewsFilter] = useState("all");
  const [filteredNews, setFilteredNews] = useState(marketNews);

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

  // Apply news filter
  useEffect(() => {
    if (newsFilter === "all") {
      setFilteredNews(marketNews);
    } else {
      setFilteredNews(marketNews.filter(news => news.category === newsFilter));
    }
  }, [newsFilter]);

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
            <div className="h-80 bg-gray-100 rounded-lg"></div>
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
            <h1 className="text-3xl font-bold text-gray-900">Market Insights</h1>
            <p className="text-gray-600">
              Stay updated with the latest market trends and news.
            </p>
          </div>
          <Button className="bg-gold hover:bg-gold-dark text-white">
            <BarChart3 className="mr-2 h-4 w-4" />
            Market Analysis
          </Button>
        </div>

        {/* Market Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {marketIndicesData.map((index) => (
            <Card key={index.id} className="shadow-card hover-scale">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">{index.name}</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex justify-between items-baseline mb-4">
                  <span className="text-2xl font-bold">{index.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  <div className={`flex items-center text-sm ${index.changePercentage >= 0 ? 'text-success' : 'text-danger'}`}>
                    {index.changePercentage >= 0 ? 
                      <ArrowUp className="h-3 w-3 mr-1" /> : 
                      <ArrowDown className="h-3 w-3 mr-1" />}
                    <span>{Math.abs(index.changePercentage).toFixed(2)}%</span>
                  </div>
                </div>
                <div className="h-[80px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={index.chartData}>
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke={index.color} 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <div className="text-xs text-gray-500 flex justify-between w-full">
                  <span>1 Week</span>
                  <span className={index.changePercentage >= 0 ? 'text-success' : 'text-danger'}>
                    {index.changePercentage >= 0 ? '+' : ''}{index.change.toFixed(2)}
                  </span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="mb-8" onValueChange={setSelectedTab}>
          <TabsList className="bg-white border border-gray-100 p-1">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-gold/10 data-[state=active]:text-gold"
            >
              Market Overview
            </TabsTrigger>
            <TabsTrigger 
              value="sectors" 
              className="data-[state=active]:bg-gold/10 data-[state=active]:text-gold"
            >
              Sector Performance
            </TabsTrigger>
            <TabsTrigger 
              value="movers" 
              className="data-[state=active]:bg-gold/10 data-[state=active]:text-gold"
            >
              Top Movers
            </TabsTrigger>
            <TabsTrigger 
              value="news" 
              className="data-[state=active]:bg-gold/10 data-[state=active]:text-gold"
            >
              Market News
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            {/* Market Overview Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="md:col-span-2 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <TrendingUp className="mr-2 h-5 w-5 text-gray-500" />
                    Market Performance
                  </CardTitle>
                  <CardDescription>S&P 500 performance over the past month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { date: '06/10', value: 5050 },
                          { date: '06/17', value: 5100 },
                          { date: '06/24', value: 5080 },
                          { date: '07/01', value: 5200 },
                          { date: '07/08', value: 5316 }
                        ]}
                        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                        <XAxis dataKey="date" />
                        <YAxis domain={['dataMin - 100', 'dataMax + 100']} />
                        <Tooltip formatter={(value) => [`${value}`, 'S&P 500']} />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#CFB53B"
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Globe className="mr-2 h-5 w-5 text-gray-500" />
                    Global Markets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "FTSE 100", value: "7,934.12", change: 0.45 },
                      { name: "Nikkei 225", value: "39,126.47", change: 1.12 },
                      { name: "DAX", value: "18,235.80", change: 0.75 },
                      { name: "Shanghai", value: "3,012.95", change: -0.38 },
                      { name: "Hang Seng", value: "17,753.34", change: -0.26 }
                    ].map((market, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                        <span className="font-medium">{market.name}</span>
                        <div className="flex flex-col items-end">
                          <span>{market.value}</span>
                          <span className={`text-xs ${market.change >= 0 ? 'text-success' : 'text-danger'} flex items-center`}>
                            {market.change >= 0 ? 
                              <ArrowUp className="h-3 w-3 mr-1" /> : 
                              <ArrowDown className="h-3 w-3 mr-1" />}
                            {Math.abs(market.change).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <AlertCircle className="mr-2 h-5 w-5 text-warning" />
                  Market Indicators
                </CardTitle>
                <CardDescription>Key indicators affecting market conditions</CardDescription>
              </CardHeader>
              <CardContent className="pb-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500">10-Year Treasury Yield</div>
                      <div className="text-2xl font-bold">4.21%</div>
                      <div className="text-xs text-danger flex items-center mt-1">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        0.05%
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500">VIX Volatility Index</div>
                      <div className="text-2xl font-bold">14.36</div>
                      <div className="text-xs text-success flex items-center mt-1">
                        <ArrowDown className="h-3 w-3 mr-1" />
                        1.23%
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500">Gold (oz)</div>
                      <div className="text-2xl font-bold">$2,334.50</div>
                      <div className="text-xs text-success flex items-center mt-1">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        0.78%
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500">Crude Oil (bbl)</div>
                      <div className="text-2xl font-bold">$76.84</div>
                      <div className="text-xs text-danger flex items-center mt-1">
                        <ArrowDown className="h-3 w-3 mr-1" />
                        2.31%
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500">Bitcoin (BTC)</div>
                      <div className="text-2xl font-bold">$62,384.27</div>
                      <div className="text-xs text-success flex items-center mt-1">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        1.45%
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500">EUR/USD</div>
                      <div className="text-2xl font-bold">1.0865</div>
                      <div className="text-xs text-danger flex items-center mt-1">
                        <ArrowDown className="h-3 w-3 mr-1" />
                        0.15%
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sectors" className="mt-6">
            {/* Sector Performance Content */}
            <Card className="shadow-card mb-6">
              <CardHeader>
                <CardTitle>Sector Performance</CardTitle>
                <CardDescription>Today's market performance by sector</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={marketSectors.sort((a, b) => b.change - a.change)}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 100, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" tickFormatter={(value) => `${value}%`} />
                      <YAxis type="category" dataKey="name" width={100} />
                      <Tooltip 
                        formatter={(value: number) => [`${value.toFixed(2)}%`, 'Change']}
                        labelFormatter={(value: string) => `${value} Sector`}
                      />
                    <Bar 
                        dataKey="change" 
                        radius={[4, 4, 4, 4]}
                        fill="#10B981"  // Default color
                        // Use getBarProps prop or other Recharts customization methods to apply conditional colors
                      />
                      
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Sector Market Cap</CardTitle>
                  <CardDescription>Market capitalization by sector (in trillions)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={marketSectors.sort((a, b) => b.marketCap - a.marketCap).slice(0, 5)} 
                        margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `$${value}T`} />
                        <Tooltip 
                          formatter={(value) => [`$${value}T`, 'Market Cap']}
                        />
                        <Bar dataKey="marketCap" fill="#CFB53B" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Sector Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-info bg-opacity-5 p-4 rounded-lg">
                      <h3 className="font-medium text-navy mb-1">Technology Leads the Rally</h3>
                      <p className="text-sm text-gray-600">Technology stocks continue to outperform the broader market, driven by strong earnings and AI innovations.</p>
                    </div>
                    <div className="bg-warning bg-opacity-5 p-4 rounded-lg">
                      <h3 className="font-medium text-navy mb-1">Energy Sector Under Pressure</h3>
                      <p className="text-sm text-gray-600">Energy stocks face headwinds due to declining oil prices and increasing regulatory pressure on fossil fuels.</p>
                    </div>
                    <div className="bg-success bg-opacity-5 p-4 rounded-lg">
                      <h3 className="font-medium text-navy mb-1">Healthcare Shows Resilience</h3>
                      <p className="text-sm text-gray-600">Healthcare sector demonstrates defensive characteristics with steady growth amid market volatility.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="movers" className="mt-6">
            {/* Top Movers Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card className="shadow-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <ArrowUp className="h-5 w-5 mr-2 text-success" />
                    Top Gainers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Company</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Price</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Change</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topMovers.gainers.map((stock) => (
                          <tr key={stock.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="flex flex-col">
                                <span className="font-medium text-gray-900">{stock.ticker}</span>
                                <span className="text-sm text-gray-500">{stock.name}</span>
                              </div>
                            </td>
                            <td className="text-right py-3 px-4">
                              ${stock.price.toFixed(2)}
                            </td>
                            <td className="text-right py-3 px-4">
                              <span className="text-success">+{stock.change.toFixed(2)}%</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <ArrowDown className="h-5 w-5 mr-2 text-danger" />
                    Top Losers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Company</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Price</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Change</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topMovers.losers.map((stock) => (
                          <tr key={stock.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="flex flex-col">
                                <span className="font-medium text-gray-900">{stock.ticker}</span>
                                <span className="text-sm text-gray-500">{stock.name}</span>
                              </div>
                            </td>
                            <td className="text-right py-3 px-4">
                              ${stock.price.toFixed(2)}
                            </td>
                            <td className="text-right py-3 px-4">
                              <span className="text-danger">{stock.change.toFixed(2)}%</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Market Momentum</CardTitle>
                <CardDescription>Key stocks showing momentum in today's trading</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: "Apple Inc", ticker: "AAPL", price: 187.42, volume: "32.5M", trend: "uptrend" },
                    { name: "Microsoft Corp", ticker: "MSFT", price: 419.35, volume: "28.7M", trend: "uptrend" },
                    { name: "Tesla Inc", ticker: "TSLA", price: 176.83, volume: "45.2M", trend: "volatile" },
                    { name: "Amazon.com Inc", ticker: "AMZN", price: 182.41, volume: "29.3M", trend: "uptrend" },
                    { name: "Alphabet Inc", ticker: "GOOGL", price: 164.32, volume: "25.1M", trend: "uptrend" },
                    { name: "Meta Platforms Inc", ticker: "META", price: 498.73, volume: "19.8M", trend: "uptrend" }
                  ].map((stock, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium">{stock.ticker}</div>
                          <div className="text-sm text-gray-500">{stock.name}</div>
                        </div>
                        <Badge variant="outline" className={
                          stock.trend === "uptrend" ? "bg-success-light text-success border-success-light" :
                          stock.trend === "downtrend" ? "bg-danger-light text-danger border-danger-light" :
                          "bg-warning-light text-warning border-warning-light"
                        }>
                          {stock.trend === "uptrend" ? "Uptrend" :
                           stock.trend === "downtrend" ? "Downtrend" :
                           "Volatile"}
                        </Badge>
                      </div>
                      <div className="text-xl font-bold">${stock.price}</div>
                      <div className="text-xs text-gray-500 mt-1">Vol: {stock.volume}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="news" className="mt-6">
            {/* Market News Content */}
            <div className="flex items-center mb-6 gap-4">
              <div className="flex-grow">
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by category</label>
                <Tabs 
                  value={newsFilter} 
                  onValueChange={setNewsFilter}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="all">All News</TabsTrigger>
                    <TabsTrigger value="market">Market</TabsTrigger>
                    <TabsTrigger value="economy">Economy</TabsTrigger>
                    <TabsTrigger value="stock">Stocks</TabsTrigger>
                    <TabsTrigger value="crypto">Crypto</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center mt-6"
              >
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-4 mb-6">
              {filteredNews.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No news found matching your filter criteria.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setNewsFilter("all")}
                  >
                    Reset Filters
                  </Button>
                </div>
              ) : (
                filteredNews.map((news) => (
                  <Card key={news.id} className="shadow-card">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="hidden sm:block p-3 bg-gray-100 rounded-full">
                          <Newspaper className="h-6 w-6 text-gray-500" />
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-medium text-navy">{news.title}</h3>
                            <Badge className={
                              news.sentiment === "positive" ? "bg-success-light text-success-dark" :
                              news.sentiment === "negative" ? "bg-danger-light text-danger-dark" :
                              "bg-muted text-muted-foreground"
                            }>
                              {news.sentiment}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-3">{news.summary}</p>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center text-sm text-gray-500">
                              <span className="font-medium mr-3">{news.source}</span>
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {news.date}
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-navy hover:text-navy-dark">
                              Read More <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
            
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Market Events Calendar</CardTitle>
                <CardDescription>Upcoming economic events and earnings releases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { 
                      date: "Jul 10", 
                      events: [
                        { time: "8:30 AM", title: "Consumer Price Index (CPI)", importance: "high" },
                        { time: "2:00 PM", title: "FOMC Meeting Minutes", importance: "high" }
                      ]
                    },
                    { 
                      date: "Jul 11", 
                      events: [
                        { time: "8:30 AM", title: "Initial Jobless Claims", importance: "medium" },
                        { time: "After Close", title: "JPMorgan Chase Earnings", importance: "high" }
                      ]
                    },
                    { 
                      date: "Jul 12", 
                      events: [
                        { time: "8:30 AM", title: "Producer Price Index (PPI)", importance: "medium" },
                        { time: "10:00 AM", title: "Michigan Consumer Sentiment", importance: "medium" },
                        { time: "After Close", title: "Citigroup Earnings", importance: "high" }
                      ]
                    }
                  ].map((day, dayIndex) => (
                    <div key={dayIndex} className="border border-gray-100 rounded-lg">
                      <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 font-medium">
                        {day.date}
                      </div>
                      <div className="divide-y divide-gray-100">
                        {day.events.map((event, eventIndex) => (
                          <div key={eventIndex} className="px-4 py-3 flex justify-between items-center">
                            <div className="flex items-start gap-3">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 text-gray-400 mr-2" />
                                <span className="text-sm text-gray-500">{event.time}</span>
                              </div>
                              <span className="font-medium">{event.title}</span>
                            </div>
                            <Badge className={
                              event.importance === "high" ? "bg-danger-light text-danger-dark" :
                              event.importance === "medium" ? "bg-warning-light text-warning-dark" :
                              "bg-muted text-muted-foreground"
                            }>
                              {event.importance}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MarketInsights;
