
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import {
  Shield,
  TrendingUp,
  LineChart,
  MessageSquare,
  ArrowRight,
} from "lucide-react";

const Index = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <LineChart className="h-8 w-8 text-gold" />,
      title: "Smart Budget Tracking",
      description:
        "Automatically categorize transactions and get real-time insights into your spending habits.",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-gold" />,
      title: "Intelligent Investment Advice",
      description:
        "Receive personalized investment recommendations based on your financial goals and risk tolerance.",
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-gold" />,
      title: "AI Financial Assistant",
      description:
        "Chat with our AI assistant for instant answers to your financial questions and personalized advice.",
    },
    {
      icon: <Shield className="h-8 w-8 text-gold" />,
      title: "Bank-Level Security",
      description:
        "Your financial data is protected with the highest level of encryption and security standards.",
    },
  ];

  const testimonials = [
    {
      quote:
        "CoinCradle helped me pay off $15,000 in debt in just 18 months with a personalized plan.",
      author: "Sarah J.",
      role: "Teacher",
    },
    {
      quote:
        "The investment suggestions have increased my portfolio by 22% in just one year. I'm impressed!",
      author: "Michael T.",
      role: "Software Engineer",
    },
    {
      quote:
        "Finally, budgeting software that actually understands my spending patterns and gives useful advice.",
      author: "Elena R.",
      role: "Small Business Owner",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-white z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 sm:pt-24 sm:pb-32 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
                <span className="block">Your Financial Wellness,</span>
                <span className="block text-gold">Personalized by AI</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl">
                CoinCradle analyzes your financial habits to provide tailored insights, 
                budgeting recommendations, and investment strategies just for you.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
                  <Button className="bg-gold hover:bg-gold-dark text-white px-8 py-6 text-lg shadow-gold">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/learn">
                  <Button variant="outline" className="border-gold/20 text-gold hover:border-gold px-8 py-6 text-lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-gold/30 to-gold-dark/30 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl animate-scale-in">
                <img
                  src="https://images.unsplash.com/photo-1551260627-fd1b6daa6224?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                  alt="Financial Dashboard"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Intelligent Features for Your Financial Journey
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform analyzes your financial data to provide
              personalized recommendations and insights.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-gold transition-all duration-300 animate-hover"
              >
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              What Our Users Say
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of users who have transformed their financial lives with CoinCradle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col animate-hover"
              >
                <div className="flex-grow">
                  <div className="text-gold mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-gold/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Financial Future?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Join CoinCradle today and start your journey to financial wellness with AI-powered insights and personalized guidance.
          </p>
          <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
            <Button className="bg-gold hover:bg-gold-dark text-white px-8 py-6 text-lg shadow-gold">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center mr-2">
                  <LineChart className="h-5 w-5 text-gold" />
                </div>
                <span className="text-xl font-semibold">CoinCradle</span>
              </div>
              <p className="text-gray-400">
                Your personalized financial wellness platform powered by AI.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link to="/features" className="text-gray-400 hover:text-gold">Features</Link></li>
                <li><Link to="/pricing" className="text-gray-400 hover:text-gold">Pricing</Link></li>
                <li><Link to="/security" className="text-gray-400 hover:text-gold">Security</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-gold">About Us</Link></li>
                <li><Link to="/careers" className="text-gray-400 hover:text-gold">Careers</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-gold">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-gray-400 hover:text-gold">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-gold">Terms of Service</Link></li>
                <li><Link to="/cookie" className="text-gray-400 hover:text-gold">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© {new Date().getFullYear()} CoinCradle. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
