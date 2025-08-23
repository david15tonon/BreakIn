// lib/contexts/AuthContext.tsx - Fixed version with proper sync timing
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { Developer } from '@/lib/models/types'

interface AuthContextType {
  user: User | null
  session: Session | null
  developer: Developer | null
  loading: boolean
  signOut: () => Promise<void>
  syncUserProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [developer, setDeveloper] = useState<Developer | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  // Sync user profile with MongoDB - pass user explicitly to avoid race conditions
  const syncUserProfile = async (userToSync?: User) => {
    const targetUser = userToSync || user
    
    if (!targetUser) {
      console.log('❌ No user to sync')
      return null
    }

    console.log('🔄 Syncing user profile for:', targetUser.id)

    try {
      const response = await fetch('/api/auth/sync-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Sync successful:', data.developer?.codename || 'existing user')
        setDeveloper(data.developer)
        return data.developer
      } else {
        const errorText = await response.text()
        console.error('❌ Sync failed:', response.status, errorText)
      }
    } catch (error) {
      console.error('❌ Error syncing user profile:', error)
    }
    return null
  }

  // Fetch developer profile from MongoDB
  const fetchDeveloperProfile = async (userId: string, userForSync?: User): Promise<Developer | null> => {
    console.log('🔍 Fetching developer profile for:', userId)
    
    try {
      const response = await fetch(`/api/developers/${userId}`)
      if (response.ok) {
        const developerData = await response.json()
        console.log('✅ Developer found:', developerData.codename)
        setDeveloper(developerData)
        return developerData
      } else if (response.status === 404) {
        console.log('❌ Developer not found, syncing profile...')
        // If developer doesn't exist, sync the profile with the user object
        return await syncUserProfile(userForSync)
      } else {
        console.error('❌ Error fetching developer:', response.status)
      }
    } catch (error) {
      console.error('❌ Error fetching developer profile:', error)
    }
    return null
  }

  // Sign out function
  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setSession(null)
      setDeveloper(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      console.log('🔍 Getting initial session...')
      const { data: { session } } = await supabase.auth.getSession()
      
      console.log('Session found:', !!session, session?.user?.email)
      
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchDeveloperProfile(session.user.id, session.user)
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email)
        
        // Set state first
        setSession(session)
        setUser(session?.user ?? null)

        if (event === 'SIGNED_IN' && session?.user) {
          console.log('✅ User signed in, fetching/syncing profile...')
          // User just signed in, fetch or sync their profile
          await fetchDeveloperProfile(session.user.id, session.user)
        } else if (event === 'SIGNED_OUT') {
          console.log('👋 User signed out')
          // User signed out, clear developer data
          setDeveloper(null)
        }

        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  const value = {
    user,
    session,
    developer,
    loading,
    signOut,
    syncUserProfile: () => syncUserProfile()
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}