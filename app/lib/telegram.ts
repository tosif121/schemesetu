import TelegramBot from 'node-telegram-bot-api'

// Initialize Telegram Bot with error handling
let bot: TelegramBot | null = null

try {
  const token = process.env.TELEGRAM_BOT_TOKEN
  
  if (token && token.length > 10) {
    // Use webhook mode for production, polling for development
    const useWebhook = process.env.NODE_ENV === 'production'
    
    bot = new TelegramBot(token, { 
      polling: !useWebhook,
      webHook: useWebhook
    })
    
    console.log('Telegram bot initialized successfully')
    
    // Set webhook URL in production
    if (useWebhook && process.env.TELEGRAM_WEBHOOK_URL) {
      bot.setWebHook(`${process.env.TELEGRAM_WEBHOOK_URL}/api/telegram/webhook`)
        .then(() => console.log('Telegram webhook set successfully'))
        .catch(err => console.error('Failed to set Telegram webhook:', err))
    }
  } else {
    console.warn('Telegram bot token not configured. Messages will be logged instead of sent.')
  }
} catch (error) {
  console.error('Failed to initialize Telegram bot:', error)
}

// Send message with error handling
export async function sendTelegramMessage(chatId: number | string, text: string, options?: any) {
  try {
    if (bot) {
      const message = await bot.sendMessage(chatId, text, {
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        ...options
      })
      console.log(`Telegram message sent to ${chatId}: ${message.message_id}`)
      return message
    } else {
      // Log message instead of sending (for development/testing)
      console.log(`[MOCK Telegram] To: ${chatId}`)
      console.log(`[MOCK Telegram] Message: ${text}`)
      console.log('---')
      return { message_id: 'mock_message_id', chat: { id: chatId } }
    }
  } catch (error) {
    console.error('Error sending Telegram message:', error)
    // Log the message as fallback
    console.log(`[FALLBACK] Failed to send to ${chatId}: ${text}`)
    throw error
  }
}

// Send message with inline keyboard
export async function sendTelegramMessageWithKeyboard(
  chatId: number | string, 
  text: string, 
  keyboard: any[][]
) {
  const options = {
    reply_markup: {
      inline_keyboard: keyboard
    }
  }
  return sendTelegramMessage(chatId, text, options)
}

// Send message with reply keyboard
export async function sendTelegramMessageWithReplyKeyboard(
  chatId: number | string, 
  text: string, 
  keyboard: string[][]
) {
  const options = {
    reply_markup: {
      keyboard: keyboard,
      resize_keyboard: true,
      one_time_keyboard: true
    }
  }
  return sendTelegramMessage(chatId, text, options)
}

// Edit message text
export async function editTelegramMessage(
  chatId: number | string, 
  messageId: number, 
  text: string, 
  options?: any
) {
  try {
    if (bot) {
      return await bot.editMessageText(text, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        ...options
      })
    }
  } catch (error) {
    console.error('Error editing Telegram message:', error)
    throw error
  }
}

// Answer callback query
export async function answerCallbackQuery(callbackQueryId: string, text?: string) {
  try {
    if (bot) {
      return await bot.answerCallbackQuery(callbackQueryId, { text })
    }
  } catch (error) {
    console.error('Error answering callback query:', error)
    throw error
  }
}

// Get bot instance (for advanced operations)
export function getTelegramBot(): TelegramBot | null {
  return bot
}

// Telegram-specific message formatting
export function formatTelegramMessage(text: string): string {
  // Escape HTML special characters for Telegram
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// Create inline keyboard for language selection
export function createLanguageKeyboard(): any[][] {
  const languages = [
    [
      { text: '🇮🇳 हिंदी', callback_data: 'lang_hi' },
      { text: '🇬🇧 English', callback_data: 'lang_en' }
    ],
    [
      { text: '🇮🇳 বাংলা', callback_data: 'lang_bn' },
      { text: '🇮🇳 தமிழ்', callback_data: 'lang_ta' }
    ],
    [
      { text: '🇮🇳 తెలుగు', callback_data: 'lang_te' },
      { text: '🇮🇳 मराठी', callback_data: 'lang_mr' }
    ],
    [
      { text: '🇮🇳 ગુજરાતી', callback_data: 'lang_gu' },
      { text: '🇮🇳 ಕನ್ನಡ', callback_data: 'lang_kn' }
    ],
    [
      { text: '🇮🇳 മലയാളം', callback_data: 'lang_ml' },
      { text: '🇮🇳 ਪੰਜਾਬੀ', callback_data: 'lang_pa' }
    ],
    [
      { text: '🇮🇳 ଓଡ଼ିଆ', callback_data: 'lang_or' },
      { text: '🇮🇳 অসমীয়া', callback_data: 'lang_as' }
    ],
    [
      { text: '🇮🇳 اردو', callback_data: 'lang_ur' },
      { text: '🇮🇳 کٲشُر', callback_data: 'lang_ks' }
    ],
    [
      { text: '🇮🇳 मैथिली', callback_data: 'lang_mai' }
    ]
  ]
  return languages
}

// Create quick action keyboard
export function createQuickActionKeyboard(language: string = 'en'): any[][] {
  const actions = {
    en: [
      [
        { text: '🔍 Find Schemes', callback_data: 'action_find_schemes' },
        { text: '✅ Check Eligibility', callback_data: 'action_check_eligibility' }
      ],
      [
        { text: '🌾 Farmer Schemes', callback_data: 'action_farmer' },
        { text: '🎓 Student Schemes', callback_data: 'action_student' }
      ],
      [
        { text: '👩 Women Schemes', callback_data: 'action_women' },
        { text: '💼 Business Schemes', callback_data: 'action_business' }
      ],
      [
        { text: '🌐 Change Language', callback_data: 'action_change_language' },
        { text: '❓ Help', callback_data: 'action_help' }
      ]
    ],
    hi: [
      [
        { text: '🔍 योजनाएं खोजें', callback_data: 'action_find_schemes' },
        { text: '✅ पात्रता जांचें', callback_data: 'action_check_eligibility' }
      ],
      [
        { text: '🌾 किसान योजनाएं', callback_data: 'action_farmer' },
        { text: '🎓 छात्र योजनाएं', callback_data: 'action_student' }
      ],
      [
        { text: '👩 महिला योजनाएं', callback_data: 'action_women' },
        { text: '💼 व्यापार योजनाएं', callback_data: 'action_business' }
      ],
      [
        { text: '🌐 भाषा बदलें', callback_data: 'action_change_language' },
        { text: '❓ सहायता', callback_data: 'action_help' }
      ]
    ]
  }
  
  return actions[language as keyof typeof actions] || actions.en
}

// Create reply keyboard for common responses
export function createReplyKeyboard(language: string = 'en'): string[][] {
  const keyboards = {
    en: [
      ['🔍 Find Schemes', '✅ Check Eligibility'],
      ['🌾 Farmer', '🎓 Student', '👩 Women', '💼 Business'],
      ['🌐 Language', '❓ Help']
    ],
    hi: [
      ['🔍 योजनाएं खोजें', '✅ पात्रता जांचें'],
      ['🌾 किसान', '🎓 छात्र', '👩 महिला', '💼 व्यापार'],
      ['🌐 भाषा', '❓ सहायता']
    ]
  }
  
  return keyboards[language as keyof typeof keyboards] || keyboards.en
}

export default bot