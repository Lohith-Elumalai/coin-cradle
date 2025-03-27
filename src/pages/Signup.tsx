
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { CheckIcon } from "lucide-react";

const Signup = () => {
  const { signInWithGoogle, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // Navigation handled by useEffect above
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  const benefits = [
    "Personalized financial insights",
    "AI-powered budgeting recommendations",
    "Investment strategy tailored to your goals",
    "Smart debt management solutions",
    "Real-time financial assistant",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center bg-gray-50 py-12">
        <div className="w-full max-w-6xl px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Start Your Financial Wellness Journey
                </h1>
                <p className="mt-4 text-lg text-gray-600">
                  Join thousands of users who are taking control of their finances with
                  CoinCradle's AI-powered financial wellness platform.
                </p>
              </div>
              
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="flex-shrink-0 bg-gold/10 rounded-full p-1">
                      <CheckIcon className="h-4 w-4 text-gold" />
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <div className="rounded-lg p-4 bg-gold/5 border border-gold/10">
                <p className="text-sm text-gray-700">
                  "I've tried many financial apps, but CoinCradle is the first one
                  that actually understands my financial habits and provides genuinely
                  useful advice. It's like having a financial advisor in my pocket."
                </p>
                <p className="mt-2 text-sm font-medium text-gray-900">
                  — Alex B., CoinCradle user
                </p>
              </div>
            </div>
            
            <Card className="shadow-lg border-gold/10 animate-scale-in">
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
                <CardDescription>
                  Sign up to start your financial wellness journey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* OAuth Options */}
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 border-gold/20 hover:border-gold/40 hover:bg-gold/5"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="animate-spin h-5 w-5 border-2 border-gold border-t-transparent rounded-full" />
                    ) : (
                      <>
                        <svg
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                        Sign up with Google
                      </>
                    )}
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or</span>
                  </div>
                </div>

                {/* Email/Password Form */}
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="Lohith" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Elu" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      placeholder="name@example.com"
                      type="email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required />
                    <p className="text-xs text-gray-500">
                      Password must be at least 8 characters long and include a number and special character.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" type="password" required />
                  </div>
                  <Button className="w-full bg-gold hover:bg-gold-dark text-white">
                    Create Account
                  </Button>
                </form>

                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="text-gold hover:underline">
                    Log in
                  </Link>
                </div>
                <p className="text-xs text-center text-gray-500">
                  By signing up, you agree to our{" "}
                  <Link to="/terms" className="text-gold hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-gold hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
