// app/api/squads/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { Squad } from '@/lib/models/types'

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()
    const squads = await db.collection<Squad>('squads')
      .find({})
      .sort({ success_rate: -1 })
      .toArray()
    
    return NextResponse.json(squads)
  } catch (error) {
    console.error('Error fetching squads:', error)
    return NextResponse.json({ error: 'Failed to fetch squads' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const db = await getDatabase()
    
    const newSquad: Omit<Squad, '_id'> = {
      ...body,
      created_at: new Date(),
      updated_at: new Date()
    }
    
    const result = await db.collection<Squad>('squads').insertOne(newSquad)
    
    return NextResponse.json({ id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error('Error creating squad:', error)
    return NextResponse.json({ error: 'Failed to create squad' }, { status: 500 })
  }
}

