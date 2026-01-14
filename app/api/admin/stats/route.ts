import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Get comprehensive stats from Supabase database
async function getStatsFromDatabase() {
  try {
    // Get total users count
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    // Get active users today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const { count: activeToday } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('last_active', today.toISOString())

    // Get active users this week
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const { count: activeThisWeek } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('last_active', weekAgo.toISOString())

    // Get active users this month
    const monthAgo = new Date()
    monthAgo.setMonth(monthAgo.getMonth() - 1)
    const { count: activeThisMonth } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('last_active', monthAgo.toISOString())

    // Get total messages/conversations
    const { count: totalMessages } = await supabase
      .from('conversations')
      .select('*', { count: 'exact', head: true })

    // Get language breakdown
    const { data: languageData } = await supabase
      .from('users')
      .select('language_preference')
      .not('language_preference', 'is', null)

    const languageBreakdown: Record<string, number> = {}
    languageData?.forEach(user => {
      const lang = user.language_preference || 'en'
      languageBreakdown[lang] = (languageBreakdown[lang] || 0) + 1
    })

    // Get platform breakdown
    const { data: platformData } = await supabase
      .from('users')
      .select('phone_number, telegram_id')

    let whatsappUsers = 0
    let telegramUsers = 0
    platformData?.forEach(user => {
      if (user.phone_number) whatsappUsers++
      if (user.telegram_id) telegramUsers++
    })

    // Get eligibility data breakdown (state, occupation, category)
    const { data: eligibilityData } = await supabase
      .from('users')
      .select('eligibility_data')
      .not('eligibility_data', 'is', null)

    const stateBreakdown: Record<string, number> = {}
    const occupationBreakdown: Record<string, number> = {}
    const categoryBreakdown: Record<string, number> = {}

    eligibilityData?.forEach(user => {
      const data = user.eligibility_data || {}
      
      if (data.state) {
        stateBreakdown[data.state] = (stateBreakdown[data.state] || 0) + 1
      }
      
      if (data.occupation) {
        occupationBreakdown[data.occupation] = (occupationBreakdown[data.occupation] || 0) + 1
      }
      
      if (data.category) {
        categoryBreakdown[data.category] = (categoryBreakdown[data.category] || 0) + 1
      }
    })

    // Get scheme interactions
    const { data: schemeInteractions } = await supabase
      .from('user_schemes')
      .select('scheme_id')
      .not('scheme_id', 'is', null)

    const schemeBreakdown: Record<string, number> = {}
    schemeInteractions?.forEach(interaction => {
      const schemeId = interaction.scheme_id
      if (schemeId) {
        schemeBreakdown[schemeId] = (schemeBreakdown[schemeId] || 0) + 1
      }
    })

    // Calculate growth rate (simplified - comparing last 30 days vs previous 30 days)
    const twoMonthsAgo = new Date()
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2)
    
    const { count: usersLastMonth } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', twoMonthsAgo.toISOString())
      .lt('created_at', monthAgo.toISOString())

    const { count: usersThisMonth } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', monthAgo.toISOString())

    const growthRate = usersLastMonth && usersLastMonth > 0 
      ? ((usersThisMonth || 0) - usersLastMonth) / usersLastMonth * 100 
      : 0

    return {
      totalUsers: totalUsers || 0,
      activeToday: activeToday || 0,
      activeThisWeek: activeThisWeek || 0,
      activeThisMonth: activeThisMonth || 0,
      totalMessages: totalMessages || 0,
      avgMessagesPerUser: totalUsers && totalUsers > 0 ? (totalMessages || 0) / totalUsers : 0,
      languageBreakdown,
      stateBreakdown,
      occupationBreakdown,
      categoryBreakdown,
      growthRate: Math.round(growthRate * 100) / 100,
      platformBreakdown: {
        'whatsapp': whatsappUsers,
        'telegram': telegramUsers
      },
      schemeInteractions: schemeBreakdown
    }
  } catch (error) {
    console.error('Error fetching stats from Supabase:', error)
    throw error // Don't fall back to mock data, let admin know there's an issue
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get comprehensive stats from database
    const stats = await getStatsFromDatabase()
    
    return NextResponse.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
      source: 'supabase'
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch statistics',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function HEAD(req: NextRequest) {
  return new NextResponse(null, { status: 200 })
}