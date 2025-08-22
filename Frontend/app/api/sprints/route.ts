// app/api/sprints/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { Sprint } from '@/lib/models/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const difficulty = searchParams.get('difficulty')
    const technology = searchParams.get('technology')
    
    const db = await getDatabase()
    
    // Build filter object
    const filter: any = {}
    if (status) filter.status = status
    if (difficulty) filter.difficulty = difficulty
    if (technology) filter.technologies = { $in: [technology] }
    
    const sprints = await db.collection<Sprint>('sprints')
      .find(filter)
      .sort({ created_at: -1 })
      .toArray()
    
    return NextResponse.json(sprints)
  } catch (error) {
    console.error('Error fetching sprints:', error)
    return NextResponse.json({ error: 'Failed to fetch sprints' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const db = await getDatabase()
    
    const newSprint: Omit<Sprint, '_id'> = {
      ...body,
      status: 'Open',
      applications: 0,
      created_at: new Date(),
      updated_at: new Date()
    }
    
    const result = await db.collection<Sprint>('sprints').insertOne(newSprint)
    
    return NextResponse.json({ id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error('Error creating sprint:', error)
    return NextResponse.json({ error: 'Failed to create sprint' }, { status: 500 })
  }
}

