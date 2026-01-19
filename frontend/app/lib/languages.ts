// Comprehensive language support for all major Indian languages

export const SUPPORTED_LANGUAGES = {
  // Official languages of India (22 languages in 8th Schedule)
  'hi': {
    name: 'Hindi',
    nativeName: 'हिंदी',
    script: 'Devanagari',
    speakers: 600000000,
    states: ['Bihar', 'Chhattisgarh', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Madhya Pradesh', 'Rajasthan', 'Uttar Pradesh', 'Uttarakhand', 'Delhi'] as string[]
  },
  'en': {
    name: 'English',
    nativeName: 'English',
    script: 'Latin',
    speakers: 125000000,
    states: ['All India'] as string[]
  },
  'ta': {
    name: 'Tamil',
    nativeName: 'தமிழ்',
    script: 'Tamil',
    speakers: 75000000,
    states: ['Tamil Nadu', 'Puducherry'] as string[]
  },
  'bn': {
    name: 'Bengali',
    nativeName: 'বাংলা',
    script: 'Bengali',
    speakers: 97000000,
    states: ['West Bengal', 'Tripura'] as string[]
  },
  'te': {
    name: 'Telugu',
    nativeName: 'తెలుగు',
    script: 'Telugu',
    speakers: 81000000,
    states: ['Andhra Pradesh', 'Telangana'] as string[]
  },
  'mr': {
    name: 'Marathi',
    nativeName: 'मराठी',
    script: 'Devanagari',
    speakers: 83000000,
    states: ['Maharashtra', 'Goa'] as string[]
  },
  'gu': {
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    script: 'Gujarati',
    speakers: 56000000,
    states: ['Gujarat', 'Dadra and Nagar Haveli and Daman and Diu'] as string[]
  },
  'kn': {
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    script: 'Kannada',
    speakers: 44000000,
    states: ['Karnataka'] as string[]
  },
  'ml': {
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    script: 'Malayalam',
    speakers: 35000000,
    states: ['Kerala', 'Lakshadweep'] as string[]
  },
  'pa': {
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    script: 'Gurmukhi',
    speakers: 33000000,
    states: ['Punjab', 'Chandigarh'] as string[]
  },
  'or': {
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    script: 'Odia',
    speakers: 38000000,
    states: ['Odisha'] as string[]
  },
  'as': {
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    script: 'Bengali',
    speakers: 15000000,
    states: ['Assam'] as string[]
  },
  'ur': {
    name: 'Urdu',
    nativeName: 'اردو',
    script: 'Arabic',
    speakers: 52000000,
    states: ['Jammu and Kashmir', 'Delhi', 'Uttar Pradesh', 'Bihar', 'Telangana'] as string[]
  },
  'sa': {
    name: 'Sanskrit',
    nativeName: 'संस्कृत',
    script: 'Devanagari',
    speakers: 25000,
    states: ['Uttarakhand'] as string[]
  },
  'ne': {
    name: 'Nepali',
    nativeName: 'नेपाली',
    script: 'Devanagari',
    speakers: 2900000,
    states: ['Sikkim', 'West Bengal'] as string[]
  },
  'si': {
    name: 'Sinhala',
    nativeName: 'සිංහල',
    script: 'Sinhala',
    speakers: 16000000,
    states: ['Sri Lanka'] as string[] // Note: Not an Indian state, but supported for diaspora
  },
  'my': {
    name: 'Myanmar',
    nativeName: 'မြန်မာ',
    script: 'Myanmar',
    speakers: 33000000,
    states: ['Myanmar'] as string[] // Note: Not an Indian state, but supported for diaspora
  },
  'ks': {
    name: 'Kashmiri',
    nativeName: 'कॉशुर',
    script: 'Devanagari',
    speakers: 7000000,
    states: ['Jammu and Kashmir'] as string[]
  },
  'sd': {
    name: 'Sindhi',
    nativeName: 'سنڌي',
    script: 'Arabic',
    speakers: 2700000,
    states: ['Gujarat', 'Maharashtra', 'Rajasthan'] as string[]
  },
  'kok': {
    name: 'Konkani',
    nativeName: 'कोंकणी',
    script: 'Devanagari',
    speakers: 2300000,
    states: ['Goa', 'Karnataka', 'Kerala', 'Maharashtra'] as string[]
  },
  'mni': {
    name: 'Manipuri',
    nativeName: 'মৈতৈলোন্',
    script: 'Bengali',
    speakers: 1800000,
    states: ['Manipur'] as string[]
  },
  'doi': {
    name: 'Dogri',
    nativeName: 'डोगरी',
    script: 'Devanagari',
    speakers: 2600000,
    states: ['Jammu and Kashmir'] as string[]
  },
  'sat': {
    name: 'Santali',
    nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ',
    script: 'Ol Chiki',
    speakers: 7400000,
    states: ['Jharkhand', 'West Bengal', 'Odisha', 'Bihar'] as string[]
  },
  'bo': {
    name: 'Tibetan',
    nativeName: 'བོད་སྐད་',
    script: 'Tibetan',
    speakers: 150000,
    states: ['Ladakh', 'Himachal Pradesh', 'Sikkim', 'Arunachal Pradesh'] as string[]
  }
} as const

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES

// Language detection patterns for better accuracy
export const LANGUAGE_PATTERNS = {
  'hi': /[\u0900-\u097F]/,  // Devanagari
  'ta': /[\u0B80-\u0BFF]/,  // Tamil
  'bn': /[\u0980-\u09FF]/,  // Bengali
  'te': /[\u0C00-\u0C7F]/,  // Telugu
  'mr': /[\u0900-\u097F]/,  // Marathi (Devanagari)
  'gu': /[\u0A80-\u0AFF]/,  // Gujarati
  'kn': /[\u0C80-\u0CFF]/,  // Kannada
  'ml': /[\u0D00-\u0D7F]/,  // Malayalam
  'pa': /[\u0A00-\u0A7F]/,  // Punjabi (Gurmukhi)
  'or': /[\u0B00-\u0B7F]/,  // Odia
  'as': /[\u0980-\u09FF]/,  // Assamese (Bengali script)
  'ur': /[\u0600-\u06FF]/,  // Urdu (Arabic script)
  'sa': /[\u0900-\u097F]/,  // Sanskrit (Devanagari)
  'ne': /[\u0900-\u097F]/,  // Nepali (Devanagari)
  'si': /[\u0D80-\u0DFF]/,  // Sinhala
  'my': /[\u1000-\u109F]/,  // Myanmar
  'ks': /[\u0900-\u097F]/,  // Kashmiri (Devanagari)
  'sd': /[\u0600-\u06FF]/,  // Sindhi (Arabic script)
  'kok': /[\u0900-\u097F]/, // Konkani (Devanagari)
  'mni': /[\u0980-\u09FF]/, // Manipuri (Bengali script)
  'doi': /[\u0900-\u097F]/, // Dogri (Devanagari)
  'sat': /[\u1C50-\u1C7F]/, // Santali (Ol Chiki)
  'bo': /[\u0F00-\u0FFF]/   // Tibetan
}

// Common greetings in different languages for better detection
export const LANGUAGE_GREETINGS = {
  'hi': ['नमस्ते', 'नमस्कार', 'हैलो', 'हाय', 'प्रणाम'],
  'ta': ['வணக்கம்', 'ஹலோ', 'வாங்க'],
  'bn': ['নমস্কার', 'হ্যালো', 'আদাব', 'সালাম'],
  'te': ['నమస్కారం', 'హలో', 'వచ్చినందుకు స్వాగతం'],
  'mr': ['नमस्कार', 'हॅलो', 'नमस्ते'],
  'gu': ['નમસ્તે', 'હેલો', 'આદાબ'],
  'kn': ['ನಮಸ್ಕಾರ', 'ಹಲೋ', 'ವಂದನೆಗಳು'],
  'ml': ['നമസ്കാരം', 'ഹലോ', 'വണക്കം'],
  'pa': ['ਸਤ ਸ੍ਰੀ ਅਕਾਲ', 'ਨਮਸਕਾਰ', 'ਹੈਲੋ'],
  'or': ['ନମସ୍କାର', 'ହେଲୋ', 'ଆଦାବ'],
  'as': ['নমস্কাৰ', 'হেল্লো', 'আদাব'],
  'ur': ['السلام علیکم', 'آداب', 'ہیلو', 'نمسکار'],
  'sa': ['नमस्ते', 'नमस्कार', 'प्रणाम'],
  'ne': ['नमस्ते', 'नमस्कार', 'हेलो'],
  'ks': ['आदाब', 'नमस्ते', 'सलाम'],
  'sd': ['آداب', 'سلام', 'نمسته'],
  'kok': ['नमस्कार', 'देव बरें करूं'],
  'mni': ['খুরুমজরী', 'নমস্কার'],
  'doi': ['नमस्ते', 'सत श्री अकाल'],
  'sat': ['ᱡᱚᱦᱟᱨ', 'ᱱᱚᱢᱚᱥᱠᱟᱨ'],
  'bo': ['བཀྲ་ཤིས་བདེ་ལེགས།', 'ཐུགས་རྗེ་ཆེ།']
}

// Get language name in native script
export function getLanguageName(code: SupportedLanguage, inNative: boolean = false): string {
  const lang = SUPPORTED_LANGUAGES[code]
  return inNative ? lang.nativeName : lang.name
}

// Get all languages for a specific state
export function getLanguagesForState(state: string): SupportedLanguage[] {
  return Object.entries(SUPPORTED_LANGUAGES)
    .filter(([_, lang]) => {
      const states = lang.states as string[]
      return states.includes(state) || states.includes('All India')
    })
    .map(([code]) => code) as SupportedLanguage[]
}

// Detect language from text using patterns and common words
export function detectLanguageFromText(text: string): SupportedLanguage {
  const lowerText = text.toLowerCase()
  
  // Check for greetings first
  for (const [lang, greetings] of Object.entries(LANGUAGE_GREETINGS)) {
    if (greetings.some(greeting => text.includes(greeting))) {
      return lang as SupportedLanguage
    }
  }
  
  // Check for script patterns
  for (const [lang, pattern] of Object.entries(LANGUAGE_PATTERNS)) {
    if (pattern.test(text)) {
      return lang as SupportedLanguage
    }
  }
  
  // Check for common English words
  const englishWords = ['i', 'am', 'is', 'are', 'the', 'and', 'or', 'but', 'year', 'old', 'from', 'income', 'farmer', 'student']
  if (englishWords.some(word => lowerText.includes(word))) {
    return 'en'
  }
  
  // Default to English if no pattern matches
  return 'en'
}

// Get fallback languages for a given language (for error messages)
export function getFallbackLanguages(primaryLang: SupportedLanguage): SupportedLanguage[] {
  const fallbacks: Record<SupportedLanguage, SupportedLanguage[]> = {
    'hi': ['en'],
    'en': ['hi'],
    'ta': ['en', 'hi'],
    'bn': ['en', 'hi'],
    'te': ['en', 'hi'],
    'mr': ['hi', 'en'],
    'gu': ['hi', 'en'],
    'kn': ['en', 'hi'],
    'ml': ['en', 'hi'],
    'pa': ['hi', 'en'],
    'or': ['en', 'hi'],
    'as': ['bn', 'en', 'hi'],
    'ur': ['hi', 'en'],
    'sa': ['hi', 'en'],
    'ne': ['hi', 'en'],
    'si': ['en'],
    'my': ['en'],
    'ks': ['ur', 'hi', 'en'],
    'sd': ['ur', 'hi', 'en'],
    'kok': ['mr', 'hi', 'en'],
    'mni': ['bn', 'en', 'hi'],
    'doi': ['hi', 'pa', 'en'],
    'sat': ['hi', 'bn', 'en'],
    'bo': ['en', 'hi']
  }
  
  return fallbacks[primaryLang] || ['en']
}

// Check if a language is RTL (Right-to-Left)
export function isRTL(lang: SupportedLanguage): boolean {
  return ['ur', 'sd'].includes(lang)
}

// Get appropriate font family for a language
export function getFontFamily(lang: SupportedLanguage): string {
  const fontMap: Record<SupportedLanguage, string> = {
    'hi': 'Noto Sans Devanagari, system-ui',
    'en': 'system-ui, -apple-system, sans-serif',
    'ta': 'Noto Sans Tamil, system-ui',
    'bn': 'Noto Sans Bengali, system-ui',
    'te': 'Noto Sans Telugu, system-ui',
    'mr': 'Noto Sans Devanagari, system-ui',
    'gu': 'Noto Sans Gujarati, system-ui',
    'kn': 'Noto Sans Kannada, system-ui',
    'ml': 'Noto Sans Malayalam, system-ui',
    'pa': 'Noto Sans Gurmukhi, system-ui',
    'or': 'Noto Sans Oriya, system-ui',
    'as': 'Noto Sans Bengali, system-ui',
    'ur': 'Noto Nastaliq Urdu, system-ui',
    'sa': 'Noto Sans Devanagari, system-ui',
    'ne': 'Noto Sans Devanagari, system-ui',
    'si': 'Noto Sans Sinhala, system-ui',
    'my': 'Noto Sans Myanmar, system-ui',
    'ks': 'Noto Sans Devanagari, system-ui',
    'sd': 'Noto Sans Arabic, system-ui',
    'kok': 'Noto Sans Devanagari, system-ui',
    'mni': 'Noto Sans Bengali, system-ui',
    'doi': 'Noto Sans Devanagari, system-ui',
    'sat': 'Noto Sans Ol Chiki, system-ui',
    'bo': 'Noto Sans Tibetan, system-ui'
  }
  
  return fontMap[lang] || 'system-ui, -apple-system, sans-serif'
}