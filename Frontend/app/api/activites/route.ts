// ===== FILE: app/api/activities/route.ts =====
import { getDatabase } from '@/lib/mongodb'
import { Activity } from '@/lib/models/types'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    
    console.log('🔍 Fetching activities for user:', userId)
    const db = await getDatabase()
    
    const filter = userId ? { user_id: userId } : {}
    
    const activities = await db.collection<Activity>('activities')
      .find(filter)
      .sort({ time: -1 })
      .limit(10)
      .toArray()
    
    console.log('✅ Found activities:', activities.length)
    return Response.json(activities)
  } catch (error) {
    console.error('❌ Error fetching activities:', error)
    return Response.json({ error: 'Failed to fetch activities' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const db = await getDatabase()
    
    const newActivity: Omit<Activity, '_id'> = {
      ...body,
      time: new Date(),
      created_at: new Date()
    }
    
    const result = await db.collection<Activity>('activities').insertOne(newActivity)
    
    return Response.json({ id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error('❌ Error creating activity:', error)
    return Response.json({ error: 'Failed to create activity' }, { status: 500 })
  }
}

