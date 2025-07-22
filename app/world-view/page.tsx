"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function WorldViewPage() {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-black via-gray-900/95 to-blue-950/80">
      {/* Sidebar Navigation */}
      <nav className="w-64 h-screen bg-black/60 border-r border-white/5 p-6 flex flex-col space-y-4">
        <h2 className="text-xl font-bold text-white mb-6">🌍 BreakIn World View</h2>
        <Button variant="ghost" className="text-white justify-start hover:bg-white/5" asChild>
          <Link href="#featured-talent">🏅 Featured Talent</Link>
        </Button>
        <Button variant="ghost" className="text-white justify-start hover:bg-white/5" asChild>
          <Link href="#sprint-reels">🎥 Sprint Reels</Link>
        </Button>
        <Button variant="ghost" className="text-white justify-start hover:bg-white/5" asChild>
          <Link href="#mentor-insights">🧠 Mentor Insights</Link>
        </Button>
        <Button variant="ghost" className="text-white justify-start hover:bg-white/5" asChild>
          <Link href="#squad-spotlights">🔍 Squad Spotlights</Link>
        </Button>
        <Button variant="ghost" className="text-white justify-start hover:bg-white/5" asChild>
          <Link href="#hiring-signals">📢 Hiring Signals</Link>
        </Button>
        <Button variant="ghost" className="text-white justify-start hover:bg-white/5" asChild>
          <Link href="#community-buzz">🌐 Community Buzz</Link>
        </Button>
      </nav>
      <main className="flex-1 p-8 space-y-12 overflow-y-auto">
        {/* Featured Talent */}
        <section id="featured-talent">
          <Card className="mb-8 bg-black/40 border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-400">🏅 Featured Talent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Placeholder cards */}
                <div className="bg-blue-950/60 p-4 rounded-lg text-white">
                  <div className="font-bold">Jane Dev</div>
                  <div>Promoted to Senior, built AI Content Generator</div>
                </div>
                <div className="bg-blue-950/60 p-4 rounded-lg text-white">
                  <div className="font-bold">Alex Coder</div>
                  <div>Hired by TechCorp after 3 sprints</div>
                </div>
                <div className="bg-blue-950/60 p-4 rounded-lg text-white">
                  <div className="font-bold">Sam Builder</div>
                  <div>Won Mentor’s Choice Award</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
        {/* Sprint Reels */}
        <section id="sprint-reels">
          <Card className="mb-8 bg-black/40 border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-400">🎥 Sprint Reels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="w-64 h-36 bg-blue-950/60 rounded-lg flex items-center justify-center text-white">Demo Clip 1</div>
                <div className="w-64 h-36 bg-blue-950/60 rounded-lg flex items-center justify-center text-white">Demo Clip 2</div>
                <div className="w-64 h-36 bg-blue-950/60 rounded-lg flex items-center justify-center text-white">Demo Clip 3</div>
              </div>
            </CardContent>
          </Card>
        </section>
        {/* Mentor Insights */}
        <section id="mentor-insights">
          <Card className="mb-8 bg-black/40 border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-400">🧠 Mentor Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 text-white space-y-2">
                <li>“What I saw this week: Devs collaborating on real-world APIs.”</li>
                <li>“Sprint retrospectives are driving real growth.”</li>
                <li>“Mentor shoutout: Sam Builder for leadership in Squad Lambda.”</li>
              </ul>
            </CardContent>
          </Card>
        </section>
        {/* Squad Spotlights */}
        <section id="squad-spotlights">
          <Card className="mb-8 bg-black/40 border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-400">🔍 Squad Spotlights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-950/60 p-4 rounded-lg text-white">
                  <div className="font-bold">Squad Lambda</div>
                  <div>Built a SaaS dashboard in 5 days</div>
                </div>
                <div className="bg-blue-950/60 p-4 rounded-lg text-white">
                  <div className="font-bold">Squad Phoenix</div>
                  <div>Automated testing for FinTech app</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
        {/* Hiring Signals */}
        <section id="hiring-signals">
          <Card className="mb-8 bg-black/40 border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-400">📢 Hiring Signals</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 text-white space-y-2">
                <li>TechCorp just hired 2 devs from Guild 4</li>
                <li>FinanceFlow is looking for React Native experts</li>
                <li>ContentAI awarded 3 badges this week</li>
              </ul>
            </CardContent>
          </Card>
        </section>
        {/* Community Buzz */}
        <section id="community-buzz">
          <Card className="mb-8 bg-black/40 border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-400">🌐 Community Buzz</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 text-white space-y-2">
                <li>Discord AMA with Orbit Ambassadors this Friday</li>
                <li>#BreakInCohort25 trending on X</li>
                <li>New guilds forming for AI and Web3</li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
} 