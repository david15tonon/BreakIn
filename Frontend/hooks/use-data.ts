//hooks/use-data.ts
import { useState, useEffect } from 'react'
import { Developer, Sprint, Activity, SkillProgress } from '@/lib/models/types'

export function useDeveloper(userId: string | undefined | null) {
  const [developer, setDeveloper] = useState<Developer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchDeveloper = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/developers/${userId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch developer data')
        }
        
        const data = await response.json()
        setDeveloper(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchDeveloper()
  }, [userId])

  return { developer, loading, error }
}

export function useAvailableSprints() {
  const [sprints, setSprints] = useState<Sprint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSprints = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/sprints/available')
      
      if (!response.ok) {
        throw new Error('Failed to fetch sprints')
      }
      
      const data = await response.json()
      setSprints(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSprints()
  }, [])

  return { sprints, loading, error, refetch: fetchSprints }
}

export function useActivities(userId: string | undefined | null) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchActivities = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/activities?user_id=${userId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch activities')
        }
        
        const data = await response.json()
        setActivities(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [userId])

  return { activities, loading, error }
}

export function useSkillProgress(userId: string | undefined | null) {
  const [skills, setSkills] = useState<SkillProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchSkills = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/skills?user_id=${userId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch skills')
        }
        
        const data = await response.json()
        setSkills(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchSkills()
  }, [userId])

  return { skills, loading, error }
}

export function useDevelopers() {
  const [developers, setDevelopers] = useState<Developer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/developers')
        
        if (!response.ok) {
          throw new Error('Failed to fetch developers')
        }
        
        const data = await response.json()
        setDevelopers(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchDevelopers()
  }, [])

  return { developers, loading, error }
}