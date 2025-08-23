// ===== FILE: app/api/auth/sync-user/route.ts =====
import { getDatabase } from '@/lib/mongodb'
import { Developer } from '@/lib/models/types'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Get the current authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return Response.json({ error: 'User not authenticated' }, { status: 401 })
    }

    console.log('🔄 Syncing user:', user.id, user.email)

    const db = await getDatabase()
    
    // Check if user already exists in MongoDB
    const existingDeveloper = await db.collection<Developer>('developers').findOne({ 
      user_id: user.id 
    })
    
    if (existingDeveloper) {
      console.log('✅ User already exists:', existingDeveloper.codename)
      return Response.json({ 
        message: 'User already exists', 
        developer: existingDeveloper 
      })
    }

    // Create new developer profile
    const newDeveloper: Omit<Developer, '_id'> = {
      user_id: user.id,
      codename: generateCodename(user),
      email: user.email || '',
      reputation: 0,
      skills: [],
      sprint_history: 0,
      success_rate: 0,
      growth_delta: '+0%',
      status: 'Available',
      mentor_endorsements: 0,
      team_rating: 0,
      avatar_url: user.user_metadata?.avatar_url || '',
      total_earnings: '$0',
      skill_badges: 0,
      current_streak: 0,
      level: 'Beginner',
      created_at: new Date(),
      updated_at: new Date()
    }

    const result = await db.collection<Developer>('developers').insertOne(newDeveloper)
    
    // Create initial skill progress entries
    const initialSkills = ['React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'AWS']
    const skillProgressEntries = initialSkills.map(skill => ({
      user_id: user.id,
      skill,
      level: Math.floor(Math.random() * 30) + 10, // Random starting level 10-40
      badge: 'Beginner' as const,
      updated_at: new Date()
    }))

    await db.collection('skill_progress').insertMany(skillProgressEntries)

    // Create welcome activity
    await db.collection('activities').insertOne({
      user_id: user.id,
      type: 'skill_earned',
      title: 'Welcome to BreakIn Direct! Profile created successfully',
      time: new Date(),
      created_at: new Date()
    })

    console.log('✅ User profile created:', newDeveloper.codename)

    return Response.json({ 
      message: 'User profile created successfully',
      developer: { ...newDeveloper, _id: result.insertedId }
    }, { status: 201 })

  } catch (error) {
    console.error('❌ Error syncing user:', error)
    return Response.json({ error: 'Failed to sync user profile' }, { status: 500 })
  }
}

// Generate a unique codename for the user
function generateCodename(user: any): string {
  const adjectives = ['Quick', 'Smart', 'Code', 'Dev', 'Tech', 'Pro', 'Elite', 'Alpha', 'Beta', 'Cyber']
  const nouns = ['Ninja', 'Warrior', 'Master', 'Guru', 'Wizard', 'Hacker', 'Builder', 'Creator', 'Engineer', 'Architect']
  
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)]
  const randomNumber = Math.floor(Math.random() * 9999) + 1000
  
  // Use user's name if available, otherwise use random generation
  const baseName = user.user_metadata?.full_name 
    ? user.user_metadata.full_name.replace(/\s+/g, '').substring(0, 8)
    : `${randomAdjective}${randomNoun}`
  
  return `${baseName}_${randomNumber}`
}