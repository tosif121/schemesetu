import twilio from 'twilio'

// Initialize Twilio client with error handling
let client: any = null
let from: string = ''

try {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  from = process.env.TWILIO_WHATSAPP_NUMBER || ''

  if (accountSid && authToken && accountSid.startsWith('AC') && authToken.length > 10) {
    client = twilio(accountSid, authToken)
    console.log('Twilio client initialized successfully')
  } else {
    console.warn('Twilio credentials not properly configured. WhatsApp messages will be logged instead of sent.')
  }
} catch (error) {
  console.error('Failed to initialize Twilio client:', error)
}

export async function sendMessage(to: string, body: string) {
  try {
    if (client && from) {
      // Send actual WhatsApp message
      const message = await client.messages.create({
        body,
        from: `whatsapp:${from}`,
        to: `whatsapp:${to}`
      })
      console.log(`WhatsApp message sent to ${to}: ${message.sid}`)
      return message
    } else {
      // Log message instead of sending (for development/testing)
      console.log(`[MOCK WhatsApp] To: ${to}`)
      console.log(`[MOCK WhatsApp] Message: ${body}`)
      console.log('---')
      return { sid: 'mock_message_id', status: 'sent' }
    }
  } catch (error) {
    console.error('Error sending WhatsApp message:', error)
    // Log the message as fallback
    console.log(`[FALLBACK] Failed to send to ${to}: ${body}`)
    throw error
  }
}