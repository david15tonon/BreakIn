// app/api/companies/route.ts
import { Company } from '@/lib/models/types'
import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { Squad } from '@/lib/models/types'
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()
    const companies = await db.collection<Company>('companies').find({}).toArray()
    
    return NextResponse.json(companies)
  } catch (error) {
    console.error('Error fetching companies:', error)
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const db = await getDatabase()
    
    const newCompany: Omit<Company, '_id'> = {
      ...body,
      created_at: new Date(),
      updated_at: new Date()
    }
    
    const result = await db.collection<Company>('companies').insertOne(newCompany)
    
    return NextResponse.json({ id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error('Error creating company:', error)
    return NextResponse.json({ error: 'Failed to create company' }, { status: 500 })
  }
}

