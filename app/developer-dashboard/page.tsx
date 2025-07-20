import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Code,
  Users,
  Trophy,
  Clock,
  Star,
  GitBranch,
  MessageSquare,
  TrendingUp,
  Calendar,
  Target,
  Zap,
  Play,
  CheckCircle,
} from "lucide-react"

export default function DeveloperDashboard() {
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
            <Badge className="bg-green-100 text-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Available for Hire
            </Badge>
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src="/placeholder.svg?height=80&width=80" />
                  <AvatarFallback className="text-lg">JD</AvatarFallback>
                </Avatar>
                <CardTitle>Jordan Developer</CardTitle>
                <CardDescription>Full-Stack Developer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Reputation Score</span>
                    <span className="font-semibold">847</span>
                  </div>
                  <Progress value={84} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">12</div>
                    <div className="text-xs text-gray-500">Sprints</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">4.8</div>
                    <div className="text-xs text-gray-500">Rating</div>
                  </div>
                </div>
                <Button className="w-full bg-transparent" variant="outline">
                  View Public Profile
                </Button>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Skills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">React</span>
                  <Badge variant="secondary">Expert</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Node.js</span>
                  <Badge variant="secondary">Advanced</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">TypeScript</span>
                  <Badge variant="secondary">Advanced</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Team Leadership</span>
                  <Badge variant="secondary">Intermediate</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="dashboard" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="sprints">Active Sprints</TabsTrigger>
                <TabsTrigger value="library">Sprint Library</TabsTrigger>
                <TabsTrigger value="feedback">Feedback</TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="space-y-6">
                {/* Stats Overview */}
                <div className="grid md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <Trophy className="w-5 h-5 text-yellow-600" />
                        <div>
                          <div className="text-2xl font-bold">12</div>
                          <div className="text-sm text-gray-500">Completed Sprints</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="text-2xl font-bold">3</div>
                          <div className="text-sm text-gray-500">Active Teams</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <Star className="w-5 h-5 text-purple-600" />
                        <div>
                          <div className="text-2xl font-bold">4.8</div>
                          <div className="text-sm text-gray-500">Avg Rating</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="text-2xl font-bold">+15%</div>
                          <div className="text-sm text-gray-500">Growth Rate</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Current Sprint */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Current Sprint: E-Commerce Platform</CardTitle>
                      <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
                    </div>
                    <CardDescription>
                      Build a full-stack e-commerce platform with React, Node.js, and PostgreSQL
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>Day 8 of 14</span>
                    </div>
                    <Progress value={57} className="h-2" />

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">4 team members</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <GitBranch className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">23 commits today</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">12 new messages</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button>
                        <Play className="w-4 h-4 mr-2" />
                        Enter Squad Room
                      </Button>
                      <Button variant="outline">View Repository</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm">Completed user authentication feature</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm">Received mentor feedback on API design</p>
                        <p className="text-xs text-gray-500">4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm">Joined new sprint: "AI Chat Application"</p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sprints" className="space-y-6">
                <div className="grid gap-6">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>E-Commerce Platform</CardTitle>
                          <CardDescription>Full-stack development with React & Node.js</CardDescription>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>8/14 days</span>
                        </div>
                        <Progress value={57} />
                        <div className="flex items-center justify-between">
                          <div className="flex -space-x-2">
                            <Avatar className="w-8 h-8 border-2 border-white">
                              <AvatarFallback className="text-xs">AM</AvatarFallback>
                            </Avatar>
                            <Avatar className="w-8 h-8 border-2 border-white">
                              <AvatarFallback className="text-xs">SK</AvatarFallback>
                            </Avatar>
                            <Avatar className="w-8 h-8 border-2 border-white">
                              <AvatarFallback className="text-xs">JL</AvatarFallback>
                            </Avatar>
                          </div>
                          <Button size="sm">Enter Squad Room</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>AI Chat Application</CardTitle>
                          <CardDescription>Build an AI-powered chat interface</CardDescription>
                        </div>
                        <Badge className="bg-orange-100 text-orange-800">Starting Soon</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-sm text-gray-600">Starts in 3 days • 10-day sprint</div>
                        <div className="flex items-center justify-between">
                          <div className="flex -space-x-2">
                            <Avatar className="w-8 h-8 border-2 border-white">
                              <AvatarFallback className="text-xs">MR</AvatarFallback>
                            </Avatar>
                            <Avatar className="w-8 h-8 border-2 border-white">
                              <AvatarFallback className="text-xs">TK</AvatarFallback>
                            </Avatar>
                            <div className="w-8 h-8 border-2 border-white bg-gray-100 rounded-full flex items-center justify-center">
                              <span className="text-xs text-gray-500">+2</span>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="library" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Sprint Library</h2>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      Sort
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">Social Media Dashboard</CardTitle>
                          <CardDescription>React, TypeScript, Chart.js</CardDescription>
                        </div>
                        <Badge variant="secondary">14 days</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>4-5 team members</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Target className="w-4 h-4" />
                          <span>Intermediate level</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>Starts Dec 15</span>
                        </div>
                        <Button className="w-full mt-4">Join Sprint</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">Blockchain Voting App</CardTitle>
                          <CardDescription>Solidity, Web3, React</CardDescription>
                        </div>
                        <Badge variant="secondary">21 days</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>3-4 team members</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Target className="w-4 h-4" />
                          <span>Advanced level</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>Starts Dec 20</span>
                        </div>
                        <Button className="w-full mt-4">Join Sprint</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">Mobile Fitness Tracker</CardTitle>
                          <CardDescription>React Native, Firebase</CardDescription>
                        </div>
                        <Badge variant="secondary">18 days</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>4-6 team members</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Target className="w-4 h-4" />
                          <span>Intermediate level</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>Starts Jan 5</span>
                        </div>
                        <Button className="w-full mt-4">Join Sprint</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">DevOps Pipeline</CardTitle>
                          <CardDescription>Docker, Kubernetes, CI/CD</CardDescription>
                        </div>
                        <Badge variant="secondary">12 days</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>3-4 team members</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Target className="w-4 h-4" />
                          <span>Advanced level</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>Starts Jan 10</span>
                        </div>
                        <Button className="w-full mt-4">Join Sprint</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="feedback" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Feedback</CardTitle>
                    <CardDescription>AI and mentor feedback from your latest sprints</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="border-l-4 border-green-500 pl-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">E-Commerce Platform Sprint</h3>
                        <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        "Outstanding work on the authentication system. Your code is clean, well-documented, and follows
                        best practices. Great collaboration with the team."
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Mentor: Sarah Chen</span>
                        <span>2 days ago</span>
                      </div>
                    </div>

                    <div className="border-l-4 border-blue-500 pl-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">AI Feedback - Code Quality</h3>
                        <Badge className="bg-blue-100 text-blue-800">Good</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        "Your React components show good structure and reusability. Consider implementing error
                        boundaries for better error handling. Performance optimization opportunities identified in the
                        product listing component."
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>AI Analysis</span>
                        <span>1 day ago</span>
                      </div>
                    </div>

                    <div className="border-l-4 border-yellow-500 pl-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">Team Collaboration</h3>
                        <Badge className="bg-yellow-100 text-yellow-800">Improving</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        "Good communication in daily standups. Try to be more proactive in code reviews and helping
                        teammates with blockers. Your technical contributions are solid."
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Mentor: Alex Rodriguez</span>
                        <span>3 days ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Growth Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-sm">Master TypeScript</h3>
                        <p className="text-sm text-gray-600">Complete advanced TypeScript patterns sprint</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-sm">System Design Skills</h3>
                        <p className="text-sm text-gray-600">Join a microservices architecture sprint</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Zap className="w-5 h-5 text-purple-500 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-sm">Leadership Experience</h3>
                        <p className="text-sm text-gray-600">Take on a team lead role in your next sprint</p>
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
