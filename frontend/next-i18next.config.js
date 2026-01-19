module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: [
      'en',    // English
      'hi',    // Hindi
      'bn',    // Bengali
      'te',    // Telugu
      'mr',    // Marathi
      'ta',    // Tamil
      'gu',    // Gujarati
      'ur',    // Urdu
      'kn',    // Kannada
      'ml',    // Malayalam
      'pa',    // Punjabi
      'or',    // Odia
      'as',    // Assamese
      'ks',    // Kashmiri
      'mai',   // Maithili
    ],
  },
  fallbackLng: 'en',
  debug: false,
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  
  // Namespace configuration
  ns: ['common', 'home'],
  defaultNS: 'common',
  
  // Load path for translation files
  backend: {
    loadPath: '/locales/{{lng}}/{{ns}}.json',
  },
  
  // Interpolation options
  interpolation: {
    escapeValue: false,
  },
  
  // React options
  react: {
    useSuspense: false,
  },
}