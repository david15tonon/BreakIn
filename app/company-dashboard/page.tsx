"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Star,
  Code,
  Users,
  TrendingUp,
  Eye,
  Calendar,
  Briefcase,
  Award,
  GitBranch,
  Bell,
  Settings,
  Target,
  Zap,
  UserPlus,
  Download,
  BarChart3,
  Shield,
  CreditCard,
  Sparkles,
  CheckCircle,
  Plus,
  FilterIcon,
  Heart,
  BookOpen,
  Rocket,
  Lightbulb,
  Activity,
} from "lucide-react"

export default function CompanyDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              BreakIn Direct
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            <Badge className="bg-blue-100 text-blue-800">TechCorp Inc.</Badge>
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>TC</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Company Profile */}
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <CardTitle>TechCorp Inc.</CardTitle>
                <CardDescription>Software Development</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">24</div>
                    <div className="text-xs text-gray-500">Active Searches</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">156</div>
                    <div className="text-xs text-gray-500">Candidates</div>
                  </div>
                </div>
                <Button className="w-full bg-transparent" variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Company Settings
                </Button>
              </CardContent>
            </Card>

            {/* Talent Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-blue-600" />
                  Talent Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New React Expert</p>
                    <p className="text-xs text-gray-500">95% match • Just completed sprint</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Squad Available</p>
                    <p className="text-xs text-gray-500">Full-stack team • 4 members</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 bg-purple-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Rising Star</p>
                    <p className="text-xs text-gray-500">Junior dev • Rapid growth</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Target className="w-4 h-4 mr-2" />
                  Set Preferences
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Rocket className="w-4 h-4 mr-2" />
                  Sponsor Sprint
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Hire Squad
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Mentor Program
                </Button>
              </CardContent>
            </Card>

            {/* Hiring Credits */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                  Hiring Credits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">47</div>
                  <div className="text-sm text-gray-500">Credits Remaining</div>
                </div>
                <Progress value={78} className="w-full" />
                <Button className="w-full bg-transparent" size="sm" variant="outline">
                  Buy More Credits
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="talent-radar">Talent Radar</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
                <TabsTrigger value="squads">Squads</TabsTrigger>
                <TabsTrigger value="sprints">Sprints</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Snapshot Overview */}
                <div className="grid md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="text-2xl font-bold">12</div>
                          <div className="text-sm text-gray-500">New Matches</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="text-2xl font-bold">8</div>
                          <div className="text-sm text-gray-500">Interviews</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5 text-purple-600" />
                        <div>
                          <div className="text-2xl font-bold">3</div>
                          <div className="text-sm text-gray-500">Squad Matches</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5 text-orange-600" />
                        <div>
                          <div className="text-2xl font-bold">94%</div>
                          <div className="text-sm text-gray-500">Match Quality</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest talent matches and interactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">New AI Match: Sarah Kim</p>
                          <p className="text-sm text-gray-600">Full-stack developer • 96% match • Available now</p>
                        </div>
                        <Button size="sm">View Profile</Button>
                      </div>

                      <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Interview Completed: Alex Martinez</p>
                          <p className="text-sm text-gray-600">
                            Backend developer • Positive feedback • Ready for offer
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          Send Offer
                        </Button>
                      </div>

                      <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
                        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Squad Recommendation: Team Phoenix</p>
                          <p className="text-sm text-gray-600">
                            4-person team • E-commerce expertise • High collaboration score
                          </p>
                        </div>
                        <Button size="sm">View Squad</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Hiring Intelligence */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
                      AI Hiring Intelligence
                    </CardTitle>
                    <CardDescription>Personalized insights based on your hiring patterns</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                        <h4 className="font-semibold mb-2">Trending Skills in Your Network</h4>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">TypeScript</Badge>
                          <Badge variant="secondary">React Native</Badge>
                          <Badge variant="secondary">GraphQL</Badge>
                          <Badge variant="secondary">Kubernetes</Badge>
                        </div>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                        <h4 className="font-semibold mb-2">Optimal Hiring Time</h4>
                        <p className="text-sm text-gray-600">
                          Based on sprint cycles, Tuesday-Thursday interviews show 23% higher acceptance rates
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Talent Radar Tab */}
              <TabsContent value="talent-radar" className="space-y-6">
                {/* AI Match Engine */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="w-5 h-5 mr-2 text-blue-600" />
                      Role-to-Talent Match Engine
                    </CardTitle>
                    <CardDescription>Paste your job description for instant AI matching</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex space-x-4">
                      <Input placeholder="Paste job description or describe the role..." className="flex-1" />
                      <Button>
                        <Zap className="w-4 h-4 mr-2" />
                        Find Matches
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Sparkles className="w-4 h-4" />
                      <span>AI will analyze requirements and suggest 3-5 best-fit candidates instantly</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Smart Filters */}
                <div className="flex space-x-4 items-center">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input placeholder="Search by skills, behavior, or sprint history..." className="pl-10" />
                  </div>
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Readiness Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ready">Ready to Hire</SelectItem>
                      <SelectItem value="emerging">Emerging Talent</SelectItem>
                      <SelectItem value="rising">Rising Stars</SelectItem>
                      <SelectItem value="all">All Levels</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <FilterIcon className="w-4 h-4 mr-2" />
                    More Filters
                  </Button>
                </div>

                {/* Developer Cards with Enhanced Info */}
                <div className="space-y-4">
                  <Card className="hover:shadow-md transition-shadow border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src="/placeholder.svg?height=48&width=48" />
                            <AvatarFallback>SK</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold">Sarah Kim</h3>
                              <Badge className="bg-green-100 text-green-800">Ready to Hire</Badge>
                              <Badge variant="outline">96% Match</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">Full-Stack Developer • Codename: Phoenix_Dev</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <span>4.9 Reputation</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Activity className="w-4 h-4" />
                                <span>+0.8 Growth Delta</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Users className="w-4 h-4" />
                                <span>Led 3 squads</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge variant="secondary">React</Badge>
                              <Badge variant="secondary">Node.js</Badge>
                              <Badge variant="secondary">TypeScript</Badge>
                              <Badge variant="secondary">Team Leadership</Badge>
                              <Badge variant="secondary">Mentoring</Badge>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg mb-3">
                              <p className="text-sm font-medium mb-1">AI + Mentor Review Summary:</p>
                              <p className="text-sm text-gray-600">
                                "Exceptional technical skills with natural leadership. Consistently delivers
                                high-quality code and mentors junior developers effectively. Strong in system design and
                                cross-team collaboration."
                              </p>
                            </div>
                            <div className="flex items-center space-x-4 text-sm">
                              <span className="text-green-600">✓ Available immediately</span>
                              <span className="text-blue-600">📍 San Francisco, CA</span>
                              <span className="text-purple-600">🕒 PST timezone</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Full Profile
                          </Button>
                          <Button size="sm" variant="outline">
                            <Calendar className="w-4 h-4 mr-2" />
                            Book Interview
                          </Button>
                          <Button size="sm" variant="outline">
                            <Heart className="w-4 h-4 mr-2" />
                            Shortlist
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src="/placeholder.svg?height=48&width=48" />
                            <AvatarFallback>AM</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold">Alex Martinez</h3>
                              <Badge className="bg-blue-100 text-blue-800">In Sprint</Badge>
                              <Badge variant="outline">89% Match</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">Backend Developer • Codename: DataForge_Alex</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <span>4.7 Reputation</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Activity className="w-4 h-4" />
                                <span>+1.2 Growth Delta</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <GitBranch className="w-4 h-4" />
                                <span>47 commits this sprint</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge variant="secondary">Python</Badge>
                              <Badge variant="secondary">Django</Badge>
                              <Badge variant="secondary">PostgreSQL</Badge>
                              <Badge variant="secondary">AWS</Badge>
                              <Badge variant="secondary">API Design</Badge>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-lg mb-3">
                              <p className="text-sm font-medium mb-1">Currently in Microservices Sprint:</p>
                              <p className="text-sm text-gray-600">
                                Leading API architecture design. Excellent problem-solving and code review skills.
                                Sprint completion rate: 95% on time.
                              </p>
                            </div>
                            <div className="flex items-center space-x-4 text-sm">
                              <span className="text-orange-600">⏳ Available in 6 days</span>
                              <span className="text-blue-600">📍 Austin, TX</span>
                              <span className="text-purple-600">🕒 CST timezone</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Watch Sprint
                          </Button>
                          <Button size="sm" variant="outline">
                            <Calendar className="w-4 h-4 mr-2" />
                            Schedule Call
                          </Button>
                          <Button size="sm" variant="outline">
                            <Heart className="w-4 h-4 mr-2" />
                            Shortlist
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow border-l-4 border-l-purple-500">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src="/placeholder.svg?height=48&width=48" />
                            <AvatarFallback>JL</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold">Jordan Lee</h3>
                              <Badge className="bg-purple-100 text-purple-800">Rising Star</Badge>
                              <Badge variant="outline">92% Match</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">Frontend Developer • Codename: UIWizard_Jordan</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <span>4.8 Reputation</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <TrendingUp className="w-4 h-4 text-green-500" />
                                <span>+1.5 Growth Delta</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Award className="w-4 h-4" />
                                <span>Sprint MVP x2</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge variant="secondary">React</Badge>
                              <Badge variant="secondary">Vue.js</Badge>
                              <Badge variant="secondary">CSS/Sass</Badge>
                              <Badge variant="secondary">UI/UX</Badge>
                              <Badge variant="secondary">Design Systems</Badge>
                            </div>
                            <div className="bg-purple-50 p-3 rounded-lg mb-3">
                              <p className="text-sm font-medium mb-1">Rapid Growth Trajectory:</p>
                              <p className="text-sm text-gray-600">
                                Exceptional design sense and clean code practices. Recently completed complex dashboard
                                sprint with outstanding user feedback. Mentor endorsement: "Future tech lead material."
                              </p>
                            </div>
                            <div className="flex items-center space-x-4 text-sm">
                              <span className="text-green-600">✓ Available now</span>
                              <span className="text-blue-600">📍 Seattle, WA</span>
                              <span className="text-purple-600">🕒 PST timezone</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Full Profile
                          </Button>
                          <Button size="sm" variant="outline">
                            <Calendar className="w-4 h-4 mr-2" />
                            Book Interview
                          </Button>
                          <Button size="sm" variant="outline">
                            <Heart className="w-4 h-4 mr-2" />
                            Shortlist
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Preferences Tab */}
              <TabsContent value="preferences" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="w-5 h-5 mr-2 text-blue-600" />
                      Talent Preferences Setup
                    </CardTitle>
                    <CardDescription>Define your ideal candidate profile for AI matching</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Role Definitions */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Role Definitions</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Tech Stack</label>
                          <div className="flex flex-wrap gap-2">
                            <Badge className="cursor-pointer">React</Badge>
                            <Badge className="cursor-pointer">Node.js</Badge>
                            <Badge className="cursor-pointer">TypeScript</Badge>
                            <Badge className="cursor-pointer">Python</Badge>
                            <Button size="sm" variant="outline">
                              <Plus className="w-4 h-4 mr-1" />
                              Add
                            </Button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Seniority Level</label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="junior">Junior (0-2 years)</SelectItem>
                              <SelectItem value="mid">Mid-level (2-5 years)</SelectItem>
                              <SelectItem value="senior">Senior (5+ years)</SelectItem>
                              <SelectItem value="lead">Tech Lead</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Cultural Fit */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Cultural Fit Tags</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Work Style</label>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <input type="checkbox" id="async" />
                              <label htmlFor="async" className="text-sm">
                                Async-first
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input type="checkbox" id="fast-paced" />
                              <label htmlFor="fast-paced" className="text-sm">
                                Fast-paced
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input type="checkbox" id="documentation" />
                              <label htmlFor="documentation" className="text-sm">
                                Documentation-heavy
                              </label>
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Company Type</label>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <input type="radio" name="company-type" id="startup" />
                              <label htmlFor="startup" className="text-sm">
                                Startup
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input type="radio" name="company-type" id="corporate" />
                              <label htmlFor="corporate" className="text-sm">
                                Corporate
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input type="radio" name="company-type" id="scale-up" />
                              <label htmlFor="scale-up" className="text-sm">
                                Scale-up
                              </label>
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Communication</label>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <input type="checkbox" id="direct" />
                              <label htmlFor="direct" className="text-sm">
                                Direct
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input type="checkbox" id="collaborative" />
                              <label htmlFor="collaborative" className="text-sm">
                                Collaborative
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input type="checkbox" id="mentoring" />
                              <label htmlFor="mentoring" className="text-sm">
                                Mentoring-focused
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Location Settings */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Location & Timezone</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Work Arrangement</label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select arrangement" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="remote">Fully Remote</SelectItem>
                              <SelectItem value="hybrid">Hybrid</SelectItem>
                              <SelectItem value="onsite">On-site</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Timezone Overlap</label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Required overlap" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="4h">4+ hours</SelectItem>
                              <SelectItem value="6h">6+ hours</SelectItem>
                              <SelectItem value="8h">8+ hours</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Preferred Regions</label>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="cursor-pointer">
                              North America
                            </Badge>
                            <Badge variant="outline" className="cursor-pointer">
                              Europe
                            </Badge>
                            <Badge variant="outline" className="cursor-pointer">
                              Asia-Pacific
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                      <Button variant="outline">Reset to Defaults</Button>
                      <Button>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Save Preferences
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Squads Tab */}
              <TabsContent value="squads" className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">Squad Hiring</h2>
                    <p className="text-gray-600">Hire entire teams that have proven they work well together</p>
                  </div>
                  <Button>
                    <Users className="w-4 h-4 mr-2" />
                    Browse All Squads
                  </Button>
                </div>

                <div className="grid gap-6">
                  <Card className="border-l-4 border-l-blue-500">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center">
                            <Users className="w-5 h-5 mr-2 text-blue-600" />
                            Team Phoenix
                          </CardTitle>
                          <CardDescription>Full-stack e-commerce specialists • 4 members</CardDescription>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Available</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Team Composition</h4>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarFallback className="text-xs">SK</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">Sarah Kim - Tech Lead</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarFallback className="text-xs">AM</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">Alex Martinez - Backend</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarFallback className="text-xs">JL</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">Jordan Lee - Frontend</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarFallback className="text-xs">MK</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">Maya Kumar - DevOps</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Team Dynamics</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm">Collaboration Score</span>
                                <span className="text-sm font-semibold text-green-600">9.2/10</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Delivery Rate</span>
                                <span className="text-sm font-semibold text-blue-600">96%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Code Quality</span>
                                <span className="text-sm font-semibold text-purple-600">A+</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Sprint Velocity</span>
                                <span className="text-sm font-semibold text-orange-600">High</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Recent Sprint Success</h4>
                          <p className="text-sm text-gray-600 mb-2">
                            Built a complete e-commerce platform in 14 days including payment integration, inventory
                            management, and admin dashboard. Exceeded all sprint goals.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">React</Badge>
                            <Badge variant="secondary">Node.js</Badge>
                            <Badge variant="secondary">PostgreSQL</Badge>
                            <Badge variant="secondary">AWS</Badge>
                            <Badge variant="secondary">Stripe</Badge>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t">
                          <div className="text-sm text-gray-600">
                            <span className="font-semibold">Estimated Cost:</span> $45,000/month for full team
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline">
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                            <Button>
                              <UserPlus className="w-4 h-4 mr-2" />
                              Hire Squad
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-purple-500">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center">
                            <Users className="w-5 h-5 mr-2 text-purple-600" />
                            Team Velocity
                          </CardTitle>
                          <CardDescription>AI/ML specialists • 3 members</CardDescription>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">In Sprint</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Team Composition</h4>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarFallback className="text-xs">TR</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">Taylor Rodriguez - ML Engineer</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarFallback className="text-xs">LM</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">Lisa Morgan - Data Scientist</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarFallback className="text-xs">NK</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">Nikhil Kumar - Backend</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Current Sprint Progress</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm">AI Chat Application</span>
                                <span className="text-sm font-semibold text-green-600">Day 3/10</span>
                              </div>
                              <Progress value={30} className="w-full" />
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>Ahead of schedule</span>
                                <span>23 commits</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Specialization</h4>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">Python</Badge>
                            <Badge variant="secondary">TensorFlow</Badge>
                            <Badge variant="secondary">FastAPI</Badge>
                            <Badge variant="secondary">OpenAI</Badge>
                            <Badge variant="secondary">Docker</Badge>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t">
                          <div className="text-sm text-gray-600">
                            <span className="font-semibold">Available:</span> In 7 days
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline">
                              <Eye className="w-4 h-4 mr-2" />
                              Watch Sprint
                            </Button>
                            <Button>
                              <Calendar className="w-4 h-4 mr-2" />
                              Schedule Interview
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Sprints Tab */}
              <TabsContent value="sprints" className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">Sponsored Sprints</h2>
                    <p className="text-gray-600">Create custom challenges to source and evaluate talent</p>
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Sprint
                  </Button>
                </div>

                <div className="grid gap-4">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>TechCorp E-Commerce Challenge</CardTitle>
                          <CardDescription>
                            React, Node.js, PostgreSQL • 14-day sprint • Sponsored by TechCorp
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                          <Badge variant="outline">12 participants</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Sprint Progress</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Day 8 of 14</span>
                                <span>57% complete</span>
                              </div>
                              <Progress value={57} className="w-full" />
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Participation</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span>Total Developers</span>
                                <span>12</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Active Teams</span>
                                <span>3</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Commits</span>
                                <span>147</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Top Performers</h4>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarFallback className="text-xs">SK</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">Sarah Kim</span>
                                <Badge variant="outline" className="text-xs">
                                  Lead
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarFallback className="text-xs">AM</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">Alex Martinez</span>
                                <Badge variant="outline" className="text-xs">
                                  MVP
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t">
                          <div className="text-sm text-gray-600">
                            <span className="font-semibold">Budget:</span> $5,000 •{" "}
                            <span className="font-semibold">Spent:</span> $2,850
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline">
                              <BarChart3 className="w-4 h-4 mr-2" />
                              View Analytics
                            </Button>
                            <Button variant="outline">
                              <Eye className="w-4 h-4 mr-2" />
                              Monitor Sprint
                            </Button>
                            <Button>
                              <UserPlus className="w-4 h-4 mr-2" />
                              Hire from Sprint
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>AI Chatbot Internship Track</CardTitle>
                          <CardDescription>
                            Python, FastAPI, OpenAI • 10-day sprint • University Partnership
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
                          <Badge variant="outline">8 participants</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Results</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span>Completion Rate</span>
                                <span className="text-green-600">100%</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Avg Quality Score</span>
                                <span className="text-blue-600">8.7/10</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Hired</span>
                                <span className="text-purple-600">3 developers</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Top Graduates</h4>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarFallback className="text-xs">TR</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">Taylor Rodriguez</span>
                                <Badge variant="outline" className="text-xs">
                                  Hired
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarFallback className="text-xs">LM</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">Lisa Morgan</span>
                                <Badge variant="outline" className="text-xs">
                                  Hired
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">ROI</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span>Sprint Cost</span>
                                <span>$3,200</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Hiring Savings</span>
                                <span className="text-green-600">$18,000</span>
                              </div>
                              <div className="flex justify-between font-semibold">
                                <span>Net ROI</span>
                                <span className="text-green-600">+463%</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t">
                          <div className="text-sm text-gray-600">
                            <span className="font-semibold">Completed:</span> 2 weeks ago
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline">
                              <Download className="w-4 h-4 mr-2" />
                              Export Report
                            </Button>
                            <Button variant="outline">
                              <Rocket className="w-4 h-4 mr-2" />
                              Rerun Sprint
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <div className="grid md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="text-2xl font-bold">156</div>
                          <div className="text-sm text-gray-500">Total Candidates</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <Eye className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="text-2xl font-bold">89</div>
                          <div className="text-sm text-gray-500">Profiles Viewed</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        <div>
                          <div className="text-2xl font-bold">18</div>
                          <div className="text-sm text-gray-500">Interviews</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <Award className="w-5 h-5 text-yellow-600" />
                        <div>
                          <div className="text-2xl font-bold">3</div>
                          <div className="text-sm text-gray-500">Hires Made</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Hiring Funnel</CardTitle>
                      <CardDescription>Track your hiring progress this month</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Candidates Viewed</span>
                          <span className="font-semibold">127</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "100%" }}></div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span>AI Matched</span>
                          <span className="font-semibold">89</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "70%" }}></div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span>Shortlisted</span>
                          <span className="font-semibold">24</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "19%" }}></div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span>Interviewed</span>
                          <span className="font-semibold">18</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "14%" }}></div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span>Offers Extended</span>
                          <span className="font-semibold">5</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: "4%" }}></div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span>Hired</span>
                          <span className="font-semibold text-green-600">3</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: "2.4%" }}></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>AI Learning Progress</CardTitle>
                      <CardDescription>How our AI is improving your matches</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Match Accuracy</span>
                          <span className="font-semibold text-green-600">94%</span>
                        </div>
                        <Progress value={94} className="w-full" />

                        <div className="flex justify-between items-center">
                          <span>Interview Success Rate</span>
                          <span className="font-semibold text-blue-600">78%</span>
                        </div>
                        <Progress value={78} className="w-full" />

                        <div className="flex justify-between items-center">
                          <span>Offer Acceptance Rate</span>
                          <span className="font-semibold text-purple-600">85%</span>
                        </div>
                        <Progress value={85} className="w-full" />

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-blue-800 mb-2">AI Insights</h4>
                          <p className="text-sm text-blue-700">
                            Your hiring patterns show a preference for candidates with strong mentoring experience. The
                            AI has learned to prioritize these profiles in future recommendations.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Hiring Compliance & Reports</CardTitle>
                    <CardDescription>Fair hiring logs and exportable reports</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center">
                          <Shield className="w-4 h-4 mr-2 text-green-600" />
                          Fair Hiring Score
                        </h4>
                        <div className="text-2xl font-bold text-green-600 mb-1">A+</div>
                        <p className="text-sm text-gray-600">All decisions based on performance data</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center">
                          <Download className="w-4 h-4 mr-2 text-blue-600" />
                          Export Reports
                        </h4>
                        <div className="space-y-2">
                          <Button size="sm" variant="outline" className="w-full bg-transparent">
                            <Download className="w-4 h-4 mr-2" />
                            Monthly Report
                          </Button>
                          <Button size="sm" variant="outline" className="w-full bg-transparent">
                            <Download className="w-4 h-4 mr-2" />
                            Audit Log
                          </Button>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center">
                          <BarChart3 className="w-4 h-4 mr-2 text-purple-600" />
                          Diversity Metrics
                        </h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Gender Balance</span>
                            <span className="text-green-600">52% / 48%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Geographic Diversity</span>
                            <span className="text-blue-600">8 countries</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Background Diversity</span>
                            <span className="text-purple-600">High</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
