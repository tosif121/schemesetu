import { GoogleGenerativeAI } from '@google/generative-ai'
import { EligibilityCriteria } from './types'

// Initialize Gemini with fallback for build time
const apiKey = process.env.GEMINI_API_KEY || ''
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null

// Using Gemini 2.0 Flash for better multilingual support
const model = genAI ? genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' }) : null

// All major Indian languages supported
const SUPPORTED_LANGUAGES = {
  'hi': 'Hindi (हिंदी)',
  'en': 'English',
  'ta': 'Tamil (தமிழ்)',
  'bn': 'Bengali (বাংলা)',
  'te': 'Telugu (తెలుగు)',
  'mr': 'Marathi (मराठी)',
  'gu': 'Gujarati (ગુજરાતી)',
  'kn': 'Kannada (ಕನ್ನಡ)',
  'ml': 'Malayalam (മലയാളം)',
  'pa': 'Punjabi (ਪੰਜਾਬੀ)',
  'or': 'Odia (ଓଡ଼ିଆ)',
  'as': 'Assamese (অসমীয়া)',
  'ur': 'Urdu (اردو)',
  'sa': 'Sanskrit (संस्कृत)',
  'ne': 'Nepali (नेपाली)',
  'si': 'Sinhala (සිංහල)',
  'my': 'Myanmar (မြန်မာ)',
  'ks': 'Kashmiri (कॉशुर)',
  'sd': 'Sindhi (سنڌي)',
  'kok': 'Konkani (कोंकणी)',
  'mni': 'Manipuri (মৈতৈলোন্)',
  'doi': 'Dogri (डोगरी)',
  'sat': 'Santali (ᱥᱟᱱᱛᱟᱲᱤ)',
  'bo': 'Tibetan (བོད་སྐད་)'
}

export async function extractEligibility(userInput: string): Promise<EligibilityCriteria> {
  if (!model) {
    console.warn('Gemini not available, returning empty eligibility')
    return {
      age: null,
      income: null,
      state: null,
      occupation: null,
      category: null,
      gender: null,
      disability: null
    }
  }

  const prompt = `You are SchemeSaathi, a helpful assistant for Indian government schemes. Extract eligibility criteria from this message in JSON format. Handle all Indian languages including Hindi, English, Tamil, Bengali, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, Urdu, Sanskrit, Nepali, Sinhala, Myanmar, Kashmiri, Sindhi, Konkani, Manipuri, Dogri, Santali, and Tibetan.

Extract these fields:
{
  "age": number | null,
  "income": number | null (in rupees per year),
  "state": string | null (Indian state/UT name in English),
  "occupation": string | null (farmer, student, unemployed, etc.),
  "category": string | null (SC, ST, OBC, General, EWS),
  "gender": "male" | "female" | "other" | null,
  "disability": boolean | null
}

Examples:
- "मैं 25 साल का किसान हूं महाराष्ट्र से, सालाना 2 लाख कमाता हूं" → {"age": 25, "income": 200000, "state": "Maharashtra", "occupation": "farmer", "category": null, "gender": null, "disability": null}
- "I am 30 year old woman from Tamil Nadu, SC category" → {"age": 30, "income": null, "state": "Tamil Nadu", "occupation": null, "category": "SC", "gender": "female", "disability": null}
- "నేను 28 ఏళ్ల విద్యార్థిని, ఆంధ్రప్రదేశ్ నుండి" → {"age": 28, "income": null, "state": "Andhra Pradesh", "occupation": "student", "category": null, "gender": "female", "disability": null}
- "আমি ২৫ বছর বয়সী কৃষক, পশ্চিমবঙ্গ থেকে" → {"age": 25, "income": null, "state": "West Bengal", "occupation": "farmer", "category": null, "gender": null, "disability": null}

User message: ${userInput}

Return only valid JSON without any explanation:`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text().trim()
    
    // Clean up the response to ensure it's valid JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    return JSON.parse(text)
  } catch (error) {
    console.error('Error extracting eligibility:', error)
    // Return empty criteria if parsing fails
    return {
      age: null,
      income: null,
      state: null,
      occupation: null,
      category: null,
      gender: null,
      disability: null
    }
  }
}

export async function generateResponse(
  eligibility: EligibilityCriteria,
  schemes: any[],
  language: string = 'en'
): Promise<string> {
  if (!model) {
    console.warn('Gemini not available, returning fallback response')
    const fallbackResponses = {
      'hi': 'माफ करें, AI सेवा अभी उपलब्ध नहीं है। कृपया बाद में कोशिश करें।',
      'ta': 'மன்னிக்கவும், AI சேவை தற்போது கிடைக்கவில்லை. பின்னர் முயற்சிக்கவும்.',
      'bn': 'দুঃখিত, AI সেবা এখন উপলব্ধ নেই। পরে চেষ্টা করুন।',
      'te': 'క్షమించండి, AI సేవ ప్రస్తుతం అందుబాటులో లేదు. దయచేసి తర్వాత ప্రయత్నించండి।'
    }
    return fallbackResponses[language as keyof typeof fallbackResponses] || 
           'Sorry, AI service is currently unavailable. Please try again later.'
  }

  const languageName = SUPPORTED_LANGUAGES[language as keyof typeof SUPPORTED_LANGUAGES] || 'English'

  const prompt = `You are SchemeSaathi, a helpful WhatsApp chatbot that helps Indian citizens find government schemes. 

Generate a response in ${languageName} for a user with these eligibility criteria:
${JSON.stringify(eligibility, null, 2)}

Available schemes: ${JSON.stringify(schemes, null, 2)}

Guidelines:
1. Be conversational and friendly
2. Explain which schemes they're eligible for
3. Provide brief benefits and how to apply
4. If no schemes match, suggest they provide more information or visit myscheme.gov.in
5. Keep response under 1600 characters (WhatsApp limit)
6. Use appropriate language script and cultural context
7. Include relevant government website links when possible
8. Be encouraging and supportive
9. If schemes are available, focus on the most relevant ones first

Response:`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Error generating response:', error)
    
    // Fallback responses in major languages
    const fallbackResponses = {
      'hi': 'माफ करें, कुछ तकनीकी समस्या है। कृपया बाद में कोशिश करें। अधिक जानकारी के लिए myscheme.gov.in पर जाएं।',
      'ta': 'மன்னிக்கவும், தொழில்நுட்ப சிக்கல் உள்ளது. பின்னர் முயற்சிக்கவும். மேலும் தகவலுக்கு myscheme.gov.in ஐ பார்வையிடவும்.',
      'bn': 'দুঃখিত, একটি প্রযুক্তিগত সমস্যা আছে। পরে চেষ্টা করুন। আরও তথ্যের জন্য myscheme.gov.in দেখুন।',
      'te': 'క్షమించండి, సాంకేతిక సమస్య ఉంది. దయచేసి తర్వాత ప্రయత్నించండి. మరింత సమాచారం కోసం myscheme.gov.in చూడండి.',
      'mr': 'माफ करा, तांत्रिक समस्या आहे. कृपया नंतर प्रयत्न करा. अधिक माहितीसाठी myscheme.gov.in ला भेट द्या.',
      'gu': 'માફ કરશો, તકનીકી સમસ્યા છે. કૃપા કરીને પછીથી પ્રયાસ કરો. વધુ માહિતી માટે myscheme.gov.in જુઓ.',
      'kn': 'ಕ್ಷಮಿಸಿ, ತಾಂತ್ರಿಕ ಸಮಸ್ಯೆ ಇದೆ. ದಯವಿಟ್ಟು ನಂತರ ಪ್ರಯತ್ನಿಸಿ. ಹೆಚ್ಚಿನ ಮಾಹಿತಿಗಾಗಿ myscheme.gov.in ನೋಡಿ.',
      'ml': 'ക്ഷമിക്കണം, സാങ്കേതിക പ്രശ്നമുണ്ട്. ദയവായി പിന്നീട് ശ്രമിക്കുക. കൂടുതൽ വിവരങ്ങൾക്ക് myscheme.gov.in കാണുക.',
      'pa': 'ਮਾਫ਼ ਕਰੋ, ਤਕਨੀਕੀ ਸਮੱਸਿਆ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਬਾਅਦ ਵਿੱਚ ਕੋਸ਼ਿਸ਼ ਕਰੋ। ਹੋਰ ਜਾਣਕਾਰੀ ਲਈ myscheme.gov.in ਦੇਖੋ।',
      'or': 'ଦୁଃଖିତ, ଏକ ବୈଷୟିକ ସମସ୍ୟା ଅଛି। ଦୟାକରି ପରେ ଚେଷ୍ଟା କରନ୍ତୁ। ଅଧିକ ସୂଚନା ପାଇଁ myscheme.gov.in ଦେଖନ୍ତୁ।',
      'as': 'দুঃখিত, এটা কাৰিকৰী সমস্যা আছে। অনুগ্ৰহ কৰি পিছত চেষ্টা কৰক। অধিক তথ্যৰ বাবে myscheme.gov.in চাওক।',
      'ur': 'معذرت، تکنیکی مسئلہ ہے۔ براہ کرم بعد میں کوشش کریں۔ مزید معلومات کے لیے myscheme.gov.in دیکھیں۔'
    }
    
    return fallbackResponses[language as keyof typeof fallbackResponses] || 
           'Sorry, there was a technical issue. Please try again later. Visit myscheme.gov.in for more information.'
  }
}

export async function detectLanguage(text: string): Promise<string> {
  if (!model) {
    console.warn('Gemini not available, defaulting to English')
    return 'en'
  }

  const prompt = `Detect the primary language of this text and return only the language code from these options:
- "en" for English
- "hi" for Hindi
- "ta" for Tamil  
- "bn" for Bengali
- "te" for Telugu
- "mr" for Marathi
- "gu" for Gujarati
- "kn" for Kannada
- "ml" for Malayalam
- "pa" for Punjabi
- "or" for Odia
- "as" for Assamese
- "ur" for Urdu
- "sa" for Sanskrit
- "ne" for Nepali
- "si" for Sinhala
- "my" for Myanmar
- "ks" for Kashmiri
- "sd" for Sindhi
- "kok" for Konkani
- "mni" for Manipuri
- "doi" for Dogri
- "sat" for Santali
- "bo" for Tibetan

Text: ${text}

Return only the language code:`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const lang = response.text().trim().toLowerCase()
    
    if (Object.keys(SUPPORTED_LANGUAGES).includes(lang)) {
      return lang
    }
    return 'en' // Default to English
  } catch (error) {
    console.error('Error detecting language:', error)
    return 'en'
  }
}