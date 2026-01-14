// WhatsApp client-side utilities for redirecting users to WhatsApp chat

// WhatsApp Business number from environment
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+917850006956'

// Generate WhatsApp URL with pre-filled message
export function generateWhatsAppURL(
  message: string = 'hi',
  language: string = 'en'
): string {
  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message)
  
  // Return WhatsApp URL
  return `https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${encodedMessage}`
}

// Specific message generators for different use cases
export const WhatsAppMessages = {
  // General scheme inquiry
  findSchemes: (language: string = 'en') => {
    return generateWhatsAppURL('hi', language)
  },

  // Check eligibility for specific scheme
  checkEligibility: (schemeName?: string, language: string = 'en') => {
    return generateWhatsAppURL('hi', language)
  },

  // Start general conversation
  startChat: (language: string = 'en') => {
    return generateWhatsAppURL('hi', language)
  },

  // Farmer specific
  farmerSchemes: (language: string = 'en') => {
    return generateWhatsAppURL('hi', language)
  },

  // Student specific
  studentSchemes: (language: string = 'en') => {
    return generateWhatsAppURL('hi', language)
  },

  // Women specific
  womenSchemes: (language: string = 'en') => {
    return generateWhatsAppURL('hi', language)
  },

  // Business/Entrepreneur specific
  businessSchemes: (language: string = 'en') => {
    return generateWhatsAppURL('hi', language)
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