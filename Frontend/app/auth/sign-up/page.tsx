"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Lock, Mail, User, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlobeDemo } from "../../globe/globe";
import { createClient } from "@/lib/supabase/client";
import { AuthError, Provider } from "@supabase/supabase-js";

type LoadingState = 'idle' | 'loading' | 'oauth';

export default function SignUpPage() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"login" | "register">("register");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading('loading');
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setLoading('idle');
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading('idle');
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: name,
          }
        }
      });

      if (error) {
        setError(error.message);
      } else {
        setError(null);
        alert("Check your email for the confirmation link!");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading('idle');
    }
  };

  const handleOAuthSignIn = async (provider: Provider) => {
    setLoading('oauth');
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        setError(error.message);
        setLoading('idle');
      }
    } catch (err) {
      setError("OAuth sign-in failed");
      setLoading('idle');
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading('loading');
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        setError(error.message);
      } else {
        // Redirect to dashboard or home page
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading('idle');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center relative">
      {/* Globe Background */}
      <div className="absolute inset-0 z-0">
        <GlobeDemo />
      </div>

      <div className="z-10 w-full max-w-md p-8">
        <Card className="bg-black/90 backdrop-blur-sm border-gray-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">Welcome to BreakIn</CardTitle>
            <CardDescription className="text-gray-400">
              The platform where developers find their next opportunity
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Error Alert */}
            {error && (
              <Alert className="mb-4 bg-red-900/20 border-red-800">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Tabs for Login/Register */}
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")} className="mb-6">
              <TabsList className="grid w-full grid-cols-2 bg-gray-900">
                <TabsTrigger value="login" className="data-[state=active]:bg-gray-700">Login</TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-gray-700">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                {/* OAuth Buttons for Login */}
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleOAuthSignIn('google')}
                    disabled={loading !== 'idle'}
                  >
                    {loading === 'oauth' ? 'Redirecting...' : 'Continue with Google'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleOAuthSignIn('github')}
                    disabled={loading !== 'idle'}
                  >
                    {loading === 'oauth' ? 'Redirecting...' : 'Continue with GitHub'}
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-black px-2 text-gray-400">Or continue with email</span>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-gray-300">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email address
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-gray-900 border-gray-700 text-white placeholder-gray-500"
                      required
                      disabled={loading !== 'idle'}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-gray-300">
                      <Lock className="w-4 h-4 inline mr-2" />
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-gray-900 border-gray-700 text-white placeholder-gray-500 pr-10"
                        required
                        disabled={loading !== 'idle'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        disabled={loading !== 'idle'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading !== 'idle'}>
                    {loading === 'loading' ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">

                {/* OAuth Buttons for Registration */}
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleOAuthSignIn('google')}
                    disabled={loading !== 'idle'}
                  >
                    {loading === 'oauth' ? 'Redirecting...' : 'Continue with Google'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleOAuthSignIn('github')}
                    disabled={loading !== 'idle'}
                  >
                    {loading === 'oauth' ? 'Redirecting...' : 'Continue with GitHub'}
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-black px-2 text-gray-400">Or continue with email</span>
                  </div>
                </div>

                <form onSubmit={handleSignUp} className="space-y-4">
                  {/* Full Name Input */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300">
                      <User className="w-4 h-4 inline mr-2" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-gray-900 border-gray-700 text-white placeholder-gray-500"
                      required
                      disabled={loading !== 'idle'}
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-gray-900 border-gray-700 text-white placeholder-gray-500"
                      required
                      disabled={loading !== 'idle'}
                    />
                  </div>

                  {/* Password Input */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-300">
                      <Lock className="w-4 h-4 inline mr-2" />
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-gray-900 border-gray-700 text-white placeholder-gray-500 pr-10"
                        required
                        disabled={loading !== 'idle'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        disabled={loading !== 'idle'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Input */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-300">
                      <Lock className="w-4 h-4 inline mr-2" />
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-gray-900 border-gray-700 text-white placeholder-gray-500 pr-10"
                        required
                        disabled={loading !== 'idle'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        disabled={loading !== 'idle'}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Create Account Button */}
                  <Button type="submit" className="w-full" disabled={loading !== 'idle'}>
                    {loading === 'loading' ? "Creating Account..." : "Create Account"}
                  </Button>

                  {/* Password requirements */}
                  <p className="text-xs text-gray-500 mt-2">
                    Password must be 8+ characters with uppercase, lowercase, and number
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
