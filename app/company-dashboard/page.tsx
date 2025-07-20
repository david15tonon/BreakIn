import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Search,
  Filter,
  Star,
  MapPin,
  Clock,
  Code,
  Users,
  TrendingUp,
  Eye,
  MessageCircle,
  Calendar,
  Briefcase,
  Award,
  GitBranch,
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
                  Company Settings
                </Button>
              </CardContent>
            </Card>

            {/* Quick Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">React Developers</span>
                  <Badge variant="secondary">42</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Full-Stack</span>
                  <Badge variant="secondary">38</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Team Leaders</span>
                  <Badge variant="secondary">12</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Available Now</span>
                  <Badge variant="secondary">89</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Hiring Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">This Month</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Profiles Viewed</span>
                  <span className="font-semibold">127</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Interviews Scheduled</span>
                  <span className="font-semibold">18</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Offers Extended</span>
                  <span className="font-semibold">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Hires Made</span>
                  <span className="font-semibold text-green-600">3</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="talent-feed" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="talent-feed">Talent Feed</TabsTrigger>
                <TabsTrigger value="shortlisted">Shortlisted</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="sprints">Live Sprints</TabsTrigger>
              </TabsList>

              <TabsContent value="talent-feed" className="space-y-6">
                {/* Search and Filters */}
                <div className="flex space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input placeholder="Search by skills, role, or experience..." className="pl-10" />
                  </div>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </div>

                {/* Talent Cards */}
                <div className="space-y-4">
                  <Card className="hover:shadow-md transition-shadow">
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
                              <Badge className="bg-green-100 text-green-800">Available</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">Full-Stack Developer</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <span>4.9</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>San Francisco, CA</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>2 years exp</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge variant="secondary">React</Badge>
                              <Badge variant="secondary">Node.js</Badge>
                              <Badge variant="secondary">TypeScript</Badge>
                              <Badge variant="secondary">Team Lead</Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              Led 3 successful sprint teams, consistently delivers high-quality code. Strong in system
                              design and mentoring junior developers.
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View Profile
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
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
                            </div>
                            <p className="text-sm text-gray-600 mb-2">Backend Developer</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <span>4.7</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>Austin, TX</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>1.5 years exp</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge variant="secondary">Python</Badge>
                              <Badge variant="secondary">Django</Badge>
                              <Badge variant="secondary">PostgreSQL</Badge>
                              <Badge variant="secondary">AWS</Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              Currently excelling in microservices sprint. Strong API design skills and excellent
                              problem-solving abilities.
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View Profile
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
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
                              <Badge className="bg-green-100 text-green-800">Available</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">Frontend Developer</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <span>4.8</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>Seattle, WA</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>1 year exp</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge variant="secondary">React</Badge>
                              <Badge variant="secondary">Vue.js</Badge>
                              <Badge variant="secondary">CSS</Badge>
                              <Badge variant="secondary">UI/UX</Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              Exceptional design sense and clean code practices. Recently completed a complex dashboard
                              sprint with outstanding user feedback.
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View Profile
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="shortlisted" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Shortlisted Candidates</h2>
                  <Badge variant="secondary">8 candidates</Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <Avatar>
                          <AvatarFallback>SK</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">Sarah Kim</h3>
                          <p className="text-sm text-gray-600">Full-Stack Developer</p>
                        </div>
                        <Badge className="ml-auto bg-green-100 text-green-800">Interview Scheduled</Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <span>⭐ 4.9</span>
                        <span>📍 San Francisco</span>
                        <span>🕒 Dec 15, 2:00 PM</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          Reschedule
                        </Button>
                        <Button size="sm">Join Interview</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <Avatar>
                          <AvatarFallback>AM</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">Alex Martinez</h3>
                          <p className="text-sm text-gray-600">Backend Developer</p>
                        </div>
                        <Badge className="ml-auto bg-blue-100 text-blue-800">Under Review</Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <span>⭐ 4.7</span>
                        <span>📍 Austin</span>
                        <span>🚀 In Active Sprint</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          View Sprint
                        </Button>
                        <Button size="sm">Schedule Interview</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

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
              </TabsContent>

              <TabsContent value="sprints" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Live Sprints</h2>
                  <Button variant="outline">Sponsor a Sprint</Button>
                </div>

                <div className="grid gap-4">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>E-Commerce Platform Sprint</CardTitle>
                          <CardDescription>React, Node.js, PostgreSQL • 14-day sprint</CardDescription>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">Day 8/14</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>4 developers</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <GitBranch className="w-4 h-4" />
                            <span>47 commits</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="w-4 h-4" />
                            <span>On track</span>
                          </div>
                        </div>
                        <div className="flex -space-x-2">
                          <Avatar className="w-8 h-8 border-2 border-white">
                            <AvatarFallback className="text-xs">SK</AvatarFallback>
                          </Avatar>
                          <Avatar className="w-8 h-8 border-2 border-white">
                            <AvatarFallback className="text-xs">AM</AvatarFallback>
                          </Avatar>
                          <Avatar className="w-8 h-8 border-2 border-white">
                            <AvatarFallback className="text-xs">JL</AvatarFallback>
                          </Avatar>
                          <Avatar className="w-8 h-8 border-2 border-white">
                            <AvatarFallback className="text-xs">MK</AvatarFallback>
                          </Avatar>
                        </div>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          Observe Sprint
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>AI Chat Application</CardTitle>
                          <CardDescription>Python, FastAPI, OpenAI • 10-day sprint</CardDescription>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Day 3/10</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>3 developers</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <GitBranch className="w-4 h-4" />
                            <span>23 commits</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="w-4 h-4" />
                            <span>Ahead of schedule</span>
                          </div>
                        </div>
                        <div className="flex -space-x-2">
                          <Avatar className="w-8 h-8 border-2 border-white">
                            <AvatarFallback className="text-xs">TR</AvatarFallback>
                          </Avatar>
                          <Avatar className="w-8 h-8 border-2 border-white">
                            <AvatarFallback className="text-xs">LM</AvatarFallback>
                          </Avatar>
                          <Avatar className="w-8 h-8 border-2 border-white">
                            <AvatarFallback className="text-xs">NK</AvatarFallback>
                          </Avatar>
                        </div>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          Observe Sprint
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
