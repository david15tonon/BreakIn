// ===== FILE: app/api/skills/route.ts =====
import { getDatabase } from '@/lib/mongodb'
import { SkillProgress } from '@/lib/models/types'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    
    if (!userId) {
      return Response.json({ error: 'User ID is required' }, { status: 400 })
    }
    
    console.log('🔍 Fetching skills for user:', userId)
    const db = await getDatabase()
    
    const skills = await db.collection<SkillProgress>('skill_progress')
      .find({ user_id: userId })
      .sort({ updated_at: -1 })
      .toArray()
    
    console.log('✅ Found skills:', skills.length)
    return Response.json(skills)
  } catch (error) {
    console.error('❌ Error fetching skills:', error)
    return Response.json({ error: 'Failed to fetch skills' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const db = await getDatabase()
    
    const newSkill: Omit<SkillProgress, '_id'> = {
      ...body,
      updated_at: new Date()
    }
    
    const result = await db.collection<SkillProgress>('skill_progress').insertOne(newSkill)
    
    return Response.json({ id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error('❌ Error creating skill:', error)
    return Response.json({ error: 'Failed to create skill' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { user_id, skill, ...updateData } = body
    const db = await getDatabase()
    
    const result = await db.collection<SkillProgress>('skill_progress').updateOne(
      { user_id, skill },
      { 
        $set: { 
          ...updateData, 
          updated_at: new Date() 
        } 
      },
      { upsert: true }
    )
    
    return Response.json({ success: true })
  } catch (error) {
    console.error('❌ Error updating skill:', error)
    return Response.json({ error: 'Failed to update skill' }, { status: 500 })
  }
}

