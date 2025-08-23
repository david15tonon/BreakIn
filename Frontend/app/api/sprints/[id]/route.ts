// app/api/sprints/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { Sprint } from '@/lib/models/types'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDatabase()
    const { ObjectId } = require('mongodb')
    
    const sprint = await db.collection<Sprint>('sprints').findOne({ 
      _id: new ObjectId(params.id) 
    })
    
    if (!sprint) {
      return NextResponse.json({ error: 'Sprint not found' }, { status: 404 })
    }
    
    return NextResponse.json(sprint)
  } catch (error) {
    console.error('Error fetching sprint:', error)
    return NextResponse.json({ error: 'Failed to fetch sprint' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const db = await getDatabase()
    const { ObjectId } = require('mongodb')
    
    const updateData = {
      ...body,
      updated_at: new Date()
    }
    
    const result = await db.collection<Sprint>('sprints').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Sprint not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating sprint:', error)
    return NextResponse.json({ error: 'Failed to update sprint' }, { status: 500 })
  }
}