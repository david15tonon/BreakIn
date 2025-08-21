"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Code2 } from "lucide-react"
import { signupUser } from "@/lib/api" // Importez votre fonction d'API

export default function SignUp() {
  
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!username || !email || !password) {
      setError("All fields are required")
      setIsLoading(false)
      return
    }

    try {
      // Utilisez votre fonction d'API avec tous les champs requis
      const userData = await signupUser({
        username: username,
        email: email,
        password: password,
      });
      
      console.log("User created successfully:", userData);
      
      // Redirigez vers la page de connexion
      router.push("/auth/signin")
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed")
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-black via-gray-900/95 to-blue-950/80">
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md bg-black/40 border-white/5 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <Code2 className="h-6 w-6 text-blue-400" />
              <span className="ml-2 text-2xl font-bold text-white">
                <a href="/">BreakIn Direct</a>
              </span>
            </div>
            <CardTitle className="text-2xl text-white text-center">Create Account</CardTitle>
            <CardDescription className="text-gray-300 text-center">
              Sign up to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="username" className="text-gray-300">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="JohnDoe42"
                    className="bg-black/60 border-white/10 text-white placeholder-gray-400"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="bg-black/60 border-white/10 text-white placeholder-gray-400"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-gray-300">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Choose a strong password"
                      className="bg-black/60 border-white/10 text-white placeholder-gray-400 pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="text-red-400 text-sm text-center">{error}</div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing up..." : "Sign Up"}
                </Button>
              </div>
            </form>
            <div className="mt-4 text-center text-sm text-gray-300">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-blue-400 hover:text-blue-300">
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}