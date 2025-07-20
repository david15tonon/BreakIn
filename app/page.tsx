import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Code, Users, Target, Zap, CheckCircle, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              BreakIn Direct
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900">
              How It Works
            </Link>
            <Link href="#for-developers" className="text-gray-600 hover:text-gray-900">
              For Developers
            </Link>
            <Link href="#for-companies" className="text-gray-600 hover:text-gray-900">
              For Companies
            </Link>
            <Button asChild>
              <Link href="/developer-dashboard">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">🚀 The Future of Hiring is Here</Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
            Proof-of-Work Hiring System
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Skip the résumé. Skip the ATS. Show your skills through real code, real teams, and real sprints. Where
            junior developers prove their worth and companies find hidden talent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              asChild
            >
              <Link href="/developer-dashboard">
                Start Building <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/company-dashboard">For Companies</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">The Hiring System is Broken</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Junior developers are trapped in a cycle where they need experience to get experience, while companies
              struggle to identify real talent through outdated ATS systems.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800">Traditional ATS Problems</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-red-700">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Filters out talent based on keywords, not ability</span>
                </div>
                <div className="flex items-center space-x-2 text-red-700">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Entry-level jobs require 2+ years experience</span>
                </div>
                <div className="flex items-center space-x-2 text-red-700">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Bias against non-traditional backgrounds</span>
                </div>
                <div className="flex items-center space-x-2 text-red-700">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>No feedback loops for improvement</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">BreakIn Direct Solution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-green-700">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Performance-based evaluation through real work</span>
                </div>
                <div className="flex items-center space-x-2 text-green-700">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Team collaboration in simulation sprints</span>
                </div>
                <div className="flex items-center space-x-2 text-green-700">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>AI + mentor feedback for continuous growth</span>
                </div>
                <div className="flex items-center space-x-2 text-green-700">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Direct hiring based on proven capabilities</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How BreakIn Direct Works</h2>
            <p className="text-gray-600">A simple 4-step process that replaces traditional hiring</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">1. Join Sprint Teams</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Get matched with other developers for team-based simulation projects
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">2. Build Real Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Work on industry-relevant challenges with real deadlines and requirements
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">3. Get AI + Mentor Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Receive detailed feedback on code quality, teamwork, and professional growth
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-lg">4. Get Hired Direct</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Companies hire based on your proven performance, not your résumé
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* For Developers */}
      <section id="for-developers" className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">For Developers</h2>
              <p className="text-gray-600 mb-6">
                Build your reputation through real work, not just credentials. Join simulation sprints, collaborate with
                peers, and get mentorship from industry experts.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Zap className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold">Real-World Experience</h3>
                    <p className="text-sm text-gray-600">Work on projects that mirror actual industry challenges</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold">Team Collaboration</h3>
                    <p className="text-sm text-gray-600">Learn to work effectively in cross-functional teams</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <TrendingUp className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold">Continuous Growth</h3>
                    <p className="text-sm text-gray-600">Get feedback and mentorship to accelerate your career</p>
                  </div>
                </div>
              </div>
              <Button className="mt-6" asChild>
                <Link href="/developer-dashboard">Start Your Journey</Link>
              </Button>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold mb-4">Your Developer Journey</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-semibold text-blue-600">1</span>
                    </div>
                    <span className="text-sm">Complete skill assessment</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-semibold text-blue-600">2</span>
                    </div>
                    <span className="text-sm">Join your first sprint team</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-semibold text-blue-600">3</span>
                    </div>
                    <span className="text-sm">Build and collaborate</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm">Get hired by top companies</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Companies */}
      <section id="for-companies" className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl p-8">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold mb-4">Hiring Dashboard Preview</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-sm font-medium">Sarah K.</span>
                    <Badge className="bg-green-100 text-green-800">Sprint Leader</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-sm font-medium">Alex M.</span>
                    <Badge className="bg-blue-100 text-blue-800">Full-Stack</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-sm font-medium">Jordan L.</span>
                    <Badge className="bg-purple-100 text-purple-800">AI/ML</Badge>
                  </div>
                </div>
                <Button size="sm" className="w-full mt-4">
                  View All Candidates
                </Button>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">For Companies</h2>
              <p className="text-gray-600 mb-6">
                Hire with confidence based on actual performance data. See how candidates work in teams, handle
                pressure, and solve real problems before making an offer.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Target className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold">Performance-Based Hiring</h3>
                    <p className="text-sm text-gray-600">Make decisions based on real work, not just interviews</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold">Team Fit Assessment</h3>
                    <p className="text-sm text-gray-600">See how candidates collaborate and communicate</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Zap className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold">Faster Time-to-Hire</h3>
                    <p className="text-sm text-gray-600">Skip lengthy screening processes with pre-validated talent</p>
                  </div>
                </div>
              </div>
              <Button className="mt-6" asChild>
                <Link href="/company-dashboard">Explore Talent Pool</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Hiring?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join the movement to replace résumés with real work. Start building your proof-of-work portfolio today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
              <Link href="/developer-dashboard">
                Start as Developer <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              asChild
            >
              <Link href="/company-dashboard">Hire Talent</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">BreakIn Direct</span>
              </div>
              <p className="text-gray-400 text-sm">The future of hiring through proof-of-work, not proof-of-paper.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Developers</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/developer-dashboard" className="hover:text-white">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Sprint Library
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Mentorship
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Portfolio
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Companies</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/company-dashboard" className="hover:text-white">
                    Talent Feed
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Hiring Analytics
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Team Matching
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 BreakIn Direct. All rights reserved. Built with proof-of-work, not promises.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
