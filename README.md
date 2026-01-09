# SchemeSaathi - Multilingual WhatsApp Chatbot for Government Schemes

SchemeSaathi is a comprehensive WhatsApp chatbot that helps Indian citizens discover government schemes they're eligible for. It supports **24+ major Indian languages** and uses advanced AI to extract eligibility criteria from natural language messages.

## 🌟 Features

- 🤖 **Advanced Multilingual AI**: Powered by Gemini 2.0 Flash for natural language processing in 24+ Indian languages
- 📱 **WhatsApp Integration**: Seamless messaging through Twilio WhatsApp Business API
- 🎯 **Smart Eligibility Matching**: Extracts age, income, state, occupation, category, gender, and disability status
- 💾 **Conversation History**: Stores user interactions and preferences in Supabase
- 🏛️ **Real Government Data**: Integration with myScheme API and fallback to comprehensive scheme database
- 📊 **Modern Admin Dashboard**: Built with shadcn/ui for monitoring users and system statistics

## 🗣️ Supported Languages

### Official Languages (22)
Hindi, English, Bengali, Marathi, Telugu, Tamil, Gujarati, Urdu, Kannada, Odia, Malayalam, Punjabi, Assamese, Santali, Kashmiri, Nepali, Sindhi, Dogri, Konkani, Manipuri, Tibetan, Sanskrit

### Additional Support
Sinhala, Myanmar (for diaspora communities)

## 🛠️ Tech Stack

- **Frontend**: Next.js 16.1.1 with App Router + TypeScript
- **Database**: Supabase (PostgreSQL) with comprehensive multilingual schema
- **AI**: Google Gemini 2.0 Flash for multilingual NLP
- **Messaging**: Twilio WhatsApp Business API
- **UI**: shadcn/ui components with Tailwind CSS
- **HTTP Client**: Axios for reliable API calls
- **Deployment**: Vercel with edge functions

## 🚀 Quick Start

### 1. Environment Setup

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Gemini AI
GEMINI_API_KEY=your-gemini-api-key

# Twilio WhatsApp
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_WHATSAPP_NUMBER=+14155238886
```

### 2. Install & Run

```bash
npm install
npm run build
npm run dev
```

### 3. Database Setup

Create a Supabase project and run this SQL:

```sql
-- Create users table with multilingual support
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  language_preference VARCHAR(3) CHECK (language_preference IN (
    'hi', 'en', 'ta', 'bn', 'te', 'mr', 'gu', 'kn', 'ml', 'pa', 
    'or', 'as', 'ur', 'sa', 'ne', 'si', 'my', 'ks', 'sd', 'kok', 
    'mni', 'doi', 'sat', 'bo'
  )),
  eligibility_data JSONB,
  conversation_history JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_language ON users(language_preference);
CREATE INDEX idx_users_eligibility ON users USING GIN (eligibility_data);
```

### 4. Twilio Webhook Setup

Configure your WhatsApp webhook URL in Twilio Console:
```
https://your-app.vercel.app/api/webhook
```

## 🌍 Example Conversations

**English**:
```
User: "I am 30 year old woman from Tamil Nadu, SC category, annual income 3 lakh"
Bot: "Based on your profile, you're eligible for Ayushman Bharat health insurance (₹5 lakh coverage)..."
```

**Hindi**:
```
User: "मैं 25 साल का किसान हूं महाराष्ट्र से, सालाना 2 लाख कमाता हूं"
Bot: "आपकी जानकारी के अनुसार, आप PM-KISAN योजना के लिए पात्र हैं (₹6000 प्रति वर्ष)..."
```

## 📊 Admin Dashboard

Visit `/admin` to view:
- User analytics and statistics
- Language distribution insights
- State and occupation breakdowns
- Conversation history tracking

## 🔗 API Endpoints

### POST /api/webhook
Receives WhatsApp messages from Twilio, processes them with Gemini AI, and responds with matching schemes.

### GET /api/schemes
Fetches government schemes from myScheme API with comprehensive eligibility matching.

## 🚀 Deployment

### Vercel Deployment

1. Connect your GitHub repo to Vercel
2. Add all environment variables in Vercel dashboard
3. Deploy automatically on push to main

## �️ Deivelopment Roadmap

- [ ] Voice message support in regional languages
- [ ] Document upload for verification
- [ ] Application tracking system
- [ ] SMS fallback for poor internet areas
- [ ] Regional dialect support (100+ dialects)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

---

**Built with ❤️ for Indian citizens to easily access government schemes in their native language.**

*"सबका साथ, सबका विकास, सबकी भाषा"* - Together, Development, Everyone's Language# schemesetu
