# SchemeSaathi - AI-Powered Government Schemes Platform 🇮🇳

SchemeSaathi is a comprehensive platform that helps Indian citizens discover government schemes they're eligible for through multiple channels. It features a **multilingual Next.js website** and an **AI-powered Telegram bot** supporting **15+ Indian languages**.

## 🌟 Platform Overview

### 🌐 **Next.js Website** (`/schemesetu`)
Modern web application with multilingual support and WhatsApp integration

### 🤖 **Telegram Bot** (`/telegram-bot`)  
Standalone AI-powered bot using Perplexity Sonar Pro for intelligent scheme matching

---

## 🚀 **Next.js Website Features**

- 🌍 **15+ Indian Languages**: Complete translation system with smart fallbacks
- 📱 **WhatsApp Integration**: Seamless messaging through Twilio Business API
- 🎯 **Smart Eligibility Matching**: AI-powered scheme recommendations
- 💾 **User Management**: Supabase integration with conversation history
- 📊 **Admin Dashboard**: Built with shadcn/ui for monitoring and analytics
- 🏛️ **Government Schemes Database**: Comprehensive scheme information

### **Supported Languages**
English, Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, Urdu, Kashmiri, Maithili

### **Tech Stack**
- **Frontend**: Next.js 15+ with App Router + TypeScript
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini AI for NLP
- **Messaging**: Twilio WhatsApp Business API
- **UI**: shadcn/ui + Tailwind CSS
- **Deployment**: Vercel

---

## 🤖 **Telegram Bot Features**

- 🧠 **Perplexity Sonar Pro**: Advanced AI for natural language understanding
- 📱 **Interactive Keyboards**: Quick action buttons for easy navigation
- 🎯 **Eligibility-Only Results**: Shows only schemes users can actually apply for
- 🌐 **Multilingual Support**: 15+ Indian languages with native scripts
- 📊 **Structured Input**: Simple format - `Age City State Occupation Income`
- 🔄 **Fallback System**: Works even when AI is unavailable

### **Bot Commands**
- `/start` - Welcome message and quick actions
- `/help` - Usage instructions and examples
- `/language` - Change preferred language
- `/schemes` - Browse popular schemes

### **Tech Stack**
- **Runtime**: Node.js with Telegraf framework
- **AI**: Perplexity Sonar Pro API
- **Database**: Supabase (shared with website)
- **Deployment**: Standalone server

---

## 🛠️ **Quick Start**

### **Prerequisites**
- Node.js 18+
- Supabase account
- Telegram Bot Token (from @BotFather)
- Perplexity API key
- Twilio account (for WhatsApp)

### **1. Clone Repository**
```bash
git clone <repository-url>
cd schemesetu
```

### **2. Setup Next.js Website**
```bash
cd schemesetu
npm install
cp .env.local.example .env.local
# Configure environment variables
npm run dev
```

### **3. Setup Telegram Bot**
```bash
cd ../telegram-bot
npm install
# Configure .env file
npm start
```

---

## ⚙️ **Environment Configuration**

### **Next.js Website** (`.env.local`)
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# AI
GEMINI_API_KEY=your-gemini-api-key

# WhatsApp
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_WHATSAPP_NUMBER=+14155238886
```

### **Telegram Bot** (`.env`)
```env
# Telegram
BOT_TOKEN=your-bot-token-from-botfather
BOT_USERNAME=your_bot_username

# Supabase (shared)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# AI
PERPLEXITY_API_KEY=your-perplexity-api-key
```

---

## 🗄️ **Database Setup**

Run this SQL in your Supabase dashboard:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for both platforms
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- WhatsApp fields
    phone_number VARCHAR(20) UNIQUE,
    whatsapp_name VARCHAR(255),
    
    -- Telegram fields  
    telegram_id VARCHAR(50) UNIQUE,
    first_name VARCHAR(255),
    username VARCHAR(255),
    
    -- Common fields
    language_preference VARCHAR(10) DEFAULT 'en',
    eligibility_data JSONB DEFAULT '{}',
    conversation_history JSONB DEFAULT '[]',
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT users_platform_check CHECK (
        (phone_number IS NOT NULL AND whatsapp_name IS NOT NULL) OR 
        (telegram_id IS NOT NULL AND first_name IS NOT NULL)
    )
);

-- Government schemes table
CREATE TABLE IF NOT EXISTS schemes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    scheme_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(500) NOT NULL,
    description TEXT,
    benefits TEXT,
    eligibility_criteria JSONB DEFAULT '{}',
    application_url VARCHAR(1000),
    department VARCHAR(255),
    category VARCHAR(100),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_phone_number ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);
CREATE INDEX IF NOT EXISTS idx_users_language_preference ON users(language_preference);
CREATE INDEX IF NOT EXISTS idx_schemes_category ON schemes(category);
```

---

## 📱 **Usage Examples**

### **Website (WhatsApp)**
```
User: "I am 25 year old farmer from Maharashtra with 2 lakh income"
Response: "You're eligible for PM-KISAN (₹6,000/year) and Kisan Credit Card..."
```

### **Telegram Bot**
```
Structured: "25 mumbai Maharashtra farmer 200000"
Natural: "मैं महाराष्ट्र का किसान हूं"
Response: Shows only eligible schemes with application links
```

---

## 🚀 **Deployment**

### **Next.js Website**
```bash
# Vercel deployment
vercel --prod

# Or build locally
npm run build
npm start
```

### **Telegram Bot**
```bash
# PM2 (recommended)
npm install -g pm2
pm2 start bot.js --name "schemesaathi-bot"

# Or direct
npm start
```

---

## 📊 **Admin Dashboard**

Access the admin panel at `/admin` to view:
- **User Analytics**: Platform-wise user statistics
- **Language Distribution**: Usage across different languages
- **Scheme Performance**: Most accessed schemes
- **Conversation Insights**: User interaction patterns

---

## 🔗 **API Endpoints**

### **Website APIs**
- `POST /api/webhook` - WhatsApp message processing
- `GET /api/schemes` - Government schemes data
- `POST /api/eligibility` - Eligibility checking

### **Bot APIs**
- Telegram webhook handling
- Perplexity AI integration
- Supabase data management

---

## 🌍 **Multilingual Support**

Both platforms support these languages with native scripts:

| Language | Code | Native Script |
|----------|------|---------------|
| English | en | English |
| Hindi | hi | हिन्दी |
| Bengali | bn | বাংলা |
| Tamil | ta | தமிழ் |
| Telugu | te | తెలుగు |
| Marathi | mr | मराठी |
| Gujarati | gu | ગુજરાતી |
| Kannada | kn | ಕನ್ನಡ |
| Malayalam | ml | മലയാളം |
| Punjabi | pa | ਪੰਜਾਬੀ |
| Odia | or | ଓଡ଼ିଆ |
| Assamese | as | অসমীয়া |
| Urdu | ur | اردو |
| Kashmiri | ks | کٲشُر |
| Maithili | mai | मैथिली |

---

## 🛣️ **Development Roadmap**

### **Phase 1** ✅
- [x] Multilingual Next.js website
- [x] WhatsApp integration
- [x] Telegram bot with Perplexity AI
- [x] Comprehensive scheme database

### **Phase 2** 🚧
- [ ] Voice message support
- [ ] Document upload verification
- [ ] Application tracking system
- [ ] Mobile app development

### **Phase 3** 📋
- [ ] Regional dialect support
- [ ] Offline functionality
- [ ] Government API integrations
- [ ] Advanced analytics dashboard

---

## 🤝 **Contributing**

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### **Development Guidelines**
- Follow TypeScript best practices
- Add tests for new features
- Update documentation
- Ensure multilingual compatibility

---

## 📄 **License**

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🆘 **Support**

- **Issues**: Create GitHub issues for bugs
- **Features**: Submit feature requests
- **Documentation**: Improve this README
- **Community**: Join our discussions

---

## 🎯 **Project Structure**

```
├── schemesetu/          # Next.js Website
│   ├── app/            # App Router pages
│   ├── components/     # React components
│   ├── lib/           # Utilities and configs
│   └── public/        # Static assets & translations
│
├── telegram-bot/       # Telegram Bot
│   ├── bot.js         # Main bot logic
│   ├── .env           # Bot configuration
│   └── README.md      # Bot documentation
│
└── README.md          # This file
```

---

**Built with ❤️ for Indian citizens to easily access government schemes in their native language.**

*"सबका साथ, सबका विकास, सबकी भाषा"* - Together, Development, Everyone's Language

---

### 🏆 **Key Achievements**

- **🌐 15+ Languages**: Complete multilingual support
- **🤖 Dual Platform**: Website + Telegram bot
- **🎯 AI-Powered**: Smart eligibility matching
- **📱 Mobile-First**: Responsive design
- **🔒 Secure**: Enterprise-grade security
- **⚡ Fast**: Optimized performance
