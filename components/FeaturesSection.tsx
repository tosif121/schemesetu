'use client';

import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/app/context/LanguageContext';
import { Bot, MessageCircle, Target, Database, History, BarChart3 } from 'lucide-react';

export function FeaturesSection() {
  const { t } = useLanguage();

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

  return (
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
  );
}