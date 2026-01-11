'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useLanguage } from '@/app/Context/LanguageContext'
import {
  Users,
  RefreshCw,
  MessageSquare,
  Phone,
  Languages,
  Clock,
  AlertCircle,
  Filter,
  Download,
  Home,
  LogOut,
  ArrowLeft,
  Search
} from 'lucide-react'
import Link from 'next/link'

interface User {
  id: string
  phone_number?: string
  whatsapp_name?: string
  telegram_id?: string
  first_name?: string
  username?: string
  language_preference: string
  eligibility_data?: any
  conversation_history?: any[]
  created_at: string
  updated_at: string
  last_active: string
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
  'ks': 'Kashmiri (कॉशुर)',
  'mai': 'Maithili (मैथिली)'
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [filter, setFilter] = useState<'all' | 'whatsapp' | 'telegram'>('all')

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem('admin_authenticated')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    } else {
      // Redirect to admin login if not authenticated
      window.location.href = '/admin'
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers()
    }
  }, [isAuthenticated, filter])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const platform = filter === 'all' ? '' : filter
      const response = await fetch(`/api/admin/users?platform=${platform}&limit=100`)
      const data = await response.json()
      
      if (data.success) {
        setUsers(data.data.users)
        setError(null)
      } else {
        setError(data.error || 'Failed to fetch users')
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      setError('Failed to connect to backend')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const refreshData = async () => {
    setRefreshing(true)
    await fetchUsers()
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated')
    window.location.href = '/admin'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 dark:bg-blue-500 animate-pulse">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div className="text-lg font-medium text-gray-900 dark:text-white">Loading Users...</div>
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
            <CardTitle className="text-red-600 dark:text-red-400">Error Loading Users</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">{error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Button onClick={refreshData} className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
            <Link href="/admin">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-backdrop-filter:bg-white/80 dark:supports-backdrop-filter:bg-gray-950/80 shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/admin" className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 dark:bg-blue-500">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">User Management</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">{users.length} total users</p>
            </div>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link href="/admin">
              <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                <Home className="w-4 h-4 mr-2" />
                Dashboard
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

      {/* Users Table Section */}
      <section className="py-8 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 md:px-6">
          {/* Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
                className={filter === 'all' ? 'bg-blue-600 text-white' : ''}
              >
                All Platforms
              </Button>
              <Button
                variant={filter === 'whatsapp' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('whatsapp')}
                className={filter === 'whatsapp' ? 'bg-green-600 text-white' : ''}
              >
                WhatsApp
              </Button>
              <Button
                variant={filter === 'telegram' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('telegram')}
                className={filter === 'telegram' ? 'bg-blue-500 text-white' : ''}
              >
                Telegram
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Users Table */}
          <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900 dark:text-white">
                <Users className="w-5 h-5 mr-2" />
                User Database ({users.length} users)
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Comprehensive user profiles and interaction history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-gray-200 dark:border-gray-800">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200 dark:border-gray-800">
                      <TableHead className="w-[200px] text-gray-700 dark:text-gray-300">
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          Contact / Platform
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
                    {users.map((user) => (
                      <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 border-gray-200 dark:border-gray-800">
                        <TableCell className="font-mono text-sm text-gray-900 dark:text-white">
                          <div className="space-y-1">
                            {user.phone_number ? (
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-300">
                                  WhatsApp
                                </Badge>
                                <span>{user.phone_number}</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-300">
                                  Telegram
                                </Badge>
                                <span>@{user.telegram_id}</span>
                              </div>
                            )}
                            <div className="text-xs text-gray-500">
                              {user.whatsapp_name || user.first_name || 'No name'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                            {LANGUAGE_NAMES[user.language_preference as keyof typeof LANGUAGE_NAMES] || user.language_preference}
                          </Badge>
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
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(user.last_active).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {users.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">No users found</h3>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Users will appear here once they start interacting with SchemeSaathi
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}