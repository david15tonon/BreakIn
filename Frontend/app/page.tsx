// app/page.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Code2,
  Users,
  Trophy,
  Zap,
  Target,
  GitBranch,
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
  Building2,
  GraduationCap,
  UserCheck,
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/contexts/AuthContext"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("developers")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const { user, developer, loading, signOut } = useAuth()

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/95 to-blue-950/80">
      {/* Navigation */}
      <nav className="border-b border-white/5 bg-black/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Code2 className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold text-white">
                  <Link href="/">BreakIn Direct</Link>
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" className="text-white hover:bg-white/5" asChild>
                <Link href="/developer-dashboard">Developer Dashboard</Link>
              </Button>
              <Button variant="ghost" className="text-white hover:bg-white/5" asChild>
                <Link href="/company-dashboard">Company Dashboard</Link>
              </Button>
              <Button variant="ghost" className="text-white hover:bg-white/5">
                How It Works
              </Button>
              <Button variant="ghost" className="text-white hover:bg-white/5">
                For Companies
              </Button>
              <Button variant="ghost" className="text-white hover:bg-white/5" asChild>
                <Link href="/world-view">World View</Link>
              </Button>
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarImage src={developer?.avatar_url || user.user_metadata?.avatar_url || "/placeholder-user.jpg"} />
                      <AvatarFallback>
                        {developer?.codename?.charAt(0) || user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-right">
                      <div className="text-white font-medium text-sm">
                        {developer?.codename || user.user_metadata?.full_name || 'Developer'}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {developer ? `Level: ${developer.level}` : 'Setting up profile...'}
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="text-white hover:bg-white/5" 
                    onClick={signOut}
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white bg-transparent"
                    asChild
                  >
                    <Link href="/auth/sign-in">Sign In</Link>
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                    <Link href="/auth/sign-up">Get Started</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="text-white">
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
              
              <Button
                variant="outline"
                className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white bg-transparent"
              >
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            </div>

          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Button variant="ghost" className="text-white hover:bg-white/5 w-full justify-start" asChild>
              <Link href="/developer-dashboard" onClick={toggleMobileMenu}>Developer Dashboard</Link>
            </Button>
            <Button variant="ghost" className="text-white hover:bg-white/5 w-full justify-start" asChild>
              <Link href="/company-dashboard" onClick={toggleMobileMenu}>Company Dashboard</Link>
            </Button>
            <Button variant="ghost" className="text-white hover:bg-white/5 w-full justify-start" onClick={toggleMobileMenu}>
              How It Works
            </Button>
            <Button variant="ghost" className="text-white hover:bg-white/5 w-full justify-start" onClick={toggleMobileMenu}>
              For Companies
            </Button>
            <Button variant="ghost" className="text-white hover:bg-white/5 w-full justify-start" asChild>
              <Link href="/world-view" onClick={toggleMobileMenu}>World View</Link>
            </Button>
            
            {user ? (
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/5 w-full justify-start" 
                onClick={async () => {
                  await signOut();
                  toggleMobileMenu();
                }}
              >
                Sign Out
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white bg-transparent w-full justify-start"
                  asChild
                >
                  <Link href="/auth/sign-in" onClick={toggleMobileMenu}>Sign In</Link>
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full justify-start" asChild>
                  <Link href="/auth/sign-up" onClick={toggleMobileMenu}>Get Started</Link>
                </Button>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Badge className="bg-blue-600/10 text-blue-300 border-blue-400/20 mb-4">Proof-of-Work Hiring System</Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Skip the résumé.
              <br />
              <span className="text-blue-400">Show your skills.</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Join real development teams, work on actual projects, and get hired based on your code—not your
              credentials.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {user ? (
              <>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3" asChild>
                  <Link href="/developer-dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/10 text-white hover:bg-white/5 px-8 py-3 bg-transparent"
                  asChild
                >
                  <Link href="/company-dashboard">Company View</Link>
                </Button>
              </>
            ) : (
              <>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3" asChild>
                  <Link href="/auth/sign-up">
                    Start Your Sprint
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/10 text-white hover:bg-white/5 px-8 py-3 bg-transparent"
                  asChild
                >
                  <Link href="/company-dashboard">Hire Developers</Link>
                </Button>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">2,847</div>
              <div className="text-gray-300">Developers Hired</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">94%</div>
              <div className="text-gray-300">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">156</div>
              <div className="text-gray-300">Partner Companies</div>
            </div>
          </div>
        </div>
      </section>

      {/* Rest of the homepage content remains the same... */}
      {/* How It Works, Live Sprint Preview, CTA Section, Footer */}
      {/* (keeping the existing content for brevity) */}
    </div>
  )
}