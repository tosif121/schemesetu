import { createClient } from '@supabase/supabase-js'
import { User } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper functions for user management
export async function getOrCreateUser(identifier: string, platform: 'whatsapp' | 'telegram' = 'whatsapp'): Promise<User> {
  try {
    const searchField = platform === 'telegram' ? 'telegram_id' : 'phone'
    
    // First try to get existing user
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq(searchField, identifier)
      .single()

    if (existingUser && !fetchError) {
      return existingUser
    }

    // Create new user if doesn't exist
    const userData = {
      language_preference: null,
      eligibility_data: {},
      conversation_history: [],
      ...(platform === 'telegram' ? { telegram_id: identifier } : { phone: identifier })
    }

    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single()

    if (createError) {
      console.error('Error creating user:', createError)
      throw createError
    }

    return newUser
  } catch (error) {
    console.error('Error in getOrCreateUser:', error)
    throw error
  }
}

// Specific function for Telegram users
export async function getOrCreateTelegramUser(telegramId: string, firstName?: string): Promise<User> {
  try {
    // First try to get existing user
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', telegramId)
      .single()

    if (existingUser && !fetchError) {
      return existingUser
    }

    // Create new user if doesn't exist
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        telegram_id: telegramId,
        first_name: firstName,
        language_preference: null,
        eligibility_data: {},
        conversation_history: []
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating Telegram user:', createError)
      throw createError
    }

    return newUser
  } catch (error) {
    console.error('Error in getOrCreateTelegramUser:', error)
    throw error
  }
}

export async function updateUserEligibility(identifier: string, eligibility: any, platform: 'whatsapp' | 'telegram' = 'whatsapp'): Promise<void> {
  try {
    const searchField = platform === 'telegram' ? 'telegram_id' : 'phone'
    
    const { error } = await supabase
      .from('users')
      .update({ 
        eligibility_data: eligibility,
        updated_at: new Date().toISOString()
      })
      .eq(searchField, identifier)

    if (error) {
      console.error('Error updating user eligibility:', error)
      throw error
    }
  } catch (error) {
    console.error('Error in updateUserEligibility:', error)
    throw error
  }
}

export async function updateUserLanguage(identifier: string, language: string, platform: 'whatsapp' | 'telegram' = 'whatsapp'): Promise<void> {
  try {
    const searchField = platform === 'telegram' ? 'telegram_id' : 'phone'
    
    const { error } = await supabase
      .from('users')
      .update({ 
        language_preference: language,
        updated_at: new Date().toISOString()
      })
      .eq(searchField, identifier)

    if (error) {
      console.error('Error updating user language:', error)
      throw error
    }
  } catch (error) {
    console.error('Error in updateUserLanguage:', error)
    throw error
  }
}

export async function addConversationMessage(
  identifier: string, 
  userMessage: string, 
  botResponse: string, 
  language: string,
  platform: 'whatsapp' | 'telegram' = 'whatsapp'
): Promise<void> {
  try {
    const searchField = platform === 'telegram' ? 'telegram_id' : 'phone'
    
    // Get current conversation history
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('conversation_history')
      .eq(searchField, identifier)
      .single()

    if (fetchError) {
      console.error('Error fetching user for conversation:', fetchError)
      throw fetchError
    }

    const currentHistory = user?.conversation_history || []
    const newMessage = {
      timestamp: new Date().toISOString(),
      user_message: userMessage,
      bot_response: botResponse,
      language: language,
      platform: platform
    }

    const updatedHistory = [...currentHistory, newMessage]

    // Update conversation history
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        conversation_history: updatedHistory,
        updated_at: new Date().toISOString()
      })
      .eq(searchField, identifier)

    if (updateError) {
      console.error('Error updating conversation history:', updateError)
      throw updateError
    }
  } catch (error) {
    console.error('Error in addConversationMessage:', error)
    throw error
  }
}