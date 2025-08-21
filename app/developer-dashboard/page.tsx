"use client"

import { useState, useEffect } from "react"
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
} from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { User, Session } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

export default function DeveloperDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
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
    fetchUser()
  }, [supabase])

  const availableSprints = [
    {
      id: 1,
      title: "E-commerce Platform",
      company: "TechCorp",
      difficulty: "Intermediate",
      duration: "5 days",
      teamSize: 4,
      technologies: ["React", "Node.js", "PostgreSQL"],
      description: "Build a complete e-commerce platform with payment integration",
      reward: "$2,500",
      applications: 24,
      spotsLeft: 2,
      startDate: "March 15",
      mentor: "Sarah Chen",
      rating: 4.8,
    },
    {
      id: 2,
      title: "Mobile Banking App",
      company: "FinanceFlow",
      difficulty: "Advanced",
      duration: "7 days",
      teamSize: 3,
      technologies: ["React Native", "Python", "AWS"],
      description: "Develop a secure mobile banking application with biometric authentication",
      reward: "$3,500",
      applications: 18,
      spotsLeft: 1,
      startDate: "March 20",
      mentor: "Alex Rodriguez",
      rating: 4.9,
    },
    {
      id: 3,
      title: "AI Content Generator",
      company: "ContentAI",
      difficulty: "Expert",
      duration: "10 days",
      teamSize: 5,
      technologies: ["Python", "TensorFlow", "React", "Docker"],
      description: "Create an AI-powered content generation platform with ML models",
      reward: "$5,000",
      applications: 32,
      spotsLeft: 3,
      startDate: "March 25",
      mentor: "Dr. Emily Watson",
      rating: 4.7,
    },
  ]

  const myStats = {
    sprintsCompleted: 12,
    successRate: 94,
    reputation: 4.8,
    totalEarnings: "$18,500",
    skillBadges: 8,
    mentorEndorsements: 5,
    currentStreak: 6,
    nextLevel: "Senior Developer",
  }

  const recentActivity = [
    {
      type: "sprint_completed",
      title: "Completed 'SaaS Dashboard' sprint",
      time: "2 hours ago",
      rating: 4.9,
      reward: "$2,000",
    },
    {
      type: "skill_earned",
      title: "Earned 'React Expert' badge",
      time: "1 day ago",
      badge: "React Expert",
    },
    {
      type: "mentor_feedback",
      title: "Received mentor endorsement from John Smith",
      time: "2 days ago",
      feedback: "Excellent problem-solving skills and team collaboration",
    },
    {
      type: "interview_request",
      title: "Interview request from TechCorp",
      time: "3 days ago",
      company: "TechCorp",
    },
  ]

  const skillProgress = [
    { skill: "React", level: 85, badge: "Expert" },
    { skill: "Node.js", level: 78, badge: "Advanced" },
    { skill: "Python", level: 72, badge: "Intermediate" },
    { skill: "AWS", level: 65, badge: "Intermediate" },
    { skill: "TypeScript", level: 88, badge: "Expert" },
    { skill: "Docker", level: 55, badge: "Beginner" },
  ]

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-black via-gray-900/95 to-blue-950/80">
      {/* Sidebar Navigation */}
      <nav className="w-64 h-screen bg-black/60 border-r border-white/5 p-6 flex flex-col space-y-4">
        <Button variant="ghost" className="text-white justify-start hover:bg-white/5" asChild>
          <Link href="/">Home</Link>
        </Button>
        <Button variant="ghost" className="text-white justify-start hover:bg-white/5" asChild>
          <Link href="/company-dashboard">Company Dashboard</Link>
        </Button>
        <Button variant="ghost" className="text-white justify-start hover:bg-white/5" asChild>
          <Link href="/world-view">World View</Link>
        </Button>
      </nav>
      <main className="flex-1 p-8">
        {/* Navigation */}
        <nav className="border-b border-white/5 bg-black/60 backdrop-blur-md mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" className="text-white hover:bg-white/5" asChild>
                  <Link href="/">Home</Link>
                </Button>
                <Button variant="ghost" className="text-white hover:bg-white/5" asChild>
                  <Link href="/company-dashboard">Company Dashboard</Link>
                </Button>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/5">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                  <Badge className="ml-2 bg-blue-600 text-white">2</Badge>
                </Button>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                  {user ? (
                    <>
                      <div className="text-white font-medium">                       
                        {user.user_metadata?.full_name || user.email?.charAt(0)}
                      </div>
                      <div className="text-gray-400 text-sm">
                        Reputation: {myStats.reputation}
                      </div>
                    </>
                  ) : (
                    <>
                      {null}
                    </>
                  )}

                  </div>
                  {user ? (
                    <>
                      <Avatar>
                      <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder-user.jpg"} />
                      <AvatarFallback>
                       {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0)}
                      </AvatarFallback>
                      </Avatar>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white bg-transparent"
                        asChild>
                       <Link href="/sign-in">Sign In</Link>
                       </Button>
                    </>
                  )}

                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-black/60 border border-white/5">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="sprints"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300"
              >
                Available Sprints
              </TabsTrigger>
              <TabsTrigger
                value="portfolio"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300"
              >
                Portfolio
              </TabsTrigger>
              <TabsTrigger
                value="skills"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300"
              >
                Skills & Growth
              </TabsTrigger>
              <TabsTrigger
                value="opportunities"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300"
              >
                Opportunities
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Stats Overview */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-300">Sprints Completed</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-white">{myStats.sprintsCompleted}</div>
                        <p className="text-xs text-green-400">+2 this month</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-300">Success Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-white">{myStats.successRate}%</div>
                        <p className="text-xs text-blue-400">Above average</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-300">Total Earnings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-white">{myStats.totalEarnings}</div>
                        <p className="text-xs text-green-400">+$2K this month</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-300">Reputation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-white flex items-center">
                          <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                          {myStats.reputation}
                        </div>
                        <p className="text-xs text-blue-400">Top 10%</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Current Sprint Status */}
                  <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white flex items-center">
                          <Rocket className="h-5 w-5 mr-2 text-blue-400" />
                          Current Sprint: SaaS Dashboard
                        </CardTitle>
                        <Badge className="bg-green-600/10 text-green-300 border-green-400/20">Day 3 of 5</Badge>
                      </div>
                      <CardDescription className="text-gray-300">
                        Building a comprehensive analytics dashboard • Team of 4 developers
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
                              4.7
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm">Potential Reward</span>
                            <div className="text-green-400 font-medium">$2,500</div>
                          </div>
                        </div>

                        <div className="flex space-x-2">
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

                  {/* Recent Activity */}
                  <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
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
                              <p className="text-gray-400 text-xs">{activity.time}</p>
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
                        ))}
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
                        <p className="text-gray-300 text-sm">Successful sprints in a row</p>
                        <div className="mt-4">
                          <Progress value={(myStats.currentStreak / 10) * 100} className="bg-gray-800" />
                          <p className="text-gray-400 text-xs mt-1">4 more for next milestone</p>
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
                          <span className="text-gray-300 text-sm">Current: Intermediate</span>
                          <span className="text-blue-400 text-sm">Next: {myStats.nextLevel}</span>
                        </div>
                        <Progress value={75} className="bg-gray-800" />
                        <div className="text-center">
                          <p className="text-gray-400 text-xs">Complete 3 more sprints to level up</p>
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
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        <Search className="h-4 w-4 mr-2" />
                        Find New Sprints
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-white/10 text-white hover:bg-white/5 bg-transparent"
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Learning Resources
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
            <TabsContent value="sprints" className="mt-8">
              <div className="space-y-6">
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
                  {availableSprints.map((sprint) => (
                    <Card
                      key={sprint.id}
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
                              <div className="text-white font-medium">{sprint.teamSize} developers</div>
                            </div>
                            <div>
                              <span className="text-gray-400">Reward</span>
                              <div className="text-green-400 font-medium">{sprint.reward}</div>
                            </div>
                            <div>
                              <span className="text-gray-400">Spots Left</span>
                              <div className="text-white font-medium">
                                {sprint.spotsLeft} of {sprint.teamSize}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-white/5">
                            <div className="flex items-center space-x-4 text-sm">
                              <div className="flex items-center text-gray-300">
                                <Calendar className="h-4 w-4 mr-1" />
                                Starts {sprint.startDate}
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
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Portfolio Tab */}
            <TabsContent value="portfolio" className="mt-8">
              <div className="space-y-6">
                <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Sprint Portfolio</CardTitle>
                    <CardDescription className="text-gray-300">
                      Showcase your completed projects and achievements
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Trophy className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                      <h3 className="text-white text-lg font-semibold mb-2">Your Sprint History</h3>
                      <p className="text-gray-300 mb-4">
                        {myStats.sprintsCompleted} completed sprints with {myStats.successRate}% success rate
                      </p>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">View Detailed Portfolio</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Skills & Growth Tab */}
            <TabsContent value="skills" className="mt-8">
              <div className="space-y-6">
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
                        {skillProgress.map((skill) => (
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
                        ))}
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
              </div>
            </TabsContent>

            {/* Opportunities Tab */}
            <TabsContent value="opportunities" className="mt-8">
              <div className="space-y-6">
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
                          We were impressed with your performance in the E-commerce Platform sprint. Would you be
                          interested in a full-time position?
                        </p>
                        <div className="flex space-x-2">
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
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
