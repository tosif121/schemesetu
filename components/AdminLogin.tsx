'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Bot, Lock, User, Eye, EyeOff, AlertCircle, Shield } from 'lucide-react';
import { useLanguage } from '@/app/Context/LanguageContext';
import Link from 'next/link';

interface AdminLoginProps {
  onLogin: (username: string, password: string) => boolean;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const success = onLogin(username, password);

    if (!success) {
      setError('Invalid username or password');
    }

    setIsLoading(false);
  };

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
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t('brandName')}</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('common.appSubtitle')}</p>
            </div>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Login Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center max-w-md mx-auto">
            <Badge className="mb-6 bg-red-50 text-red-700 border border-red-200 hover:bg-red-50 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800">
              <Shield className="mr-1 h-3 w-3" />
              Restricted Access
            </Badge>

            <Card className="w-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-blue-50 dark:bg-blue-950/30 rounded-full flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-[#4299eb] dark:text-blue-400" />
                </div>
                <CardTitle className="text-2xl text-gray-900 dark:text-white">Admin Login</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Enter your credentials to access the analytics dashboard
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
                    </div>
                  )}

                  <div className="space-y-2 text-start">
                    <label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Username
                      <span className="text-destructive ms-2">*</span>
                    </label>
                    <div className="relative mt-3">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter username"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2 text-start">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Password
                      <span className="text-destructive ms-2">*</span>
                    </label>
                    <div className="relative mt-3">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>

                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Demo Credentials:</p>
                    <div className="space-y-1">
                      <p className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        Username: <span className="text-[#4299eb] dark:text-blue-400">admin</span>
                      </p>
                      <p className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        Password: <span className="text-[#4299eb] dark:text-blue-400">scheme123</span>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-[#4299eb] dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
