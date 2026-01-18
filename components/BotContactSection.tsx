'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useWhatsApp } from '@/app/lib/whatsapp-client';
import { useTelegram } from '@/app/lib/telegram-client';
import { useLanguage } from '@/app/context/LanguageContext';
import { 
  Bot, 
  MessageCircle, 
  Phone, 
  Languages, 
  Target, 
  Clock, 
  Shield 
} from 'lucide-react';

export function BotContactSection() {
  const whatsapp = useWhatsApp();
  const telegram = useTelegram();
  const { t } = useLanguage();

  return (
    <section className="py-16 md:py-24 bg-linear-to-br from-[#4299eb] to-blue-600 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <Badge className="mb-6 bg-white/20 text-white border-0 hover:bg-white/20 px-4 py-2 text-sm font-semibold">
            <Bot className="mr-2 h-4 w-4" />
            {t('botContact.badge')}
          </Badge>
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">{t('botContact.title')}</h3>
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
  );
}