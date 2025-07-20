import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import {
  Code,
  Users,
  Target,
  ArrowRight,
  Star,
  TrendingUp,
  Shield,
  Rocket,
  Building,
  GitBranch,
  Sparkles,
  Eye,
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b sticky top-0 z-50 bg-white/95 backdrop-blur-sm">
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
            <Button variant="ghost" asChild>
              <Link href="/developer-dashboard">For Developers</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/company-dashboard">For Companies</Link>
            </Button>
            <Button>Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="mb-8">
            <Badge className="mb-4 bg-blue-100 text-blue-800">Proof-of-Work Hiring System</Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              Skip the résumé.
              <br />
              Show your skills.
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              BreakIn Direct replaces traditional hiring with real code, real teams, and real sprints. Developers prove
              their worth through performance, not paperwork.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/developer-dashboard">
                Start Building
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent" asChild>
              <Link href="/company-dashboard">
                Hire Talent
                <Building className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Hero Stats */}
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">2,500+</div>
              <div className="text-gray-600">Developers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">450+</div>
              <div className="text-gray-600">Companies</div>
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-2">96%</div>
            <div className="text-gray-600">Match Success</div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">$2.3M</div>
              <div className="text-gray-600">Salaries Placed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem vs Solution */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">The Hiring Revolution</h2>
            <p className="text-xl text-gray-600">From résumé screening to performance proving</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Traditional Hiring */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center">
                  <Shield className="w-6 h-6 mr-2" />
                  Traditional ATS Hiring
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-red-800">Keyword Filtering</p>
                    <p className="text-sm text-red-600">Great developers filtered out by ATS algorithms</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-red-800">Bias & Pedigree</p>
                    <p className="text-sm text-red-600">Non-traditional backgrounds unfairly overlooked</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-red-800">Ghosting & Black Boxes</p>
                    <p className="text-sm text-red-600">Silent rejections with no feedback</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-red-800">Experience Paradox</p>
                    <p className="text-sm text-red-600">"Entry-level" roles require 2+ years experience</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* BreakIn Direct */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center">
                  <Rocket className="w-6 h-6 mr-2" />
                  BreakIn Direct (PoWHS)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-green-800">Performance-Based</p>
                    <p className="text-sm text-green-600">Actual code, teamwork, and sprint results</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-green-800">Merit-First Matching</p>
                    <p className="text-sm text-green-600">Skills and growth trajectory over credentials</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-green-800">Rich Feedback Loops</p>
                    <p className="text-sm text-green-600">AI + mentor reviews for continuous growth</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-green-800">Real Experience Building</p>
                    <p className="text-sm text-green-600">Gain experience through simulation sprints</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How BreakIn Works</h2>
            <p className="text-xl text-gray-600">Four steps from code to career</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Join Sprint Teams</h3>
              <p className="text-gray-600">Get matched with other developers for collaborative simulation projects</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Build Real Projects</h3>
              <p className="text-gray-600">Work on industry-relevant challenges with real deadlines and requirements</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Get AI + Mentor Reviews</h3>
              <p className="text-gray-600">Receive detailed feedback on code quality, teamwork, and growth areas</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">4. Get Hired</h3>
              <p className="text-gray-600">Companies discover you based on proven performance, not résumés</p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Sprint Preview */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Live Sprints in Action</h2>
            <p className="text-xl text-gray-600">Real developers, real projects, real results</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
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
                  <p className="text-sm text-gray-600">
                    Building a complete e-commerce solution with payment integration, inventory management, and admin
                    dashboard. Team showing excellent collaboration and code quality.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
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
                  <p className="text-sm text-gray-600">
                    Creating an intelligent chatbot with natural language processing and context awareness. Team
                    demonstrating strong AI/ML expertise and rapid prototyping skills.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600">Real developers, real career transformations</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <Avatar className="w-16 h-16 mx-auto mb-4">
                  <AvatarImage src="/placeholder.svg?height=64&width=64" />
                  <AvatarFallback>SK</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold mb-2">Sarah Kim</h3>
                <p className="text-sm text-gray-600 mb-4">Bootcamp Graduate → Senior Developer</p>
                <p className="text-sm italic text-gray-700">
                  "BreakIn let me prove my skills through real projects. I went from job rejections to multiple offers
                  in 3 months."
                </p>
                <div className="flex justify-center space-x-2 mt-4">
                  <Badge variant="secondary">React</Badge>
                  <Badge variant="secondary">Node.js</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Avatar className="w-16 h-16 mx-auto mb-4">
                  <AvatarImage src="/placeholder.svg?height=64&width=64" />
                  <AvatarFallback>AM</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold mb-2">Alex Martinez</h3>
                <p className="text-sm text-gray-600 mb-4">Career Changer → Backend Engineer</p>
                <p className="text-sm italic text-gray-700">
                  "Coming from finance, I had no tech experience on paper. BreakIn showed companies what I could
                  actually build."
                </p>
                <div className="flex justify-center space-x-2 mt-4">
                  <Badge variant="secondary">Python</Badge>
                  <Badge variant="secondary">Django</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Avatar className="w-16 h-16 mx-auto mb-4">
                  <AvatarImage src="/placeholder.svg?height=64&width=64" />
                  <AvatarFallback>JL</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold mb-2">Jordan Lee</h3>
                <p className="text-sm text-gray-600 mb-4">Self-Taught → Frontend Lead</p>
                <p className="text-sm italic text-gray-700">
                  "No CS degree, no problem. My sprint performance spoke louder than any diploma. Now I'm leading a team
                  of 6."
                </p>
                <div className="flex justify-center space-x-2 mt-4">
                  <Badge variant="secondary">React</Badge>
                  <Badge variant="secondary">Vue.js</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* For Companies */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">For Companies: Talent Radar, Not Talent Hunting</h2>
            <p className="text-xl text-gray-600">Stop posting jobs. Start discovering proven performers.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">AI-Powered Matching</h3>
                    <p className="text-gray-600">
                      Paste your job description, get instant candidate recommendations based on actual performance
                      data.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Hire Entire Squads</h3>
                    <p className="text-gray-600">
                      Find teams that have already proven they work well together on real projects.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Eye className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Live Sprint Observation</h3>
                    <p className="text-gray-600">
                      Watch candidates in action during sprints to see their real working style and collaboration
                      skills.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Sponsor Custom Sprints</h3>
                    <p className="text-gray-600">
                      Create challenges specific to your needs and discover talent through your own projects.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Company Success Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Time to Hire</span>
                    <span className="font-semibold text-green-600">-67%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Interview Success Rate</span>
                    <span className="font-semibold text-blue-600">89%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>90-Day Retention</span>
                    <span className="font-semibold text-purple-600">94%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Hiring Cost Reduction</span>
                    <span className="font-semibold text-orange-600">-52%</span>
                  </div>
                </div>
                <Button className="w-full mt-6" asChild>
                  <Link href="/company-dashboard">
                    Start Hiring Better
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Break Into Your Future?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of developers who've proven their worth through performance, not paperwork.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
              <Link href="/developer-dashboard">
                Start Your First Sprint
                <Rocket className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              asChild
            >
              <Link href="/company-dashboard">
                Discover Talent
                <Target className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">BreakIn Direct</span>
              </div>
              <p className="text-gray-400">The future of hiring is here. Performance over paperwork.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Developers</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Join Sprints
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Build Portfolio
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Get Mentored
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Find Jobs
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Companies</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Hire Talent
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Sponsor Sprints
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Mentor Program
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Analytics
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BreakIn Direct. All rights reserved. Built with performance, not promises.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
