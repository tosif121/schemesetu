'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useWhatsApp } from './lib/whatsapp-client';
import { useTelegram } from './lib/telegram-client';
import { useLanguage } from './Context/LanguageContext';
import {
  Bot,
  MessageCircle,
  Target,
  Database,
  History,
  BarChart3,
  Globe,
  Users,
  Heart,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Phone,
  Languages,
  Building2,
  GraduationCap,
  Stethoscope,
  Wheat,
  ExternalLink,
  TrendingUp,
  Clock,
  MapPin,
  Menu,
  X,
} from 'lucide-react';

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const whatsapp = useWhatsApp();
  const telegram = useTelegram();
  const { t } = useLanguage();

  useEffect(() => {
    // Handle scroll event
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation items array
  const navItems = [
    { href: '#features', label: t('nav.features') },
    { href: '#languages', label: t('nav.languages') },
    { href: '#schemes', label: t('nav.schemes') },
  ];

  const languages = [
    { code: 'en', name: 'English', native: 'English', speakers: '125M+' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी', speakers: '600M+' },
    { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', speakers: '37M+' },
    { code: 'as', name: 'Assamese', native: 'অসমীয়া', speakers: '15M+' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা', speakers: '97M+' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', speakers: '56M+' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', speakers: '44M+' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം', speakers: '35M+' },
    { code: 'mr', name: 'Marathi', native: 'मराठी', speakers: '83M+' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', speakers: '33M+' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்', speakers: '75M+' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు', speakers: '81M+' },
    { code: 'ur', name: 'Urdu', native: 'اردو', speakers: '52M+' },
    { code: 'ks', name: 'Kashmiri', native: 'کٲشُر', speakers: '7M+' },
    { code: 'mai', name: 'Maithili', native: 'मैथिली', speakers: '13M+' },
  ];

  const features = [
    {
      title: t('features.items.aiProcessing.title'),
      description: t('features.items.aiProcessing.description'),
      icon: Bot,
      color: 'text-[#4299eb] dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
      title: t('features.items.whatsappIntegration.title'),
      description: t('features.items.whatsappIntegration.description'),
      icon: MessageCircle,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950/30',
    },
    {
      title: t('features.items.eligibilityMatching.title'),
      description: t('features.items.eligibilityMatching.description'),
      icon: Target,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    },
    {
      title: t('features.items.governmentData.title'),
      description: t('features.items.governmentData.description'),
      icon: Database,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-950/30',
    },
    {
      title: t('features.items.conversationMemory.title'),
      description: t('features.items.conversationMemory.description'),
      icon: History,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
    },
    {
      title: t('features.items.analyticsDashboard.title'),
      description: t('features.items.analyticsDashboard.description'),
      icon: BarChart3,
      color: 'text-pink-600 dark:text-pink-400',
      bgColor: 'bg-pink-50 dark:bg-pink-950/30',
    },
  ];

  const stats = [
    { label: t('stats.languages'), value: '15+', icon: Languages },
    { label: t('stats.schemes'), value: '500+', icon: Building2 },
    { label: t('stats.states'), value: '28+', icon: MapPin },
    { label: t('stats.responseTime'), value: '<3s', icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-backdrop-filter:bg-white/80 dark:supports-backdrop-filter:bg-gray-950/80 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center space-x-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: '#4299eb' }}
            >
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1
                className={`text-xl font-bold transition-colors duration-300 ${
                  isScrolled ? 'text-gray-900 dark:text-white' : 'text-white drop-shadow-lg'
                }`}
              >
                {t('brandName')}
              </h1>
              <p
                className={`text-xs transition-colors duration-300 ${
                  isScrolled ? 'text-gray-500 dark:text-gray-400' : 'text-white/90 drop-shadow-md'
                }`}
              >
                {t('common.appSubtitle')}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors duration-300 ${
                  isScrolled
                    ? 'text-gray-600 hover:text-[#4299eb] dark:text-gray-300 dark:hover:text-blue-400'
                    : 'text-white/90 hover:text-white drop-shadow-md'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <LanguageSelector isScrolled={isScrolled} />
            <ThemeToggle />
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`transition-all duration-300 ${
                isScrolled
                  ? 'border-gray-300 text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800'
                  : 'border-white text-white hover:bg-white hover:text-gray-900 backdrop-blur-sm bg-white/10'
              }`}
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
        )}

        {/* Mobile Menu Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-900 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: '#4299eb' }}
                >
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t('brandName')}</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t('common.appSubtitle')}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMobileMenuOpen(false)}
                className="border-gray-300 text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Mobile Menu Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <nav className="space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-[#4299eb] dark:hover:text-blue-400 transition-colors py-2"
                  >
                    {item.label}
                  </Link>
                ))}

                {/* Settings Section */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                    {t('mobile.settings')}
                  </h3>
                  <div className="space-y-4">
                    {/* Language Selector in Mobile Menu */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('mobile.language')}
                      </span>
                      <LanguageSelector isScrolled={true} />
                    </div>

                    {/* Theme Toggle in Mobile Menu */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('mobile.theme')}</span>
                      <ThemeToggle />
                    </div>
                  </div>
                </div>

                {/* Mobile WhatsApp Actions */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {t('mobile.quickActions')}
                  </h3>
                  <Button
                    className="w-full justify-start text-left bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      whatsapp.startChat('en');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {t('cta.startChat')}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left border-[#4299eb] text-[#4299eb] hover:bg-blue-50 dark:hover:bg-blue-950/30"
                    onClick={() => {
                      whatsapp.findSchemes('en');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Database className="w-4 h-4 mr-2" />
                    {t('cta.findSchemes')}
                  </Button>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative -mt-16 pt-16 py-16 md:py-24 overflow-hidden">
        {/* Background Image - extends to cover navbar */}
        <div className="absolute inset-0 -top-16 bg-[url('/images/bg-img.jpg')] bg-cover bg-center bg-no-repeat"></div>

        {/* Dark Overlay for better text readability */}
        <div className="absolute inset-0 -top-16 bg-black/60"></div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-white/20 text-white border border-white/30 hover:bg-white/20 backdrop-blur-sm">
              <Shield className="mr-1 h-3 w-3" />
              {t('hero.badge')}
            </Badge>
            <h2 className="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-lg">
              {t('hero.title')}
            </h2>
            <p className="mb-8 max-w-2xl text-lg md:text-xl text-white/95 leading-relaxed drop-shadow-md">
              {t('hero.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="relative bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold shadow-2xl transform hover:scale-105 transition-all duration-300 ease-out overflow-hidden group animate-pulse hover:animate-none border-0"
                onClick={() => whatsapp.startChat('en')}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>

                {/* WhatsApp png icon with bounce animation */}
                <img
                  src="/images/whatsapp.png"
                  alt="WhatsApp"
                  className="h-10 w-10 group-hover:animate-bounce filter brightness-0 invert"
                />

                {/* Text with glow effect */}
                <span className="relative z-10 text-lg tracking-wide drop-shadow-lg">{t('hero.startChat')}</span>

                {/* Pulsing ring effect */}
                <div className="absolute inset-0 rounded-lg bg-green-400/30 animate-ping group-hover:animate-none"></div>
              </Button>

              <Button
                size="lg"
                className="relative bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold shadow-2xl transform hover:scale-105 transition-all duration-300 ease-out overflow-hidden group border-0"
                onClick={() => telegram.startChat('en')}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>

                {/* Telegram icon */}
                <svg className="h-8 w-8 mr-3 group-hover:animate-bounce" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>

                {/* Text with glow effect */}
                <span className="relative z-10 text-lg tracking-wide drop-shadow-lg">{t('hero.startTelegram')}</span>

                {/* Pulsing ring effect */}
                <div className="absolute inset-0 rounded-lg bg-blue-400/30 animate-ping group-hover:animate-none"></div>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white dark:bg-gray-950  dark:border-gray-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <stat.icon className="h-8 w-8 mb-3" style={{ color: '#4299eb' }} />
                <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <Badge className="mb-4 bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800">
              {t('features.badge')}
            </Badge>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('features.title')}</h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{t('features.subtitle')}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow bg-white dark:bg-gray-900"
              >
                <CardHeader>
                  <div
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${feature.bgColor} mb-4`}
                  >
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl text-gray-900 dark:text-white">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Languages Section */}
      <section id="languages" className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <Badge className="mb-6 bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800 px-4 py-2 text-sm font-semibold">
              <Globe className="mr-2 h-4 w-4" />
              {t('languages.badge')}
            </Badge>
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t('languages.title')}
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {t('languages.subtitle')}
            </p>
          </div>

          {/* Featured Languages Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mb-16">
            {languages.map((lang, index) => (
              <Card
                key={lang.code}
                className="group text-center border border-gray-200 dark:border-gray-800 hover:border-[#4299eb] dark:hover:border-[#4299eb] hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-900 hover:scale-105 cursor-pointer relative overflow-hidden"
                onClick={() => whatsapp.startChat(lang.code)}
              >
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-br from-[#4299eb]/0 to-[#4299eb]/0 group-hover:from-[#4299eb]/5 group-hover:to-[#4299eb]/10 transition-all duration-300"></div>

                <CardContent className="p-3 sm:p-4 md:p-6 relative z-10">
                  {/* Native name */}
                  <div className="text-sm sm:text-base md:text-lg font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 group-hover:text-[#4299eb] transition-colors duration-300 leading-tight">
                    {lang.native}
                  </div>

                  {/* English name */}
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-3 font-medium">
                    {lang.name}
                  </div>

                  {/* Speakers badge */}
                  <Badge className="text-xs bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800 group-hover:bg-[#4299eb] group-hover:text-white group-hover:border-[#4299eb] transition-all duration-300">
                    <Users className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                    <span className="text-xs">{lang.speakers}</span>
                  </Badge>

                  {/* Click to chat indicator - hidden on mobile */}
                  <div className="mt-2 sm:mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
                    <div className="text-xs text-[#4299eb] font-medium flex items-center justify-center">
                      <MessageCircle className="w-3 h-3 mr-1" />
                      {t('languages.clickToChat', { language: lang.name })}
                    </div>
                  </div>
                </CardContent>

                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
              </Card>
            ))}
          </div>

          {/* Additional Languages Section */}
          <div className="text-center mb-12">
            <div className="inline-flex flex-col items-center space-y-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-8 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-[#4299eb] rounded-full">
                  <Languages className="w-6 h-6 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
                  {t('languages.moreLanguages')}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-center max-w-md leading-relaxed">
                {t('languages.moreDescription')}
              </p>

              {/* Language tags */}
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {['Sanskrit', 'Bodo', 'Dogri', 'Konkani', 'Manipuri', 'Nepali', 'Santhali', 'Sindhi'].map(
                  (lang, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-[#4299eb] hover:text-white hover:border-[#4299eb] transition-colors cursor-pointer"
                    >
                      {lang}
                    </Badge>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Unified Call to Action */}
          <div className="text-center">
            <div className="bg-[#4299eb] text-white px-8 py-12 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 right-4 w-24 h-24 bg-white rounded-full blur-2xl"></div>
                <div className="absolute bottom-4 left-4 w-32 h-32 bg-white rounded-full blur-3xl"></div>
              </div>

              <div className="relative z-10 max-w-4xl mx-auto">
                <Badge className="mb-6 bg-white/20 text-white border-0 hover:bg-white/20 px-4 py-2">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {t('cta.badge')}
                </Badge>

                <h3 className="text-3xl md:text-5xl font-bold mb-6">{t('cta.title')}</h3>

                <p className="text-lg md:text-xl mb-8 text-blue-100 leading-relaxed max-w-3xl mx-auto">
                  {t('cta.description')}
                </p>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10 max-w-2xl mx-auto">
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-white">15+</div>
                    <div className="text-sm text-blue-200">{t('cta.stats.languages')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-white">500+</div>
                    <div className="text-sm text-blue-200">{t('cta.stats.schemes')}</div>
                  </div>
                  <div className="text-center col-span-2 md:col-span-1">
                    <div className="text-2xl md:text-3xl font-bold text-white">10M+</div>
                    <div className="text-sm text-blue-200">{t('cta.stats.citizensHelped')}</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap">
                  <Button
                    size="lg"
                    className="bg-white text-[#4299eb] hover:bg-blue-50 font-bold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 min-w-[200px]"
                    onClick={() => whatsapp.startChat('hi')}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    {t('cta.startChat')}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>

                  <Button
                    size="lg"
                    className="bg-white text-[#4299eb] hover:bg-blue-50 font-bold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 min-w-[200px]"
                    onClick={() => telegram.startChat('hi')}
                  >
                    <Bot className="w-5 h-5 mr-2" />
                    {t('cta.startTelegram')}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-[#4299eb] font-bold px-8 py-4 text-lg rounded-xl transition-all duration-300 transform hover:scale-105 min-w-[180px] bg-transparent"
                    onClick={() => whatsapp.findSchemes('en')}
                  >
                    <Database className="w-5 h-5 mr-2" />
                    {t('cta.findSchemes')}
                  </Button>
                </div>

                {/* Additional Info */}
                <div className="mt-8 flex flex-col sm:flex-row gap-6 justify-center items-center text-blue-200 text-sm">
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    {t('cta.features.secure')}
                  </div>
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-2" />
                    {t('cta.features.available')}
                  </div>
                  <div className="flex items-center">
                    <Zap className="w-4 h-4 mr-2" />
                    {t('cta.features.instant')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bot Contact Section */}
      <section className="py-16 md:py-24 bg-linear-to-br from-[#4299eb] to-blue-600 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <Badge className="mb-6 bg-white/20 text-white border-0 hover:bg-white/20 px-4 py-2 text-sm font-semibold">
              <Bot className="mr-2 h-4 w-4" />
              {t('botContact.badge')}
            </Badge>
            <h3 className="text-4xl md:text-5xl font-bold mb-6">{t('botContact.title')}</h3>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">{t('botContact.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* WhatsApp Bot Card */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
                    <img src="/images/whatsapp.png" alt="WhatsApp" className="h-10 w-10 filter brightness-0 invert" />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2">{t('botContact.whatsapp.title')}</h4>
                  <p className="text-blue-100 mb-4">{t('botContact.whatsapp.description')}</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Phone className="w-5 h-5 text-green-400" />
                      <span className="text-lg font-bold text-white">+91 78500 06956</span>
                    </div>
                    <p className="text-sm text-blue-200">{t('botContact.whatsapp.number')}</p>
                  </div>

                  <Button
                    size="lg"
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => whatsapp.startChat('en')}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    {t('botContact.whatsapp.button')}
                  </Button>

                  <div className="text-xs text-blue-200 space-y-1">
                    <p>• {t('botContact.whatsapp.features.textBased')}</p>
                    <p>• {t('botContact.whatsapp.features.greetings')}</p>
                    <p>• {t('botContact.whatsapp.features.multilingual')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Telegram Bot Card */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
                    <svg className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2">{t('botContact.telegram.title')}</h4>
                  <p className="text-blue-100 mb-4">{t('botContact.telegram.description')}</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Bot className="w-5 h-5 text-blue-400" />
                      <span className="text-lg font-bold text-white">@schemesetu_bot</span>
                    </div>
                    <p className="text-sm text-blue-200">{t('botContact.telegram.handle')}</p>
                  </div>

                  <Button
                    size="lg"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => telegram.startChat('en')}
                  >
                    <Bot className="w-5 h-5 mr-2" />
                    {t('botContact.telegram.button')}
                  </Button>

                  <div className="text-xs text-blue-200 space-y-1">
                    <p>• {t('botContact.telegram.features.interactive')}</p>
                    <p>• {t('botContact.telegram.features.commands')}</p>
                    <p>• {t('botContact.telegram.features.richFormatting')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Common Features */}
          <div className="mt-12 text-center">
            <h4 className="text-2xl font-bold text-white mb-6">{t('botContact.common.title')}</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-3">
                  <Languages className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm text-blue-100">{t('botContact.common.features.languages')}</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-3">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm text-blue-100">{t('botContact.common.features.aiPowered')}</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-3">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm text-blue-100">{t('botContact.common.features.instant')}</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-3">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm text-blue-100">{t('botContact.common.features.secure')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-16 px-4 border-t dark:border-gray-800">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-lg">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold">{t('brandName')}</h4>
                  <p className="text-xs text-gray-400">{t('common.appSubtitle')}</p>
                </div>
              </div>
              <p className="text-gray-400 dark:text-gray-500 leading-relaxed">{t('footer.description')}</p>
            </div>

            <div>
              <h5 className="font-semibold mb-6 flex items-center">
                <Zap className="w-4 h-4 mr-2" />
                {t('footer.features')}
              </h5>
              <ul className="space-y-3 text-gray-400 dark:text-gray-500">
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 mr-2 text-green-400" />
                  {t('footer.items.languageSupport')}
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 mr-2 text-green-400" />
                  {t('footer.items.whatsappIntegration')}
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 mr-2 text-blue-400" />
                  {t('footer.items.telegramIntegration')}
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 mr-2 text-green-400" />
                  {t('footer.items.aiMatching')}
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 mr-2 text-green-400" />
                  {t('footer.items.realTimeUpdates')}
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-6 flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                {t('footer.languages')}
              </h5>
              <ul className="space-y-3 text-gray-400 dark:text-gray-500">
                <li>{t('footer.items.languageList')}</li>
                <li>{t('footer.items.languageList2')}</li>
                <li>{t('footer.items.languageList3')}</li>
                <li>{t('footer.items.moreLanguages')}</li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-6 flex items-center">
                <ExternalLink className="w-4 h-4 mr-2" />
                {t('footer.resources')}
              </h5>
              <ul className="space-y-3 text-gray-400 dark:text-gray-500">
                <li>
                  <a
                    href="https://myscheme.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center"
                  >
                    <Building2 className="w-3 h-3 mr-2" />
                    {t('footer.items.mySchemePortal')}
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/tosif121/schemesetu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center"
                  >
                    <ExternalLink className="w-3 h-3 mr-2" />
                    {t('footer.items.githubRepo')}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-800 dark:bg-gray-800 mb-8 w-full" />

        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 dark:text-gray-500">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <p>
                &copy; {new Date().getFullYear()} {t('brandName')}. {t('footer.copyright')}
              </p>
            </div>
            <div className="flex items-center space-x-4">{t('footer.tagline')}</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
