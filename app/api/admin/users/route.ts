import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Get users from Supabase database
async function getUsersFromDatabase(limit: number = 50, offset: number = 0, platform?: string) {
  try {
    let query = supabase
      .from('users')
      .select('*')
      .order('last_active', { ascending: false })
      .range(offset, offset + limit - 1)

    // Filter by platform if specified
    if (platform === 'whatsapp') {
      query = query.not('phone_number', 'is', null)
    } else if (platform === 'telegram') {
      query = query.not('telegram_id', 'is', null)
    }

    const { data: users, error, count } = await query

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    // Get total count for pagination
    let totalQuery = supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    if (platform === 'whatsapp') {
      totalQuery = totalQuery.not('phone_number', 'is', null)
    } else if (platform === 'telegram') {
      totalQuery = totalQuery.not('telegram_id', 'is', null)
    }

    const { count: total } = await totalQuery

    return {
      users: users || [],
      total: total || 0,
      hasMore: offset + limit < (total || 0)
    }
  } catch (error) {
    console.error('Error fetching users from Supabase:', error)
    throw error // Don't fall back to mock data
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const platform = searchParams.get('platform') // 'whatsapp', 'telegram', or null for all
    
    // Get users from database
    const result = await getUsersFromDatabase(limit, offset, platform || undefined)
    
    return NextResponse.json({
      success: true,
      data: {
        users: result.users,
        total: result.total,
        hasMore: result.hasMore,
        pagination: {
          limit,
          offset,
          platform
        }
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch users',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}

// Create new user (for testing purposes)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Insert user into Supabase
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([{
        phone_number: body.phone_number,
        whatsapp_name: body.whatsapp_name,
        telegram_id: body.telegram_id,
        first_name: body.first_name,
        username: body.username,
        language_preference: body.language_preference || 'en',
        eligibility_data: body.eligibility_data || {}
      }])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }
    
    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      data: newUser
    })
  } catch (error) {
    console.error('Error creating user:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create user',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}