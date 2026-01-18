'use client';

import { useLanguage } from '@/app/context/LanguageContext';
import { Languages, Building2, MapPin, Clock } from 'lucide-react';

export function StatsSection() {
  const { t } = useLanguage();

  const stats = [
    { label: t('stats.languages'), value: '15+', icon: Languages },
    { label: t('stats.schemes'), value: '500+', icon: Building2 },
    { label: t('stats.states'), value: '28+', icon: MapPin },
    { label: t('stats.responseTime'), value: '<3s', icon: Clock },
  ];

  return (
    <section className="py-12 bg-white dark:bg-gray-950 dark:border-gray-800">
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
  );
}