'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useLanguage } from '@/app/Context/LanguageContext'
import {
  Briefcase,
  RefreshCw,
  Users,
  ExternalLink,
  AlertCircle,
  Bot,
  Filter,
  Download,
  Home,
  LogOut,
  ArrowLeft,
  Search,
  Plus,
  Edit,
  Eye,
  Building,
  MapPin,
  Calendar,
  CheckCircle,
  Clock
} from 'lucide-react'
import Link from 'next/link'

interface Scheme {
  id: string
  scheme_id: string
  name: string
  description: string
  benefits: string
  eligibility_criteria: any
  application_url: string
  department: string
  state: string
  category: string
  status: string
  created_at: string
  updated_at: string
  interaction_count?: number
  applications?: number
}

const CATEGORY_COLORS = {
  'farmer': 'bg-green-50 text-green-700 border-green-300',
  'health': 'bg-red-50 text-red-700 border-red-300',
  'business': 'bg-blue-50 text-blue-700 border-blue-300',
  'student': 'bg-purple-50 text-purple-700 border-purple-300',
  'women': 'bg-pink-50 text-pink-700 border-pink-300',
  'housing': 'bg-orange-50 text-orange-700 border-orange-300',
  'energy': 'bg-yellow-50 text-yellow-700 border-yellow-300',
  'skill': 'bg-indigo-50 text-indigo-700 border-indigo-300',
  'agriculture': 'bg-green-50 text-green-700 border-green-300',
  'education': 'bg-purple-50 text-purple-700 border-purple-300',
  'digital': 'bg-cyan-50 text-cyan-700 border-cyan-300',
  'sanitation': 'bg-teal-50 text-teal-700 border-teal-300',
  'manufacturing': 'bg-gray-50 text-gray-700 border-gray-300'
}

export default function SchemesPage() {
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [filter, setFilter] = useState<string>('all')
  const { t } = useLanguage()

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
      fetchSchemes()
    }
  }, [isAuthenticated, filter])

  const fetchSchemes = async () => {
    try {
      setLoading(true)
      const category = filter === 'all' ? '' : filter
      const response = await fetch(`/api/admin/schemes?category=${category}&limit=100`)
      const data = await response.json()
      
      if (data.success) {
        setSchemes(data.data.schemes)
        setError(null)
      } else {
        setError(data.error || 'Failed to fetch schemes')
      }
    } catch (error) {
      console.error('Error fetching schemes:', error)
      setError('Failed to connect to backend')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const refreshData = async () => {
    setRefreshing(true)
    await fetchSchemes()
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated')
    window.location.href = '/admin'
  }

  const getUniqueCategories = () => {
    const categories = schemes.map(scheme => scheme.category).filter(Boolean)
    return ['all', ...Array.from(new Set(categories))]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 dark:bg-blue-500 animate-pulse">
            <Briefcase className="h-6 w-6 text-white" />
          </div>
          <div className="text-lg font-medium text-gray-900 dark:text-white">Loading Schemes...</div>
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
            <CardTitle className="text-red-600 dark:text-red-400">Error Loading Schemes</CardTitle>
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
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Scheme Management</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">{schemes.length} total schemes</p>
            </div>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link href="/admin">
              <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                <Users className="w-4 h-4 mr-2" />
                Users
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

      {/* Schemes Table Section */}
      <section className="py-8 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 md:px-6">
          {/* Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center space-x-2 flex-wrap gap-2">
              {getUniqueCategories().map((category) => (
                <Button
                  key={category}
                  variant={filter === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(category)}
                  className={filter === category ? 'bg-blue-600 text-white' : ''}
                >
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
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
              <Button variant="outline" size="sm" className="border-green-300 text-green-600 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-950/30">
                <Plus className="w-4 h-4 mr-2" />
                Add Scheme
              </Button>
            </div>
          </div>

          {/* Schemes Table */}
          <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900 dark:text-white">
                <Briefcase className="w-5 h-5 mr-2" />
                Government Schemes Database ({schemes.length} schemes)
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Comprehensive government scheme management and analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-gray-200 dark:border-gray-800">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200 dark:border-gray-800">
                      <TableHead className="w-[300px] text-gray-700 dark:text-gray-300">
                        <div className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-2" />
                          Scheme Details
                        </div>
                      </TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-300">
                        <div className="flex items-center">
                          <Building className="w-4 h-4 mr-2" />
                          Department
                        </div>
                      </TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-300">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          Coverage
                        </div>
                      </TableHead>
                      <TableHead className="text-center text-gray-700 dark:text-gray-300">
                        <div className="flex items-center justify-center">
                          <Users className="w-4 h-4 mr-2" />
                          Interactions
                        </div>
                      </TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-300">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          Status
                        </div>
                      </TableHead>
                      <TableHead className="text-center text-gray-700 dark:text-gray-300">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schemes.map((scheme) => (
                      <TableRow key={scheme.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 border-gray-200 dark:border-gray-800">
                        <TableCell className="text-gray-900 dark:text-white">
                          <div className="space-y-2">
                            <div className="flex items-start space-x-2">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${CATEGORY_COLORS[scheme.category as keyof typeof CATEGORY_COLORS] || 'bg-gray-50 text-gray-700 border-gray-300'}`}
                              >
                                {scheme.category}
                              </Badge>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm leading-tight">{scheme.name}</h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                {scheme.description}
                              </p>
                            </div>
                            <div className="text-xs font-mono text-blue-600 dark:text-blue-400">
                              {scheme.scheme_id}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {scheme.department}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Government of India
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                            {scheme.state || 'All India'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="space-y-1">
                            <Badge variant="outline" className="text-xs border-gray-300 dark:border-gray-700">
                              {scheme.interaction_count || 0} views
                            </Badge>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {scheme.applications || 0} applied
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1">
                              {scheme.status === 'active' ? (
                                <CheckCircle className="w-3 h-3 text-green-500" />
                              ) : (
                                <Clock className="w-3 h-3 text-yellow-500" />
                              )}
                              <Badge 
                                variant={scheme.status === 'active' ? 'default' : 'secondary'}
                                className={`text-xs ${scheme.status === 'active' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-yellow-100 text-yellow-700 border-yellow-300'}`}
                              >
                                {scheme.status}
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Updated {new Date(scheme.updated_at).toLocaleDateString('en-IN', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="w-3 h-3" />
                            </Button>
                            {scheme.application_url && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={() => window.open(scheme.application_url, '_blank')}
                              >
                                <ExternalLink className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {schemes.length === 0 && (
                <div className="text-center py-12">
                  <Briefcase className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">No schemes found</h3>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Government schemes will appear here once they are added to the database
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