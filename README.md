# SchemeSaathi - AI-Powered Government Schemes Platform 🇮🇳

SchemeSaathi is a comprehensive platform that helps Indian citizens discover government schemes they're eligible for through multiple channels. It features a **multilingual Next.js website** and a **unified AI-powered bot** supporting both **Telegram and WhatsApp** with **15+ Indian languages**.

## 🔗 **Live Links**

- **🌐 Website**: https://scheme-setu-govt.vercel.app/
- **📱 Telegram Bot**: https://t.me/schemesetu_bot
- **� WhatsApp Bot**: +91 78500 06956
- **�📂 GitHub Repository**: https://github.com/tosif121/schemesetu.git

## 🌟 Platform Overview

### 🌐 **Next.js Website** (`/schemesetu`)
Modern web application with multilingual support and integrated messaging

### 🤖 **Unified Bot** (`/bot`)  
**Dual-platform bot** supporting both Telegram and WhatsApp with automatic message synchronization, powered by Perplexity Sonar Pro AI

## 🤖 **Bot Access**

### **Telegram Bot**
- **Handle**: @schemesetu_bot
- **Link**: https://t.me/schemesetu_bot
- **Features**: Interactive buttons, commands, rich formatting

### **WhatsApp Bot**
- **Number**: +91 78500 06956
- **Features**: Text-based menus, greeting detection, state management
- **Usage**: Send "hi" or "menu" to start

Both bots offer the same AI-powered scheme matching with 15+ Indian languages support!

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

## 🤖 **Unified Bot Features**

### 🔄 **Dual Platform Support**
- **Telegram Bot**: Full interactive experience with buttons and commands
- **WhatsApp Bot**: Text-based interface with numbered menus and greeting detection
- **Automatic Sync**: Messages sync between platforms in real-time
- **Admin Monitoring**: Designated admin receives all messages from both platforms

### 🧠 **AI-Powered Intelligence**
- **Perplexity Sonar Pro**: Advanced AI for natural language understanding
- **15+ Indian Languages**: Complete multilingual support with native scripts
- **Eligibility-Only Results**: Shows only schemes users can actually apply for
- **Smart Parsing**: Handles both structured (`25 mumbai Maharashtra farmer 200000`) and natural language

### 📱 **Platform-Specific Features**

#### **Telegram Features**
- ✅ Interactive buttons and keyboards
- ✅ Commands (`/start`, `/help`, `/language`, `/schemes`)
- ✅ Language selection interface
- ✅ Category-based quick actions (Farmer, Student, Women, Business)
- ✅ Rich formatting (Markdown)

#### **WhatsApp Features**  
- ✅ Direct messaging without commands
- ✅ Same AI engine and scheme database
- ✅ Multilingual support
- ✅ QR code authentication
- ❌ No buttons/commands (WhatsApp limitation)

### 🔄 **Message Synchronization**
- **Real-time Sync**: Messages automatically appear on both platforms
- **Bidirectional**: Works from Telegram → WhatsApp and WhatsApp → Telegram
- **Admin Monitoring**: All user conversations forwarded to admin
- **Configurable**: Can be enabled/disabled via environment variables

### **Tech Stack**
- **Runtime**: Node.js with Telegraf framework
- **WhatsApp**: whatsapp-web.js with QR authentication
- **AI**: Perplexity Sonar Pro API
- **Database**: Supabase (shared with website)
- **Sync**: Real-time message synchronization
- **Deployment**: Standalone unified server

---

## 🛠️ **Quick Start**

### **Prerequisites**
- Node.js 18+
- Telegram Bot Token (from @BotFather)
- WhatsApp account for scanning QR code
- Supabase account
- Perplexity API key
- Twilio account (for website WhatsApp integration)

### **1. Clone Repository**
```bash
git clone https://github.com/tosif121/schemesetu.git
cd schemesetu
```

### **2. Setup Next.js Website**
```bash
npm install
cp .env.local.example .env.local
# Configure environment variables
npm run dev
```

### **3. Setup Unified Bot (Telegram + WhatsApp)**
```bash
cd bot
npm install
# Configure .env file with both platform credentials
npm start
# Scan WhatsApp QR code when prompted
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

### **Unified Bot** (`bot/.env`)
```env
# Telegram Bot
BOT_TOKEN=your_telegram_bot_token
BOT_USERNAME=your_bot_username

# Supabase Database (shared)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key

# Perplexity AI
PERPLEXITY_API_KEY=your_perplexity_api_key

# Message Synchronization
MESSAGE_SYNC_ENABLED=true
SYNC_ADMIN_TELEGRAM_ID=your_telegram_user_id
SYNC_ADMIN_WHATSAPP_NUMBER=your_whatsapp_number
```

---

## 💬 **Usage Examples**

### **Website (WhatsApp)**
```
User: "I am 25 year old farmer from Maharashtra with 2 lakh income"
Response: "You're eligible for PM-KISAN (₹6,000/year) and Kisan Credit Card..."
```

### **Telegram Bot**
```
User: /start
Bot: 🇮🇳 Welcome to SchemeSaathi! [Interactive buttons shown]

User: 25 mumbai Maharashtra farmer 200000
Bot: 🌾 Based on your details, you're eligible for:
     1. PM-KISAN (₹6,000/year)
     2. Kisan Credit Card
```

### **WhatsApp Bot**
```
User: hi
Bot: 🇮🇳 Welcome to SchemeSaathi! 
     Quick Actions:
     1️⃣ Find Schemes
     2️⃣ Farmer Schemes 🌾
     3️⃣ Student Schemes 🎓
     4️⃣ Women Schemes 👩
     5️⃣ Business Schemes 💼
     6️⃣ Change Language 🌐
     7️⃣ Help & Instructions ❓

User: 2
Bot: 🌾 Government Schemes for Farmers:
     1. PM-KISAN (₹6,000/year)
     2. Kisan Credit Card

User: 6
Bot: [Language selection menu 1-10]

User: 2
Bot: ✅ भाषा हिन्दी में सेट की गई!
     [Hindi main menu]
```

---

## 🔄 **Message Synchronization**

### **How It Works**
1. **User sends message** on Telegram → **Admin receives on WhatsApp**
2. **User sends message** on WhatsApp → **Admin receives on Telegram**
3. **Bot responses** are synced to both platforms
4. **Real-time monitoring** of all conversations

### **Configuration**
```env
# Enable/disable sync
MESSAGE_SYNC_ENABLED=true

# Admin Telegram ID (get from @userinfobot)
SYNC_ADMIN_TELEGRAM_ID=123456789

# Admin WhatsApp number (with country code, no +)
SYNC_ADMIN_WHATSAPP_NUMBER=1234567890
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

### **Unified Bot**
```bash
# PM2 (recommended)
npm install -g pm2
cd bot
pm2 start unified-bot.js --name "schemesaathi-unified"
pm2 startup
pm2 save

# Or direct
npm start
```

---

## 🔧 **Bot Commands & Features**

### **Telegram Commands**
- `/start` - Welcome message and interactive buttons
- `/help` - Usage instructions and examples
- `/language` - Change preferred language
- `/schemes` - Browse popular schemes

### **WhatsApp Commands**
- **Greeting Triggers**: "hi", "hello", "hey", "menu", "start", "namaste"
- **Quick Actions (1-7)**:
  - **1** → Find Schemes (All available)
  - **2** → Farmer Schemes 🌾
  - **3** → Student Schemes 🎓
  - **4** → Women Schemes 👩
  - **5** → Business Schemes 💼
  - **6** → Change Language 🌐
  - **7** → Help & Instructions ❓
- **Language Selection**: Numbers 1-10 after selecting option 6
- **Text Commands**: "help", "language"

### **Bot Features**
- **🔄 Unified Experience**: Same AI across both platforms
- **📱 Platform Choice**: Users can choose Telegram or WhatsApp
- **🤖 Smart Sync**: Admins monitor all conversations
- **🌐 Multilingual**: Native language support
- **🎯 Accurate Results**: Only shows eligible schemes
- **⚡ Fast Response**: Optimized AI processing
- **🛡️ State Management**: Proper language selection handling
- **👋 Smart Greetings**: Multiple greeting word detection

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
git clone https://github.com/tosif121/schemesetu.git
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

### **3. Setup Unified Bot (Telegram + WhatsApp)**
```bash
cd bot
npm install
# Configure .env file with both platform credentials
npm start
# Scan WhatsApp QR code when prompted
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

### **Unified Bot** (`.env`)
```env
# Telegram
BOT_TOKEN=your-bot-token-from-botfather
BOT_USERNAME=your_bot_username

# Supabase (shared)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# AI
PERPLEXITY_API_KEY=your-perplexity-api-key

# Message Synchronization
MESSAGE_SYNC_ENABLED=true
SYNC_ADMIN_TELEGRAM_ID=your_telegram_user_id
SYNC_ADMIN_WHATSAPP_NUMBER=your_whatsapp_number
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

## 🎯 **Government Schemes**

The bot includes 8 comprehensive government schemes:

| Category | Schemes |
|----------|---------|
| **Farmers** | PM-KISAN, Kisan Credit Card |
| **Students** | National Scholarship Portal |
| **Women** | Beti Bachao Beti Padhao, Stand Up India, Sukanya Samriddhi |
| **Business** | MUDRA Yojana, Stand Up India |
| **Health** | Ayushman Bharat PM-JAY |

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

## 🎯 **Project Structure**

```
schemesetu/
├── app/                    # Next.js App Router pages
│   ├── Context/           # Language context
│   ├── admin/             # Admin dashboard
│   └── api/               # API routes
├── components/            # React components
├── lib/                   # Utilities and configs
├── public/                # Static assets & translations
│   └── locales/          # Language files (15+ languages)
├── bot/                   # Unified Bot (Telegram + WhatsApp)
│   ├── unified-bot.js    # Main unified bot
│   ├── bot.js            # Telegram-only bot (legacy)
│   ├── complete-schema.sql # Database schema
│   ├── package.json      # Bot dependencies
│   └── .env              # Bot configuration
└── README.md             # This comprehensive guide
```

---

## 🔧 **Development**

### **Adding New Features**

**Website:**
1. **New Pages**: Add to `app/` directory
2. **New Components**: Add to `components/` directory
3. **New Languages**: Update translation files in `public/locales/`
4. **New APIs**: Add to `app/api/` directory

**Bot:**
1. **New Commands**: Add using `bot.command('name', handler)`
2. **New Languages**: Update `LANGUAGES` object and add translations
3. **New Schemes**: Update `MOCK_SCHEMES` array or integrate with API
4. **New Actions**: Add to callback query handler

### **Environment Variables**

| Variable | Description | Required |
|----------|-------------|----------|
| **Website** | | |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `GEMINI_API_KEY` | Google Gemini API key | ✅ |
| `TWILIO_ACCOUNT_SID` | Twilio account SID | ✅ |
| `TWILIO_AUTH_TOKEN` | Twilio auth token | ✅ |
| **Bot** | | |
| `BOT_TOKEN` | Telegram bot token from @BotFather | ✅ |
| `BOT_USERNAME` | Bot username (without @) | ✅ |
| `SUPABASE_URL` | Supabase project URL | ✅ |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `PERPLEXITY_API_KEY` | Perplexity API key | ✅ |
| `MESSAGE_SYNC_ENABLED` | Enable message sync | ❌ |
| `SYNC_ADMIN_TELEGRAM_ID` | Admin Telegram ID | ❌ |
| `SYNC_ADMIN_WHATSAPP_NUMBER` | Admin WhatsApp number | ❌ |

---

## 🔒 **Security**

- **Environment Variables**: All sensitive data in .env files
- **Input Validation**: Sanitized user inputs
- **Rate Limiting**: Built-in Telegram rate limits
- **WhatsApp Auth**: Secure QR code authentication
- **Database**: Parameterized queries prevent injection
- **CORS**: Proper CORS configuration for APIs

---

## 🐛 **Troubleshooting**

### **Common Issues**

1. **WhatsApp QR Code Not Showing**
   ```bash
   # Check if puppeteer is installed correctly
   cd bot
   npm install puppeteer --save
   ```

2. **Telegram Bot Not Responding**
   ```bash
   # Verify bot token
   curl https://api.telegram.org/bot<TOKEN>/getMe
   ```

3. **Message Sync Not Working**
   ```bash
   # Check environment variables
   echo $MESSAGE_SYNC_ENABLED
   echo $SYNC_ADMIN_TELEGRAM_ID
   ```

4. **Database Connection Issues**
   ```bash
   # Test Supabase connection
   curl -H "apikey: <ANON_KEY>" <SUPABASE_URL>/rest/v1/users
   ```

5. **Memory Issues (Bot)**
   ```bash
   # Start with increased memory
   node --max-old-space-size=2048 --expose-gc unified-bot.js
   ```

### **Debug Mode**
```bash
# Website
npm run dev

# Bot
NODE_ENV=development npm start
```

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
