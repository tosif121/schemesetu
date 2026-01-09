import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { extractEligibility, generateResponse, detectLanguage } from '../../lib/gemini'
import { sendMessage } from '../../lib/whatsapp'
import { 
  getOrCreateUser, 
  updateUserEligibility, 
  updateUserLanguage,
  addConversationMessage 
} from '../../lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.formData()
    const from = body.get('From') as string
    const bodyText = body.get('Body') as string

    if (!from || !bodyText) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Extract phone number (remove whatsapp: prefix)
    const phone = from.replace('whatsapp:', '')

    console.log(`Received message from ${phone}: ${bodyText}`)

    // Get or create user
    const user = await getOrCreateUser(phone)

    // Detect language if not set
    let userLanguage = user.language_preference
    if (!userLanguage) {
      const detectedLang = await detectLanguage(bodyText)
      userLanguage = detectedLang as typeof user.language_preference
      await updateUserLanguage(phone, userLanguage)
    }

    // Extract eligibility criteria from message
    const eligibility = await extractEligibility(bodyText)
    
    // Update user eligibility if new data found
    if (Object.values(eligibility).some(value => value !== null)) {
      await updateUserEligibility(phone, eligibility)
    }

    // Fetch matching schemes using axios
    const schemesUrl = new URL('/api/schemes', req.url)
    Object.entries(eligibility).forEach(([key, value]) => {
      if (value !== null) {
        schemesUrl.searchParams.set(key, value.toString())
      }
    })

    const schemesResponse = await axios.get(schemesUrl.toString(), {
      timeout: 15000 // 15 second timeout for internal API
    })
    const schemesData = schemesResponse.data

    // Generate multilingual response
    const responseText = await generateResponse(
      eligibility, 
      schemesData.schemes || [], 
      userLanguage || 'en'
    )

    // Send response via WhatsApp
    await sendMessage(phone, responseText)

    // Save conversation to database
    await addConversationMessage(phone, bodyText, responseText, userLanguage || 'en')

    console.log(`Sent response to ${phone}`)

    return NextResponse.json({ 
      status: 'success',
      phone,
      language: userLanguage || 'en',
      eligibility,
      schemes_found: schemesData.schemes?.length || 0,
      data_source: schemesData.source || 'unknown'
    })

  } catch (error) {
    console.error('Webhook error:', error)
    
    // Try to send error message to user if we have their phone
    try {
      const body = await req.formData()
      const from = body.get('From') as string
      if (from) {
        const phone = from.replace('whatsapp:', '')
        await sendMessage(phone, 'Sorry, I encountered an error. Please try again later. / माफ करें, कुछ तकनीकी समस्या है। कृपया बाद में कोशिश करें।')
      }
    } catch (sendError) {
      console.error('Failed to send error message:', sendError)
    }

    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

// Handle Twilio webhook verification
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const hubChallenge = searchParams.get('hub.challenge')
  
  if (hubChallenge) {
    return new NextResponse(hubChallenge)
  }
  
  return NextResponse.json({ status: 'SchemeSaathi webhook endpoint' })
}