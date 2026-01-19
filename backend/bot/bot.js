const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize services
const bot = new Telegraf(process.env.BOT_TOKEN);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Perplexity API configuration
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

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
  mai: { name: 'Maithili', native: 'मैथिली', flag: '🇮🇳' },
};

// Welcome messages in different languages
const WELCOME_MESSAGES = {
  en: `🇮🇳 <b>Welcome to SchemeSaathi!</b>

I'm your AI assistant for Indian government schemes. I can help you in 15+ Indian languages!

<b>What I can do:</b>
• Find government schemes you're eligible for
• Check eligibility for specific schemes
• Provide scheme details and application links
• Support multiple Indian languages

<b>How to use:</b>
Simply send me your details in this format:
<code>Age City State Occupation Income</code>

<b>Example:</b>
<code>25 mumbai Maharashtra farmer 200000</code>

Or describe in natural language:
"I am 25 years old farmer from Maharashtra"

<b>Commands:</b>
/language - Change language
/help - Show help
/schemes - Popular schemes

मैं आपकी हिंदी में भी मदद कर सकता हूं! 🙏`,

  hi: `🇮🇳 <b>स्कीमसाथी में आपका स्वागत है!</b>

मैं भारतीय सरकारी योजनाओं के लिए आपका AI सहायक हूं। मैं 15+ भारतीय भाषाओं में आपकी मदद कर सकता हूं!

<b>मैं क्या कर सकता हूं:</b>
• आपके लिए उपयुक्त सरकारी योजनाएं खोजना
• विशिष्ट योजनाओं के लिए पात्रता जांचना
• योजना विवरण और आवेदन लिंक प्रदान करना
• कई भारतीय भाषाओं में सहायता

<b>उपयोग कैसे करें:</b>
बस मुझे इस फॉर्मेट में अपना विवरण भेजें:
<code>उम्र शहर राज्य व्यवसाय आय</code>

<b>उदाहरण:</b>
<code>25 mumbai Maharashtra farmer 200000</code>

या प्राकृतिक भाषा में बताएं:
"मैं महाराष्ट्र का 25 साल का किसान हूं"

<b>कमांड:</b>
/language - भाषा बदलें
/help - सहायता दिखाएं
/schemes - लोकप्रिय योजनाएं

I can also help you in English! 🙏`,
};

// User management functions
async function getOrCreateUser(telegramId, firstName, username) {
  try {
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', telegramId.toString())
      .single();

    if (existingUser && !fetchError) {
      return existingUser;
    }

    // Try to create user with username first, fallback without username if column doesn't exist
    let userData = {
      telegram_id: telegramId.toString(),
      first_name: firstName,
      language_preference: 'en',
      eligibility_data: {},
      conversation_history: [],
    };

    // Add username if provided
    if (username) {
      userData.username = username;
    }

    const { data: newUser, error: createError } = await supabase.from('users').insert(userData).select().single();

    if (createError) {
      console.error('Error creating user:', createError);

      // If username column doesn't exist, try without it
      if (createError.message && createError.message.includes('username')) {
        console.log('Retrying user creation without username column...');
        const { username: _, ...userDataWithoutUsername } = userData;

        const { data: retryUser, error: retryError } = await supabase
          .from('users')
          .insert(userDataWithoutUsername)
          .select()
          .single();

        if (retryError) {
          console.error('Error creating user (retry):', retryError);
          return null;
        }

        return retryUser;
      }

      return null;
    }

    return newUser;
  } catch (error) {
    console.error('Error in getOrCreateUser:', error);
    return null;
  }
}

async function updateUserLanguage(telegramId, language) {
  try {
    const { error } = await supabase
      .from('users')
      .update({
        language_preference: language,
        updated_at: new Date().toISOString(),
      })
      .eq('telegram_id', telegramId.toString());

    if (error) {
      console.error('Error updating user language:', error);
    }
  } catch (error) {
    console.error('Error in updateUserLanguage:', error);
  }
}

// AI functions
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
  const prompt = `You are SchemeSaathi, a helpful Telegram bot for Indian government schemes.

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

function generateFallbackResponse(eligibility, schemes, language = 'en') {
  const responses = {
    en: {
      greeting: '🇮🇳 Based on your details, here are the schemes you might be eligible for:',
      noSchemes: '❌ No specific schemes found for your criteria. Please provide more details or try different format:',
      format: 'Format: Age City State Occupation Income\nExample: 25 mumbai Maharashtra farmer 200000',
      schemes: '✅ Matching Schemes:',
      moreInfo: '💡 For more schemes, try /schemes command or provide additional details.',
      aiError: '⚠️ AI service temporarily unavailable. Using basic matching.',
    },
    hi: {
      greeting: '🇮🇳 आपके विवरण के आधार पर, यहाँ वे योजनाएं हैं जिनके लिए आप पात्र हो सकते हैं:',
      noSchemes: '❌ आपके मापदंड के लिए कोई विशिष्ट योजना नहीं मिली। कृपया अधिक विवरण प्रदान करें:',
      format: 'फॉर्मेट: उम्र शहर राज्य व्यवसाय आय\nउदाहरण: 25 mumbai Maharashtra farmer 200000',
      schemes: '✅ मैचिंग योजनाएं:',
      moreInfo: '💡 अधिक योजनाओं के लिए, /schemes कमांड आज़माएं या अतिरिक्त विवरण प्रदान करें।',
      aiError: '⚠️ AI सेवा अस्थायी रूप से अनुपलब्ध। बेसिक मैचिंग का उपयोग कर रहे हैं।',
    },
  };

  const lang = responses[language] || responses.en;
  let response = lang.aiError + '\n\n';

  if (schemes.length === 0) {
    response += lang.noSchemes + '\n\n' + lang.format + '\n\n' + lang.moreInfo;
    return response;
  }

  response += lang.greeting + '\n\n' + lang.schemes + '\n\n';

  schemes.forEach((scheme, index) => {
    response += `${index + 1}. **${scheme.name}**\n`;
    response += `💰 ${scheme.benefits}\n`;
    response += `🔗 ${scheme.url}\n\n`;
  });

  response += lang.moreInfo;
  return response;
}

// Mock schemes data
const MOCK_SCHEMES = [
  {
    id: 'pm-kisan',
    name: 'PM-KISAN',
    description: 'Direct income support to farmers',
    benefits: '₹6,000 per year in 3 installments',
    eligibility: { occupation: ['farmer'], landOwnership: true },
    url: 'https://pmkisan.gov.in/',
  },
  {
    id: 'ayushman-bharat',
    name: 'Ayushman Bharat PM-JAY',
    description: 'Health insurance for economically vulnerable families',
    benefits: '₹5 lakh per family per year health coverage',
    eligibility: { income_max: 500000, category: ['BPL'] },
    url: 'https://pmjay.gov.in/',
  },
  {
    id: 'mudra-loan',
    name: 'Pradhan Mantri MUDRA Yojana',
    description: 'Micro finance for small businesses',
    benefits: 'Loans up to ₹10 lakh without collateral',
    eligibility: { occupation: ['business', 'entrepreneur'], age_min: 18, age_max: 65 },
    url: 'https://mudra.org.in/',
  },
  {
    id: 'beti-bachao',
    name: 'Beti Bachao Beti Padhao',
    description: 'Girl child education and empowerment scheme',
    benefits: 'Financial support for girl child education and safety',
    eligibility: { gender: 'female', age_max: 18 },
    url: 'https://wcd.nic.in/bbbp-scheme',
  },
  {
    id: 'national-scholarship',
    name: 'National Scholarship Portal',
    description: 'Financial assistance for students',
    benefits: 'Scholarships up to ₹2 lakh per year',
    eligibility: { occupation: ['student'], age_min: 16, age_max: 25, income_max: 800000 },
    url: 'https://scholarships.gov.in/',
  },
  {
    id: 'kisan-credit-card',
    name: 'Kisan Credit Card',
    description: 'Credit facility for farmers',
    benefits: 'Easy credit access for agricultural needs',
    eligibility: { occupation: ['farmer'] },
    url: 'https://pmkisan.gov.in/KCCStaticReport.aspx',
  },
  {
    id: 'stand-up-india',
    name: 'Stand Up India',
    description: 'Bank loans for SC/ST and women entrepreneurs',
    benefits: 'Loans between ₹10 lakh to ₹1 crore',
    eligibility: { occupation: ['business', 'entrepreneur'], gender: 'female' },
    url: 'https://standupmitra.in/',
  },
  {
    id: 'sukanya-samriddhi',
    name: 'Sukanya Samriddhi Yojana',
    description: 'Savings scheme for girl child',
    benefits: 'High interest savings for girl child education and marriage',
    eligibility: { gender: 'female', age_max: 10 },
    url: 'https://www.nsiindia.gov.in/InternalPage.aspx?Id_Pk=61',
  },
];

function filterSchemes(eligibility) {
  return MOCK_SCHEMES.filter((scheme) => {
    let matches = 0;
    let totalCriteria = 0;

    // Check occupation match
    if (eligibility.occupation && scheme.eligibility.occupation) {
      totalCriteria++;
      const userOccupation = eligibility.occupation.toLowerCase();
      const schemeOccupations = scheme.eligibility.occupation.map((occ) => occ.toLowerCase());

      if (schemeOccupations.some((occ) => userOccupation.includes(occ) || occ.includes(userOccupation))) {
        matches++;
      }
    }

    // Check income match
    if (eligibility.income && scheme.eligibility.income_max) {
      totalCriteria++;
      if (eligibility.income <= scheme.eligibility.income_max) {
        matches++;
      }
    }

    // Check age match
    if (eligibility.age && (scheme.eligibility.age_min || scheme.eligibility.age_max)) {
      totalCriteria++;
      const ageMatch =
        (!scheme.eligibility.age_min || eligibility.age >= scheme.eligibility.age_min) &&
        (!scheme.eligibility.age_max || eligibility.age <= scheme.eligibility.age_max);
      if (ageMatch) {
        matches++;
      }
    }

    // If no specific criteria, include popular schemes
    if (totalCriteria === 0) {
      return ['pm-kisan', 'ayushman-bharat', 'mudra-loan'].includes(scheme.id);
    }

    // Return schemes that match at least 50% of criteria
    return matches > 0 && matches / totalCriteria >= 0.5;
  });
}

// Create language selection keyboard
function createLanguageKeyboard() {
  const languages = Object.entries(LANGUAGES);
  const keyboard = [];

  for (let i = 0; i < languages.length; i += 2) {
    const row = [];
    row.push(Markup.button.callback(`${languages[i][1].flag} ${languages[i][1].native}`, `lang_${languages[i][0]}`));

    if (languages[i + 1]) {
      row.push(
        Markup.button.callback(
          `${languages[i + 1][1].flag} ${languages[i + 1][1].native}`,
          `lang_${languages[i + 1][0]}`
        )
      );
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
        Markup.button.callback('✅ Check Eligibility', 'action_check_eligibility'),
      ],
      [
        Markup.button.callback('🌾 Farmer Schemes', 'action_farmer'),
        Markup.button.callback('🎓 Student Schemes', 'action_student'),
      ],
      [
        Markup.button.callback('👩 Women Schemes', 'action_women'),
        Markup.button.callback('💼 Business Schemes', 'action_business'),
      ],
      [
        Markup.button.callback('🌐 Change Language', 'action_change_language'),
        Markup.button.callback('❓ Help', 'action_help'),
      ],
    ],
    hi: [
      [
        Markup.button.callback('🔍 योजनाएं खोजें', 'action_find_schemes'),
        Markup.button.callback('✅ पात्रता जांचें', 'action_check_eligibility'),
      ],
      [
        Markup.button.callback('🌾 किसान योजनाएं', 'action_farmer'),
        Markup.button.callback('🎓 छात्र योजनाएं', 'action_student'),
      ],
      [
        Markup.button.callback('👩 महिला योजनाएं', 'action_women'),
        Markup.button.callback('💼 व्यापार योजनाएं', 'action_business'),
      ],
      [
        Markup.button.callback('🌐 भाषा बदलें', 'action_change_language'),
        Markup.button.callback('❓ सहायता', 'action_help'),
      ],
    ],
  };

  return Markup.inlineKeyboard(actions[language] || actions.en);
}

// Bot commands
bot.start(async (ctx) => {
  const user = await getOrCreateUser(ctx.from.id, ctx.from.first_name, ctx.from.username);

  const language = user?.language_preference || 'en';
  const welcomeMessage = WELCOME_MESSAGES[language] || WELCOME_MESSAGES.en;

  await ctx.replyWithHTML(welcomeMessage, createQuickActionKeyboard(language));
});

bot.command('language', async (ctx) => {
  await ctx.reply(
    '🌐 Please select your preferred language:\nकृपया अपनी पसंदीदा भाषा चुनें:',
    createLanguageKeyboard()
  );
});

bot.command('help', async (ctx) => {
  const user = await getOrCreateUser(ctx.from.id, ctx.from.first_name, ctx.from.username);
  const language = user?.language_preference || 'en';

  const helpMessages = {
    en: `🤖 <b>SchemeSaathi Bot Help</b>

<b>What I can do:</b>
• Find government schemes you're eligible for
• Check eligibility for specific schemes
• Support 15+ Indian languages
• Provide scheme details and application links

<b>How to use:</b>
1. Send your details in simple format:
   <code>Age City State Occupation Income</code>
   
2. Or describe naturally:
   "I am 25 year old farmer from Punjab"

3. Use buttons for quick actions

<b>Format Examples:</b>
<code>25 mumbai Maharashtra farmer 200000</code>
<code>30 delhi Delhi student 50000</code>
<code>35 bangalore Karnataka business 500000</code>

<b>Commands:</b>
/start - Start conversation
/help - Show this help
/language - Change language
/schemes - Popular schemes

Just start typing your details! 💬`,

    hi: `🤖 <b>स्कीमसाथी बॉट सहायता</b>

<b>मैं क्या कर सकता हूं:</b>
• आपके लिए उपयुक्त सरकारी योजनाएं खोजना
• विशिष्ट योजनाओं के लिए पात्रता जांचना
• 15+ भारतीय भाषाओं में सहायता
• योजना विवरण और आवेदन लिंक प्रदान करना

<b>उपयोग कैसे करें:</b>
1. अपना विवरण सरल फॉर्मेट में भेजें:
   <code>उम्र शहर राज्य व्यवसाय आय</code>
   
2. या प्राकृतिक रूप से बताएं:
   "मैं पंजाब का 25 साल का किसान हूं"

3. त्वरित कार्यों के लिए बटन का उपयोग करें

<b>फॉर्मेट उदाहरण:</b>
<code>25 mumbai Maharashtra farmer 200000</code>
<code>30 delhi Delhi student 50000</code>
<code>35 bangalore Karnataka business 500000</code>

<b>कमांड:</b>
/start - बातचीत शुरू करें
/help - यह सहायता दिखाएं
/language - भाषा बदलें
/schemes - लोकप्रिय योजनाएं

बस अपना विवरण टाइप करना शुरू करें! 💬`,
  };

  await ctx.replyWithHTML(helpMessages[language] || helpMessages.en, createQuickActionKeyboard(language));
});

bot.command('schemes', async (ctx) => {
  const user = await getOrCreateUser(ctx.from.id, ctx.from.first_name, ctx.from.username);
  const language = user?.language_preference || 'en';

  const schemesText = {
    en: `🏛️ <b>Popular Government Schemes</b>

🌾 <b>PM-KISAN</b>
Direct income support for farmers
₹6,000 per year | pmkisan.gov.in

🏥 <b>Ayushman Bharat PM-JAY</b>
Health insurance for families
₹5 lakh coverage | pmjay.gov.in

💼 <b>MUDRA Yojana</b>
Business loans without collateral
Up to ₹10 lakh | mudra.org.in

👩 <b>Beti Bachao Beti Padhao</b>
Girl child education support
Education benefits | wcd.nic.in

🎓 <b>National Scholarship</b>
Financial aid for students
Up to ₹2 lakh | scholarships.gov.in

💡 <i>Tell me your details to find schemes you're eligible for!</i>`,

    hi: `🏛️ <b>लोकप्रिय सरकारी योजनाएं</b>

🌾 <b>पीएम-किसान</b>
किसानों के लिए प्रत्यक्ष आय सहायता
₹6,000 प्रति वर्ष | pmkisan.gov.in

🏥 <b>आयुष्मान भारत पीएम-जेएवाई</b>
परिवारों के लिए स्वास्थ्य बीमा
₹5 लाख कवरेज | pmjay.gov.in

💼 <b>मुद्रा योजना</b>
बिना गारंटी के व्यापारिक ऋण
₹10 लाख तक | mudra.org.in

👩 <b>बेटी बचाओ बेटी पढ़ाओ</b>
बालिका शिक्षा सहायता
शिक्षा लाभ | wcd.nic.in

🎓 <b>राष्ट्रीय छात्रवृत्ति</b>
छात्रों के लिए वित्तीय सहायता
₹2 लाख तक | scholarships.gov.in

💡 <i>मुझे अपना विवरण बताएं ताकि मैं आपके लिए उपयुक्त योजनाएं खोज सकूं!</i>`,
  };

  await ctx.replyWithHTML(schemesText[language] || schemesText.en, createQuickActionKeyboard(language));
});

// Handle callback queries
bot.on('callback_query', async (ctx) => {
  const data = ctx.callbackQuery.data;
  const user = await getOrCreateUser(ctx.from.id, ctx.from.first_name, ctx.from.username);
  let userLanguage = user?.language_preference || 'en';

  await ctx.answerCbQuery();

  if (data.startsWith('lang_')) {
    const selectedLanguage = data.replace('lang_', '');
    await updateUserLanguage(ctx.from.id, selectedLanguage);
    userLanguage = selectedLanguage;

    const confirmMessages = {
      en: `✅ Language set to ${LANGUAGES[selectedLanguage]?.name}!\n\nWhat would you like to do?`,
      hi: `✅ भाषा ${LANGUAGES[selectedLanguage]?.native} में सेट की गई!\n\nआप क्या करना चाहते हैं?`,
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
    // Handle quick action buttons with direct scheme filtering
    let schemes = [];
    let responseMessage = '';
    
    if (data === 'action_farmer') {
      schemes = MOCK_SCHEMES.filter(scheme => 
        scheme.eligibility.occupation && scheme.eligibility.occupation.includes('farmer')
      );
      responseMessage = userLanguage === 'hi' 
        ? '🌾 किसानों के लिए सरकारी योजनाएं:' 
        : '🌾 Government Schemes for Farmers:';
        
    } else if (data === 'action_student') {
      schemes = MOCK_SCHEMES.filter(scheme => 
        scheme.eligibility.occupation && scheme.eligibility.occupation.includes('student')
      );
      responseMessage = userLanguage === 'hi' 
        ? '🎓 छात्रों के लिए सरकारी योजनाएं:' 
        : '🎓 Government Schemes for Students:';
        
    } else if (data === 'action_women') {
      schemes = MOCK_SCHEMES.filter(scheme => 
        scheme.eligibility.gender === 'female'
      );
      responseMessage = userLanguage === 'hi' 
        ? '👩 महिलाओं के लिए सरकारी योजनाएं:' 
        : '👩 Government Schemes for Women:';
        
    } else if (data === 'action_business') {
      schemes = MOCK_SCHEMES.filter(scheme => 
        scheme.eligibility.occupation && 
        (scheme.eligibility.occupation.includes('business') || scheme.eligibility.occupation.includes('entrepreneur'))
      );
      responseMessage = userLanguage === 'hi' 
        ? '💼 व्यापार और स्टार्टअप योजनाएं:' 
        : '💼 Business and Startup Schemes:';
        
    } else if (data === 'action_find_schemes' || data === 'action_check_eligibility') {
      // For general actions, show all available schemes
      schemes = MOCK_SCHEMES; // Show all schemes
      responseMessage = userLanguage === 'hi' 
        ? '🔍 सभी उपलब्ध सरकारी योजनाएं:\n\nव्यक्तिगत सुझाव के लिए अपना विवरण भेजें: उम्र शहर राज्य व्यवसाय आय' 
        : '🔍 All Available Government Schemes:\n\nFor personalized recommendations, send your details: Age City State Occupation Income';
        
    } else if (data === 'action_help') {
      // Show help message
      const helpMessages = {
        en: `🤖 <b>How to Use SchemeSaathi Bot</b>

<b>Quick Actions:</b>
• Use buttons below for category-wise schemes
• Send your details for personalized results

<b>Format:</b> Age City State Occupation Income
<b>Example:</b> 25 mumbai Maharashtra farmer 200000

<b>Commands:</b>
/start - Start over
/help - Show help
/language - Change language
/schemes - Popular schemes`,

        hi: `🤖 <b>स्कीमसाथी बॉट का उपयोग कैसे करें</b>

<b>त्वरित कार्य:</b>
• श्रेणी-वार योजनाओं के लिए नीचे के बटन का उपयोग करें
• व्यक्तिगत परिणामों के लिए अपना विवरण भेजें

<b>फॉर्मेट:</b> उम्र शहर राज्य व्यवसाय आय
<b>उदाहरण:</b> 25 mumbai Maharashtra farmer 200000

<b>कमांड:</b>
/start - फिर से शुरू करें
/help - सहायता दिखाएं
/language - भाषा बदलें
/schemes - लोकप्रिय योजनाएं`
      };
      
      await safeEditMessage(ctx,
        helpMessages[userLanguage] || helpMessages.en,
        {
          parse_mode: 'HTML',
          ...createQuickActionKeyboard(userLanguage)
        }
      );
      return;
    }

    // Generate response for scheme categories
    if (schemes.length > 0) {
      let response = responseMessage + '\n\n';
      
      schemes.forEach((scheme, index) => {
        response += `${index + 1}. <b>${scheme.name}</b>\n`;
        response += `💰 ${scheme.benefits}\n`;
        response += `🔗 <a href="${scheme.url}">Apply Here</a>\n\n`;
      });
      
      const moreInfo = userLanguage === 'hi' 
        ? '💡 व्यक्तिगत सुझाव के लिए अपना विवरण भेजें: उम्र शहर राज्य व्यवसाय आय'
        : '💡 For personalized recommendations, send your details: Age City State Occupation Income';
      
      response += moreInfo;
      
      try {
        await safeEditMessage(ctx, response, {
          parse_mode: 'HTML',
          ...createQuickActionKeyboard(userLanguage)
        });
      } catch (error) {
        // Handle "message is not modified" error - ignore it as it's not critical
        if (error.response?.error_code === 400 && 
            error.response?.description?.includes('message is not modified')) {
          console.log('Message content unchanged, skipping edit');
          // Just answer the callback query to acknowledge the button press
          await ctx.answerCbQuery('Already showing this content');
        } else {
          throw error; // Re-throw other errors
        }
      }
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
bot.on('text', async (ctx) => {
  if (ctx.message.text.startsWith('/')) return;

  const user = await getOrCreateUser(ctx.from.id, ctx.from.first_name, ctx.from.username);
  const userLanguage = user?.language_preference || 'en';

  try {
    // Show typing indicator
    await ctx.sendChatAction('typing');

    // Extract eligibility from user message
    const eligibility = await extractEligibility(ctx.message.text);
    console.log('Extracted eligibility:', eligibility);

    // Filter schemes based on eligibility
    const matchingSchemes = filterSchemes(eligibility);
    console.log(`Found ${matchingSchemes.length} matching schemes`);

    // Generate response
    const response = await generateResponse(eligibility, matchingSchemes, userLanguage);

    // Send response with quick actions
    await ctx.replyWithHTML(response, createQuickActionKeyboard(userLanguage));
  } catch (error) {
    console.error('Error processing message:', error);

    const errorMessages = {
      en: '❌ Sorry, I encountered an error. Please try again or use /help for assistance.',
      hi: '❌ माफ करें, मुझे एक त्रुटि का सामना करना पड़ा। कृपया पुनः प्रयास करें या सहायता के लिए /help का उपयोग करें।',
    };

    await ctx.reply(errorMessages[userLanguage] || errorMessages.en);
  }
});

// Handle stickers and other media
bot.on('sticker', async (ctx) => {
  const user = await getOrCreateUser(ctx.from.id, ctx.from.first_name, ctx.from.username);
  const userLanguage = user?.language_preference || 'en';

  const responses = {
    en: 'Nice sticker! 🎨 But I can help you better with text messages about government schemes. Try asking me about schemes you might be eligible for!',
    hi: 'अच्छा स्टिकर! 🎨 लेकिन मैं सरकारी योजनाओं के बारे में टेक्स्ट संदेशों के साथ आपकी बेहतर मदद कर सकता हूं। मुझसे उन योजनाओं के बारे में पूछें जिनके लिए आप पात्र हो सकते हैं!',
  };

  await ctx.reply(responses[userLanguage] || responses.en);
});

// Error handling
bot.catch((err, ctx) => {
  console.error('Bot error:', err);
  ctx.reply('Sorry, something went wrong. Please try again or use /help for assistance.');
});

// Start the bot
console.log('🚀 Starting SchemeSaathi Telegram Bot...');
console.log('🔧 Initializing services...');
console.log('📡 Bot token configured:', process.env.BOT_TOKEN ? 'Yes' : 'No');
console.log('�️ Supabase configured:', process.env.SUPABASE_URL ? 'Yes' : 'No');
console.log('🤖 Perplexity configured:', process.env.PERPLEXITY_API_KEY ? 'Yes' : 'No');

bot
  .launch()
  .then(() => {
    console.log('🤖 SchemeSaathi Bot is running!');
    console.log(`📱 Bot username: @${process.env.BOT_USERNAME}`);
    console.log('🌐 Supporting 15+ Indian languages');
    console.log('🏛️ Ready to help with government schemes');
    console.log('Press Ctrl+C to stop');
  })
  .catch((err) => {
    console.error('❌ Failed to start bot:', err);
  });

// Graceful shutdown
process.once('SIGINT', () => {
  console.log('\n🛑 Stopping bot...');
  bot.stop('SIGINT');
});

process.once('SIGTERM', () => {
  console.log('\n🛑 Stopping bot...');
  bot.stop('SIGTERM');
});

// Mock schemes data - only eligible schemes will be returned
