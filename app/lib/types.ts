export interface User {
  id?: string
  phone?: string
  telegram_id?: string
  first_name?: string
  language_preference: string
  eligibility_data: any
  conversation_history: any[]
  created_at?: string
  updated_at?: string
}

export interface EligibilityCriteria {
  age?: number | null
  income?: number | null
  state?: string | null
  occupation?: string | null
  category?: string | null
  gender?: 'male' | 'female' | 'other' | null
  disability?: boolean | null
}

export interface Scheme {
  id: string
  name: string
  description: string
  eligibility: string[]
  benefits: string
  application_process: string
  department: string
  state: string
}