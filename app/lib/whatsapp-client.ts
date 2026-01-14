// WhatsApp client-side utilities for redirecting users to WhatsApp chat

// WhatsApp Business number from environment
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+917850006956'

// Welcome messages in different languages
const WELCOME_MESSAGES = {
  en: `🇮🇳 Welcome to SchemeSaathi! 

I'm your AI assistant for Indian government schemes. I can help you in 24+ Indian languages!

Please tell me:
• Your age
• Your state/location  
• Your occupation (farmer, student, business, etc.)
• Your income (optional)
• Any specific needs

Example: "I am 25 years old farmer from Maharashtra with annual income 2 lakh"

मैं आपकी हिंदी में भी मदद कर सकता हूं! 🙏`,

  hi: `🇮🇳 स्कीमसाथी में आपका स्वागत है!

मैं भारतीय सरकारी योजनाओं के लिए आपका AI सहायक हूं। मैं 24+ भारतीय भाषाओं में आपकी मदद कर सकता हूं!

कृपया बताएं:
• आपकी उम्र
• आपका राज्य/स्थान
• आपका व्यवसाय (किसान, छात्र, व्यापार आदि)
• आपकी आय (वैकल्पिक)
• कोई विशेष आवश्यकता

उदाहरण: "मैं महाराष्ट्र का 25 साल का किसान हूं, सालाना 2 लाख कमाता हूं"

I can also help you in English! 🙏`,

  ta: `🇮🇳 ஸ்கீம்சாத்திக்கு வரவேற்கிறோம்!

நான் இந்திய அரசு திட்டங்களுக்கான உங்கள் AI உதவியாளர். நான் 24+ இந்திய மொழிகளில் உங்களுக்கு உதவ முடியும்!

தயவுசெய்து சொல்லுங்கள்:
• உங்கள் வயது
• உங்கள் மாநிலம்/இடம்
• உங்கள் தொழில் (விவசாயி, மாணவர், வணிகம் போன்றவை)
• உங்கள் வருமானம் (விருப்பம்)
• ஏதேனும் குறிப்பிட்ட தேவைகள்

உதாரணம்: "நான் தமிழ்நாட்டைச் சேர்ந்த 25 வயது விவசாயி, ஆண்டுக்கு 2 லட்சம் சம்பாதிக்கிறேன்"

I can also help you in English! 🙏`,

  bn: `🇮🇳 স্কিমসাথীতে স্বাগতম!

আমি ভারতীয় সরকারি প্রকল্পের জন্য আপনার AI সহায়ক। আমি ২৪+ ভারতীয় ভাষায় আপনাকে সাহায্য করতে পারি!

দয়া করে বলুন:
• আপনার বয়স
• আপনার রাজ্য/অবস্থান
• আপনার পেশা (কৃষক, ছাত্র, ব্যবসা ইত্যাদি)
• আপনার আয় (ঐচ্ছিক)
• কোন বিশেষ প্রয়োজন

উদাহরণ: "আমি পশ্চিমবঙ্গের ২৫ বছর বয়সী কৃষক, বছরে ২ লক্ষ আয় করি"

I can also help you in English! 🙏`
}

// Generate WhatsApp URL with pre-filled message
export function generateWhatsAppURL(
  message: string = WELCOME_MESSAGES.en,
  language: string = 'en'
): string {
  // Use language-specific welcome message if available
  const welcomeMessage = WELCOME_MESSAGES[language as keyof typeof WELCOME_MESSAGES] || WELCOME_MESSAGES.en
  
  // Combine custom message with welcome message if provided
  const finalMessage = message === WELCOME_MESSAGES.en ? welcomeMessage : `${message}\n\n${welcomeMessage}`
  
  // Encode the message for URL
  const encodedMessage = encodeURIComponent(finalMessage)
  
  // Return WhatsApp URL
  return `https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${encodedMessage}`
}

// Specific message generators for different use cases
export const WhatsAppMessages = {
  // General scheme inquiry
  findSchemes: (language: string = 'en') => {
    const messages = {
      en: "🔍 I want to find government schemes I'm eligible for",
      hi: "🔍 मैं उन सरकारी योजनाओं को खोजना चाहता हूं जिनके लिए मैं पात्र हूं",
      ta: "🔍 நான் தகுதியான அரசு திட்டங்களைக் கண்டறிய விரும்புகிறேன்",
      bn: "🔍 আমি যোগ্য সরকারি প্রকল্প খুঁজে পেতে চাই"
    }
    return generateWhatsAppURL(messages[language as keyof typeof messages] || messages.en, language)
  },

  // Check eligibility for specific scheme
  checkEligibility: (schemeName?: string, language: string = 'en') => {
    const messages = {
      en: schemeName 
        ? `✅ I want to check my eligibility for ${schemeName}` 
        : "✅ I want to check my eligibility for government schemes",
      hi: schemeName 
        ? `✅ मैं ${schemeName} के लिए अपनी पात्रता जांचना चाहता हूं`
        : "✅ मैं सरकारी योजनाओं के लिए अपनी पात्रता जांचना चाहता हूं",
      ta: schemeName 
        ? `✅ ${schemeName} க்கான எனது தகுதியை சரிபார்க்க விரும்புகிறேன்`
        : "✅ அரசு திட்டங்களுக்கான எனது தகுதியை சரிபார்க்க விரும்புகிறேன்",
      bn: schemeName 
        ? `✅ আমি ${schemeName} এর জন্য আমার যোগ্যতা পরীক্ষা করতে চাই`
        : "✅ আমি সরকারি প্রকল্পের জন্য আমার যোগ্যতা পরীক্ষা করতে চাই"
    }
    return generateWhatsAppURL(messages[language as keyof typeof messages] || messages.en, language)
  },

  // Start general conversation
  startChat: (language: string = 'en') => {
    const messages = {
      en: "hi",
      hi: "hi",
      ta: "hi",
      bn: "hi"
    }
    return generateWhatsAppURL(messages[language as keyof typeof messages] || messages.en, language)
  },

  // Farmer specific
  farmerSchemes: (language: string = 'en') => {
    const messages = {
      en: "🌾 I am a farmer looking for agricultural schemes and subsidies",
      hi: "🌾 मैं एक किसान हूं और कृषि योजनाओं और सब्सिडी की तलाश में हूं",
      ta: "🌾 நான் ஒரு விவசாயி, விவசாய திட்டங்கள் மற்றும் மானியங்களைத் தேடுகிறேன்",
      bn: "🌾 আমি একজন কৃষক এবং কৃষি প্রকল্প ও ভর্তুকি খুঁজছি"
    }
    return generateWhatsAppURL(messages[language as keyof typeof messages] || messages.en, language)
  },

  // Student specific
  studentSchemes: (language: string = 'en') => {
    const messages = {
      en: "🎓 I am a student looking for scholarships and educational schemes",
      hi: "🎓 मैं एक छात्र हूं और छात्रवृत्ति और शैक्षिक योजनाओं की तलाश में हूं",
      ta: "🎓 நான் ஒரு மாணவர், உதவித்தொகை மற்றும் கல்வித் திட்டங்களைத் தேடுகிறேன்",
      bn: "🎓 আমি একজন ছাত্র এবং বৃত্তি ও শিক্ষা প্রকল্প খুঁজছি"
    }
    return generateWhatsAppURL(messages[language as keyof typeof messages] || messages.en, language)
  },

  // Women specific
  womenSchemes: (language: string = 'en') => {
    const messages = {
      en: "👩 I am looking for schemes specifically for women empowerment",
      hi: "👩 मैं महिला सशक्तिकरण के लिए विशेष योजनाओं की तलाश में हूं",
      ta: "👩 நான் பெண்கள் அதிகாரமளிப்புக்கான சிறப்பு திட்டங்களைத் தேடுகிறேன்",
      bn: "👩 আমি নারী ক্ষমতায়নের জন্য বিশেষ প্রকল্প খুঁজছি"
    }
    return generateWhatsAppURL(messages[language as keyof typeof messages] || messages.en, language)
  },

  // Business/Entrepreneur specific
  businessSchemes: (language: string = 'en') => {
    const messages = {
      en: "💼 I am an entrepreneur looking for business loans and startup schemes",
      hi: "💼 मैं एक उद्यमी हूं और व्यापारिक ऋण और स्टार्टअप योजनाओं की तलाश में हूं",
      ta: "💼 நான் ஒரு தொழில்முனைவோர், வணிகக் கடன் மற்றும் ஸ்டார்ட்அப் திட்டங்களைத் தேடுகிறேன்",
      bn: "💼 আমি একজন উদ্যোক্তা এবং ব্যবসায়িক ঋণ ও স্টার্টআপ প্রকল্প খুঁজছি"
    }
    return generateWhatsAppURL(messages[language as keyof typeof messages] || messages.en, language)
  }
}

// Utility to open WhatsApp in new tab/window
export function openWhatsApp(url: string) {
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

// React hook for WhatsApp integration
export function useWhatsApp() {
  const startChat = (language: string = 'en') => {
    const url = WhatsAppMessages.startChat(language)
    openWhatsApp(url)
  }

  const findSchemes = (language: string = 'en') => {
    const url = WhatsAppMessages.findSchemes(language)
    openWhatsApp(url)
  }

  const checkEligibility = (schemeName?: string, language: string = 'en') => {
    const url = WhatsAppMessages.checkEligibility(schemeName, language)
    openWhatsApp(url)
  }

  const openFarmerSchemes = (language: string = 'en') => {
    const url = WhatsAppMessages.farmerSchemes(language)
    openWhatsApp(url)
  }

  const openStudentSchemes = (language: string = 'en') => {
    const url = WhatsAppMessages.studentSchemes(language)
    openWhatsApp(url)
  }

  const openWomenSchemes = (language: string = 'en') => {
    const url = WhatsAppMessages.womenSchemes(language)
    openWhatsApp(url)
  }

  const openBusinessSchemes = (language: string = 'en') => {
    const url = WhatsAppMessages.businessSchemes(language)
    openWhatsApp(url)
  }

  return {
    startChat,
    findSchemes,
    checkEligibility,
    openFarmerSchemes,
    openStudentSchemes,
    openWomenSchemes,
    openBusinessSchemes
  }
}