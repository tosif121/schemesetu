'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';

const languages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'ta', name: 'Tamil', native: 'தমিழ்' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'ur', name: 'Urdu', native: 'اردو' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া' },
  { code: 'ks', name: 'Kashmiri', native: 'کٲشُر' },
  { code: 'mai', name: 'Maithili', native: 'मैथिली' },
];

interface LanguageSelectorProps {
  isScrolled?: boolean;
}

export function LanguageSelector({ isScrolled = false }: LanguageSelectorProps) {
  const { currentLanguage, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  const handleLanguageChange = (locale: string) => {
    console.log('Language selector: changing to', locale); // Debug log
    setLanguage(locale);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`transition-all duration-300 flex items-center space-x-2 min-w-[100px] ${
            isScrolled
              ? 'border-gray-300 text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800'
              : 'border-white text-white hover:bg-white hover:text-gray-900 backdrop-blur-sm bg-white/10'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline text-sm">{currentLang.native}</span>
          <span className="sm:hidden text-xs font-medium">{currentLang.code.toUpperCase()}</span>
          <ChevronDown className="w-3 h-3 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 max-h-80 overflow-y-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg"
      >
        <div className="p-2">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-2">
            {currentLanguage === 'hi' ? 'भाषा चुनें' : 
             currentLanguage === 'bn' ? 'ভাষা নির্বাচন করুন' :
             currentLanguage === 'ta' ? 'மொழியைத் தேர்ந்தெடுக்கவும்' :
             currentLanguage === 'te' ? 'భాషను ఎంచుకోండి' :
             currentLanguage === 'mr' ? 'भाषा निवडा' :
             currentLanguage === 'gu' ? 'ભાષા પસંદ કરો' :
             currentLanguage === 'kn' ? 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ' :
             currentLanguage === 'ml' ? 'ഭാഷ തിരഞ്ഞെടുക്കുക' :
             currentLanguage === 'pa' ? 'ਭਾਸ਼ਾ ਚੁਣੋ' :
             currentLanguage === 'or' ? 'ଭାଷା ବାଛନ୍ତୁ' :
             currentLanguage === 'as' ? 'ভাষা বাছক' :
             currentLanguage === 'ur' ? 'زبان منتخب کریں' :
             currentLanguage === 'ks' ? 'زبان ژأرو' :
             currentLanguage === 'mai' ? 'भाषा चुनू' :
             'Select Language'}
          </div>
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`flex items-center my-1.5 justify-between cursor-pointer rounded-md px-2 py-2 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors ${
                currentLanguage === language.code 
                  ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <div className="flex flex-col">
                <span className="font-medium text-sm">{language.native}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{language.name}</span>
              </div>
              {currentLanguage === language.code && (
                <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              )}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}