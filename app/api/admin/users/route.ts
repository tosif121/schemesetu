import { NextRequest, NextResponse } from 'next/server'

// Mock database connection - replace with your actual database connection
async function getUsersFromDatabase(limit: number = 50, offset: number = 0) {
  // TODO: Replace with actual database queries
  // Example using your database schema:
  /*
  const users = await db.query(`
    SELECT 
      id, phone_number, whatsapp_name, telegram_id, first_name, username,
      language_preference, eligibility_data, conversation_history,
      created_at, updated_at, last_active
    FROM users 
    ORDER BY last_active DESC 
    LIMIT $1 OFFSET $2
  `, [limit, offset]);
  */
  
  // Mock data based on your schema structure
  const mockUsers = [
    {
      id: '123e4567-e89b-12d3-a456-426614174000',
      phone_number: '+919876543210',
      whatsapp_name: 'Rajesh Kumar',
      telegram_id: null,
      first_name: null,
      username: null,
      language_preference: 'hi',
      eligibility_data: {
        age: 35,
        state: 'Maharashtra',
        occupation: 'farmer',
        income: 200000,
        category: 'General'
      },
      conversation_history: [
        { message: 'Hello', timestamp: '2024-01-15T10:30:00Z' },
        { message: 'I need help with PM-KISAN', timestamp: '2024-01-15T10:31:00Z' }
      ],
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T15:45:00Z',
      last_active: '2024-01-15T15:45:00Z'
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174001',
      phone_number: null,
      whatsapp_name: null,
      telegram_id: 'user123',
      first_name: 'Priya',
      username: 'priya_sharma',
      language_preference: 'en',
      eligibility_data: {
        age: 22,
        state: 'Tamil Nadu',
        occupation: 'student',
        category: 'SC'
      },
      conversation_history: [
        { message: '/start', timestamp: '2024-01-14T09:15:00Z' },
        { message: 'Looking for scholarships', timestamp: '2024-01-14T09:16:00Z' }
      ],
      created_at: '2024-01-14T09:15:00Z',
      updated_at: '2024-01-14T12:20:00Z',
      last_active: '2024-01-14T12:20:00Z'
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174002',
      phone_number: '+918765432109',
      whatsapp_name: 'Amit Patel',
      telegram_id: null,
      first_name: null,
      username: null,
      language_preference: 'gu',
      eligibility_data: {
        age: 28,
        state: 'Gujarat',
        occupation: 'business',
        income: 500000,
        category: 'OBC'
      },
      conversation_history: [
        { message: 'Business loan information needed', timestamp: '2024-01-13T14:22:00Z' }
      ],
      created_at: '2024-01-13T14:22:00Z',
      updated_at: '2024-01-13T16:30:00Z',
      last_active: '2024-01-13T16:30:00Z'
    }
  ]
  
  return {
    users: mockUsers.slice(offset, offset + limit),
    total: mockUsers.length,
    hasMore: offset + limit < mockUsers.length
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const platform = searchParams.get('platform') // 'whatsapp', 'telegram', or null for all
    
    // Get users from database
    const result = await getUsersFromDatabase(limit, offset)
    
    // Filter by platform if specified
    let filteredUsers = result.users
    if (platform) {
      filteredUsers = result.users.filter(user => {
        if (platform === 'whatsapp') return user.phone_number !== null
        if (platform === 'telegram') return user.telegram_id !== null
        return true
      })
    }
    
    return NextResponse.json({
      success: true,
      data: {
        users: filteredUsers,
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
    
    // TODO: Validate and insert user into database
    // Example:
    /*
    const newUser = await db.query(`
      INSERT INTO users (phone_number, whatsapp_name, language_preference, eligibility_data)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [body.phone_number, body.whatsapp_name, body.language_preference, body.eligibility_data]);
    */
    
    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      data: { id: 'mock-id', ...body }
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