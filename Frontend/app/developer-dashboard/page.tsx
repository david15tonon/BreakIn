// app/developer-dashboard/page.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Code2,
  Users,
  Trophy,
  TrendingUp,
  Bell,
  Search,
  Filter,
  Star,
  Eye,
  MessageSquare,
  Calendar,
  Play,
  Target,
  Flame,
  Award,
  BookOpen,
  Lightbulb,
  Rocket,
  Building2,
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/contexts/AuthContext"
import { useAvailableSprints, useActivities, useSkillProgress } from "@/hooks/use-data"

export default function DeveloperDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  const { user, developer, loading: authLoading, signOut } = useAuth()
  
  // Fetch data using custom hooks
  const { sprints: availableSprints, loading: sprintsLoading } = useAvailableSprints()
  const { activities: recentActivity, loading: activitiesLoading } = useActivities(user?.id)
  const { skills: skillProgress, loading: skillsLoading } = useSkillProgress(user?.id)

  // Redirect to sign-in if not authenticated
  if (!authLoading && !user) {
    router.push('/auth/sign-in')
    return null
  }

  // Default stats (will be replaced by developer data when available)
  const myStats = {
    sprintsCompleted: developer?.sprint_history || 0,
    successRate: developer?.success_rate || 0,
    reputation: developer?.reputation || 0,
    totalEarnings: developer?.total_earnings || "$0",
    skillBadges: developer?.skill_badges || 0,
    mentorEndorsements: developer?.mentor_endorsements || 0,
    currentStreak: developer?.current_streak || 0,
    nextLevel: developer?.level === 'Intermediate' ? 'Senior Developer' : 'Advanced Developer',
  }

  // Format activity time
  const formatActivityTime = (time: string | Date) => {
    const date = new Date(time)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} days ago`
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/95 to-blue-950/80 flex items-center justify-center">
        <div className="text-white text-xl">Loading your dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-black via-gray-900/95 to-blue-950/80">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded bg-black/70 border border-white/10 text-white focus:outline-none"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar Navigation */}
      <nav className={`fixed md:static top-0 left-0 h-full w-64 bg-black/60 border-r border-white/5 p-6 flex flex-col space-y-4 z-40 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex items-center mb-6">
          <Code2 className="h-8 w-8 text-blue-400" />
          <span className="ml-2 text-xl font-bold text-white">BreakIn Direct</span>
        </div>
        
        <Button variant="ghost" className="text-white justify-start hover:bg-white/5" asChild>
          <Link href="/" onClick={() => setSidebarOpen(false)}>Home</Link>
        </Button>
        <Button variant="ghost" className="text-white justify-start hover:bg-white/5" asChild>
          <Link href="/company-dashboard" onClick={() => setSidebarOpen(false)}>Company Dashboard</Link>
        </Button>
        <Button variant="ghost" className="text-white justify-start hover:bg-white/5" asChild>
          <Link href="/world-view" onClick={() => setSidebarOpen(false)}>World View</Link>
        </Button>

        <div className="mt-auto">
          <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
            <Avatar>
              <AvatarImage src={developer?.avatar_url || user?.user_metadata?.avatar_url || "/placeholder-user.jpg"} />
              <AvatarFallback>
                {developer?.codename?.charAt(0) || user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-white font-medium text-sm truncate">
                {developer?.codename || user?.user_metadata?.full_name || 'Developer'}
              </div>
              <div className="text-gray-400 text-xs">
                {developer?.level || 'Beginner'} • {myStats.reputation} rep
              </div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full text-white hover:bg-white/5 mt-4" 
            onClick={signOut}
          >
            Sign Out
          </Button>
        </div>
      </nav>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Sidebar overlay"
        />
      )}
      
      <main className="flex-1 p-4 md:p-8 transition-all duration-300">
        {/* Top Navigation */}
        <div className="flex justify-between items-center mb-8 pt-16 md:pt-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Welcome back, {developer?.codename || 'Developer'}!
            </h1>
            <p className="text-gray-400">Track your progress and find new opportunities</p>
          </div>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/5">
            <Bell className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Notifications</span>
            <Badge className="ml-2 bg-blue-600 text-white">2</Badge>
          </Button>
        </div>

        {/* Welcome message for new users */}
        {developer && developer.sprint_history === 0 && (
          <Card className="bg-blue-600/10 border-blue-400/20 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                🎉 Welcome to BreakIn Direct, {developer.codename}!
              </CardTitle>
              <CardDescription className="text-blue-200">
                Your developer profile has been created. Start by exploring available sprints and building your reputation!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setActiveTab('sprints')}>
                  <Search className="h-4 w-4 mr-2" />
                  Find Your First Sprint
                </Button>
                <Button variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white bg-transparent">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Learn How It Works
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Debug: User Not Synced */}
        {user && !developer && (
          <Card className="bg-red-600/10 border-red-400/20 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                🔧 Debug: User Not Synced to MongoDB
              </CardTitle>
              <CardDescription className="text-red-200">
                User ID: {user.id.slice(0, 8)}... - Not found in MongoDB database
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-gray-300">
                  <p>• MongoDB is working ✅</p>
                  <p>• User is authenticated ✅</p>
                  <p>• Profile not synced ❌</p>
                </div>
                <Button 
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={async () => {
                    console.log('🔄 Manual sync triggered for user:', user.id)
                    try {
                      const response = await fetch('/api/auth/sync-user', { method: 'POST' })
                      const data = await response.json()
                      console.log('✅ Sync result:', data)
                      
                      if (data.developer) {
                        alert(`✅ Profile created! Welcome ${data.developer.codename}`)
                        window.location.reload() // Refresh to see changes
                      } else {
                        alert('❌ Sync failed: ' + (data.error || 'Unknown error'))
                      }
                    } catch (error) {
                      console.error('❌ Manual sync failed:', error)
                      alert('❌ Sync failed: ' + (error as Error).message)
                    }
                  }}
                >
                  🔄 Create My Profile in MongoDB
                </Button>
                <div className="text-xs text-gray-400">
                  This will create your developer profile with initial skills and activities
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-black/60 border border-white/5 mb-8">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300 text-xs md:text-sm"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="sprints"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300 text-xs md:text-sm"
            >
              Sprints
            </TabsTrigger>
            <TabsTrigger
              value="portfolio"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300 text-xs md:text-sm"
            >
              Portfolio
            </TabsTrigger>
            <TabsTrigger
              value="skills"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300 text-xs md:text-sm"
            >
              Skills
            </TabsTrigger>
            <TabsTrigger
              value="opportunities"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300 text-xs md:text-sm"
            >
              Jobs
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Sprints Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{myStats.sprintsCompleted}</div>
                  <p className="text-xs text-green-400">
                    {myStats.sprintsCompleted === 0 ? 'Start your journey!' : '+2 this month'}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Success Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{myStats.successRate}%</div>
                  <p className="text-xs text-blue-400">
                    {myStats.successRate === 0 ? 'Complete sprints!' : 'Above average'}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Total Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{myStats.totalEarnings}</div>
                  <p className="text-xs text-green-400">
                    {myStats.totalEarnings === '$0' ? 'Earn from sprints!' : '+$2K this month'}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Reputation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                    {myStats.reputation || '0.0'}
                  </div>
                  <p className="text-xs text-blue-400">
                    {myStats.reputation === 0 ? 'Build reputation!' : 'Top 10%'}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Current Sprint Status or Getting Started */}
              <div className="lg:col-span-2">
                {developer?.status === 'In Sprint' ? (
                  <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white flex items-center">
                          <Rocket className="h-5 w-5 mr-2 text-blue-400" />
                          Current Sprint: {developer.last_sprint || 'Active Sprint'}
                        </CardTitle>
                        <Badge className="bg-green-600/10 text-green-300 border-green-400/20">Active</Badge>
                      </div>
                      <CardDescription className="text-gray-300">
                        You're currently participating in an active sprint
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-300">Overall Progress</span>
                            <span className="text-blue-400">78%</span>
                          </div>
                          <Progress value={78} className="bg-gray-800" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <span className="text-gray-400 text-sm">Your Tasks</span>
                            <div className="text-white font-medium">6/8 completed</div>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm">Team Rating</span>
                            <div className="text-white font-medium flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                              {developer.team_rating || '4.0'}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm">Potential Reward</span>
                            <div className="text-green-400 font-medium">$2,500</div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Play className="h-4 w-4 mr-2" />
                            Continue Sprint
                          </Button>
                          <Button
                            variant="outline"
                            className="border-white/10 text-white hover:bg-white/5 bg-transparent"
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Team Chat
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Search className="h-5 w-5 mr-2 text-blue-400" />
                        Ready to Start Your Next Sprint?
                      </CardTitle>
                      <CardDescription className="text-gray-300">
                        Join a development team and work on real projects to build your reputation
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="text-center p-4 bg-blue-600/10 border border-blue-400/20 rounded-lg">
                            <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                            <div className="text-white font-medium">Join a Team</div>
                            <div className="text-gray-400 text-xs">Work with other developers</div>
                          </div>
                          <div className="text-center p-4 bg-green-600/10 border border-green-400/20 rounded-lg">
                            <Code2 className="h-8 w-8 text-green-400 mx-auto mb-2" />
                            <div className="text-white font-medium">Build Real Projects</div>
                            <div className="text-gray-400 text-xs">Ship production-ready code</div>
                          </div>
                          <div className="text-center p-4 bg-purple-600/10 border border-purple-400/20 rounded-lg">
                            <Trophy className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                            <div className="text-white font-medium">Get Recognized</div>
                            <div className="text-gray-400 text-xs">Build reputation & earn rewards</div>
                          </div>
                        </div>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setActiveTab('sprints')}>
                          <Search className="h-4 w-4 mr-2" />
                          Browse Available Sprints
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Recent Activity */}
                <Card className="bg-black/40 border-white/5 backdrop-blur-sm mt-6">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activitiesLoading ? (
                        <div className="text-gray-400">Loading activities...</div>
                      ) : recentActivity.length > 0 ? (
                        recentActivity.map((activity, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div
                              className={`w-2 h-2 rounded-full mt-2 ${
                                activity.type === "sprint_completed"
                                  ? "bg-green-400"
                                  : activity.type === "skill_earned"
                                    ? "bg-blue-400"
                                    : activity.type === "mentor_feedback"
                                      ? "bg-purple-400"
                                      : "bg-yellow-400"
                              }`}
                            ></div>
                            <div className="flex-1">
                              <p className="text-white text-sm">{activity.title}</p>
                              <p className="text-gray-400 text-xs">{formatActivityTime(activity.time)}</p>
                              {activity.rating && (
                                <div className="flex items-center mt-1">
                                  <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                                  <span className="text-yellow-400 text-xs">{activity.rating}</span>
                                  {activity.reward && (
                                    <span className="text-green-400 text-xs ml-2">+{activity.reward}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-400">No activity yet</p>
                          <p className="text-gray-500 text-sm">Join your first sprint to start building your timeline!</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Achievement Streak */}
                <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Flame className="h-5 w-5 mr-2 text-orange-400" />
                      Achievement Streak
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-400 mb-2">{myStats.currentStreak}</div>
                      <p className="text-gray-300 text-sm">
                        {myStats.currentStreak === 0 ? 'Start your streak!' : 'Successful sprints in a row'}
                      </p>
                      <div className="mt-4">
                        <Progress value={(myStats.currentStreak / 10) * 100} className="bg-gray-800" />
                        <p className="text-gray-400 text-xs mt-1">
                          {myStats.currentStreak === 0 ? 'Complete your first sprint!' : `${10 - myStats.currentStreak} more for next milestone`}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Next Level Progress */}
                <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
                      Level Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-300 text-sm">Current: {developer?.level || 'Beginner'}</span>
                        <span className="text-blue-400 text-sm">Next: {myStats.nextLevel}</span>
                      </div>
                      <Progress value={developer?.sprint_history ? Math.min((developer.sprint_history / 5) * 100, 100) : 0} className="bg-gray-800" />
                      <div className="text-center">
                        <p className="text-gray-400 text-xs">
                          {developer?.sprint_history === 0 ? 'Complete sprints to level up!' : 'Complete 3 more sprints to level up'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setActiveTab('sprints')}>
                      <Search className="h-4 w-4 mr-2" />
                      Find New Sprints
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-white/10 text-white hover:bg-white/5 bg-transparent"
                      onClick={() => setActiveTab('skills')}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      View Skills Progress
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-white/10 text-white hover:bg-white/5 bg-transparent"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Find Teammates
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Available Sprints Tab */}
          <TabsContent value="sprints" className="space-y-6">
            {/* Filters */}
            <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-blue-400" />
                  Find Your Perfect Sprint
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-gray-300">Difficulty</Label>
                    <Select>
                      <SelectTrigger className="bg-black/60 border-white/10 text-white">
                        <SelectValue placeholder="All levels" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-300">Duration</Label>
                    <Select>
                      <SelectTrigger className="bg-black/60 border-white/10 text-white">
                        <SelectValue placeholder="Any duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-3">1-3 days</SelectItem>
                        <SelectItem value="4-7">4-7 days</SelectItem>
                        <SelectItem value="8-14">1-2 weeks</SelectItem>
                        <SelectItem value="15+">2+ weeks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-300">Technology</Label>
                    <Select>
                      <SelectTrigger className="bg-black/60 border-white/10 text-white">
                        <SelectValue placeholder="Select tech" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="react">React</SelectItem>
                        <SelectItem value="node">Node.js</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="aws">AWS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-300">Reward Range</Label>
                    <Select>
                      <SelectTrigger className="bg-black/60 border-white/10 text-white">
                        <SelectValue placeholder="Any amount" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1000-2500">$1K - $2.5K</SelectItem>
                        <SelectItem value="2500-5000">$2.5K - $5K</SelectItem>
                        <SelectItem value="5000+">$5K+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Available Sprints */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sprintsLoading ? (
                <div className="col-span-2 text-center py-8">
                  <div className="text-white">Loading sprints...</div>
                </div>
              ) : availableSprints.length > 0 ? (
                availableSprints.map((sprint) => (
                  <Card
                    key={sprint._id?.toString()}
                    className="bg-black/40 border-white/5 backdrop-blur-sm hover:border-blue-400/30 transition-colors"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-white">{sprint.title}</CardTitle>
                          <CardDescription className="text-gray-300">{sprint.company}</CardDescription>
                        </div>
                        <Badge
                          className={`${
                            sprint.difficulty === "Beginner"
                              ? "bg-green-600/10 text-green-300 border-green-400/20"
                              : sprint.difficulty === "Intermediate"
                                ? "bg-blue-600/10 text-blue-300 border-blue-400/20"
                                : sprint.difficulty === "Advanced"
                                  ? "bg-orange-600/10 text-orange-300 border-orange-400/20"
                                  : "bg-red-600/10 text-red-300 border-red-400/20"
                          }`}
                        >
                          {sprint.difficulty}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-gray-300 text-sm">{sprint.description}</p>

                        <div className="flex flex-wrap gap-1">
                          {sprint.technologies.map((tech) => (
                            <Badge
                              key={tech}
                              variant="secondary"
                              className="bg-purple-600/10 text-purple-300 border-purple-400/20"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Duration</span>
                            <div className="text-white font-medium">{sprint.duration}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Team Size</span>
                            <div className="text-white font-medium">{sprint.team_size} developers</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Reward</span>
                            <div className="text-green-400 font-medium">{sprint.reward}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Spots Left</span>
                            <div className="text-white font-medium">
                              {sprint.spots_left} of {sprint.team_size}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center text-gray-300">
                              <Calendar className="h-4 w-4 mr-1" />
                              Starts {sprint.start_date}
                            </div>
                            <div className="flex items-center text-gray-300">
                              <Users className="h-4 w-4 mr-1" />
                              {sprint.applications} applied
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-white/10 text-white hover:bg-white/5 bg-transparent"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                              Apply Now
                            </Button>
                          </div>
                        </div>

                        <div className="text-xs text-gray-400">
                          Mentor: {sprint.mentor} • Rating: {sprint.rating}/5.0
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 text-center py-12">
                  <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No available sprints found</p>
                  <p className="text-gray-500 text-sm">Check back later for new opportunities!</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Sprint Portfolio</CardTitle>
                <CardDescription className="text-gray-300">
                  Showcase your completed projects and achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                {developer && developer.sprint_history > 0 ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-6 bg-blue-600/10 border border-blue-400/20 rounded-lg">
                        <Trophy className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                        <div className="text-2xl font-bold text-white">{myStats.sprintsCompleted}</div>
                        <div className="text-gray-300 text-sm">Completed Sprints</div>
                      </div>
                      <div className="text-center p-6 bg-green-600/10 border border-green-400/20 rounded-lg">
                        <Star className="h-12 w-12 text-green-400 mx-auto mb-4" />
                        <div className="text-2xl font-bold text-white">{myStats.successRate}%</div>
                        <div className="text-gray-300 text-sm">Success Rate</div>
                      </div>
                      <div className="text-center p-6 bg-purple-600/10 border border-purple-400/20 rounded-lg">
                        <Award className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                        <div className="text-2xl font-bold text-white">{myStats.skillBadges}</div>
                        <div className="text-gray-300 text-sm">Skill Badges</div>
                      </div>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      View Detailed Portfolio
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-white text-lg font-semibold mb-2">Build Your Portfolio</h3>
                    <p className="text-gray-300 mb-4">
                      Complete sprints to showcase your skills and build an impressive portfolio
                    </p>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setActiveTab('sprints')}>
                      Find Your First Sprint
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills & Growth Tab */}
          <TabsContent value="skills" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Target className="h-5 w-5 mr-2 text-blue-400" />
                    Skill Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {skillsLoading ? (
                      <div className="text-gray-400">Loading skills...</div>
                    ) : skillProgress.length > 0 ? (
                      skillProgress.map((skill) => (
                        <div key={skill.skill}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-white font-medium">{skill.skill}</span>
                            <Badge
                              className={`${
                                skill.badge === "Expert"
                                  ? "bg-purple-600/10 text-purple-300 border-purple-400/20"
                                  : skill.badge === "Advanced"
                                    ? "bg-blue-600/10 text-blue-300 border-blue-400/20"
                                    : skill.badge === "Intermediate"
                                      ? "bg-green-600/10 text-green-300 border-green-400/20"
                                      : "bg-gray-600/10 text-gray-300 border-gray-400/20"
                              }`}
                            >
                              {skill.badge}
                            </Badge>
                          </div>
                          <Progress value={skill.level} className="bg-gray-800" />
                          <div className="text-right text-gray-400 text-xs mt-1">{skill.level}%</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400">No skill data available</p>
                        <p className="text-gray-500 text-sm">Complete sprints to track your skill development!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Award className="h-5 w-5 mr-2 text-blue-400" />
                    Achievements & Badges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-black/60 border border-white/5 rounded-lg">
                      <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                      <div className="text-white font-medium">Sprint Master</div>
                      <div className="text-gray-400 text-xs">10+ completed sprints</div>
                    </div>
                    <div className="text-center p-4 bg-black/60 border border-white/5 rounded-lg">
                      <Star className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                      <div className="text-white font-medium">Team Player</div>
                      <div className="text-gray-400 text-xs">High collaboration score</div>
                    </div>
                    <div className="text-center p-4 bg-black/60 border border-white/5 rounded-lg">
                      <Code2 className="h-8 w-8 text-green-400 mx-auto mb-2" />
                      <div className="text-white font-medium">Code Quality</div>
                      <div className="text-gray-400 text-xs">Consistent high ratings</div>
                    </div>
                    <div className="text-center p-4 bg-black/60 border border-white/5 rounded-lg">
                      <Lightbulb className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                      <div className="text-white font-medium">Problem Solver</div>
                      <div className="text-gray-400 text-xs">Creative solutions</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Opportunities Tab */}
          <TabsContent value="opportunities" className="space-y-6">
            <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Rocket className="h-5 w-5 mr-2 text-blue-400" />
                  Career Opportunities
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Companies interested in hiring you based on your sprint performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                {developer && developer.sprint_history > 0 ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-600/10 border border-green-400/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-gray-900" />
                          </div>
                          <div>
                            <div className="text-white font-semibold">TechCorp</div>
                            <div className="text-gray-300 text-sm">Senior React Developer</div>
                          </div>
                        </div>
                        <Badge className="bg-green-600 text-white">Interview Invite</Badge>
                      </div>
                      <p className="text-gray-300 text-sm mb-3">
                        We were impressed with your performance in recent sprints. Would you be
                        interested in a full-time position?
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                          Accept Interview
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/10 text-white hover:bg-white/5 bg-transparent"
                        >
                          Learn More
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-600/10 border border-blue-400/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-gray-900" />
                          </div>
                          <div>
                            <div className="text-white font-semibold">StartupXYZ</div>
                            <div className="text-gray-300 text-sm">Full-Stack Developer</div>
                          </div>
                        </div>
                        <Badge className="bg-blue-600 text-white">Watching</Badge>
                      </div>
                      <p className="text-gray-300 text-sm mb-3">
                        This company is following your sprint progress and may reach out soon.
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/10 text-white hover:bg-white/5 bg-transparent"
                      >
                        View Company Profile
                      </Button>
                    </div>

                    <div className="p-4 bg-purple-600/10 border border-purple-400/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-gray-900" />
                          </div>
                          <div>
                            <div className="text-white font-semibold">InnovateCorp</div>
                            <div className="text-gray-300 text-sm">Lead Frontend Developer</div>
                          </div>
                        </div>
                        <Badge className="bg-purple-600 text-white">New</Badge>
                      </div>
                      <p className="text-gray-300 text-sm mb-3">
                        Based on your React expertise and team leadership skills, we'd love to chat.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                          View Opportunity
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/10 text-white hover:bg-white/5 bg-transparent"
                        >
                          Not Interested
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-white text-lg font-semibold mb-2">Build Your Reputation First</h3>
                    <p className="text-gray-300 mb-4">
                      Complete sprints and showcase your skills to attract company attention
                    </p>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setActiveTab('sprints')}>
                      Start Your First Sprint
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
                        