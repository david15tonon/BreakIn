"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlobeDemo } from "../../globe/globe";  // Assuming this is the correct path
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  Code2
} from "lucide-react"
export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();
  const router = useRouter();

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
    });

    setLoading(false);

    if (error) {
        setErrorMessage(error.message || "Error signing in");
    } else {
        router.push('/');
    }
    };


  const handleDemoLogin = async () => {
    setEmail("demo@example.com");
    setPassword("password123");
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: "demo@example.com",
      password: "password123",
    });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message || "Demo login failed");
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#22293a] text-white overflow-hidden">
      <div className="absolute inset-0 z-0 hidden md:block">
        <div className="relative w-full h-full flex items-center justify-center">
          <GlobeDemo />
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center w-full py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full space-y-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-center">
            <div className="inline-flex items-center justify-center">
                <Code2 className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold text-white">BreakIn Direct</span>
            </div>
            </CardTitle>
            <CardDescription className="mt-2 text-sm text-gray-600">
              The platform where developers find their next opportunity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" asChild>
                  <Link href="/auth/sign-in">Login</Link>
                </TabsTrigger>
                <TabsTrigger value="register" asChild>
                  <Link href="/auth/sign-up">Register</Link>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login"></TabsContent>
              <TabsContent value="register"></TabsContent>
            </Tabs>

            {errorMessage && (
              <Alert className="mb-6" variant="destructive">
                <AlertTitle>Sign In Error</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSignIn} className="space-y-6">
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="pl-10"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="pl-10 pr-10"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white border border-[hsl(0deg_0%_14.9%)] hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link href="/sign-up" className="text-blue-600 hover:underline">
                Sign up here
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
