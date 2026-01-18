const { Telegraf, Markup } = require('telegraf');
const { Client, LocalAuth, MessageMedia, Buttons, List } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
const { 
  getAllSchemes, 
  getSchemesByCategory, 
  filterSchemes, 
  getSchemesByOccupation, 
  getSchemesByGender,
  logSchemeInteraction,
  logConversation
} = require('./supabase-schemes');
require('dotenv').config();

// Initialize services
const telegramBot = new Telegraf(process.env.BOT_TOKEN);
const whatsappClient = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Perplexity API configuration
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

// User state management for language selection with memory cleanup
const userStates = new Map();
const STATE_TIMEOUT = 300000; // 5 minutes
const MAX_STATES = 1000; // Maximum number of states to keep

// Cleanup old states periodically
setInterval(() => {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [userId, state] of userStates.entries()) {
    if (now - state.timestamp > STATE_TIMEOUT) {
      userStates.delete(userId);
      cleaned++;
    }
  }
  
  // If still too many states, remove oldest ones
  if (userStates.size > MAX_STATES) {
    const entries = Array.from(userStates.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    const toRemove = entries.slice(0, userStates.size - MAX_STATES);
    toRemove.forEach(([userId]) => userStates.delete(userId));
    cleaned += toRemove.length;
  }
  
  if (cleaned > 0) {
    console.log(`🧹 Cleaned up ${cleaned} expired user states. Current states: ${userStates.size}`);
  }
}, 60000); // Clean up every minute

// Set user state
function setUserState(userId, state) {
  userStates.set(userId, { state, timestamp: Date.now() });
  
  // Immediate cleanup if too many states
  if (userStates.size > MAX_STATES * 1.2) {
    const now = Date.now();
    for (const [id, stateData] of userStates.entries()) {
      if (now - stateData.timestamp > STATE_TIMEOUT) {
        userStates.delete(id);
      }
    }
  }
}

// Get user state
function getUserState(userId) {
  const userState = userStates.get(userId);
  if (userState && (Date.now() - userState.timestamp) < STATE_TIMEOUT) {
    return userState.state;
  }
  userStates.delete(userId); // Clean up expired state
  return null;
}

// Clear user state
function clearUserState(userId) {
  userStates.delete(userId);
}

console.log('🚀 Starting SchemeSaathi Unified Bot...');
console.log('🔧 Initializing services...');
console.log('📡 Telegram bot configured:', process.env.BOT_TOKEN ? 'Yes' : 'No');
console.log('📱 WhatsApp client configured: Yes');
console.log('🗄️ Supabase configured:', process.env.SUPABASE_URL ? 'Yes' : 'No');
console.log('🤖 Perplexity configured:', process.env.PERPLEXITY_API_KEY ? 'Yes' : 'No');

// Memory monitoring
setInterval(() => {
  const memUsage = process.memoryUsage();
  const memMB = {
    rss: Math.round(memUsage.rss / 1024 / 1024),
    heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
    heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
    external: Math.round(memUsage.external / 1024 / 1024)
  };
  
  // Log memory usage every 10 minutes
  console.log(`📊 Memory: RSS ${memMB.rss}MB, Heap ${memMB.heapUsed}/${memMB.heapTotal}MB, External ${memMB.external}MB, States: ${userStates.size}`);
  
  // Force garbage collection if heap usage is high
  if (memMB.heapUsed > 500) {
    if (global.gc) {
      global.gc();
      console.log('🧹 Forced garbage collection due to high memory usage');
    }
  }
}, 600000); // Every 10 minutes

// Perplexity API helper function
async function callPerplexityAPI(prompt, model = 'sonar-pro') {
  try {
    const response = await axios.post(
      PERPLEXITY_API_URL,
      {
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 1000,
        temperature: 0.3,
        top_p: 0.9,
        stream: false,
      },
      {
        headers: {
          Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Perplexity API error:', error.response?.data || error.message);
    throw error;
  }
}

// Helper function to safely edit messages
async function safeEditMessage(ctx, text, options = {}) {
  try {
    await ctx.editMessageText(text, options);
  } catch (error) {
    // Handle "message is not modified" error - ignore it as it's not critical
    if (error.response?.error_code === 400 && 
        error.response?.description?.includes('message is not modified')) {
      console.log('Message content unchanged, skipping edit');
      // Just answer the callback query to acknowledge the button press
      await ctx.answerCbQuery('Already showing this content');
    } else {
      console.error('Error editing message:', error);
      // Try to answer callback query even if edit fails
      try {
        await ctx.answerCbQuery('Something went wrong, please try again');
      } catch (cbError) {
        console.error('Error answering callback query:', cbError);
      }
    }
  }
}

const LANGUAGES = {
  en: { name: 'English', native: 'English', flag: '🇬🇧' },
  hi: { name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  ta: { name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  bn: { name: 'Bengali', native: 'বাংলা', flag: '🇮🇳' },
  te: { name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  mr: { name: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
  gu: { name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
  kn: { name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
  ml: { name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' },
  pa: { name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  or: { name: 'Odia', native: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  as: { name: 'Assamese', native: 'অসমীয়া', flag: '🇮🇳' },
  ur: { name: 'Urdu', native: 'اردو', flag: '🇮🇳' },
  ks: { name: 'Kashmiri', native: 'کٲشُر', flag: '🇮🇳' },
  mai: { name: 'Maithili', native: 'मैथिली', flag: '🇮🇳' }
};

// Welcome messages in different languages
const WELCOME_MESSAGES = {
  en: `🇮🇳 *Welcome to SchemeSaathi!*

I'm your AI assistant for Indian government schemes. I can help you in 15+ Indian languages!

*What I can do:*
• Find government schemes you're eligible for
• Check eligibility for specific schemes
• Provide scheme details and application links
• Support multiple Indian languages

*How to use:*
Simply send me your details in this format:
\`Age City State Occupation Income\`

*Example:*
\`25 mumbai Maharashtra farmer 200000\`

Or describe in natural language:
"I am 25 years old farmer from Maharashtra"

*Commands:*
/language - Change language
/help - Show help
/schemes - Popular schemes

मैं आपकी हिंदी में भी मदद कर सकता हूं! 🙏`,

  hi: `🇮🇳 *स्कीमसाथी में आपका स्वागत है!*

मैं भारतीय सरकारी योजनाओं के लिए आपका AI सहायक हूं। मैं 15+ भारतीय भाषाओं में आपकी मदद कर सकता हूं!

*मैं क्या कर सकता हूं:*
• आपके लिए उपयुक्त सरकारी योजनाएं खोजना
• विशिष्ट योजनाओं के लिए पात्रता जांचना
• योजना विवरण और आवेदन लिंक प्रदान करना
• कई भारतीय भाषाओं में सहायता

*उपयोग कैसे करें:*
बस मुझे इस फॉर्मेट में अपना विवरण भेजें:
\`उम्र शहर राज्य व्यवसाय आय\`

*उदाहरण:*
\`25 mumbai Maharashtra farmer 200000\`

या प्राकृतिक भाषा में बताएं:
"मैं महाराष्ट्र का 25 साल का किसान हूं"

*कमांड:*
/language - भाषा बदलें
/help - सहायता दिखाएं
/schemes - लोकप्रिय योजनाएं

I can also help you in English! 🙏`
};

// User management functions
async function getOrCreateUser(identifier, firstName, username, platform) {
  try {
    const isWhatsApp = platform === 'whatsapp';
    const searchField = isWhatsApp ? 'phone_number' : 'telegram_id';
    
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq(searchField, identifier.toString())
      .single();

    if (existingUser && !fetchError) {
      return existingUser;
    }

    // Create user data based on platform
    let userData = {
      language_preference: 'en',
      eligibility_data: {},
      conversation_history: []
    };

    if (isWhatsApp) {
      userData.phone_number = identifier.toString();
      userData.whatsapp_name = firstName;
    } else {
      userData.telegram_id = identifier.toString();
      userData.first_name = firstName;
      if (username) userData.username = username;
    }

    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();

    if (createError) {
      console.error('Error creating user:', createError);
      return null;
    }

    return newUser;
  } catch (error) {
    console.error('Error in getOrCreateUser:', error);
    return null;
  }
}

async function updateUserLanguage(identifier, language, platform) {
  try {
    const searchField = platform === 'whatsapp' ? 'phone_number' : 'telegram_id';
    
    const { error } = await supabase
      .from('users')
      .update({ 
        language_preference: language,
        updated_at: new Date().toISOString()
      })
      .eq(searchField, identifier.toString());

    if (error) {
      console.error('Error updating user language:', error);
    }
  } catch (error) {
    console.error('Error in updateUserLanguage:', error);
  }
}


// AI functions (same as before)
async function extractEligibility(userInput) {
  // First try simple pattern matching for structured format: "25 mumbai Maharashtra farmer 200000"
  const structuredMatch = userInput.trim().match(/^(\d+)\s+(\w+)\s+(\w+)\s+(\w+)\s*(\d+)?$/i);
  
  if (structuredMatch) {
    const [, age, city, state, occupation, income] = structuredMatch;
    console.log('Using structured format parsing');
    return {
      age: parseInt(age),
      income: income ? parseInt(income) : null,
      state: state,
      city: city,
      occupation: occupation.toLowerCase(),
      category: null,
      gender: null,
      disability: null
    };
  }

  // Try Perplexity AI extraction for natural language
  const prompt = `Extract eligibility criteria from this user message and return ONLY a valid JSON object. Handle all Indian languages.

User message: "${userInput}"

Extract these fields and return as JSON:
{
  "age": number or null,
  "income": number or null (annual income in rupees),
  "state": string or null (Indian state name in English),
  "city": string or null,
  "occupation": string or null (farmer, student, business, unemployed, etc.),
  "category": string or null (SC, ST, OBC, General, EWS),
  "gender": "male" or "female" or "other" or null,
  "disability": boolean or null
}

Examples:
- "25 mumbai Maharashtra farmer 200000" → {"age": 25, "income": 200000, "state": "Maharashtra", "city": "mumbai", "occupation": "farmer", "category": null, "gender": null, "disability": null}
- "I am 30 year old student from Delhi" → {"age": 30, "income": null, "state": "Delhi", "city": "delhi", "occupation": "student", "category": null, "gender": null, "disability": null}

Return ONLY the JSON object, no other text:`;

  try {
    const response = await callPerplexityAPI(prompt);
    console.log('Perplexity response:', response);
    
    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Try to parse the entire response as JSON
    return JSON.parse(response);
  } catch (error) {
    console.error('Error extracting eligibility with Perplexity:', error);
    
    // Fallback to pattern matching
    return performFallbackExtraction(userInput);
  }
}

function performFallbackExtraction(userInput) {
  // Fallback: Try basic keyword extraction
  const fallbackData = {
    age: null,
    income: null,
    state: null,
    city: null,
    occupation: null,
    category: null,
    gender: null,
    disability: null,
  };

  // Extract age
  const ageMatch = userInput.match(/(\d+)\s*(year|sal|साल)/i);
  if (ageMatch) fallbackData.age = parseInt(ageMatch[1]);

  // Extract income
  const incomeMatch = userInput.match(/(\d+)\s*(lakh|lakhs|thousand|हजार|लाख)/i);
  if (incomeMatch) {
    const amount = parseInt(incomeMatch[1]);
    fallbackData.income = incomeMatch[2].toLowerCase().includes('lakh') ? amount * 100000 : amount * 1000;
  }

  // Extract occupation keywords
  const occupations = ['farmer', 'student', 'business', 'unemployed', 'किसान', 'छात्र', 'व्यापार'];
  for (const occ of occupations) {
    if (userInput.toLowerCase().includes(occ.toLowerCase())) {
      fallbackData.occupation = occ.includes('किसान')
        ? 'farmer'
        : occ.includes('छात्र')
        ? 'student'
        : occ.includes('व्यापार')
        ? 'business'
        : occ;
      break;
    }
  }

  // Extract state keywords
  const states = ['maharashtra', 'gujarat', 'punjab', 'delhi', 'karnataka', 'tamil nadu', 'rajasthan'];
  for (const state of states) {
    if (userInput.toLowerCase().includes(state)) {
      fallbackData.state = state;
      break;
    }
  }

  console.log('Using fallback extraction:', fallbackData);
  return fallbackData;
}

async function generateResponse(eligibility, schemes, language = 'en') {
  const languageName = LANGUAGES[language]?.name || 'English';

  // Try Perplexity AI response first
  const prompt = `You are SchemeSaathi, a helpful bot for Indian government schemes.

Generate a response in ${languageName} for a user with these eligibility criteria:
${JSON.stringify(eligibility, null, 2)}

ONLY show these eligible schemes (do NOT mention any ineligible schemes):
${JSON.stringify(schemes, null, 2)}

Guidelines:
1. Be conversational and friendly
2. ONLY explain schemes they ARE eligible for from the provided list
3. Do NOT mention any schemes they are not eligible for
4. Provide brief benefits and application process
5. If no schemes in the list, suggest they provide more details or try different criteria
6. Keep response under 4000 characters (Telegram limit)
7. Use appropriate language script for ${languageName}
8. Include relevant website links for eligible schemes only
9. Be encouraging and supportive
10. Use emojis appropriately
11. Focus on positive eligibility matches only

If the schemes list is empty, suggest:
- Providing more specific details
- Trying the structured format: Age City State Occupation Income
- Using /schemes command to see popular schemes

Response:`;

  try {
    const response = await callPerplexityAPI(prompt);
    return response;
  } catch (error) {
    console.error('Error generating response with Perplexity:', error);

    // Fallback response without AI
    return generateFallbackResponse(eligibility, schemes, language);
  }
}

// Schemes are now loaded from Supabase via supabase-schemes.js

// filterSchemes function is now imported from supabase-schemes.js

// Fallback response for when AI is not available
function generateFallbackResponse(eligibility, schemes, language = 'en') {
  const responses = {
    en: {
      greeting: "🇮🇳 Great! Based on your details, here are the government schemes you're eligible for:",
      noSchemes: "❌ No matching schemes found for your current criteria. Try providing more details:",
      format: "Format: Age City State Occupation Income\nExample: 25 mumbai Maharashtra farmer 200000",
      schemes: "✅ You're Eligible For:",
      moreInfo: "💡 For more schemes, try /schemes command or provide additional details like income, category, etc."
    },
    hi: {
      greeting: "🇮🇳 बहुत बढ़िया! आपके विवरण के आधार पर, यहाँ वे सरकारी योजनाएं हैं जिनके लिए आप पात्र हैं:",
      noSchemes: "❌ आपके वर्तमान मापदंड के लिए कोई मैचिंग योजना नहीं मिली। अधिक विवरण प्रदान करने का प्रयास करें:",
      format: "फॉर्मेट: उम्र शहर राज्य व्यवसाय आय\nउदाहरण: 25 mumbai Maharashtra farmer 200000",
      schemes: "✅ आप इनके लिए पात्र हैं:",
      moreInfo: "💡 अधिक योजनाओं के लिए, /schemes कमांड आज़माएं या आय, श्रेणी आदि जैसे अतिरिक्त विवरण प्रदान करें।"
    }
  };

  const lang = responses[language] || responses.en;
  let response = "";

  if (schemes.length === 0) {
    response += lang.noSchemes + "\n\n" + lang.format + "\n\n" + lang.moreInfo;
    return response;
  }

  response += lang.greeting + "\n\n" + lang.schemes + "\n\n";

  schemes.forEach((scheme, index) => {
    response += `${index + 1}. *${scheme.name}*\n`;
    response += `💰 ${scheme.benefits}\n`;
    response += `🔗 Apply: ${scheme.url}\n\n`;
  });

  response += lang.moreInfo;
  return response;
}

// Process message for both platforms
async function processMessage(messageText, identifier, firstName, username, platform) {
  try {
    const user = await getOrCreateUser(identifier, firstName, username, platform);
    const userLanguage = user?.language_preference || 'en';
    
    // Log the conversation
    if (user) {
      await logConversation(user.id, platform, 'user_message', messageText);
    }
    
    // Extract eligibility from user message
    const eligibility = await extractEligibility(messageText);
    console.log('Extracted eligibility:', eligibility);
    
    // Filter schemes based on eligibility using Supabase
    const matchingSchemes = await filterSchemes(eligibility);
    console.log(`Found ${matchingSchemes.length} matching schemes from Supabase`);
    
    // Log scheme interactions
    if (user && matchingSchemes.length > 0) {
      for (const scheme of matchingSchemes) {
        await logSchemeInteraction(user.id, scheme.id, 'viewed', platform);
      }
    }
    
    // Generate response
    const response = await generateResponse(eligibility, matchingSchemes, userLanguage);
    
    // Log bot response
    if (user) {
      await logConversation(user.id, platform, 'bot_response', response);
    }
    
    return response;
  } catch (error) {
    console.error('Error processing message:', error);
    
    const errorMessages = {
      en: '❌ Sorry, I encountered an error. Please try again or use /help for assistance.',
      hi: '❌ माफ करें, मुझे एक त्रुटि का सामना करना पड़ा। कृपया पुनः प्रयास करें या सहायता के लिए /help का उपयोग करें।'
    };
    
    return errorMessages.en;
  }
}

// WhatsApp interactive menu functions
function createWhatsAppMainMenu(language = 'en') {
  const menus = {
    en: `🇮🇳 *Welcome to SchemeSaathi!*

I'm your AI assistant for Indian government schemes. I can help you in 15+ Indian languages!

*Quick Actions:*
1️⃣ Find Schemes
2️⃣ Farmer Schemes 🌾
3️⃣ Student Schemes 🎓
4️⃣ Women Schemes 👩
5️⃣ Business Schemes 💼
6️⃣ Change Language 🌐
7️⃣ Help & Instructions ❓

*How to use:*
• Reply with a number (1-7) for quick actions
• Send your details: Age City State Occupation Income
• Example: 25 mumbai Maharashtra farmer 200000

मैं आपकी हिंदी में भी मदद कर सकता हूं! 🙏`,

    hi: `🇮🇳 *स्कीमसाथी में आपका स्वागत है!*

मैं भारतीय सरकारी योजनाओं के लिए आपका AI सहायक हूं। मैं 15+ भारतीय भाषाओं में आपकी मदद कर सकता हूं!

*त्वरित कार्य:*
1️⃣ योजनाएं खोजें
2️⃣ किसान योजनाएं 🌾
3️⃣ छात्र योजनाएं 🎓
4️⃣ महिला योजनाएं 👩
5️⃣ व्यापार योजनाएं 💼
6️⃣ भाषा बदलें 🌐
7️⃣ सहायता और निर्देश ❓

*उपयोग कैसे करें:*
• त्वरित कार्यों के लिए संख्या (1-7) के साथ उत्तर दें
• अपना विवरण भेजें: उम्र शहर राज्य व्यवसाय आय
• उदाहरण: 25 mumbai Maharashtra farmer 200000

I can also help you in English! 🙏`
  };
  
  return menus[language] || menus.en;
}

function createWhatsAppButtons(language = 'en') {
  const buttonTexts = {
    en: {
      find: '🔍 Find Schemes',
      farmer: '🌾 Farmer',
      student: '🎓 Student', 
      women: '👩 Women',
      business: '💼 Business',
      language: '🌐 Language',
      help: '❓ Help'
    },
    hi: {
      find: '🔍 योजनाएं खोजें',
      farmer: '🌾 किसान',
      student: '🎓 छात्र',
      women: '👩 महिला', 
      business: '💼 व्यापार',
      language: '🌐 भाषा',
      help: '❓ सहायता'
    }
  };
  
  const texts = buttonTexts[language] || buttonTexts.en;
  
  return new Buttons(
    createWhatsAppMainMenu(language),
    [
      { body: texts.find, id: 'find_schemes' },
      { body: texts.farmer, id: 'farmer_schemes' },
      { body: texts.student, id: 'student_schemes' }
    ],
    language === 'hi' ? 'त्वरित कार्य' : 'Quick Actions',
    language === 'hi' ? 'विकल्प चुनें' : 'Choose an option'
  );
}

function createWhatsAppSecondaryButtons(language = 'en') {
  const buttonTexts = {
    en: {
      women: '👩 Women',
      business: '💼 Business',
      language: '🌐 Language',
      help: '❓ Help'
    },
    hi: {
      women: '👩 महिला',
      business: '💼 व्यापार', 
      language: '🌐 भाषा',
      help: '❓ सहायता'
    }
  };
  
  const texts = buttonTexts[language] || buttonTexts.en;
  
  return new Buttons(
    language === 'hi' ? 'अधिक विकल्प:' : 'More Options:',
    [
      { body: texts.women, id: 'women_schemes' },
      { body: texts.business, id: 'business_schemes' },
      { body: texts.language, id: 'change_language' }
    ],
    language === 'hi' ? 'अन्य सेवाएं' : 'Other Services',
    language === 'hi' ? 'विकल्प चुनें' : 'Choose an option'
  );
}

function createWhatsAppLanguageList() {
  const sections = [
    {
      title: 'Indian Languages',
      rows: [
        { id: 'lang_en', title: '🇬🇧 English', description: 'English' },
        { id: 'lang_hi', title: '🇮🇳 हिन्दी', description: 'Hindi' },
        { id: 'lang_bn', title: '🇮🇳 বাংলা', description: 'Bengali' },
        { id: 'lang_ta', title: '🇮🇳 தமிழ்', description: 'Tamil' },
        { id: 'lang_te', title: '🇮🇳 తెలుగు', description: 'Telugu' },
        { id: 'lang_mr', title: '🇮🇳 मराठी', description: 'Marathi' },
        { id: 'lang_gu', title: '🇮🇳 ગુજરાતી', description: 'Gujarati' },
        { id: 'lang_kn', title: '🇮🇳 ಕನ್ನಡ', description: 'Kannada' },
        { id: 'lang_ml', title: '🇮🇳 മലയാളം', description: 'Malayalam' },
        { id: 'lang_pa', title: '🇮🇳 ਪੰਜਾਬੀ', description: 'Punjabi' }
      ]
    }
  ];
  
  return new List(
    '🌐 *Select Your Language*\nकृपया अपनी भाषा चुनें',
    'Choose Language',
    sections,
    'Language Options'
  );
}

function createWhatsAppLanguageMenu() {
  return `🌐 *Select Your Language / अपनी भाषा चुनें*

1️⃣ 🇬🇧 English
2️⃣ 🇮🇳 हिन्दी (Hindi)
3️⃣ 🇮🇳 বাংলা (Bengali)
4️⃣ 🇮🇳 தமிழ் (Tamil)
5️⃣ 🇮🇳 తెలుగు (Telugu)
6️⃣ 🇮🇳 मराठी (Marathi)
7️⃣ 🇮🇳 ગુજરાતી (Gujarati)
8️⃣ 🇮🇳 ಕನ್ನಡ (Kannada)
9️⃣ 🇮🇳 മലയാളം (Malayalam)
🔟 🇮🇳 ਪੰਜਾਬੀ (Punjabi)

*Reply with number to select language*
*भाषा चुनने के लिए संख्या के साथ उत्तर दें*`;
}

function createWhatsAppHelpMenu(language = 'en') {
  const helps = {
    en: `🤖 *SchemeSaathi Bot Help*

*What I can do:*
• Find government schemes you're eligible for
• Check eligibility for specific schemes
• Support 15+ Indian languages
• Provide scheme details and application links

*How to use:*
1. Send your details in simple format:
   Age City State Occupation Income
   
2. Or describe naturally:
   "I am 25 year old farmer from Punjab"

3. Use numbers 1-7 for quick actions

*Format Examples:*
25 mumbai Maharashtra farmer 200000
30 delhi Delhi student 50000
35 bangalore Karnataka business 500000

*Quick Actions:*
Reply *menu* anytime to see main menu
Reply *help* for this help message

Just start typing your details! 💬`,

    hi: `🤖 *स्कीमसाथी बॉट सहायता*

*मैं क्या कर सकता हूं:*
• आपके लिए उपयुक्त सरकारी योजनाएं खोजना
• विशिष्ट योजनाओं के लिए पात्रता जांचना
• 15+ भारतीय भाषाओं में सहायता
• योजना विवरण और आवेदन लिंक प्रदान करना

*उपयोग कैसे करें:*
1. अपना विवरण सरल फॉर्मेट में भेजें:
   उम्र शहर राज्य व्यवसाय आय
   
2. या प्राकृतिक रूप से बताएं:
   "मैं पंजाब का 25 साल का किसान हूं"

3. त्वरित कार्यों के लिए संख्या 1-7 का उपयोग करें

*फॉर्मेट उदाहरण:*
25 mumbai Maharashtra farmer 200000
30 delhi Delhi student 50000
35 bangalore Karnataka business 500000

*त्वरित कार्य:*
मुख्य मेनू देखने के लिए कभी भी *menu* का उत्तर दें
इस सहायता संदेश के लिए *help* का उत्तर दें

बस अपना विवरण टाइप करना शुरू करें! 💬`
  };
  
  return helps[language] || helps.en;
}

async function handleWhatsAppButtonClick(buttonId, contact, message, userLanguage = 'en') {
  let response = '';
  let schemes = [];
  
  switch (buttonId) {
    case 'find_schemes':
      schemes = await getAllSchemes();
      response = userLanguage === 'hi' 
        ? '🔍 सभी उपलब्ध सरकारी योजनाएं:\n\nव्यक्तिगत सुझाव के लिए अपना विवरण भेजें: उम्र शहर राज्य व्यवसाय आय\n\n'
        : '🔍 All Available Government Schemes:\n\nFor personalized recommendations, send your details: Age City State Occupation Income\n\n';
      break;
      
    case 'farmer_schemes':
      schemes = await getSchemesByOccupation('farmer');
      response = userLanguage === 'hi' 
        ? '🌾 किसानों के लिए सरकारी योजनाएं:\n\n'
        : '🌾 Government Schemes for Farmers:\n\n';
      break;
      
    case 'student_schemes':
      schemes = await getSchemesByOccupation('student');
      response = userLanguage === 'hi' 
        ? '🎓 छात्रों के लिए सरकारी योजनाएं:\n\n'
        : '🎓 Government Schemes for Students:\n\n';
      break;
      
    case 'women_schemes':
      schemes = await getSchemesByGender('female');
      response = userLanguage === 'hi' 
        ? '👩 महिलाओं के लिए सरकारी योजनाएं:\n\n'
        : '👩 Government Schemes for Women:\n\n';
      break;
      
    case 'business_schemes':
      schemes = await getSchemesByOccupation('business');
      response = userLanguage === 'hi' 
        ? '💼 व्यापार और स्टार्टअप योजनाएं:\n\n'
        : '💼 Business and Startup Schemes:\n\n';
      break;
      
    case 'change_language':
      await message.reply(createWhatsAppLanguageMenu());
      return;
      
    case 'help':
      await message.reply(createWhatsAppHelpMenu(userLanguage));
      return;
      
    default:
      response = userLanguage === 'hi' 
        ? '❌ अमान्य विकल्प। कृपया मेनू से चुनें।'
        : '❌ Invalid option. Please choose from the menu.';
      await message.reply(response);
      return;
  }
  
  // Generate scheme list response
  if (schemes.length > 0) {
    schemes.forEach((scheme, index) => {
      response += `${index + 1}. *${scheme.name}*\n`;
      response += `💰 ${scheme.benefits}\n`;
      response += `🔗 ${scheme.url}\n\n`;
    });
    
    const moreInfo = userLanguage === 'hi' 
      ? '💡 व्यक्तिगत सुझाव के लिए अपना विवरण भेजें या *menu* टाइप करें'
      : '💡 For personalized recommendations, send your details or type *menu*';
    
    response += moreInfo;
  } else {
    response = userLanguage === 'hi' 
      ? '❌ इस श्रेणी के लिए कोई योजना उपलब्ध नहीं है। कृपया अन्य विकल्प आज़माएं।'
      : '❌ No schemes available for this category. Please try other options.';
  }
  
  await message.reply(response);
  
  // Send secondary buttons for more options
  try {
    await whatsappClient.sendMessage(message.from, createWhatsAppSecondaryButtons(userLanguage));
  } catch (error) {
    console.log('Interactive buttons not supported, using text menu');
  }
}

async function handleWhatsAppMenuSelection(selection, contact, message, userLanguage = 'en') {
  let response = '';
  let schemes = [];
  
  console.log(`📱 WhatsApp menu selection: ${selection} for user ${contact.number}`);
  
  switch (selection) {
    case '1': // Find Schemes
      schemes = await getAllSchemes();
      response = userLanguage === 'hi' 
        ? '🔍 सभी उपलब्ध सरकारी योजनाएं:\n\nव्यक्तिगत सुझाव के लिए अपना विवरण भेजें: उम्र शहर राज्य व्यवसाय आय\n\n'
        : '🔍 All Available Government Schemes:\n\nFor personalized recommendations, send your details: Age City State Occupation Income\n\n';
      break;
      
    case '2': // Farmer Schemes
      schemes = await getSchemesByOccupation('farmer');
      response = userLanguage === 'hi' 
        ? '🌾 किसानों के लिए सरकारी योजनाएं:\n\n'
        : '🌾 Government Schemes for Farmers:\n\n';
      break;
      
    case '3': // Student Schemes
      schemes = await getSchemesByOccupation('student');
      response = userLanguage === 'hi' 
        ? '🎓 छात्रों के लिए सरकारी योजनाएं:\n\n'
        : '🎓 Government Schemes for Students:\n\n';
      break;
      
    case '4': // Women Schemes
      schemes = await getSchemesByGender('female');
      response = userLanguage === 'hi' 
        ? '👩 महिलाओं के लिए सरकारी योजनाएं:\n\n'
        : '👩 Government Schemes for Women:\n\n';
      break;
      
    case '5': // Business Schemes
      schemes = await getSchemesByOccupation('business');
      response = userLanguage === 'hi' 
        ? '💼 व्यापार और स्टार्टअप योजनाएं:\n\n'
        : '💼 Business and Startup Schemes:\n\n';
      break;
      
    case '6': // Change Language
      setUserState(contact.number, 'language_selection');
      await message.reply(createWhatsAppLanguageMenu());
      return;
      
    case '7': // Help
      await message.reply(createWhatsAppHelpMenu(userLanguage));
      return;
      
    default:
      response = userLanguage === 'hi' 
        ? '❌ अमान्य विकल्प। कृपया 1-7 के बीच संख्या चुनें।\n\n' + createWhatsAppMainMenu(userLanguage)
        : '❌ Invalid option. Please choose a number between 1-7.\n\n' + createWhatsAppMainMenu(userLanguage);
      await message.reply(response);
      return;
  }
  
  // Generate scheme list response
  if (schemes.length > 0) {
    schemes.forEach((scheme, index) => {
      response += `${index + 1}. *${scheme.name}*\n`;
      response += `💰 ${scheme.benefits}\n`;
      response += `🔗 ${scheme.url}\n\n`;
    });
    
    const moreInfo = userLanguage === 'hi' 
      ? '💡 व्यक्तिगत सुझाव के लिए अपना विवरण भेजें या *menu* टाइप करें'
      : '💡 For personalized recommendations, send your details or type *menu*';
    
    response += moreInfo;
  } else {
    response = userLanguage === 'hi' 
      ? '❌ इस श्रेणी के लिए कोई योजना उपलब्ध नहीं है। कृपया अन्य विकल्प आज़माएं।\n\n' + createWhatsAppMainMenu(userLanguage)
      : '❌ No schemes available for this category. Please try other options.\n\n' + createWhatsAppMainMenu(userLanguage);
  }
  
  await message.reply(response);
  
  // Send secondary buttons for more options
  try {
    await whatsappClient.sendMessage(message.from, createWhatsAppSecondaryButtons(userLanguage));
  } catch (error) {
    console.log('Interactive buttons not supported, using text menu');
  }
}

async function handleWhatsAppLanguageSelection(selection, contact, message) {
  const languageMap = {
    '1': 'en', '2': 'hi', '3': 'bn', '4': 'ta', '5': 'te',
    '6': 'mr', '7': 'gu', '8': 'kn', '9': 'ml', '10': 'pa'
  };
  
  const selectedLanguage = languageMap[selection];
  
  console.log(`📱 WhatsApp language selection: ${selection} -> ${selectedLanguage} for user ${contact.number}`);
  
  if (selectedLanguage) {
    await updateUserLanguage(contact.number, selectedLanguage, 'whatsapp');
    
    const confirmMessages = {
      en: `✅ Language set to ${LANGUAGES[selectedLanguage]?.name}!\n\n${createWhatsAppMainMenu(selectedLanguage)}`,
      hi: `✅ भाषा ${LANGUAGES[selectedLanguage]?.native} में सेट की गई!\n\n${createWhatsAppMainMenu(selectedLanguage)}`
    };
    
    await message.reply(confirmMessages[selectedLanguage] || confirmMessages.en);
  } else {
    const errorMsg = '❌ Invalid language selection. Please choose 1-10.\n\n' + createWhatsAppLanguageMenu();
    await message.reply(errorMsg);
  }
}

// WhatsApp Client Setup
whatsappClient.on('qr', (qr) => {
  console.log('📱 WhatsApp QR Code:');
  qrcode.generate(qr, { small: true });
  console.log('Scan this QR code with your WhatsApp to connect');
});

whatsappClient.on('ready', () => {
  console.log('✅ WhatsApp Client is ready!');
});

whatsappClient.on('message', async (message) => {
  // Skip if message is from status broadcast or groups
  if (message.from === 'status@broadcast' || message.isGroupMsg) return;
  
  const contact = await message.getContact();
  const messageText = message.body.trim();
  
  console.log(`📱 WhatsApp message from ${contact.name || contact.number}: ${messageText}`);
  
  try {
    // Get or create user
    const user = await getOrCreateUser(
      contact.number,
      contact.name || contact.number,
      null,
      'whatsapp'
    );
    const userLanguage = user?.language_preference || 'en';
    
    // Handle special commands and greetings
    const lowerText = messageText.toLowerCase();
    if (lowerText === 'menu' || lowerText === 'start' || lowerText === 'hi' || lowerText === 'hello' || lowerText === 'hey' || lowerText === 'namaste') {
      await message.reply(createWhatsAppMainMenu(userLanguage));
      return;
    }
    
    if (messageText.toLowerCase() === 'help') {
      await message.reply(createWhatsAppHelpMenu(userLanguage));
      return;
    }
    
    if (messageText.toLowerCase() === 'language') {
      try {
        await whatsappClient.sendMessage(message.from, createWhatsAppLanguageList());
      } catch (error) {
        await message.reply(createWhatsAppLanguageMenu());
      }
      return;
    }
    
    // Handle menu selections (1-7) and language selections (8-10)
    if (/^([1-9]|10)$/.test(messageText)) {
      const selection = parseInt(messageText);
      const currentState = getUserState(contact.number);
      
      // Check if user is in language selection mode
      if (currentState === 'language_selection') {
        await handleWhatsAppLanguageSelection(messageText, contact, message);
        clearUserState(contact.number);
        return;
      }
      
      if (selection >= 1 && selection <= 7) {
        // Quick actions menu
        await handleWhatsAppMenuSelection(messageText, contact, message, userLanguage);
        return;
      } else if (selection >= 8 && selection <= 10) {
        // Language selection for numbers 8-10
        await handleWhatsAppLanguageSelection(messageText, contact, message);
        return;
      }
    }
    
    // Handle first-time users or simple greetings
    if (!user || messageText.length <= 15) {
      // Check if it's a simple greeting or first interaction
      const greetings = ['hi', 'hello', 'hey', 'namaste', 'namaskar', 'hola', 'good morning', 'good evening', 'menu', 'start'];
      const isGreeting = greetings.some(greeting => lowerText.includes(greeting));
      
      if (isGreeting || !user) {
        await message.reply(createWhatsAppMainMenu(userLanguage));
        return;
      }
    }
    
    // Process regular messages (eligibility queries)
    const response = await processMessage(
      messageText,
      contact.number,
      contact.name || contact.number,
      null,
      'whatsapp'
    );
    
    // Send quick action buttons after response
    const menuPrompt = userLanguage === 'hi' 
      ? '\n\n💡 मुख्य मेनू के लिए *menu* टाइप करें'
      : '\n\n💡 Type *menu* for main menu';
    
    await message.reply(response + menuPrompt);
    
  } catch (error) {
    console.error('Error processing WhatsApp message:', error);
    
    const errorMessages = {
      en: '❌ Sorry, I encountered an error. Please try again or type *help* for assistance.',
      hi: '❌ माफ करें, मुझे एक त्रुटि का सामना करना पड़ा। कृपया पुनः प्रयास करें या सहायता के लिए *help* टाइप करें।'
    };
    
    await message.reply(errorMessages.en);
  }
});

// Handle WhatsApp button interactions
whatsappClient.on('message_create', async (message) => {
  // Handle button responses and interactive list selections
  if (message.fromMe) return; // Skip messages sent by the bot
  
  const contact = await message.getContact();
  
  // Check if this is a button response
  if (message.selectedButtonId) {
    console.log(`📱 WhatsApp button clicked: ${message.selectedButtonId}`);
    
    const user = await getOrCreateUser(
      contact.number,
      contact.name || contact.number,
      null,
      'whatsapp'
    );
    const userLanguage = user?.language_preference || 'en';
    
    await handleWhatsAppButtonClick(message.selectedButtonId, contact, message, userLanguage);
  }
  
  // Check if this is a list selection
  if (message.selectedRowId) {
    console.log(`📱 WhatsApp list item selected: ${message.selectedRowId}`);
    
    if (message.selectedRowId.startsWith('lang_')) {
      const selectedLanguage = message.selectedRowId.replace('lang_', '');
      await updateUserLanguage(contact.number, selectedLanguage, 'whatsapp');
      
      const confirmMessages = {
        en: `✅ Language set to ${LANGUAGES[selectedLanguage]?.name}!\n\n${createWhatsAppMainMenu(selectedLanguage)}`,
        hi: `✅ भाषा ${LANGUAGES[selectedLanguage]?.native} में सेट की गई!\n\n${createWhatsAppMainMenu(selectedLanguage)}`
      };
      
      await whatsappClient.sendMessage(
        message.from, 
        confirmMessages[selectedLanguage] || confirmMessages.en
      );
      
      // Send interactive buttons
      try {
        await whatsappClient.sendMessage(message.from, createWhatsAppButtons(selectedLanguage));
      } catch (error) {
        console.log('Interactive buttons not supported');
      }
    }
  }
});

whatsappClient.on('disconnected', (reason) => {
  console.log('❌ WhatsApp Client was logged out:', reason);
});

// Telegram Bot Setup (keeping existing functionality)
// ... (I'll continue with Telegram bot setup in the next part)
// Create language selection keyboard
function createLanguageKeyboard() {
  const languages = Object.entries(LANGUAGES);
  const keyboard = [];
  
  for (let i = 0; i < languages.length; i += 2) {
    const row = [];
    row.push(Markup.button.callback(
      `${languages[i][1].flag} ${languages[i][1].native}`,
      `lang_${languages[i][0]}`
    ));
    
    if (languages[i + 1]) {
      row.push(Markup.button.callback(
        `${languages[i + 1][1].flag} ${languages[i + 1][1].native}`,
        `lang_${languages[i + 1][0]}`
      ));
    }
    
    keyboard.push(row);
  }
  
  return Markup.inlineKeyboard(keyboard);
}

// Create quick action keyboard
function createQuickActionKeyboard(language = 'en') {
  const actions = {
    en: [
      [
        Markup.button.callback('🔍 Find Schemes', 'action_find_schemes'),
        Markup.button.callback('✅ Check Eligibility', 'action_check_eligibility')
      ],
      [
        Markup.button.callback('🌾 Farmer Schemes', 'action_farmer'),
        Markup.button.callback('🎓 Student Schemes', 'action_student')
      ],
      [
        Markup.button.callback('👩 Women Schemes', 'action_women'),
        Markup.button.callback('💼 Business Schemes', 'action_business')
      ],
      [
        Markup.button.callback('🌐 Change Language', 'action_change_language'),
        Markup.button.callback('❓ Help', 'action_help')
      ]
    ],
    hi: [
      [
        Markup.button.callback('🔍 योजनाएं खोजें', 'action_find_schemes'),
        Markup.button.callback('✅ पात्रता जांचें', 'action_check_eligibility')
      ],
      [
        Markup.button.callback('🌾 किसान योजनाएं', 'action_farmer'),
        Markup.button.callback('🎓 छात्र योजनाएं', 'action_student')
      ],
      [
        Markup.button.callback('👩 महिला योजनाएं', 'action_women'),
        Markup.button.callback('💼 व्यापार योजनाएं', 'action_business')
      ],
      [
        Markup.button.callback('🌐 भाषा बदलें', 'action_change_language'),
        Markup.button.callback('❓ सहायता', 'action_help')
      ]
    ]
  };
  
  return Markup.inlineKeyboard(actions[language] || actions.en);
}

// Telegram Bot Commands
telegramBot.start(async (ctx) => {
  const user = await getOrCreateUser(
    ctx.from.id, 
    ctx.from.first_name, 
    ctx.from.username,
    'telegram'
  );
  
  const language = user?.language_preference || 'en';
  const welcomeMessage = WELCOME_MESSAGES[language] || WELCOME_MESSAGES.en;
  
  await ctx.replyWithMarkdown(welcomeMessage, createQuickActionKeyboard(language));
});

telegramBot.command('language', async (ctx) => {
  await ctx.reply(
    '🌐 Please select your preferred language:\nकृपया अपनी पसंदीदा भाषा चुनें:',
    createLanguageKeyboard()
  );
});

telegramBot.command('help', async (ctx) => {
  const user = await getOrCreateUser(ctx.from.id, ctx.from.first_name, ctx.from.username, 'telegram');
  const language = user?.language_preference || 'en';

  const helpMessages = {
    en: `🤖 *SchemeSaathi Bot Help*

*What I can do:*
• Find government schemes you're eligible for
• Check eligibility for specific schemes
• Support 15+ Indian languages
• Provide scheme details and application links

*How to use:*
1. Send your details in simple format:
   \`Age City State Occupation Income\`
   
2. Or describe naturally:
   "I am 25 year old farmer from Punjab"

3. Use buttons for quick actions

*Format Examples:*
\`25 mumbai Maharashtra farmer 200000\`
\`30 delhi Delhi student 50000\`
\`35 bangalore Karnataka business 500000\`

*Commands:*
/start - Start conversation
/help - Show this help
/language - Change language
/schemes - Popular schemes

Just start typing your details! 💬`,

    hi: `🤖 *स्कीमसाथी बॉट सहायता*

*मैं क्या कर सकता हूं:*
• आपके लिए उपयुक्त सरकारी योजनाएं खोजना
• विशिष्ट योजनाओं के लिए पात्रता जांचना
• 15+ भारतीय भाषाओं में सहायता
• योजना विवरण और आवेदन लिंक प्रदान करना

*उपयोग कैसे करें:*
1. अपना विवरण सरल फॉर्मेट में भेजें:
   \`उम्र शहर राज्य व्यवसाय आय\`
   
2. या प्राकृतिक रूप से बताएं:
   "मैं पंजाब का 25 साल का किसान हूं"

3. त्वरित कार्यों के लिए बटन का उपयोग करें

*फॉर्मेट उदाहरण:*
\`25 mumbai Maharashtra farmer 200000\`
\`30 delhi Delhi student 50000\`
\`35 bangalore Karnataka business 500000\`

*कमांड:*
/start - बातचीत शुरू करें
/help - यह सहायता दिखाएं
/language - भाषा बदलें
/schemes - लोकप्रिय योजनाएं

बस अपना विवरण टाइप करना शुरू करें! 💬`
  };
  
  await ctx.replyWithMarkdown(
    helpMessages[language] || helpMessages.en,
    createQuickActionKeyboard(language)
  );
});

telegramBot.command('schemes', async (ctx) => {
  const user = await getOrCreateUser(ctx.from.id, ctx.from.first_name, ctx.from.username, 'telegram');
  const language = user?.language_preference || 'en';
  
  const schemesText = {
    en: `🏛️ *Popular Government Schemes*

🌾 *PM-KISAN*
Direct income support for farmers
₹6,000 per year | pmkisan.gov.in

🏥 *Ayushman Bharat PM-JAY*
Health insurance for families
₹5 lakh coverage | pmjay.gov.in

💼 *MUDRA Yojana*
Business loans without collateral
Up to ₹10 lakh | mudra.org.in

👩 *Beti Bachao Beti Padhao*
Girl child education support
Education benefits | wcd.nic.in

🎓 *National Scholarship*
Financial aid for students
Up to ₹2 lakh | scholarships.gov.in

💡 _Tell me your details to find schemes you're eligible for!_`,

    hi: `🏛️ *लोकप्रिय सरकारी योजनाएं*

🌾 *पीएम-किसान*
किसानों के लिए प्रत्यक्ष आय सहायता
₹6,000 प्रति वर्ष | pmkisan.gov.in

🏥 *आयुष्मान भारत पीएम-जेएवाई*
परिवारों के लिए स्वास्थ्य बीमा
₹5 लाख कवरेज | pmjay.gov.in

💼 *मुद्रा योजना*
बिना गारंटी के व्यापारिक ऋण
₹10 लाख तक | mudra.org.in

👩 *बेटी बचाओ बेटी पढ़ाओ*
बालिका शिक्षा सहायता
शिक्षा लाभ | wcd.nic.in

🎓 *राष्ट्रीय छात्रवृत्ति*
छात्रों के लिए वित्तीय सहायता
₹2 लाख तक | scholarships.gov.in

💡 _मुझे अपना विवरण बताएं ताकि मैं आपके लिए उपयुक्त योजनाएं खोज सकूं!_`
  };
  
  await ctx.replyWithMarkdown(
    schemesText[language] || schemesText.en,
    createQuickActionKeyboard(language)
  );
});

// Handle callback queries (button clicks)
telegramBot.on('callback_query', async (ctx) => {
  const data = ctx.callbackQuery.data;
  const user = await getOrCreateUser(ctx.from.id, ctx.from.first_name, ctx.from.username, 'telegram');
  let userLanguage = user?.language_preference || 'en';

  await ctx.answerCbQuery();

  if (data.startsWith('lang_')) {
    const selectedLanguage = data.replace('lang_', '');
    await updateUserLanguage(ctx.from.id, selectedLanguage, 'telegram');
    userLanguage = selectedLanguage;
    
    const confirmMessages = {
      en: `✅ Language set to ${LANGUAGES[selectedLanguage]?.name}!\n\nWhat would you like to do?`,
      hi: `✅ भाषा ${LANGUAGES[selectedLanguage]?.native} में सेट की गई!\n\nआप क्या करना चाहते हैं?`
    };
    
    await safeEditMessage(ctx,
      confirmMessages[selectedLanguage] || confirmMessages.en,
      createQuickActionKeyboard(selectedLanguage)
    );
    
  } else if (data === 'action_change_language') {
    await safeEditMessage(ctx,
      '🌐 Please select your preferred language:\nकृपया अपनी पसंदीदा भाषा चुनें:',
      createLanguageKeyboard()
    );
    
  } else if (data.startsWith('action_')) {
    // Handle quick action buttons with direct scheme filtering using Supabase
    let schemes = [];
    let responseMessage = '';
    
    if (data === 'action_farmer') {
      schemes = await getSchemesByOccupation('farmer');
      responseMessage = userLanguage === 'hi' 
        ? '🌾 किसानों के लिए सरकारी योजनाएं:' 
        : '🌾 Government Schemes for Farmers:';
        
    } else if (data === 'action_student') {
      schemes = await getSchemesByOccupation('student');
      responseMessage = userLanguage === 'hi' 
        ? '🎓 छात्रों के लिए सरकारी योजनाएं:' 
        : '🎓 Government Schemes for Students:';
        
    } else if (data === 'action_women') {
      schemes = await getSchemesByGender('female');
      responseMessage = userLanguage === 'hi' 
        ? '👩 महिलाओं के लिए सरकारी योजनाएं:' 
        : '👩 Government Schemes for Women:';
        
    } else if (data === 'action_business') {
      schemes = await getSchemesByOccupation('business');
      responseMessage = userLanguage === 'hi' 
        ? '💼 व्यापार और स्टार्टअप योजनाएं:' 
        : '💼 Business and Startup Schemes:';
        
    } else if (data === 'action_find_schemes' || data === 'action_check_eligibility') {
      // For general actions, show all available schemes from Supabase
      schemes = await getAllSchemes();
      responseMessage = userLanguage === 'hi' 
        ? '🔍 सभी उपलब्ध सरकारी योजनाएं:\n\nव्यक्तिगत सुझाव के लिए अपना विवरण भेजें: उम्र शहर राज्य व्यवसाय आय' 
        : '🔍 All Available Government Schemes:\n\nFor personalized recommendations, send your details: Age City State Occupation Income';
        
    } else if (data === 'action_help') {
      // Show help message
      const helpMessages = {
        en: `🤖 *How to Use SchemeSaathi Bot*

*Quick Actions:*
• Use buttons below for category-wise schemes
• Send your details for personalized results

*Format:* Age City State Occupation Income
*Example:* 25 mumbai Maharashtra farmer 200000

*Commands:*
/start - Start over
/help - Show help
/language - Change language
/schemes - Popular schemes`,

        hi: `🤖 *स्कीमसाथी बॉट का उपयोग कैसे करें*

*त्वरित कार्य:*
• श्रेणी-वार योजनाओं के लिए नीचे के बटन का उपयोग करें
• व्यक्तिगत परिणामों के लिए अपना विवरण भेजें

*फॉर्मेट:* उम्र शहर राज्य व्यवसाय आय
*उदाहरण:* 25 mumbai Maharashtra farmer 200000

*कमांड:*
/start - फिर से शुरू करें
/help - सहायता दिखाएं
/language - भाषा बदलें
/schemes - लोकप्रिय योजनाएं`
      };
      
      await safeEditMessage(ctx,
        helpMessages[userLanguage] || helpMessages.en,
        {
          parse_mode: 'Markdown',
          ...createQuickActionKeyboard(userLanguage)
        }
      );
      return;
    }

    // Generate response for scheme categories
    if (schemes.length > 0) {
      let response = responseMessage + '\n\n';
      
      schemes.forEach((scheme, index) => {
        response += `${index + 1}. *${scheme.name}*\n`;
        response += `💰 ${scheme.benefits}\n`;
        response += `🔗 [Apply Here](${scheme.url})\n\n`;
      });
      
      const moreInfo = userLanguage === 'hi' 
        ? '💡 व्यक्तिगत सुझाव के लिए अपना विवरण भेजें: उम्र शहर राज्य व्यवसाय आय'
        : '💡 For personalized recommendations, send your details: Age City State Occupation Income';
      
      response += moreInfo;
      
      await safeEditMessage(ctx, response, {
        parse_mode: 'Markdown',
        ...createQuickActionKeyboard(userLanguage)
      });
    } else {
      // Fallback if no schemes found
      const noSchemesMsg = userLanguage === 'hi' 
        ? '❌ इस श्रेणी के लिए कोई योजना उपलब्ध नहीं है। कृपया अन्य विकल्प आज़माएं।'
        : '❌ No schemes available for this category. Please try other options.';
        
      await safeEditMessage(ctx, noSchemesMsg, createQuickActionKeyboard(userLanguage));
    }
  }
});

// Handle text messages
telegramBot.on('text', async (ctx) => {
  if (ctx.message.text.startsWith('/')) return;

  const messageText = ctx.message.text;
  
  try {
    // Show typing indicator
    await ctx.sendChatAction('typing');

    // Process the message
    const response = await processMessage(
      messageText,
      ctx.from.id,
      ctx.from.first_name,
      ctx.from.username,
      'telegram'
    );

    // Send response with quick actions
    const user = await getOrCreateUser(ctx.from.id, ctx.from.first_name, ctx.from.username, 'telegram');
    const userLanguage = user?.language_preference || 'en';
    
    await ctx.replyWithMarkdown(response, createQuickActionKeyboard(userLanguage));
    
  } catch (error) {
    console.error('Error processing Telegram message:', error);

    const errorMessages = {
      en: '❌ Sorry, I encountered an error. Please try again or use /help for assistance.',
      hi: '❌ माफ करें, मुझे एक त्रुटि का सामना करना पड़ा। कृपया पुनः प्रयास करें या सहायता के लिए /help का उपयोग करें।'
    };

    await ctx.reply(errorMessages.en);
  }
});

// Handle stickers and other media
telegramBot.on('sticker', async (ctx) => {
  const user = await getOrCreateUser(ctx.from.id, ctx.from.first_name, ctx.from.username, 'telegram');
  const userLanguage = user?.language_preference || 'en';

  const responses = {
    en: 'Nice sticker! 🎨 But I can help you better with text messages about government schemes. Try asking me about schemes you might be eligible for!',
    hi: 'अच्छा स्टिकर! 🎨 लेकिन मैं सरकारी योजनाओं के बारे में टेक्स्ट संदेशों के साथ आपकी बेहतर मदद कर सकता हूं। मुझसे उन योजनाओं के बारे में पूछें जिनके लिए आप पात्र हो सकते हैं!'
  };

  await ctx.reply(responses[userLanguage] || responses.en);
});

// Error handling
telegramBot.catch((err, ctx) => {
  console.error('Telegram bot error:', err);
  if (ctx && ctx.reply) {
    ctx.reply('Sorry, something went wrong. Please try again or use /help for assistance.');
  }
});

// Start both bots
async function startUnifiedBot() {
  try {
    // Start WhatsApp client
    console.log('🔄 Initializing WhatsApp client...');
    await whatsappClient.initialize();
    
    // Start Telegram bot
    console.log('🔄 Starting Telegram bot...');
    await telegramBot.launch();
    
    console.log('🎉 SchemeSaathi Unified Bot is running!');
    console.log('📱 WhatsApp: Ready for QR scan');
    console.log(`🤖 Telegram: @${process.env.BOT_USERNAME}`);
    console.log('🌐 Supporting 15+ Indian languages');
    console.log('🔄 Message sync:', MESSAGE_SYNC_ENABLED ? 'Enabled' : 'Disabled');
    console.log('Press Ctrl+C to stop');
    
  } catch (error) {
    console.error('❌ Failed to start unified bot:', error);
    process.exit(1);
  }
}

// Error handling to prevent crashes
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  // Don't exit, just log the error
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit, just log the error
});

// Graceful shutdown
process.once('SIGINT', async () => {
  console.log('\n🛑 Stopping unified bot...');
  
  try {
    await whatsappClient.destroy();
    console.log('✅ WhatsApp client stopped');
  } catch (error) {
    console.error('❌ Error stopping WhatsApp client:', error);
  }
  
  try {
    telegramBot.stop('SIGINT');
    console.log('✅ Telegram bot stopped');
  } catch (error) {
    console.error('❌ Error stopping Telegram bot:', error);
  }
  
  // Clear all states
  userStates.clear();
  console.log('✅ Cleared user states');
  
  process.exit(0);
});

process.once('SIGTERM', async () => {
  console.log('\n🛑 Stopping unified bot...');
  
  try {
    await whatsappClient.destroy();
    telegramBot.stop('SIGTERM');
    userStates.clear();
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
  }
  
  process.exit(0);
});

// Start the unified bot
startUnifiedBot();