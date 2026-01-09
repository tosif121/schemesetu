import { NextRequest, NextResponse } from 'next/server'
import { 
  sendTelegramMessage, 
  sendTelegramMessageWithKeyboard,
  answerCallbackQuery,
  createLanguageKeyboard,
  createQuickActionKeyboard,
  formatTelegramMessage
} from '@/app/lib/telegram'
import { handleUserMessage } from '@/app/lib/message-handler'
import { getOrCreateTelegramUser, updateUserLanguage } from '@/app/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Telegram webhook received:', JSON.stringify(body, null, 2))

    // Handle different types of updates
    if (body.message) {
      await handleMessage(body.message)
    } else if (body.callback_query) {
      await handleCallbackQuery(body.callback_query)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error processing Telegram webhook:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function handleMessage(message: any) {
  const chatId = message.chat.id
  const userId = message.from.id
  const text = message.text || ''
  const firstName = message.from.first_name || 'User'

  console.log(`Telegram message from ${firstName} (${userId}): ${text}`)

  try {
    // Get or create user
    const user = await getOrCreateTelegramUser(userId.toString(), firstName)
    const userLanguage = user.language_preference || 'en'

    // Handle commands
    if (text.startsWith('/start')) {
      await handleStartCommand(chatId, text, userLanguage, firstName)
      return
    }

    if (text.startsWith('/help')) {
      await handleHelpCommand(chatId, userLanguage)
      return
    }

    if (text.startsWith('/language')) {
      await handleLanguageCommand(chatId)
      return
    }

    // Handle regular messages through shared message handler
    const response = await handleUserMessage(text, userId.toString(), userLanguage, 'telegram')
    
    // Send response with quick action keyboard
    await sendTelegramMessageWithKeyboard(
      chatId,
      formatTelegramMessage(response),
      createQuickActionKeyboard(userLanguage)
    )

  } catch (error) {
    console.error('Error handling Telegram message:', error)
    
    // Send error message
    const errorMessages = {
      en: '❌ Sorry, I encountered an error. Please try again or contact support.',
      hi: '❌ माफ करें, मुझे एक त्रुटि का सामना करना पड़ा। कृपया पुनः प्रयास करें या सहायता से संपर्क करें।',
      ta: '❌ மன்னிக்கவும், எனக்கு ஒரு பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும் அல்லது ஆதரவைத் தொடர்பு கொள்ளவும்.',
      bn: '❌ দুঃখিত, আমি একটি ত্রুটির সম্মুখীন হয়েছি। অনুগ্রহ করে আবার চেষ্টা করুন বা সহায়তার সাথে যোগাযোগ করুন।'
    }
    
    // Get user language or default to English
    let userLanguage = 'en'
    try {
      const user = await getOrCreateTelegramUser(userId.toString(), firstName)
      userLanguage = user.language_preference || 'en'
    } catch (langError) {
      console.error('Error getting user language:', langError)
    }
    
    await sendTelegramMessage(
      chatId, 
      errorMessages[userLanguage as keyof typeof errorMessages] || errorMessages.en
    )
  }
}

async function handleCallbackQuery(callbackQuery: any) {
  const chatId = callbackQuery.message.chat.id
  const messageId = callbackQuery.message.message_id
  const userId = callbackQuery.from.id
  const data = callbackQuery.data
  const firstName = callbackQuery.from.first_name || 'User'

  console.log(`Telegram callback from ${firstName} (${userId}): ${data}`)

  try {
    // Answer the callback query first
    await answerCallbackQuery(callbackQuery.id)

    // Get or create user
    const user = await getOrCreateTelegramUser(userId.toString(), firstName)
    let userLanguage = user.language_preference || 'en'

    // Handle different callback actions
    if (data.startsWith('lang_')) {
      const selectedLanguage = data.replace('lang_', '')
      await updateUserLanguage(userId.toString(), selectedLanguage, 'telegram')
      userLanguage = selectedLanguage
      
      const welcomeMessages = {
        en: `🌟 Language set to English! 

I'm SchemeSaathi, your AI assistant for Indian government schemes. I can help you find schemes you're eligible for in 15+ Indian languages.

What would you like to do?`,
        hi: `🌟 भाषा हिंदी में सेट की गई!

मैं स्कीमसाथी हूं, भारतीय सरकारी योजनाओं के लिए आपका AI सहायक। मैं 15+ भारतीय भाषाओं में आपकी मदद कर सकता हूं।

आप क्या करना चाहते हैं?`,
        ta: `🌟 மொழி தமிழில் அமைக்கப்பட்டது!

நான் ஸ்கீம்சாத்தி, இந்திய அரசு திட்டங்களுக்கான உங்கள் AI உதவியாளர். நான் 15+ இந்திய மொழிகளில் உங்களுக்கு உதவ முடியும்।

நீங்கள் என்ன செய்ய விரும்புகிறீர்கள்?`,
        bn: `🌟 ভাষা বাংলায় সেট করা হয়েছে!

আমি স্কিমসাথী, ভারতীয় সরকারি প্রকল্পের জন্য আপনার AI সহায়ক। আমি ১৫+ ভারতীয় ভাষায় আপনাকে সাহায্য করতে পারি।

আপনি কী করতে চান?`
      }
      
      await sendTelegramMessageWithKeyboard(
        chatId,
        welcomeMessages[userLanguage as keyof typeof welcomeMessages] || welcomeMessages.en,
        createQuickActionKeyboard(userLanguage)
      )
      
    } else if (data === 'action_change_language') {
      const languageMessages = {
        en: '🌐 Please select your preferred language:',
        hi: '🌐 कृपया अपनी पसंदीदा भाषा चुनें:',
        ta: '🌐 தயவுசெய்து உங்கள் விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்:',
        bn: '🌐 অনুগ্রহ করে আপনার পছন্দের ভাষা নির্বাচন করুন:'
      }
      
      await sendTelegramMessageWithKeyboard(
        chatId,
        languageMessages[userLanguage as keyof typeof languageMessages] || languageMessages.en,
        createLanguageKeyboard()
      )
      
    } else if (data.startsWith('action_')) {
      // Handle action callbacks through message handler
      const actionMessages = {
        action_find_schemes: {
          en: '🔍 I want to find government schemes I\'m eligible for',
          hi: '🔍 मैं उन सरकारी योजनाओं को खोजना चाहता हूं जिनके लिए मैं पात्र हूं',
          ta: '🔍 நான் தகுதியான அரசு திட்டங்களைக் கண்டறிய விரும்புகிறேன்',
          bn: '🔍 আমি যোগ্য সরকারি প্রকল্প খুঁজে পেতে চাই'
        },
        action_check_eligibility: {
          en: '✅ I want to check my eligibility for government schemes',
          hi: '✅ मैं सरকारी योजनाओं के लिए अपनी पात्रता जांचना चाहता हूं',
          ta: '✅ அரசு திட்டங்களுக்கான எனது தகுதியை சரிபார்க்க விரும்புகிறேன்',
          bn: '✅ আমি সরকারি প্রকল্পের জন্য আমার যোগ্যতা পরীক্ষা করতে চাই'
        },
        action_farmer: {
          en: '🌾 I am a farmer looking for agricultural schemes',
          hi: '🌾 मैं एक किसान हूं और कृषि योजनाओं की तलाश में हूं',
          ta: '🌾 நான் ஒரு விவசாயி, விவசாய திட்டங்களைத் தேடுகிறேன்',
          bn: '🌾 আমি একজন কৃষক এবং কৃষি প্রকল্প খুঁজছি'
        },
        action_student: {
          en: '🎓 I am a student looking for scholarships',
          hi: '🎓 मैं एक छात্र हूं और छात्रवृत्ति की तलाश में हूं',
          ta: '🎓 நான் ஒரு மாணவர், உதவித்தொகை தேடுகிறேன்',
          bn: '🎓 আমি একজন ছাত্র এবং বৃত্তি খুঁজছি'
        },
        action_women: {
          en: '👩 I am looking for women empowerment schemes',
          hi: '👩 मैं महिला सशक्तिकरण योजनाओं की तलाश में हूं',
          ta: '👩 நான் பெண்கள் அதிகாரமளிப்பு திட்டங்களைத் தேடுகிறேன்',
          bn: '👩 আমি নারী ক্ষমতায়ন প্রকল্প খুঁজছি'
        },
        action_business: {
          en: '💼 I am looking for business and startup schemes',
          hi: '💼 मैं व्यापार और स्टार्टअप योजनाओं की तलाश में हूं',
          ta: '💼 நான் வணிகம் மற்றும் ஸ்டார்ட்அப் திட்டங்களைத் தேடுகிறேன்',
          bn: '💼 আমি ব্যবসা এবং স্টার্টআপ প্রকল্প খুঁজছি'
        },
        action_help: {
          en: '❓ I need help using this bot',
          hi: '❓ मुझे इस बॉट का उपयोग करने में सहायता चाहिए',
          ta: '❓ இந்த பாட்டைப் பயன்படுத்த எனக்கு உதவி தேவை',
          bn: '❓ এই বট ব্যবহার করতে আমার সাহায্য দরকার'
        }
      }
      
      const actionMessage = actionMessages[data as keyof typeof actionMessages]
      if (actionMessage) {
        const message = actionMessage[userLanguage as keyof typeof actionMessage] || actionMessage.en
        const response = await handleUserMessage(message, userId.toString(), userLanguage, 'telegram')
        
        await sendTelegramMessageWithKeyboard(
          chatId,
          formatTelegramMessage(response),
          createQuickActionKeyboard(userLanguage)
        )
      }
    }

  } catch (error) {
    console.error('Error handling Telegram callback:', error)
    await answerCallbackQuery(callbackQuery.id, 'Error occurred. Please try again.')
  }
}

async function handleStartCommand(chatId: number, text: string, language: string, firstName: string) {
  // Check for start parameters
  const startParam = text.split(' ')[1]
  
  if (startParam && startParam.startsWith('lang_')) {
    const selectedLanguage = startParam.replace('lang_', '')
    await updateUserLanguage(chatId.toString(), selectedLanguage, 'telegram')
    language = selectedLanguage
  }

  const welcomeMessages = {
    en: `🇮🇳 Welcome to SchemeSaathi, ${firstName}!

I'm your AI assistant for Indian government schemes. I can help you find schemes you're eligible for in 15+ Indian languages!

Please tell me:
• Your age
• Your state/location
• Your occupation (farmer, student, business, etc.)
• Your income (optional)
• Any specific needs

Example: "I am 25 years old farmer from Maharashtra with annual income 2 lakh"

मैं आपकी हिंदी में भी मदद कर सकता हूं! 🙏

Choose an option below or just start typing:`,

    hi: `🇮🇳 स्कीमसाथी में आपका स्वागत है, ${firstName}!

मैं भारतीय सरकारी योजनाओं के लिए आपका AI सहायक हूं। मैं 15+ भारतीय भाषाओं में आपकी मदद कर सकता हूं!

कृपया बताएं:
• आपकी उम्र
• आपका राज्य/स्थान
• आपका व्यवसाय (किसान, छात्र, व्यापार आदि)
• आपकी आय (वैकल्पिक)
• कोई विशेष आवश्यकता

उदाहरण: "मैं महाराष्ट्र का 25 साल का किसान हूं, सालाना 2 लाख कमाता हूं"

I can also help you in English! 🙏

नीचे कोई विकल्प चुनें या बस टाइप करना शुरू करें:`,

    ta: `🇮🇳 ஸ்கீம்சாத்திக்கு வரவேற்கிறோம், ${firstName}!

நான் இந்திய அரசு திட்டங்களுக்கான உங்கள் AI உதவியாளர். நான் 15+ இந்திய மொழிகளில் உங்களுக்கு உதவ முடியும்!

தயவுசெய்து சொல்லுங்கள்:
• உங்கள் வயது
• உங்கள் மாநிலம்/இடம்
• உங்கள் தொழில் (விவசாயி, மாணவர், வணிகம் போன்றவை)
• உங்கள் வருமானம் (விருப்பம்)
• ஏதேனும் குறிப்பிட்ட தேவைகள்

உதாரணம்: "நான் தமிழ்நாட்டைச் சேர்ந்த 25 வயது விவசாயி, ஆண்டுக்கு 2 லட்சம் சம்பாதிக்கிறேன்"

I can also help you in English! 🙏

கீழே ஒரு விருப்பத்தைத் தேர்ந்தெடுக்கவும் அல்லது தட்டச்சு செய்யத் தொடங்குங்கள்:`,

    bn: `🇮🇳 স্কিমসাথীতে স্বাগতম, ${firstName}!

আমি ভারতীয় সরকারি প্রকল্পের জন্য আপনার AI সহায়ক। আমি ১৫+ ভারতীয় ভাষায় আপনাকে সাহায্য করতে পারি!

দয়া করে বলুন:
• আপনার বয়স
• আপনার রাজ্য/অবস্থান
• আপনার পেশা (কৃষক, ছাত্র, ব্যবসা ইত্যাদি)
• আপনার আয় (ঐচ্ছিক)
• কোন বিশেষ প্রয়োজন

উদাহরণ: "আমি পশ্চিমবঙ্গের ২৫ বছর বয়সী কৃষক, বছরে ২ লক্ষ আয় করি"

I can also help you in English! 🙏

নীচে একটি বিকল্প বেছে নিন বা শুধু টাইপ করা শুরু করুন:`
  }

  await sendTelegramMessageWithKeyboard(
    chatId,
    welcomeMessages[language as keyof typeof welcomeMessages] || welcomeMessages.en,
    createQuickActionKeyboard(language)
  )
}

async function handleHelpCommand(chatId: number, language: string) {
  const helpMessages = {
    en: `🤖 <b>SchemeSaathi Bot Help</b>

<b>What I can do:</b>
• Find government schemes you're eligible for
• Check eligibility for specific schemes
• Support 15+ Indian languages
• Provide scheme details and application links

<b>How to use:</b>
1. Tell me your details (age, state, occupation, income)
2. I'll find matching schemes for you
3. Use buttons for quick actions

<b>Commands:</b>
/start - Start conversation
/help - Show this help
/language - Change language

<b>Examples:</b>
"I am 25 year old farmer from Punjab"
"मैं राजस्थान का छात्र हूं"
"Check PM Kisan eligibility"

Just start typing your question! 💬`,

    hi: `🤖 <b>स्कीमसाथी बॉट सहायता</b>

<b>मैं क्या कर सकता हूं:</b>
• आपके लिए उपयुक्त सरकारी योजनाएं खोजना
• विशिष्ट योजनाओं के लिए पात्रता जांचना
• 15+ भारतीय भाषाओं में सहायता
• योजना विवरण और आवेदन लिंक प्रदान करना

<b>उपयोग कैसे करें:</b>
1. मुझे अपना विवरण बताएं (उम्र, राज्य, व्यवसाय, आय)
2. मैं आपके लिए मैचिंग योजनाएं खोजूंगा
3. त्वरित कार्यों के लिए बटन का उपयोग करें

<b>कमांड:</b>
/start - बातचीत शुरू करें
/help - यह सहायता दिखाएं
/language - भाषा बदलें

<b>उदाहरण:</b>
"मैं पंजाब का 25 साल का किसान हूं"
"I am a student from Rajasthan"
"पीएम किसान पात्रता जांचें"

बस अपना प्रश्न टाइप करना शुरू करें! 💬`
  }

  await sendTelegramMessage(
    chatId,
    helpMessages[language as keyof typeof helpMessages] || helpMessages.en
  )
}

async function handleLanguageCommand(chatId: number) {
  await sendTelegramMessageWithKeyboard(
    chatId,
    '🌐 Please select your preferred language:\nकृपया अपनी पसंदीदा भाषा चुनें:',
    createLanguageKeyboard()
  )
}