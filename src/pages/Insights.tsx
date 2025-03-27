import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InvestmentPortfolio from "@/components/InvestmentPortfolio";
import InvestmentRecommendations from "@/components/InvestmentRecommendations";
import MarketInsights from "@/components/MarketInsights";

const Insights = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("portfolio");

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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Investment Insights</h1>
            <p className="text-gray-600">
              Comprehensive view of your portfolio, recommendations, and market trends
            </p>
          </div>
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="market">Market Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="mt-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Your Investment Portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                <InvestmentPortfolio />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="mt-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Investment Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <InvestmentRecommendations />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="market" className="mt-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Market Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <MarketInsights />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Insights;