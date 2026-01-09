import { extractEligibility, generateResponse, detectLanguage } from './gemini'
import { getOrCreateUser, updateUserEligibility, addConversationMessage } from './supabase'
import { EligibilityCriteria } from './types'

// Mock schemes data - in production this would come from a database or API
const MOCK_SCHEMES = [
  {
    id: 'pm-kisan',
    name: 'PM-KISAN',
    nameHi: 'पीएम-किसान',
    nameTa: 'பிஎம்-கிசான்',
    nameBn: 'পিএম-কিষাণ',
    category: 'farmer',
    description: 'Direct income support to farmers',
    descriptionHi: 'किसानों को प्रत्यक्ष आय सहायता',
    descriptionTa: 'விவசாயிகளுக்கு நேரடி வருமான ஆதரவு',
    descriptionBn: 'কৃষকদের প্রত্যক্ষ আয় সহায়তা',
    benefits: '₹6,000 per year in 3 installments',
    benefitsHi: 'वर्ष में ₹6,000 तीन किस्तों में',
    benefitsTa: 'ஆண்டுக்கு ₹6,000 மூன்று தவணைகளில்',
    benefitsBn: 'বছরে ₹6,000 তিন কিস্তিতে',
    eligibility: {
      occupation: ['farmer'],
      landOwnership: true,
      maxIncome: null
    },
    applicationUrl: 'https://pmkisan.gov.in/',
    states: 'all'
  },
  {
    id: 'pm-scholarship',
    name: 'PM Scholarship Scheme',
    nameHi: 'पीएम छात्रवृत्ति योजना',
    nameTa: 'பிஎம் உதவித்தொகை திட்டம்',
    nameBn: 'পিএম বৃত্তি প্রকল্প',
    category: 'student',
    description: 'Scholarship for students of armed forces personnel',
    descriptionHi: 'सशस्त्र बल कर्मियों के छात्रों के लिए छात्रवृत्ति',
    descriptionTa: 'ஆயுதப்படை வீரர்களின் மாணவர்களுக்கு உதவித்தொகை',
    descriptionBn: 'সশস্ত্র বাহিনীর কর্মীদের ছাত্রদের জন্য বৃত্তি',
    benefits: '₹2,000-₹3,000 per month',
    benefitsHi: 'प्रति माह ₹2,000-₹3,000',
    benefitsTa: 'மாதம் ₹2,000-₹3,000',
    benefitsBn: 'মাসে ₹2,000-₹3,000',
    eligibility: {
      occupation: ['student'],
      parentOccupation: ['armed_forces'],
      ageRange: [18, 25]
    },
    applicationUrl: 'https://scholarships.gov.in/',
    states: 'all'
  },
  {
    id: 'mudra-loan',
    name: 'Pradhan Mantri MUDRA Yojana',
    nameHi: 'प्रधानमंत्री मुद्रा योजना',
    nameTa: 'பிரதம மந்திரி முத்ரா யோஜனா',
    nameBn: 'প্রধানমন্ত্রী মুদ্রা যোজনা',
    category: 'business',
    description: 'Micro finance for small businesses',
    descriptionHi: 'छोटे व्यापार के लिए सूक्ष्म वित्त',
    descriptionTa: 'சிறு வணிகங்களுக்கு நுண்ணிய நிதி',
    descriptionBn: 'ছোট ব্যবসার জন্য ক্ষুদ্র অর্থায়ন',
    benefits: 'Loans up to ₹10 lakh without collateral',
    benefitsHi: 'बिना गारंटी के ₹10 लाख तक का ऋण',
    benefitsTa: 'பிணையம் இல்லாமல் ₹10 லட்சம் வரை கடன்',
    benefitsBn: 'জামানত ছাড়াই ₹10 লক্ষ পর্যন্ত ঋণ',
    eligibility: {
      occupation: ['business', 'entrepreneur', 'self_employed'],
      maxIncome: 1000000,
      ageRange: [18, 65]
    },
    applicationUrl: 'https://mudra.org.in/',
    states: 'all'
  },
  {
    id: 'beti-bachao',
    name: 'Beti Bachao Beti Padhao',
    nameHi: 'बेटी बचाओ बेटी पढ़ाओ',
    nameTa: 'பெட்டி பச்சாவ் பெட்டி படாவ்',
    nameBn: 'বেটি বাচাও বেটি পড়াও',
    category: 'women',
    description: 'Girl child education and empowerment',
    descriptionHi: 'बालिका शिक्षा और सशक्तिकरण',
    descriptionTa: 'பெண் குழந்தை கல்வி மற்றும் அதிகாரமளித்தல்',
    descriptionBn: 'কন্যা শিশু শিক্ষা ও ক্ষমতায়ন',
    benefits: 'Education support and awareness programs',
    benefitsHi: 'शिक्षा सहायता और जागरूकता कार्यक्रम',
    benefitsTa: 'கல்வி ஆதரவு மற்றும் விழிப்புணர்வு திட்டங்கள்',
    benefitsBn: 'শিক্ষা সহায়তা এবং সচেতনতা কর্মসূচি',
    eligibility: {
      gender: 'female',
      ageRange: [0, 18]
    },
    applicationUrl: 'https://wcd.nic.in/',
    states: 'all'
  }
]

// Filter schemes based on eligibility criteria
function filterSchemes(eligibility: EligibilityCriteria): any[] {
  return MOCK_SCHEMES.filter(scheme => {
    // Check occupation
    if (eligibility.occupation && scheme.eligibility.occupation) {
      const userOccupation = eligibility.occupation.toLowerCase()
      const schemeOccupations = scheme.eligibility.occupation.map(occ => occ.toLowerCase())
      
      if (!schemeOccupations.some(occ => 
        userOccupation.includes(occ) || occ.includes(userOccupation)
      )) {
        return false
      }
    }

    // Check age
    if (eligibility.age && scheme.eligibility.ageRange) {
      const [minAge, maxAge] = scheme.eligibility.ageRange
      if (eligibility.age < minAge || eligibility.age > maxAge) {
        return false
      }
    }

    // Check income
    if (eligibility.income && scheme.eligibility.maxIncome) {
      if (eligibility.income > scheme.eligibility.maxIncome) {
        return false
      }
    }

    // Check gender
    if (scheme.eligibility.gender && eligibility.gender) {
      if (scheme.eligibility.gender !== eligibility.gender) {
        return false
      }
    }

    return true
  })
}

// Main message handler that can be used by both WhatsApp and Telegram
export async function handleUserMessage(
  message: string, 
  userId: string, 
  userLanguage: string = 'en',
  platform: 'whatsapp' | 'telegram' = 'whatsapp'
): Promise<string> {
  try {
    console.log(`Processing ${platform} message from ${userId}: ${message}`)

    // Detect language if not provided
    if (!userLanguage || userLanguage === 'en') {
      userLanguage = await detectLanguage(message)
    }

    // Get or create user
    const user = await getOrCreateUser(userId, platform)

    // Extract eligibility criteria from the message
    const eligibility = await extractEligibility(message)
    console.log('Extracted eligibility:', eligibility)

    // Update user eligibility if we got new information
    if (Object.values(eligibility).some(value => value !== null)) {
      await updateUserEligibility(userId, eligibility, platform)
    }

    // Filter schemes based on eligibility
    const matchingSchemes = filterSchemes(eligibility)
    console.log(`Found ${matchingSchemes.length} matching schemes`)

    // Generate response using Gemini
    const response = await generateResponse(eligibility, matchingSchemes, userLanguage)

    // Add to conversation history
    await addConversationMessage(userId, message, response, userLanguage, platform)

    return response

  } catch (error) {
    console.error('Error in handleUserMessage:', error)
    
    // Return fallback response based on language
    const fallbackResponses = {
      en: `❌ I apologize, but I encountered an error while processing your request. Please try again or visit https://myscheme.gov.in for more information about government schemes.

You can also try rephrasing your message with details like:
• Your age
• Your state
• Your occupation
• Your income (optional)

Example: "I am 25 years old farmer from Maharashtra"`,

      hi: `❌ मुझे खुशी है, लेकिन आपके अनुरोध को संसाधित करते समय मुझे एक त्रुटि का सामना करना पड़ा। कृपया पुनः प्रयास करें या सरकारी योजनाओं के बारे में अधिक जानकारी के लिए https://myscheme.gov.in पर जाएं।

आप अपने संदेश को इन विवरणों के साथ दोबारा लिख सकते हैं:
• आपकी उम्र
• आपका राज्य
• आपका व्यवसाय
• आपकी आय (वैकल्पिक)

उदाहरण: "मैं महाराष्ट्र का 25 साल का किसान हूं"`,

      ta: `❌ மன்னிக்கவும், உங்கள் கோரிக்கையை செயலாக்கும் போது எனக்கு ஒரு பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும் அல்லது அரசு திட்டங்கள் பற்றிய கூடுதல் தகவலுக்கு https://myscheme.gov.in ஐ பார்வையிடவும்।

நீங்கள் உங்கள் செய்தியை இந்த விவரங்களுடன் மீண்டும் எழுதலாம்:
• உங்கள் வயது
• உங்கள் மாநிலம்
• உங்கள் தொழில்
• உங்கள் வருமானம் (விருப்பம்)

உதாரணம்: "நான் தமிழ்நாட்டைச் சேர்ந்த 25 வயது விவசாயி"`,

      bn: `❌ দুঃখিত, আপনার অনুরোধ প্রক্রিয়া করার সময় আমার একটি ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন বা সরকারি প্রকল্প সম্পর্কে আরও তথ্যের জন্য https://myscheme.gov.in দেখুন।

আপনি এই বিবরণ সহ আপনার বার্তা পুনরায় লিখতে পারেন:
• আপনার বয়স
• আপনার রাজ্য
• আপনার পেশা
• আপনার আয় (ঐচ্ছিক)

উদাহরণ: "আমি পশ্চিমবঙ্গের ২৫ বছর বয়সী কৃষক"`
    }

    return fallbackResponses[userLanguage as keyof typeof fallbackResponses] || fallbackResponses.en
  }
}

// Helper function to get scheme name in specific language
export function getSchemeNameInLanguage(scheme: any, language: string): string {
  const nameKey = `name${language.charAt(0).toUpperCase() + language.slice(1)}`
  return scheme[nameKey] || scheme.name
}

// Helper function to get scheme description in specific language
export function getSchemeDescriptionInLanguage(scheme: any, language: string): string {
  const descKey = `description${language.charAt(0).toUpperCase() + language.slice(1)}`
  return scheme[descKey] || scheme.description
}

// Helper function to get scheme benefits in specific language
export function getSchemeBenefitsInLanguage(scheme: any, language: string): string {
  const benefitsKey = `benefits${language.charAt(0).toUpperCase() + language.slice(1)}`
  return scheme[benefitsKey] || scheme.benefits
}