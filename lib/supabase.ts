import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types based on our schema
export interface User {
  id: string
  phone_number?: string
  whatsapp_name?: string
  telegram_id?: string
  first_name?: string
  username?: string
  language_preference: string
  eligibility_data?: any
  conversation_history?: any[]
  created_at: string
  updated_at: string
  last_active: string
}

export interface Scheme {
  id: string
  scheme_id: string
  name: string
  description: string
  benefits: string
  eligibility_criteria: any
  application_url: string
  department: string
  state: string
  category: string
  status: string
  created_at: string
  updated_at: string
}

export interface Conversation {
  id: string
  user_id: string
  platform: string
  message_type: string
  content: string
  metadata: any
  created_at: string
}

export interface UserScheme {
  id: string
  user_id: string
  scheme_uuid: string
  scheme_id: string
  interaction_type: string
  status: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Analytics {
  id: string
  user_id: string
  platform: string
  event_type: string
  event_data: any
  created_at: string
}