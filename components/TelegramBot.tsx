'use client'

import { useState } from 'react'
import { useTelegram } from '@/app/lib/telegram-client'
import { useLanguage } from '@/app/Context/LanguageContext'

interface TelegramBotProps {
  className?: string
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
}

export default function TelegramBot({ 
  className = '', 
  variant = 'primary',
  size = 'md',
  showIcon = true 
}: TelegramBotProps) {
  const { t, currentLanguage } = useLanguage()
  const { startChat } = useTelegram()
  const [isLoading, setIsLoading] = useState(false)

  const handleTelegramClick = async () => {
    setIsLoading(true)
    try {
      startChat(currentLanguage)
    } catch (error) {
      console.error('Error opening Telegram:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background'
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700',
    outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950'
  }
  
  const sizeClasses = {
    sm: 'h-9 px-3 text-sm rounded-md',
    md: 'h-10 px-4 py-2 rounded-md',
    lg: 'h-11 px-8 rounded-md text-lg'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <button
      onClick={handleTelegramClick}
      disabled={isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      aria-label={t('telegram.startChat')}
    >
      {showIcon && (
        <svg 
          className={`${iconSizes[size]} ${size !== 'sm' ? 'mr-2' : ''}`}
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      )}
      {size !== 'sm' && (
        <span>
          {isLoading ? t('telegram.connecting') : t('telegram.startChat')}
        </span>
      )}
    </button>
  )
}

// Quick action buttons for different use cases
export function TelegramFarmerButton({ className = '' }: { className?: string }) {
  const { t, currentLanguage } = useLanguage()
  const { openFarmerSchemes } = useTelegram()

  return (
    <button
      onClick={() => openFarmerSchemes(currentLanguage)}
      className={`inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors ${className}`}
    >
      <span className="mr-2">🌾</span>
      {t('telegram.farmerSchemes')}
    </button>
  )
}

export function TelegramStudentButton({ className = '' }: { className?: string }) {
  const { t, currentLanguage } = useLanguage()
  const { openStudentSchemes } = useTelegram()

  return (
    <button
      onClick={() => openStudentSchemes(currentLanguage)}
      className={`inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${className}`}
    >
      <span className="mr-2">🎓</span>
      {t('telegram.studentSchemes')}
    </button>
  )
}

export function TelegramWomenButton({ className = '' }: { className?: string }) {
  const { t, currentLanguage } = useLanguage()
  const { openWomenSchemes } = useTelegram()

  return (
    <button
      onClick={() => openWomenSchemes(currentLanguage)}
      className={`inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors ${className}`}
    >
      <span className="mr-2">👩</span>
      {t('telegram.womenSchemes')}
    </button>
  )
}

export function TelegramBusinessButton({ className = '' }: { className?: string }) {
  const { t, currentLanguage } = useLanguage()
  const { openBusinessSchemes } = useTelegram()

  return (
    <button
      onClick={() => openBusinessSchemes(currentLanguage)}
      className={`inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors ${className}`}
    >
      <span className="mr-2">💼</span>
      {t('telegram.businessSchemes')}
    </button>
  )
}