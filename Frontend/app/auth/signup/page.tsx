"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Code2 } from "lucide-react"
import { signupUser } from "@/lib/api"

export default function SignUp() {
  
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const validateForm = () => {
    if (!username || !email || !password) {
      return "Tous les champs sont requis"
    }

    if (username.length < 3) {
      return "Le nom d'utilisateur doit contenir au moins 3 caractères"
    }

    if (password.length < 8) {
      return "Le mot de passe doit contenir au moins 8 caractères"
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return "Veuillez entrer un email valide"
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validation côté client
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      setIsLoading(false)
      return
    }

    try {
      const userData = await signupUser({ 
        username: username,
        email: email,
        password: password,
      });
      
      console.log("✅ Utilisateur créé avec succès:", userData);
      router.push("/auth/signin")
      
    } catch (err) {
      console.error("❌ Erreur d'inscription:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur inattendue s'est produite");
      }
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
                BreakIn Direct
              </span>
            </div>
            <CardTitle className="text-2xl text-white text-center">
              Créer un compte
            </CardTitle>
            <CardDescription className="text-gray-300 text-center">
              Inscrivez-vous pour accéder à votre tableau de bord
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300">
                  Nom d'utilisateur
                  <span className="text-xs text-gray-500 ml-2">(min. 3 caractères)</span>
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Votre nom d'utilisateur"
                  className="bg-black/60 border-white/10 text-white placeholder-gray-400"
                  required
                  minLength={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="bg-black/60 border-white/10 text-white placeholder-gray-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                  Mot de passe
                  <span className="text-xs text-gray-500 ml-2">(min. 8 caractères)</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Choisissez un mot de passe sécurisé"
                    className="bg-black/60 border-white/10 text-white placeholder-gray-400 pr-10"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {password.length > 0 && password.length < 8 && (
                  <p className="text-xs text-red-400">
                    Le mot de passe doit contenir au moins 8 caractères
                  </p>
                )}
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Inscription en cours..." : "S'inscrire"}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-white/10">
              <p className="text-center text-sm text-gray-300">
                Déjà un compte ?{" "}
                <Link 
                  href="/auth/signin" 
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}