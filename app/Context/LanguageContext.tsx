'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Translation type
interface Translations {
  [key: string]: any;
}

// Language context type
interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  t: (key: string, params?: Record<string, string>) => string;
  translations: Translations;
}

// Create context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Available languages - All 15 Indian languages
export const availableLanguages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'ur', name: 'Urdu', native: 'اردو' },
  { code: 'ks', name: 'Kashmiri', native: 'کٲشُر' },
  { code: 'mai', name: 'Maithili', native: 'मैथिली' },
];

// Language provider component
interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [translations, setTranslations] = useState<Translations>({});

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  const setLanguage = async (lang: string) => {
    setCurrentLanguage(lang);
    
    try {
      // Try to load translations from JSON file
      const response = await fetch(`/locales/${lang}/common.json`);
      if (response.ok) {
        const loadedTranslations = await response.json();
        setTranslations(loadedTranslations);
      } else {
        // Fallback to Hindi, then English
        const fallbackLang = lang !== 'hi' ? 'hi' : 'en';
        const fallbackResponse = await fetch(`/locales/${fallbackLang}/common.json`);
        if (fallbackResponse.ok) {
          const fallbackTranslations = await fallbackResponse.json();
          setTranslations(fallbackTranslations);
        }
      }
    } catch (error) {
      console.error('Error loading translations:', error);
      // Set empty translations as fallback
      setTranslations({});
    }
    
    localStorage.setItem('preferred-language', lang);
  };

  // Translation function with parameter substitution and enhanced fallback
  const t = (key: string, params?: Record<string, string>): string => {
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (typeof value !== 'string') {
      return key; // Return key if translation not found
    }
    
    // Replace parameters
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match: string, paramKey: string) => {
        return params[paramKey] || match;
      });
    }
    
    return value;
  };

  const contextValue: LanguageContextType = {
    currentLanguage,
    setLanguage,
    t,
    translations
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook to use language context
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}