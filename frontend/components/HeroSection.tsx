'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWhatsApp } from '@/app/lib/whatsapp-client';
import { useTelegram } from '@/app/lib/telegram-client';
import { useLanguage } from '@/app/context/LanguageContext';
import { Shield } from 'lucide-react';

export function HeroSection() {
  const whatsapp = useWhatsApp();
  const telegram = useTelegram();
  const { t } = useLanguage();

  return (
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
  );
}