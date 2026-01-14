'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  MapPin,
  Briefcase,
  Languages,
  Clock,
  AlertCircle,
  CheckCircle,
  BarChart3,
  PieChart,
  Zap,
  Target,
  Bot,
  ArrowUp,
  ArrowDown,
  Minus,
  Eye,
  Calendar as CalendarIcon,
  Home,
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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const [seedStatus, setSeedStatus] = useState<any>(null)
  const { t } = useLanguage()
  
  // Mock stats for demonstration - replace with your Node.js backend API calls
  const [stats, setStats] = useState({
    totalUsers: 1247,
    activeToday: 89,
    activeThisWeek: 342,
    activeThisMonth: 856,
    totalMessages: 5634,
    avgMessagesPerUser: 4.5,
    languageBreakdown: {
      'hi': 456,
      'en': 234,
      'ta': 123,
      'bn': 98,
      'te': 87,
      'mr': 76,
      'gu': 65,
      'kn': 54
    } as Record<string, number>,
    stateBreakdown: {
      'Maharashtra': 234,
      'Tamil Nadu': 187,
      'Karnataka': 156,
      'West Bengal': 134,
      'Gujarat': 123,
      'Uttar Pradesh': 112,
      'Rajasthan': 98,
      'Kerala': 87
    } as Record<string, number>,
    occupationBreakdown: {
      'farmer': 456,
      'student': 234,
      'business': 187,
      'employee': 156,
      'unemployed': 123,
      'retired': 91
    } as Record<string, number>,
    categoryBreakdown: {
      'General': 567,
      'OBC': 234,
      'SC': 187,
      'ST': 123,
      'EWS': 98
    } as Record<string, number>,
    growthRate: 12.5
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
      refreshData()
      checkSeedStatus()
    }
  }, [isAuthenticated])

  const checkSeedStatus = async () => {
    try {
      const response = await fetch('/api/admin/seed')
      const data = await response.json()
      if (data.success) {
        setSeedStatus(data.data)
      }
    } catch (error) {
      console.error('Error checking seed status:', error)
    }
  }

  const handleSeedDatabase = async () => {
    setSeeding(true)
    try {
      const response = await fetch('/api/admin/seed', { method: 'POST' })
      const data = await response.json()
      
      if (data.success) {
        alert(`✅ ${data.message}`)
        await refreshData()
        await checkSeedStatus()
      } else {
        alert(`❌ ${data.message || 'Failed to seed database'}`)
      }
    } catch (error) {
      console.error('Error seeding database:', error)
      alert('❌ Failed to seed database')
    } finally {
      setSeeding(false)
    }
  }

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

  const refreshData = async () => {
    setRefreshing(true)
    try {
      // Fetch stats from your Node.js backend API
      const response = await fetch('/api/admin/stats')
      const data = await response.json()
      
      if (data.success) {
        setStats(data.data)
        setError(null)
      } else {
        setError(data.error || 'Failed to fetch data')
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
      setError('Failed to connect to backend')
    } finally {
      setRefreshing(false)
    }
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

      {/* Integration Notice */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <Badge className="mb-4 bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800">
              <Database className="mr-1 h-3 w-3" />
              Backend Integration
            </Badge>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Connect Your Node.js Backend</h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              This dashboard is ready to connect to your Node.js backend. Update the API calls to fetch real data from your backend services.
            </p>
          </div>

          <Card className="max-w-4xl mx-auto border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900 dark:text-white">
                <Bot className="w-5 h-5 mr-2" />
                Integration Instructions
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Steps to connect this dashboard to your Node.js backend
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Frontend (Completed)
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Removed Supabase dependencies</li>
                    <li>• Removed Gemini AI integration</li>
                    <li>• Removed Twilio WhatsApp API</li>
                    <li>• Cleaned up unused API routes</li>
                    <li>• Client-side WhatsApp redirects only</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-blue-500" />
                    Backend (Your Node.js)
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Update refreshData() function</li>
                    <li>• Add API endpoints for stats</li>
                    <li>• Connect to your database</li>
                    <li>• Implement user management</li>
                    <li>• Add authentication middleware</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">Database Management:</h5>
                <div className="space-y-2">
                  {seedStatus && !seedStatus.isSeeded && (
                    <Button 
                      onClick={handleSeedDatabase}
                      disabled={seeding}
                      className="w-full justify-start bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Database className="w-4 h-4 mr-2" />
                      {seeding ? 'Seeding Database...' : 'Seed Initial Schemes'}
                    </Button>
                  )}
                  <Link href="/admin/users">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Users className="w-4 h-4 mr-2" />
                      View All Users ({seedStatus?.users || 0})
                    </Button>
                  </Link>
                  <Link href="/admin/schemes">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Database className="w-4 h-4 mr-2" />
                      Manage Schemes ({seedStatus?.schemes || 0})
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">API Integration Example:</h5>
                <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-x-auto">
{`// Replace refreshData() function with:
const refreshData = async () => {
  setRefreshing(true)
  try {
    const response = await fetch('/api/admin/stats')
    const data = await response.json()
    setStats(data)
  } catch (error) {
    setError('Failed to fetch data')
  } finally {
    setRefreshing(false)
  }
}`}
                </pre>
              </div>
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
                  Frontend: Operational
                </li>
                <li className="flex items-center">
                  <Clock className="w-3 h-3 mr-2 text-blue-400" />
                  Backend: Connect Node.js
                </li>
                <li className="flex items-center">
                  <AlertCircle className="w-3 h-3 mr-2 text-yellow-400" />
                  WhatsApp: Client-side redirects
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
                <span className="text-sm">Ready for Node.js Backend</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}