"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
    BarChart3,
    Bell,
    Bookmark,
    Download,
    Eye,
    Filter,
    MessageSquare,
    Play,
    Plus,
    Search,
    Send,
    Star,
    Target,
    Users,
    Zap
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function CompanyDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [selectedDeveloper, setSelectedDeveloper] = useState(null)

  const talentRecommendations = [
    {
      id: 1,
      codename: "ReactNinja_2024",
      reputation: 4.9,
      skills: ["React", "TypeScript", "Node.js", "AWS"],
      sprintHistory: 12,
      successRate: 94,
      growthDelta: "+23%",
      status: "Available",
      lastSprint: "E-commerce Platform",
      mentorEndorsements: 3,
      teamRating: 4.8,
      avatar: "/placeholder-user.jpg",
    },
    {
      id: 2,
      codename: "FullStackPro",
      reputation: 4.7,
      skills: ["Python", "Django", "React", "PostgreSQL"],
      sprintHistory: 8,
      successRate: 91,
      growthDelta: "+18%",
      status: "In Sprint",
      lastSprint: "FinTech Dashboard",
      mentorEndorsements: 2,
      teamRating: 4.6,
      avatar: "/placeholder-user.jpg",
    },
    {
      id: 3,
      codename: "CloudArchitect",
      reputation: 4.8,
      skills: ["AWS", "Kubernetes", "Go", "Terraform"],
      sprintHistory: 15,
      successRate: 96,
      growthDelta: "+31%",
      status: "Available",
      lastSprint: "Microservices Migration",
      mentorEndorsements: 4,
      teamRating: 4.9,
      avatar: "/placeholder-user.jpg",
    },
  ]

  const squadRecommendations = [
    {
      id: 1,
      name: "The React Rangers",
      members: 4,
      completedSprints: 6,
      successRate: 95,
      specialties: ["Frontend", "React", "TypeScript", "UI/UX"],
      lastProject: "SaaS Dashboard",
      teamDynamics: {
        collaboration: 4.8,
        delivery: 4.9,
        codeQuality: 4.7,
      },
    },
    {
      id: 2,
      name: "Backend Builders",
      members: 3,
      completedSprints: 8,
      successRate: 92,
      specialties: ["Node.js", "Python", "Databases", "APIs"],
      lastProject: "Payment System",
      teamDynamics: {
        collaboration: 4.6,
        delivery: 4.8,
        codeQuality: 4.9,
      },
    },
  ]

  const activeSprints = [
    {
      id: 1,
      title: "E-commerce Platform",
      company: "TechCorp",
      participants: 8,
      daysRemaining: 2,
      progress: 85,
      budget: "$5,000",
      applications: 24,
      status: "Active",
    },
    {
      id: 2,
      title: "Mobile Banking App",
      company: "FinanceFlow",
      participants: 6,
      daysRemaining: 4,
      progress: 67,
      budget: "$7,500",
      applications: 18,
      status: "Active",
    },
  ]

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-black via-gray-900/95 to-blue-950/80">
      {/* Mobile Sidebar Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded bg-black/70 border border-white/10 text-white focus:outline-none"
        aria-label="Open sidebar"
        onClick={() => setSidebarOpen(true)}
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {/* Sidebar Navigation */}
      <nav
        className={`fixed md:static top-0 left-0 h-full ${sidebarCollapsed ? 'w-20' : 'w-64'} bg-black/60 border-r border-white/5 p-6 flex flex-col justify-between z-40 transition-all duration-300 md:flex`}
        style={{ minWidth: sidebarCollapsed ? '5rem' : '16rem' }}
        aria-label="Sidebar"
      >
        {/* Collapse/Expand button for desktop */}
        <div className="hidden md:flex justify-end mb-4">
          <button
            className="p-2 rounded bg-black/70 border border-white/10 text-white focus:outline-none"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={() => setSidebarCollapsed((prev) => !prev)}
          >
            {sidebarCollapsed ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
        <div className="flex flex-col space-y-2">
          <div className={`flex items-center mb-8 transition-all duration-300 ${sidebarCollapsed ? 'justify-center' : ''}`}> 
            <BarChart3 className="h-7 w-7 text-blue-400" />
            {!sidebarCollapsed && <span className="ml-2 text-xl font-bold text-white">BreakIn Direct</span>}
          </div>
          {[
            { label: 'Overview', value: 'overview', icon: <BarChart3 className="h-5 w-5 mr-2" /> },
            { label: 'Talent Radar', value: 'talent', icon: <Zap className="h-5 w-5 mr-2" /> },
            { label: 'Squad Hiring', value: 'squads', icon: <Users className="h-5 w-5 mr-2" /> },
            { label: 'Sponsored Sprints', value: 'sprints', icon: <Play className="h-5 w-5 mr-2" /> },
            { label: 'Analytics', value: 'analytics', icon: <BarChart3 className="h-5 w-5 mr-2" /> },
            { label: 'Settings', value: 'settings', icon: <Filter className="h-5 w-5 mr-2" /> },
          ].map((item) => (
            <Button
              key={item.value}
              variant={activeTab === item.value ? 'secondary' : 'ghost'}
              className={`justify-start text-white hover:bg-white/5 w-full flex items-center ${activeTab === item.value ? 'bg-blue-600/20 border-l-4 border-blue-400' : ''} ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
              onClick={() => { setActiveTab(item.value); setSidebarOpen(false); }}
              style={{ minHeight: '2.5rem' }}
            >
              {item.icon}
              {!sidebarCollapsed && item.label}
            </Button>
          ))}
        </div>
        <div className={`flex flex-col space-y-2 mt-8 ${sidebarCollapsed ? 'items-center' : ''}`}>
          <Button variant="ghost" className={`justify-start text-white hover:bg-white/5 w-full flex items-center ${sidebarCollapsed ? 'justify-center px-0' : ''}`} asChild>
            <Link href="#support"><MessageSquare className="h-5 w-5 mr-2" />{!sidebarCollapsed && 'Support'}</Link>
          </Button>
          <Button variant="ghost" className={`justify-start text-white hover:bg-white/5 w-full flex items-center ${sidebarCollapsed ? 'justify-center px-0' : ''}`} asChild>
            <Link href="#profile"><Avatar className="h-6 w-6 mr-2"><AvatarImage src="/placeholder-user.jpg" /><AvatarFallback>CO</AvatarFallback></Avatar>{!sidebarCollapsed && 'Profile/Logout'}</Link>
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
      <main className={`flex-1 p-8 transition-all duration-300 ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-black/60 border border-white/5">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="talent"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300"
            >
              Talent Radar
            </TabsTrigger>
            <TabsTrigger
              value="squads"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300"
            >
              Squad Hiring
            </TabsTrigger>
            <TabsTrigger
              value="sprints"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300"
            >
              Sponsored Sprints
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Quick Stats */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">Active Matches</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">23</div>
                      <p className="text-xs text-green-400">+12% from last week</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">Interviews Booked</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">8</div>
                      <p className="text-xs text-blue-400">This week</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">Success Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">94%</div>
                      <p className="text-xs text-green-400">Above average</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-white text-sm">New talent match: ReactNinja_2024</p>
                          <p className="text-gray-400 text-xs">2 hours ago</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white bg-transparent"
                        >
                          View
                        </Button>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-white text-sm">Interview scheduled with FullStackPro</p>
                          <p className="text-gray-400 text-xs">4 hours ago</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white bg-transparent"
                        >
                          Details
                        </Button>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-white text-sm">Sprint "Mobile Banking App" completed</p>
                          <p className="text-gray-400 text-xs">1 day ago</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white bg-transparent"
                        >
                          Review
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Talent Alerts */}
              <div className="space-y-6">
                <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Bell className="h-5 w-5 mr-2 text-blue-400" />
                      Talent Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-blue-600/10 border border-blue-400/20 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="bg-blue-600 text-white">New Match</Badge>
                          <span className="text-xs text-gray-400">5 min ago</span>
                        </div>
                        <p className="text-white text-sm">CloudArchitect matches your DevOps role</p>
                        <p className="text-gray-400 text-xs">96% success rate • 4 endorsements</p>
                      </div>
                      <div className="p-3 bg-green-600/10 border border-green-400/20 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="bg-green-600 text-white">Rising Star</Badge>
                          <span className="text-xs text-gray-400">1 hour ago</span>
                        </div>
                        <p className="text-white text-sm">ReactNinja_2024 completed sprint with 4.9 rating</p>
                        <p className="text-gray-400 text-xs">Available for hire • React specialist</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Sprint
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-white/10 text-white hover:bg-white/5 bg-transparent"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Search Talent
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-white/10 text-white hover:bg-white/5 bg-transparent"
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Reports
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Talent Radar Tab */}
          <TabsContent value="talent" className="mt-8">
            <div className="space-y-6">
              {/* AI Match Engine */}
              <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-blue-400" />
                    AI Match Engine
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Paste your job description for instant talent recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Paste your job description here or describe what you're looking for..."
                      className="bg-black/60 border-white/10 text-white placeholder-gray-400"
                      rows={4}
                    />
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Target className="h-4 w-4 mr-2" />
                      Find Matches
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Filters */}
              <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Filter className="h-5 w-5 mr-2 text-blue-400" />
                    Smart Filters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-gray-300">Readiness Level</Label>
                      <Select>
                        <SelectTrigger className="bg-black/60 border-white/10 text-white">
                          <SelectValue placeholder="All levels" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ready">Ready to hire</SelectItem>
                          <SelectItem value="emerging">Emerging talent</SelectItem>
                          <SelectItem value="experienced">Experienced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300">Skills</Label>
                      <Select>
                        <SelectTrigger className="bg-black/60 border-white/10 text-white">
                          <SelectValue placeholder="Select skills" />
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
                      <Label className="text-gray-300">Sprint History</Label>
                      <Select>
                        <SelectTrigger className="bg-black/60 border-white/10 text-white">
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5+">5+ sprints</SelectItem>
                          <SelectItem value="10+">10+ sprints</SelectItem>
                          <SelectItem value="15+">15+ sprints</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300">Endorsements</Label>
                      <Select>
                        <SelectTrigger className="bg-black/60 border-white/10 text-white">
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1+">1+ endorsements</SelectItem>
                          <SelectItem value="3+">3+ endorsements</SelectItem>
                          <SelectItem value="5+">5+ endorsements</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Talent Recommendations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {talentRecommendations.map((developer) => (
                  <Card
                    key={developer.id}
                    className="bg-black/40 border-white/5 backdrop-blur-sm hover:border-blue-400/30 transition-colors"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={developer.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{developer.codename.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-white text-lg">{developer.codename}</CardTitle>
                            <div className="flex items-center space-x-2">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-gray-300 text-sm">{developer.reputation}</span>
                            </div>
                          </div>
                        </div>
                        <Badge
                          className={`${developer.status === "Available" ? "bg-green-600/10 text-green-300 border-green-400/20" : "bg-yellow-600/10 text-yellow-300 border-yellow-400/20"}`}
                        >
                          {developer.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {developer.skills.map((skill) => (
                              <Badge
                                key={skill}
                                variant="secondary"
                                className="bg-blue-600/10 text-blue-300 border-blue-400/20"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Sprint History</span>
                            <div className="text-white font-medium">{developer.sprintHistory} sprints</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Success Rate</span>
                            <div className="text-white font-medium">{developer.successRate}%</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Growth Delta</span>
                            <div className="text-green-400 font-medium">{developer.growthDelta}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Endorsements</span>
                            <div className="text-white font-medium">{developer.mentorEndorsements}</div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-white/5">
                          <div className="text-gray-400 text-sm mb-2">Last Sprint: {developer.lastSprint}</div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-gray-300 text-sm">{developer.teamRating} team rating</span>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-white/10 text-white hover:bg-white/5 bg-transparent"
                              >
                                <Bookmark className="h-4 w-4" />
                              </Button>
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                                <Send className="h-4 w-4 mr-1" />
                                Contact
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Squad Hiring Tab */}
          <TabsContent value="squads" className="mt-8">
            <div className="space-y-6">
              <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-400" />
                    Team-in-a-Box Recommendations
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Hire entire squads that have proven they work well together
                  </CardDescription>
                </CardHeader>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {squadRecommendations.map((squad) => (
                  <Card key={squad.id} className="bg-black/40 border-white/5 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white">{squad.name}</CardTitle>
                        <Badge className="bg-blue-600/10 text-blue-300 border-blue-400/20">
                          {squad.members} members
                        </Badge>
                      </div>
                      <CardDescription className="text-gray-300">
                        {squad.completedSprints} completed sprints • {squad.successRate}% success rate
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-gray-400 text-sm">Specialties</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {squad.specialties.map((specialty) => (
                              <Badge
                                key={specialty}
                                variant="secondary"
                                className="bg-green-600/10 text-green-300 border-green-400/20"
                              >
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label className="text-gray-400 text-sm">Team Dynamics</Label>
                          <div className="grid grid-cols-3 gap-4 mt-2">
                            <div className="text-center">
                              <div className="text-white font-medium">{squad.teamDynamics.collaboration}</div>
                              <div className="text-gray-400 text-xs">Collaboration</div>
                            </div>
                            <div className="text-center">
                              <div className="text-white font-medium">{squad.teamDynamics.delivery}</div>
                              <div className="text-gray-400 text-xs">Delivery</div>
                            </div>
                            <div className="text-center">
                              <div className="text-white font-medium">{squad.teamDynamics.codeQuality}</div>
                              <div className="text-gray-400 text-xs">Code Quality</div>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-white/5">
                          <div className="text-gray-400 text-sm mb-3">Last Project: {squad.lastProject}</div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              className="flex-1 border-white/10 text-white hover:bg-white/5 bg-transparent"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                              <Users className="h-4 w-4 mr-2" />
                              Hire Squad
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Sponsored Sprints Tab */}
          <TabsContent value="sprints" className="mt-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Sponsored Sprint Manager</h2>
                  <p className="text-gray-300">Create custom challenges to source and evaluate talent</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Sprint
                </Button>
              </div>

              {/* Active Sprints */}
              <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Active Sponsored Sprints</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeSprints.map((sprint) => (
                      <div key={sprint.id} className="p-4 bg-black/60 border border-white/5 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="text-white font-semibold">{sprint.title}</h3>
                            <p className="text-gray-400 text-sm">
                              {sprint.participants} participants • {sprint.applications} applications
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-green-600/10 text-green-300 border-green-400/20">
                              {sprint.status}
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-white/10 text-white hover:bg-white/5 bg-transparent"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                          <div>
                            <span className="text-gray-400 text-sm">Progress</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={sprint.progress} className="flex-1 bg-gray-800" />
                              <span className="text-white text-sm">{sprint.progress}%</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm">Days Remaining</span>
                            <div className="text-white font-medium">{sprint.daysRemaining}</div>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm">Budget</span>
                            <div className="text-white font-medium">{sprint.budget}</div>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm">ROI Estimate</span>
                            <div className="text-green-400 font-medium">3.2x</div>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Play className="h-4 w-4 mr-1" />
                            Watch Live
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/10 text-white hover:bg-white/5 bg-transparent"
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Feedback
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/10 text-white hover:bg-white/5 bg-transparent"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Export
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-8">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">Hiring Cost Savings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">$127K</div>
                    <p className="text-xs text-green-400">vs traditional hiring</p>
                  </CardContent>
                </Card>
                <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">Time to Hire</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">12 days</div>
                    <p className="text-xs text-green-400">-67% reduction</p>
                  </CardContent>
                </Card>
                <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">Match Accuracy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">94%</div>
                    <p className="text-xs text-blue-400">AI learning active</p>
                  </CardContent>
                </Card>
                <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">Retention Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">96%</div>
                    <p className="text-xs text-green-400">12-month average</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Hiring Intelligence Dashboard</CardTitle>
                  <CardDescription className="text-gray-300">
                    AI-powered insights based on your hiring patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-black/60 border border-white/5 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                      <p className="text-gray-300">Interactive analytics dashboard</p>
                      <p className="text-gray-400 text-sm">Charts and insights would be rendered here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-8">
            <div className="space-y-6">
              <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Talent Preferences</CardTitle>
                  <CardDescription className="text-gray-300">
                    Define your ideal candidate profile for better AI matching
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-gray-300">Tech Stack Preferences</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {["React", "Node.js", "Python", "AWS", "TypeScript", "Docker"].map((tech) => (
                            <div key={tech} className="flex items-center space-x-2">
                              <Switch />
                              <span className="text-white text-sm">{tech}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-gray-300">Seniority Level</Label>
                        <Select>
                          <SelectTrigger className="bg-black/60 border-white/10 text-white mt-2">
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="junior">Junior (0-2 years)</SelectItem>
                            <SelectItem value="mid">Mid-level (2-5 years)</SelectItem>
                            <SelectItem value="senior">Senior (5+ years)</SelectItem>
                            <SelectItem value="lead">Lead/Principal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-gray-300">Cultural Fit Tags</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {["Fast-paced", "Async work", "Startup", "Enterprise", "Remote-first", "Collaborative"].map(
                            (culture) => (
                              <div key={culture} className="flex items-center space-x-2">
                                <Switch />
                                <span className="text-white text-sm">{culture}</span>
                              </div>
                            ),
                          )}
                        </div>
                      </div>

                      <div>
                        <Label className="text-gray-300">Location Preference</Label>
                        <Select>
                          <SelectTrigger className="bg-black/60 border-white/10 text-white mt-2">
                            <SelectValue placeholder="Select preference" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="remote">Remote only</SelectItem>
                            <SelectItem value="hybrid">Hybrid</SelectItem>
                            <SelectItem value="onsite">On-site</SelectItem>
                            <SelectItem value="timezone">Timezone overlap required</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-white/5" />

                  <div>
                    <Label className="text-gray-300">AI Learning Preferences</Label>
                    <div className="space-y-3 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-white">Enable AI feedback loop</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white">Share hiring patterns for better matching</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white">Receive proactive talent alerts</span>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">Save Preferences</Button>
                    <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 bg-transparent">
                      Reset to Defaults
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
