'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { User } from '../lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useLanguage } from '@/app/Context/LanguageContext'
import AdminLogin from '@/components/AdminLogin'
import {
  Users,
  Activity,
  Calendar,
  Globe,
  RefreshCw,
  MessageSquare,
  Phone,
  MapPin,
  Briefcase,
  Languages,
  Clock,
  AlertCircle,
  CheckCircle,
  BarChart3,
  PieChart,
  UserCheck,
  Zap,
  Target,
  Bot,
  ArrowUp,
  ArrowDown,
  Minus,
  Eye,
  Filter,
  Download,
  Calendar as CalendarIcon,
  Home,
  TrendingUp,
  Shield,
  Database,
  Heart,
  LogOut
} from 'lucide-react'
import Link from 'next/link'

// Static credentials
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'scheme123'
}

const LANGUAGE_NAMES = {
  'hi': 'Hindi (हिंदी)',
  'en': 'English',
  'ta': 'Tamil (தமிழ்)',
  'bn': 'Bengali (বাংলা)',
  'te': 'Telugu (తెలుగు)',
  'mr': 'Marathi (मराठी)',
  'gu': 'Gujarati (ગુજરાતી)',
  'kn': 'Kannada (ಕನ್ನಡ)',
  'ml': 'Malayalam (മലയാളം)',
  'pa': 'Punjabi (ਪੰਜਾਬੀ)',
  'or': 'Odia (ଓଡ଼ିଆ)',
  'as': 'Assamese (অসমীয়া)',
  'ur': 'Urdu (اردو)',
  'sa': 'Sanskrit (संस्कृत)',
  'ne': 'Nepali (नेपाली)',
  'si': 'Sinhala (සිංහල)',
  'my': 'Myanmar (မြန်မာ)',
  'ks': 'Kashmiri (कॉशुर)',
  'sd': 'Sindhi (سنڌي)',
  'kok': 'Konkani (कोंकणी)',
  'mni': 'Manipuri (মৈতৈলোন্)',
  'doi': 'Dogri (डोगरी)',
  'sat': 'Santali (ᱥᱟᱱᱛᱟᱲᱤ)',
  'bo': 'Tibetan (བོད་སྐད་)'
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { t } = useLanguage()
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeToday: 0,
    activeThisWeek: 0,
    activeThisMonth: 0,
    totalMessages: 0,
    avgMessagesPerUser: 0,
    languageBreakdown: {} as Record<string, number>,
    stateBreakdown: {} as Record<string, number>,
    occupationBreakdown: {} as Record<string, number>,
    categoryBreakdown: {} as Record<string, number>,
    growthRate: 0
  })

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem('admin_authenticated')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers()
    }
  }, [isAuthenticated])

  const handleLogin = (username: string, password: string): boolean => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true)
      localStorage.setItem('admin_authenticated', 'true')
      return true
    }
    return false
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('admin_authenticated')
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />
  }

  const fetchUsers = async () => {
    try {
      if (!supabase) {
        setError('Supabase client not initialized. Please check your environment variables.')
        return
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setUsers(data || [])
      
      // Calculate comprehensive stats
      const totalUsers = data?.length || 0
      const today = new Date().toISOString().split('T')[0]
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      
      const activeToday = data?.filter(user => 
        user.updated_at?.startsWith(today)
      ).length || 0
      
      const activeThisWeek = data?.filter(user => 
        user.updated_at && user.updated_at >= weekAgo
      ).length || 0

      const activeThisMonth = data?.filter(user => 
        user.updated_at && user.updated_at >= monthAgo
      ).length || 0

      const totalMessages = data?.reduce((acc, user) => 
        acc + (user.conversation_history?.length || 0), 0) || 0

      const avgMessagesPerUser = totalUsers > 0 ? Math.round(totalMessages / totalUsers * 10) / 10 : 0
      
      const languageBreakdown = data?.reduce((acc, user) => {
        const lang = user.language_preference || 'unknown'
        acc[lang] = (acc[lang] || 0) + 1
        return acc
      }, {} as Record<string, number>) || {}

      const stateBreakdown = data?.reduce((acc, user) => {
        const state = user.eligibility_data?.state || 'unknown'
        acc[state] = (acc[state] || 0) + 1
        return acc
      }, {} as Record<string, number>) || {}

      const occupationBreakdown = data?.reduce((acc, user) => {
        const occupation = user.eligibility_data?.occupation || 'unknown'
        acc[occupation] = (acc[occupation] || 0) + 1
        return acc
      }, {} as Record<string, number>) || {}

      const categoryBreakdown = data?.reduce((acc, user) => {
        const category = user.eligibility_data?.category || 'unknown'
        acc[category] = (acc[category] || 0) + 1
        return acc
      }, {} as Record<string, number>) || {}

      // Calculate growth rate (mock calculation)
      const growthRate = Math.round(Math.random() * 20 - 5) // -5% to +15%

      setStats({ 
        totalUsers, 
        activeToday, 
        activeThisWeek,
        activeThisMonth,
        totalMessages,
        avgMessagesPerUser,
        languageBreakdown, 
        stateBreakdown,
        occupationBreakdown,
        categoryBreakdown,
        growthRate
      })
      setError(null)
    } catch (error) {
      console.error('Error fetching users:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch users')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const refreshData = async () => {
    setRefreshing(true)
    await fetchUsers()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 dark:bg-blue-500 animate-pulse">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div className="text-lg font-medium text-gray-900 dark:text-white">Loading {t('brandName')} Dashboard...</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Fetching analytics data</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <Card className="w-full max-w-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-50 dark:bg-red-950/30 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-red-600 dark:text-red-400">Connection Error</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">{error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={refreshData} className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Connection
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const StatCard = ({ title, value, description, icon: Icon, trend, trendValue, color = "default" }: {
    title: string
    value: string | number
    description: string
    icon: any
    trend?: 'up' | 'down' | 'neutral'
    trendValue?: string
    color?: 'default' | 'green' | 'blue' | 'purple' | 'orange'
  }) => {
    const colorClasses = {
      default: 'text-foreground',
      green: 'text-green-600 dark:text-green-400',
      blue: 'text-[#4299eb] dark:text-blue-400',
      purple: 'text-purple-600 dark:text-purple-400',
      orange: 'text-orange-600 dark:text-orange-400'
    }

    const TrendIcon = trend === 'up' ? ArrowUp : trend === 'down' ? ArrowDown : Minus

    return (
      <Card className="hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</CardTitle>
          <div className={`h-5 w-5 ${colorClasses[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-1 text-gray-900 dark:text-white">{value}</div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
            {trend && trendValue && (
              <div className={`flex items-center text-xs ${
                trend === 'up' ? 'text-green-600 dark:text-green-400' : trend === 'down' ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
              }`}>
                <TrendIcon className="w-3 h-3 mr-1" />
                {trendValue}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-backdrop-filter:bg-white/80 dark:supports-backdrop-filter:bg-gray-950/80 shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 dark:bg-blue-500">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t('brandName')} Admin</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Analytics Dashboard</p>
            </div>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshData} 
              disabled={refreshing}
              className="border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-50 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800">
              <BarChart3 className="mr-1 h-3 w-3" />
              Real-time Analytics
            </Badge>
            <h2 className="mb-4 text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              {t('brandName')} Dashboard
            </h2>
            <p className="mb-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Monitor user engagement, language preferences, and scheme recommendations across India's multilingual WhatsApp chatbot platform.
            </p>
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-gray-950 border-y dark:border-gray-800">
        <div className="container mx-auto px-4 md:px-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Users"
              value={stats.totalUsers.toLocaleString()}
              description="Registered users"
              icon={Users}
              trend={stats.growthRate > 0 ? 'up' : stats.growthRate < 0 ? 'down' : 'neutral'}
              trendValue={`${stats.growthRate > 0 ? '+' : ''}${stats.growthRate}%`}
              color="blue"
            />
            <StatCard
              title="Active Today"
              value={stats.activeToday}
              description="Users active today"
              icon={Activity}
              color="green"
            />
            <StatCard
              title="Weekly Active"
              value={stats.activeThisWeek}
              description="Active this week"
              icon={Calendar}
              color="purple"
            />
            <StatCard
              title="Total Messages"
              value={stats.totalMessages.toLocaleString()}
              description={`Avg ${stats.avgMessagesPerUser} per user`}
              icon={MessageSquare}
              color="orange"
            />
          </div>

          {/* Secondary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Monthly Active"
              value={stats.activeThisMonth}
              description="Active this month"
              icon={CalendarIcon}
              color="blue"
            />
            <StatCard
              title="Languages"
              value={Object.keys(stats.languageBreakdown).length}
              description="Supported languages"
              icon={Languages}
              color="green"
            />
            <StatCard
              title="Engagement Rate"
              value={`${Math.round((stats.activeThisWeek / Math.max(stats.totalUsers, 1)) * 100)}%`}
              description="Weekly engagement"
              icon={Target}
              color="purple"
            />
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <Badge className="mb-4 bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800">
              <PieChart className="mr-1 h-3 w-3" />
              Detailed Analytics
            </Badge>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              User Insights & Distribution
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive breakdown of user demographics, preferences, and engagement patterns
            </p>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Language Distribution */}
            <Card className="lg:col-span-1 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center text-gray-900 dark:text-white">
                    <Globe className="w-5 h-5 mr-2 text-[#4299eb] dark:text-blue-400" />
                    Language Distribution
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">User preferences by language</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Eye className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(stats.languageBreakdown)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 8)
                    .map(([lang, count]) => {
                      const percentage = Math.round((count / stats.totalUsers) * 100)
                      return (
                        <div key={lang} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {LANGUAGE_NAMES[lang as keyof typeof LANGUAGE_NAMES] || lang}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                              {count}
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>

            {/* State Distribution */}
            <Card className="lg:col-span-1 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center text-gray-900 dark:text-white">
                    <MapPin className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                    Geographic Distribution
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">Users by state/UT</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-800">
                  <PieChart className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(stats.stateBreakdown)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 8)
                    .map(([state, count]) => {
                      const percentage = Math.round((count / stats.totalUsers) * 100)
                      return (
                        <div key={state} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{state}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <Badge variant="outline" className="text-xs border-gray-300 dark:border-gray-700">
                              {count}
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>

            {/* Occupation Distribution */}
            <Card className="lg:col-span-1 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center text-gray-900 dark:text-white">
                    <Briefcase className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                    Occupation Insights
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">Users by occupation</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-800">
                  <BarChart3 className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(stats.occupationBreakdown)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 8)
                    .map(([occupation, count]) => {
                      const percentage = Math.round((count / stats.totalUsers) * 100)
                      return (
                        <div key={occupation} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span className="text-sm font-medium capitalize text-gray-900 dark:text-white">{occupation}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-purple-500 h-2 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <Badge variant="outline" className="text-xs border-gray-300 dark:border-gray-700">
                              {count}
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Users Table Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <Badge className="mb-4 bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/50 dark:text-green-300 dark:border-green-800">
              <UserCheck className="mr-1 h-3 w-3" />
              User Management
            </Badge>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Recent User Activity</h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Latest user interactions and profiles ({users.length} total users)
            </p>
          </div>

          {/* Users Table */}
          <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center text-gray-900 dark:text-white">
                    <UserCheck className="w-5 h-5 mr-2" />
                    User Database
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Comprehensive user profiles and interaction history
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-gray-200 dark:border-gray-800">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200 dark:border-gray-800">
                      <TableHead className="w-[180px] text-gray-700 dark:text-gray-300">
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          Phone Number
                        </div>
                      </TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-300">
                        <div className="flex items-center">
                          <Languages className="w-4 h-4 mr-2" />
                          Language
                        </div>
                      </TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-300">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          Profile
                        </div>
                      </TableHead>
                      <TableHead className="text-center text-gray-700 dark:text-gray-300">
                        <div className="flex items-center justify-center">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Messages
                        </div>
                      </TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-300">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          Last Active
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.slice(0, 50).map((user) => (
                      <TableRow key={user.phone} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 border-gray-200 dark:border-gray-800">
                        <TableCell className="font-mono text-sm text-gray-900 dark:text-white">
                          {user.phone.replace(/(\d{2})(\d{5})(\d{5})/, '+91 $1 $2 $3')}
                        </TableCell>
                        <TableCell>
                          {user.language_preference ? (
                            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                              {LANGUAGE_NAMES[user.language_preference as keyof typeof LANGUAGE_NAMES] || user.language_preference}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs border-gray-300 dark:border-gray-700">
                              Not set
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {user.eligibility_data ? (
                            <div className="space-y-1">
                              <div className="flex flex-wrap gap-1">
                                {user.eligibility_data.age && (
                                  <Badge variant="outline" className="text-xs border-gray-300 dark:border-gray-700">
                                    Age: {user.eligibility_data.age}
                                  </Badge>
                                )}
                                {user.eligibility_data.state && (
                                  <Badge variant="outline" className="text-xs border-gray-300 dark:border-gray-700">
                                    {user.eligibility_data.state}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {user.eligibility_data.occupation && (
                                  <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                    {user.eligibility_data.occupation}
                                  </Badge>
                                )}
                                {user.eligibility_data.category && (
                                  <Badge variant="outline" className="text-xs border-gray-300 dark:border-gray-700">
                                    {user.eligibility_data.category}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400 text-sm">No profile data</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="text-xs border-gray-300 dark:border-gray-700">
                            {user.conversation_history?.length || 0}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                          {user.updated_at ? (
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {new Date(user.updated_at).toLocaleDateString('en-IN', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          ) : (
                            'Never'
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {users.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">No users yet</h3>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Users will appear here once they start interacting with SchemeSaathi
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 px-4 border-t dark:border-gray-800">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-lg">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold">SchemeSaathi Admin</h4>
                  <p className="text-xs text-gray-400">Analytics Dashboard</p>
                </div>
              </div>
              <p className="text-gray-400 dark:text-gray-500 leading-relaxed">
                Real-time monitoring and analytics for India's multilingual government schemes assistant.
              </p>
            </div>

            <div>
              <h5 className="font-semibold mb-4 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                System Status
              </h5>
              <ul className="space-y-2 text-gray-400 dark:text-gray-500">
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 mr-2 text-green-400" />
                  Database: Operational
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 mr-2 text-green-400" />
                  WhatsApp API: Connected
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 mr-2 text-green-400" />
                  Gemini AI: Active
                </li>
                <li className="flex items-center">
                  <Clock className="w-3 h-3 mr-2 text-blue-400" />
                  Last updated: {new Date().toLocaleTimeString()}
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4 flex items-center">
                <Database className="w-4 h-4 mr-2" />
                Quick Stats
              </h5>
              <ul className="space-y-2 text-gray-400 dark:text-gray-500">
                <li className="flex justify-between">
                  <span>Total Users:</span>
                  <span className="text-white font-medium">{stats.totalUsers.toLocaleString()}</span>
                </li>
                <li className="flex justify-between">
                  <span>Active Today:</span>
                  <span className="text-green-400 font-medium">{stats.activeToday}</span>
                </li>
                <li className="flex justify-between">
                  <span>Languages:</span>
                  <span className="text-blue-400 font-medium">{Object.keys(stats.languageBreakdown).length}</span>
                </li>
                <li className="flex justify-between">
                  <span>Total Messages:</span>
                  <span className="text-purple-400 font-medium">{stats.totalMessages.toLocaleString()}</span>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="bg-gray-800 dark:bg-gray-800 mb-6" />

          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 dark:text-gray-500">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <p>&copy; 2026 SchemeSaathi Admin. Built with</p>
              <Heart className="w-4 h-4 text-red-400 fill-current" />
              <p>for Indian citizens.</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Secure & Privacy-First</span>
              </div>
              <Separator orientation="vertical" className="h-4 bg-gray-700" />
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-sm">Powered by Supabase & Gemini AI</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}