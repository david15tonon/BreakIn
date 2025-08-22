// ===== FILE: app/api/sprints/available/route.ts =====
import { getDatabase } from '@/lib/mongodb'
import { Sprint } from '@/lib/models/types'

export async function GET() {
  try {
    console.log('🔍 Fetching available sprints...')
    const db = await getDatabase()
    
    const availableSprints = await db.collection<Sprint>('sprints')
      .find({ 
        status: 'Open',
        spots_left: { $gt: 0 }
      })
      .sort({ created_at: -1 })
      .toArray()
    
    console.log('✅ Found available sprints:', availableSprints.length)
    return Response.json(availableSprints)
  } catch (error) {
    console.error('❌ Error fetching available sprints:', error)
    return Response.json({ error: 'Failed to fetch available sprints' }, { status: 500 })
  }
}

