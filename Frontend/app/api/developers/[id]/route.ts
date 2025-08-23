// ===== FILE: app/api/developers/[id]/route.ts =====
import { getDatabase } from '@/lib/mongodb'
import { Developer } from '@/lib/models/types'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    console.log('🔍 Fetching developer:', id)
    
    const db = await getDatabase()
    const developer = await db.collection<Developer>('developers').findOne({ 
      user_id: id 
    })
    
    if (!developer) {
      console.log('❌ Developer not found for user:', id)
      return Response.json({ error: 'Developer not found' }, { status: 404 })
    }
    
    console.log('✅ Found developer:', developer.codename)
    return Response.json(developer)
    
  } catch (error) {
    console.error('❌ Error fetching developer:', error)
    return Response.json({ error: 'Failed to fetch developer' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const db = await getDatabase()
    
    const updateData = {
      ...body,
      updated_at: new Date()
    }
    
    const result = await db.collection<Developer>('developers').updateOne(
      { user_id: id },
      { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
      return Response.json({ error: 'Developer not found' }, { status: 404 })
    }
    
    return Response.json({ success: true })
  } catch (error) {
    console.error('❌ Error updating developer:', error)
    return Response.json({ error: 'Failed to update developer' }, { status: 500 })
  }
}

