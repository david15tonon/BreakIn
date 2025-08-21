"use client"

import { useState, useEffect } from "react"
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

import { createClient } from "@/lib/supabase/client"
import { User, Session } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("developers")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setSession(session);
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setSession(session);
      }
    );

    fetchUser();

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      } else {
        // Clear local state immediately
        setUser(null);
        setSession(null);
        router.push('/');
      }
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
    }
  };

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
                <>
                  <Avatar>
                    <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder-user.jpg"} />
                    <AvatarFallback>
                      {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    variant="ghost" 
                    className="text-white hover:bg-white/5" 
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                </>
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
                  await handleSignOut();
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
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
              Start Your Sprint
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/10 text-white hover:bg-white/5 px-8 py-3 bg-transparent"
            >
              Hire Developers
            </Button>
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

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How BreakIn Direct Works</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Three simple steps to revolutionize how you hire and get hired
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-black/60 border border-white/5">
              <TabsTrigger
                value="developers"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300"
              >
                For Developers
              </TabsTrigger>
              <TabsTrigger
                value="companies"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300"
              >
                For Companies
              </TabsTrigger>
              <TabsTrigger
                value="mentors"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300"
              >
                For Mentors
              </TabsTrigger>
            </TabsList>

            <TabsContent value="developers" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-blue-400" />
                    </div>
                    <CardTitle className="text-white">1. Join a Sprint</CardTitle>
                    <CardDescription className="text-gray-300">
                      Get matched with a real development team working on actual projects
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center mb-4">
                      <Code2 className="h-6 w-6 text-blue-400" />
                    </div>
                    <CardTitle className="text-white">2. Ship Real Code</CardTitle>
                    <CardDescription className="text-gray-300">
                      Collaborate, solve problems, and deliver features that matter
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center mb-4">
                      <Trophy className="h-6 w-6 text-blue-400" />
                    </div>
                    <CardTitle className="text-white">3. Get Hired</CardTitle>
                    <CardDescription className="text-gray-300">
                      Companies see your work and hire based on proven performance
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="companies" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center mb-4">
                      <Target className="h-6 w-6 text-blue-400" />
                    </div>
                    <CardTitle className="text-white">1. Define Your Needs</CardTitle>
                    <CardDescription className="text-gray-300">
                      Set preferences for skills, culture fit, and team dynamics
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center mb-4">
                      <Zap className="h-6 w-6 text-blue-400" />
                    </div>
                    <CardTitle className="text-white">2. Watch Talent Work</CardTitle>
                    <CardDescription className="text-gray-300">
                      Observe developers in action during live sprint sessions
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center mb-4">
                      <CheckCircle className="h-6 w-6 text-blue-400" />
                    </div>
                    <CardTitle className="text-white">3. Hire with Confidence</CardTitle>
                    <CardDescription className="text-gray-300">
                      Make offers based on actual performance, not interviews
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="mentors" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center mb-4">
                      <GraduationCap className="h-6 w-6 text-blue-400" />
                    </div>
                    <CardTitle className="text-white">1. Guide Developers</CardTitle>
                    <CardDescription className="text-gray-300">
                      Share your expertise and help emerging talent grow
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center mb-4">
                      <Building2 className="h-6 w-6 text-blue-400" />
                    </div>
                    <CardTitle className="text-white">2. Build Your Brand</CardTitle>
                    <CardDescription className="text-gray-300">
                      Establish yourself as a thought leader in the community
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center mb-4">
                      <UserCheck className="h-6 w-6 text-blue-400" />
                    </div>
                    <CardTitle className="text-white">3. Scout Talent</CardTitle>
                    <CardDescription className="text-gray-300">
                      Identify top performers for your company's hiring needs
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Live Sprint Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Live Sprint in Action</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See how developers collaborate in real-time on actual projects
            </p>
          </div>

          <Card className="bg-black/60 border-white/5 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center">
                    <GitBranch className="h-5 w-5 mr-2 text-blue-400" />
                    E-commerce Platform Sprint
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Building a payment integration system • Day 3 of 5
                  </CardDescription>
                </div>
                <Badge className="bg-green-600/10 text-green-300 border-green-400/20">Live</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-white font-semibold mb-4">Team Progress</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">Payment API Integration</span>
                        <span className="text-blue-400">85%</span>
                      </div>
                      <Progress value={85} className="bg-gray-800" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">Frontend Components</span>
                        <span className="text-blue-400">92%</span>
                      </div>
                      <Progress value={92} className="bg-gray-800" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">Testing & QA</span>
                        <span className="text-blue-400">67%</span>
                      </div>
                      <Progress value={67} className="bg-gray-800" />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-4">Active Team Members</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback>AK</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="text-white font-medium">Alex K.</div>
                        <div className="text-gray-400 text-sm">Backend Lead • Currently coding</div>
                      </div>
                      <div className="flex items-center text-green-400">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                        Active
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback>SM</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="text-white font-medium">Sarah M.</div>
                        <div className="text-gray-400 text-sm">Frontend Dev • In review</div>
                      </div>
                      <div className="flex items-center text-yellow-400">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                        Review
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback>DJ</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="text-white font-medium">David J.</div>
                        <div className="text-gray-400 text-sm">QA Engineer • Testing</div>
                      </div>
                      <div className="flex items-center text-blue-400">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                        Testing
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-gray-300">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />2 days remaining
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      4.8 team rating
                    </div>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">Watch Sprint Live</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to revolutionize hiring?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of developers and companies who've already made the switch to proof-of-work hiring.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
              Start as Developer
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/10 text-white hover:bg-white/5 px-8 py-3 bg-transparent"
            >
              Hire Developers
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black/60 backdrop-blur-md py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Code2 className="h-6 w-6 text-blue-400" />
                <span className="ml-2 text-lg font-bold text-white">
                  <Link href="/">BreakIn Direct</Link>
                </span>
              </div>
              <p className="text-gray-400">Proof-of-work hiring for the modern world.</p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">For Developers</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Join Sprints</li>
                <li>Build Portfolio</li>
                <li>Get Hired</li>
                <li>Success Stories</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">For Companies</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Hire Talent</li>
                <li>Sponsor Sprints</li>
                <li>Mentor Program</li>
                <li>Enterprise</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation</li>
                <li>API</li>
                <li>Support</li>
                <li>Blog</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/5 text-center text-gray-400">
            <p>&copy; 2025 BreakIn Direct. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
