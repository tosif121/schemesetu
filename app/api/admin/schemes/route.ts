import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Get schemes from Supabase database
async function getSchemesFromDatabase(limit: number = 50, offset: number = 0, category?: string) {
  try {
    let query = supabase
      .from('schemes')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Filter by category if specified
    if (category) {
      query = query.eq('category', category)
    }

    const { data: schemes, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    // Get interaction counts for each scheme
    const schemesWithStats = await Promise.all(
      (schemes || []).map(async (scheme) => {
        // Get total interactions for this scheme
        const { count: interactionCount } = await supabase
          .from('user_schemes')
          .select('*', { count: 'exact', head: true })
          .eq('scheme_uuid', scheme.id)

        // Get applications count
        const { count: applications } = await supabase
          .from('user_schemes')
          .select('*', { count: 'exact', head: true })
          .eq('scheme_uuid', scheme.id)
          .eq('interaction_type', 'applied')

        return {
          ...scheme,
          interaction_count: interactionCount || 0,
          applications: applications || 0
        }
      })
    )

    // Get total count for pagination
    let totalQuery = supabase
      .from('schemes')
      .select('*', { count: 'exact', head: true })

    if (category) {
      totalQuery = totalQuery.eq('category', category)
    }

    const { count: total } = await totalQuery

    return {
      schemes: schemesWithStats,
      total: total || 0,
      hasMore: offset + limit < (total || 0)
    }
  } catch (error) {
    console.error('Error fetching schemes from Supabase:', error)
    throw error // Don't fall back to mock data
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const category = searchParams.get('category')
    const status = searchParams.get('status') || 'active'
    
    // Get schemes from database
    const result = await getSchemesFromDatabase(limit, offset, category || undefined)
    
    return NextResponse.json({
      success: true,
      data: {
        schemes: result.schemes,
        total: result.total,
        hasMore: result.hasMore,
        pagination: {
          limit,
          offset,
          category,
          status
        }
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching schemes:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch schemes',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}

// Create new scheme
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Insert scheme into Supabase
    const { data: newScheme, error } = await supabase
      .from('schemes')
      .insert([{
        scheme_id: body.scheme_id,
        name: body.name,
        description: body.description,
        benefits: body.benefits,
        eligibility_criteria: body.eligibility_criteria || {},
        application_url: body.application_url,
        department: body.department,
        state: body.state,
        category: body.category,
        status: body.status || 'active'
      }])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }
    
    return NextResponse.json({
      success: true,
      message: 'Scheme created successfully',
      data: newScheme
    })
  } catch (error) {
    console.error('Error creating scheme:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create scheme',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}

// Update scheme
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...updateData } = body
    
    // Update scheme in Supabase
    const { data: updatedScheme, error } = await supabase
      .from('schemes')
      .update({
        name: updateData.name,
        description: updateData.description,
        benefits: updateData.benefits,
        eligibility_criteria: updateData.eligibility_criteria,
        application_url: updateData.application_url,
        department: updateData.department,
        state: updateData.state,
        category: updateData.category,
        status: updateData.status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }
    
    return NextResponse.json({
      success: true,
      message: 'Scheme updated successfully',
      data: updatedScheme
    })
  } catch (error) {
    console.error('Error updating scheme:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update scheme',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}