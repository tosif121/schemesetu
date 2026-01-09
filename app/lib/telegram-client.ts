// Telegram client-side utilities for redirecting users to Telegram bot

// Telegram bot username from environment
const TELEGRAM_BOT_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'SchemeSaathiBot'

// Welcome messages in different languages for Telegram
const TELEGRAM_WELCOME_MESSAGES = {
  en: `🇮🇳 Welcome to SchemeSaathi Bot! 

I'm your AI assistant for Indian government schemes. I can help you in 15+ Indian languages!

Please tell me:
• Your age
• Your state/location  
• Your occupation (farmer, student, business, etc.)
• Your income (optional)
• Any specific needs

Example: "I am 25 years old farmer from Maharashtra with annual income 2 lakh"

मैं आपकी हिंदी में भी मदद कर सकता हूं! 🙏

Use /start to begin or /help for more options.`,

  hi: `🇮🇳 स्कीमसाथी बॉट में आपका स्वागत है!

मैं भारतीय सरकारी योजनाओं के लिए आपका AI सहायक हूं। मैं 15+ भारतीय भाषाओं में आपकी मदद कर सकता हूं!

कृपया बताएं:
• आपकी उम्र
• आपका राज्य/स्थान
• आपका व्यवसाय (किसान, छात्र, व्यापार आदि)
• आपकी आय (वैकल्पिक)
• कोई विशेष आवश्यकता

उदाहरण: "मैं महाराष्ट्र का 25 साल का किसान हूं, सालाना 2 लाख कमाता हूं"

I can also help you in English! 🙏

शुरू करने के लिए /start या अधिक विकल्पों के लिए /help का उपयोग करें।`,

  ta: `🇮🇳 ஸ்கீம்சாத்தி பாட்டிற்கு வரவேற்கிறோம்!

நான் இந்திய அரசு திட்டங்களுக்கான உங்கள் AI உதவியாளர். நான் 15+ இந்திய மொழிகளில் உங்களுக்கு உதவ முடியும்!

தயவுசெய்து சொல்லுங்கள்:
• உங்கள் வயது
• உங்கள் மாநிலம்/இடம்
• உங்கள் தொழில் (விவசாயி, மாணவர், வணிகம் போன்றவை)
• உங்கள் வருமானம் (விருப்பம்)
• ஏதேனும் குறிப்பிட்ட தேவைகள்

உதாரணம்: "நான் தமிழ்நாட்டைச் சேர்ந்த 25 வயது விவசாயி, ஆண்டுக்கு 2 லட்சம் சம்பாதிக்கிறேன்"

I can also help you in English! 🙏

தொடங்க /start அல்லது மேலும் விருப்பங்களுக்கு /help ஐ பயன்படுத்தவும்.`,

  bn: `🇮🇳 স্কিমসাথী বটে স্বাগতম!

আমি ভারতীয় সরকারি প্রকল্পের জন্য আপনার AI সহায়ক। আমি ১৫+ ভারতীয় ভাষায় আপনাকে সাহায্য করতে পারি!

দয়া করে বলুন:
• আপনার বয়স
• আপনার রাজ্য/অবস্থান
• আপনার পেশা (কৃষক, ছাত্র, ব্যবসা ইত্যাদি)
• আপনার আয় (ঐচ্ছিক)
• কোন বিশেষ প্রয়োজন

উদাহরণ: "আমি পশ্চিমবঙ্গের ২৫ বছর বয়সী কৃষক, বছরে ২ লক্ষ আয় করি"

I can also help you in English! 🙏

শুরু করতে /start বা আরও বিকল্পের জন্য /help ব্যবহার করুন।`
}

// Generate Telegram bot URL with pre-filled message
export function generateTelegramURL(
  message: string = '',
  startParameter?: string
): string {
  let url = `https://t.me/${TELEGRAM_BOT_USERNAME}`
  
  if (startParameter) {
    url += `?start=${startParameter}`
  } else if (message) {
    // For direct messages, we can't pre-fill in Telegram like WhatsApp
    // But we can use deep linking with start parameters
    const encodedMessage = encodeURIComponent(message.substring(0, 64)) // Telegram start parameter limit
    url += `?start=${encodedMessage}`
  }
  
  return url
}

// Specific message generators for different use cases
export const TelegramMessages = {
  // General scheme inquiry
  findSchemes: (language: string = 'en') => {
    return generateTelegramURL('', 'find_schemes')
  },

  // Check eligibility for specific scheme
  checkEligibility: (schemeName?: string, language: string = 'en') => {
    const param = schemeName ? `check_${schemeName}` : 'check_eligibility'
    return generateTelegramURL('', param)
  },

  // Start general conversation
  startChat: (language: string = 'en') => {
    return generateTelegramURL('', `start_${language}`)
  },

  // Farmer specific
  farmerSchemes: (language: string = 'en') => {
    return generateTelegramURL('', 'farmer_schemes')
  },

  // Student specific
  studentSchemes: (language: string = 'en') => {
    return generateTelegramURL('', 'student_schemes')
  },

  // Women specific
  womenSchemes: (language: string = 'en') => {
    return generateTelegramURL('', 'women_schemes')
  },

  // Business/Entrepreneur specific
  businessSchemes: (language: string = 'en') => {
    return generateTelegramURL('', 'business_schemes')
  },

  // Language selection
  selectLanguage: (language: string = 'en') => {
    return generateTelegramURL('', `lang_${language}`)
  }
}

// Utility to open Telegram in new tab/window
export function openTelegram(url: string) {
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

// React hook for Telegram integration
export function useTelegram() {
  const startChat = (language: string = 'en') => {
    const url = TelegramMessages.startChat(language)
    openTelegram(url)
  }

  const findSchemes = (language: string = 'en') => {
    const url = TelegramMessages.findSchemes(language)
    openTelegram(url)
  }

  const checkEligibility = (schemeName?: string, language: string = 'en') => {
    const url = TelegramMessages.checkEligibility(schemeName, language)
    openTelegram(url)
  }

  const openFarmerSchemes = (language: string = 'en') => {
    const url = TelegramMessages.farmerSchemes(language)
    openTelegram(url)
  }

  const openStudentSchemes = (language: string = 'en') => {
    const url = TelegramMessages.studentSchemes(language)
    openTelegram(url)
  }

  const openWomenSchemes = (language: string = 'en') => {
    const url = TelegramMessages.womenSchemes(language)
    openTelegram(url)
  }

  const openBusinessSchemes = (language: string = 'en') => {
    const url = TelegramMessages.businessSchemes(language)
    openTelegram(url)
  }

  const selectLanguage = (language: string = 'en') => {
    const url = TelegramMessages.selectLanguage(language)
    openTelegram(url)
  }

  return {
    startChat,
    findSchemes,
    checkEligibility,
    openFarmerSchemes,
    openStudentSchemes,
    openWomenSchemes,
    openBusinessSchemes,
    selectLanguage
  }
}

// Get welcome message for specific language
export function getTelegramWelcomeMessage(language: string = 'en'): string {
  return TELEGRAM_WELCOME_MESSAGES[language as keyof typeof TELEGRAM_WELCOME_MESSAGES] || TELEGRAM_WELCOME_MESSAGES.en
}

// Create Telegram bot link with custom text
export function createTelegramBotLink(text: string = 'Open in Telegram'): string {
  return `<a href="${generateTelegramURL()}" target="_blank" rel="noopener noreferrer">${text}</a>`
}