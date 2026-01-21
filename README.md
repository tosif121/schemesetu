# SchemeSaathi - AI for Social Impact 🇮🇳

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/badge/GitHub-tosif121%2Fschemesetu-blue)](https://github.com/tosif121/schemesetu)
[![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-red)](https://github.com/tosif121/schemesetu)

**Multilingual Government Schemes Chatbot for Indian Citizens**

> *"सब का साथ, सब का विकास, सब की भाषा"* - Together, Development, Everyone's Language

## 🎯 **Problem & Solution**

**Problem**: Citizens often don't know which government schemes they qualify for due to language barriers and complex portals.

**Solution**: AI-powered WhatsApp/Telegram chatbot that uses government data to answer eligibility questions in 15+ Indian languages.

## 🔗 **Live Links**

- **🌐 Website**: https://scheme-setu-govt.vercel.app/
- **📱 Telegram Bot**: https://t.me/schemesetu_bot  
- **💬 WhatsApp Bot**: +91 78500 06956

## 🎬 **Demo Video**

[![Demo Video](https://img.shields.io/badge/▶️_Watch_Demo-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/8yuUFMFeqJY)

*Watch how SchemeSaathi helps citizens discover government schemes in their native language through WhatsApp and Telegram bots.*

## 🏗️ **Project Structure**

```
schemesaathi/
├── 📁 frontend/           # Next.js website with multilingual support
│   ├── app/              # Next.js App Router
│   ├── components/       # React components  
│   ├── public/locales/   # 15+ language translations
│   └── README.md         # 📖 Frontend documentation
│
├── 📁 backend/           # Unified bot (Telegram + WhatsApp)
│   ├── unified-bot.js    # Main bot file
│   ├── supabase-schemes.js # Database integration
│   ├── .env              # Bot configuration
│   └── README.md         # 📖 Backend documentation
│
├── 📄 .env.example       # Frontend environment template
└── 📄 README.md          # 📖 This overview
```

## ✨ **Features**

### **Frontend (Next.js)**
- 🌍 **15+ Indian Languages** with native scripts
- 📱 **Mobile-first Design** with dark/light themes
- 🔗 **WhatsApp/Telegram Integration** 
- 🗄️ **Supabase Database** for real-time data
- ⚡ **Fast & Responsive** - optimized performance

### **Backend (Unified Bot)**
- 🤖 **Dual Platform**: Telegram + WhatsApp in one bot
- 🧠 **AI-Powered**: Perplexity AI for natural language processing
- 🗄️ **Live Database**: Supabase integration with 500+ schemes
- 🌐 **Multilingual**: Same 15+ languages as frontend
- 📊 **Analytics**: User interaction tracking

## 🚀 **Quick Start**

### **1. Frontend (Next.js Website)**
```bash
cd frontend
npm install
cp .env.example .env.local
# Configure Supabase credentials
npm run dev
```

### **2. Backend (Unified Bot)**
```bash
cd backend  
npm install
cp .env.example .env
# Configure bot tokens and API keys
npm start
# Scan WhatsApp QR code when prompted
```

## 📚 **Documentation**

- **📖 [Frontend Documentation](frontend/README.md)** - Complete setup, deployment, and usage guide
- **📖 [Backend Documentation](backend/README.md)** - Bot configuration, troubleshooting, and development

## 🌍 **Supported Languages**

| Language | Code | Native Script | Coverage |
|----------|------|---------------|----------|
| English | en | English | 🌐 |
| Hindi | hi | हिन्दी | 🇮🇳 |
| Bengali | bn | বাংলা | 🇮🇳 |
| Tamil | ta | தமிழ் | 🇮🇳 |
| Telugu | te | తెలుగు | 🇮🇳 |
| Marathi | mr | मराठी | 🇮🇳 |
| Gujarati | gu | ગુજરાતી | 🇮🇳 |
| Kannada | kn | ಕನ್ನಡ | 🇮🇳 |
| Malayalam | ml | മലയാളം | 🇮🇳 |
| Punjabi | pa | ਪੰਜਾਬੀ | 🇮🇳 |
| Odia | or | ଓଡ଼ିଆ | 🇮🇳 |
| Assamese | as | অসমীয়া | 🇮🇳 |
| Urdu | ur | اردو | 🇮🇳 |
| Kashmiri | ks | کٲشُر | 🇮🇳 |
| Maithili | mai | मैथिली | 🇮🇳 |

*Covers 87% of Indian population*

## 💬 **Usage Examples**

### **Website**
Visit https://scheme-setu-govt.vercel.app/ and interact in your preferred language.

### **Telegram Bot** (@schemesetu_bot)
```
User: /start
Bot: 🇮🇳 Welcome to SchemeSaathi! [Interactive buttons]

User: 25 mumbai Maharashtra farmer 200000  
Bot: 🌾 You're eligible for:
     1. PM-KISAN (₹6,000/year)
     2. Kisan Credit Card
```

### **WhatsApp Bot** (+91 78500 06956)
```
User: hi
Bot: 🇮🇳 Welcome! Quick Actions:
     1️⃣ Find Schemes
     2️⃣ Farmer Schemes 🌾
     3️⃣ Student Schemes 🎓
     [...]

User: 2
Bot: 🌾 Government Schemes for Farmers: [scheme list]
```

## 🎯 **Government Schemes Covered**

| Category | Examples |
|----------|----------|
| **👨‍🌾 Farmers** | PM-KISAN, Fasal Bima Yojana |
| **🎓 Students** | National Scholarship Portal |
| **👩 Women** | Beti Bachao Beti Padhao |
| **💼 Business** | MUDRA Yojana, Startup India |
| **🏥 Health** | Ayushman Bharat PM-JAY |
| **🏠 Housing** | PM Awas Yojana |
| **⚡ Energy** | Ujjwala Yojana |
| **🛠️ Skills** | PM Kaushal Vikas Yojana |

## 🚀 **Deployment**

### **Frontend** 
- **Vercel** (Recommended): One-click deployment
- **Netlify**: Alternative static hosting
- **Self-hosted**: Node.js server

### **Backend Bot**
- **AWS EC2** (Recommended): $100 free credits + 12 months free tier
- **Railway.app**: Docker support for WhatsApp + Telegram
- **VPS**: DigitalOcean, Linode, etc.

See detailed deployment guides in respective README files.

## 📈 **Social Impact**

### **Accessibility Metrics**
- **Language Coverage**: 15+ languages (87% of Indian population)
- **Platform Reach**: WhatsApp (400M+ users) + Telegram
- **Device Support**: Works on basic smartphones

### **Government Transparency**
- **Scheme Discovery**: 500+ government schemes
- **Personalized Matching**: AI-powered recommendations
- **Application Tracking**: Complete user journey

## 🤝 **Contributing**

1. **Fork** the repository
2. **Choose** your area: Frontend (React/Next.js) or Backend (Node.js/Bot)
3. **Read** the respective README for detailed setup
4. **Create** feature branch: `git checkout -b feature/amazing-feature`
5. **Submit** Pull Request

### **Development Areas**
- 🎨 **Frontend**: UI/UX improvements, new language support
- 🤖 **Backend**: Bot features, AI improvements, new integrations
- 📊 **Analytics**: User insights, scheme effectiveness tracking
- 🔒 **Security**: Authentication, data protection
- 📱 **Mobile**: Progressive Web App features

## 📄 **License**

MIT License - Free for personal, commercial, and government use.

## 🆘 **Support**

- **📖 Documentation**: Check frontend/backend README files
- **🐛 Issues**: Create GitHub issues for bugs
- **💡 Features**: Submit feature requests
- **💬 Community**: Join our discussions

---

**Built with ❤️ for Indian citizens to easily access government schemes in their native language.**

### 🏆 **Key Achievements**

- ✅ **15+ Languages** with native script support
- ✅ **Dual Platform** - Website + Telegram + WhatsApp  
- ✅ **AI-Powered** - Smart eligibility matching
- ✅ **Live Database** - 500+ government schemes
- ✅ **Mobile-First** - Responsive design
- ✅ **Open Source** - MIT License

**Ready to make government schemes accessible to every Indian citizen! 🇮🇳**