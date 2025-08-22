// ===== FILE: app/api/developers/route.ts =====
import { getDatabase } from '@/lib/mongodb'
import { Developer } from '@/lib/models/types'

export async function GET() {
  try {
    console.log('🔍 Fetching all developers...')
    const db = await getDatabase()
    const developers = await db.collection<Developer>('developers').find({}).toArray()
    
    console.log('✅ Found developers:', developers.length)
    return Response.json(developers)
  } catch (error) {
    console.error('❌ Error fetching developers:', error)
    return Response.json({ error: 'Failed to fetch developers' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const db = await getDatabase()
    
    const newDeveloper: Omit<Developer, '_id'> = {
      ...body,
      created_at: new Date(),
      updated_at: new Date()
    }
    
    const result = await db.collection<Developer>('developers').insertOne(newDeveloper)
    
    return Response.json({ id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error('❌ Error creating developer:', error)
    return Response.json({ error: 'Failed to create developer' }, { status: 500 })
  }
}

