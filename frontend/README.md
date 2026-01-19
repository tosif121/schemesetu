# SchemeSaathi Frontend 🌐
## Next.js Multilingual Website for Government Schemes

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/badge/GitHub-tosif121%2Fschemesetu-blue)](https://github.com/tosif121/schemesetu)
[![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-red)](https://github.com/tosif121/schemesetu)

**Frontend Component**: Modern Next.js website with multilingual support, responsive design, and seamless integration with Telegram/WhatsApp bots.

This is the **frontend component** of SchemeSaathi - a comprehensive platform that helps Indian citizens discover government schemes. The website features **15+ Indian languages**, **mobile-first design**, and **real-time integration** with Supabase database.

> 📖 **For the complete project overview**: See [main README](../README.md)  
> 🤖 **For bot setup**: See [backend README](../backend/README.md)

## ✨ **Frontend Features**

### **🌍 Multilingual Support**
- **15+ Indian Languages** with native scripts (Hindi, Bengali, Tamil, Telugu, etc.)
- **Complete Translations** for all UI elements and content
- **Language Selector** with flag icons and native names
- **RTL Support** for Urdu and other right-to-left languages

### **📱 Responsive Design**
- **Mobile-First** approach optimized for smartphones
- **Dark/Light Theme** toggle with system preference detection
- **Progressive Web App** ready (PWA capabilities)
- **Touch-Friendly** interface with large tap targets

### **🔗 Bot Integration**
- **WhatsApp Integration**: Direct chat links with pre-filled messages
- **Telegram Integration**: Seamless redirect to @schemesetu_bot
- **Cross-Platform**: Consistent experience across web and messaging apps

### **🗄️ Database Integration**
- **Supabase Backend**: Real-time data synchronization
- **Scheme Database**: 500+ government schemes with filtering
- **User Analytics**: Track interactions and popular schemes
- **Performance Optimized**: Indexed queries and caching

## 🔗 **Live Links**

- **🌐 Website**: https://scheme-setu-govt.vercel.app/
- **📱 Telegram Bot**: https://t.me/schemesetu_bot
- **💬 WhatsApp Bot**: +91 78500 06956
- **📂 GitHub Repository**: https://github.com/tosif121/schemesetu.git

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Supabase account (for database)

### **1. Clone & Navigate**
```bash
git clone https://github.com/tosif121/schemesetu.git
cd schemesetu/frontend
```

### **2. Install Dependencies**
```bash
npm install
# or
yarn install
```

### **3. Environment Setup**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_WHATSAPP_NUMBER=+1234567890
```

### **4. Run Development Server**
```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the website.

### **5. Build for Production**
```bash
npm run build
npm start
```

## ⚙️ **Environment Configuration**

### **Required Environment Variables**

Create `.env.local` in the frontend directory:

```env
# Supabase Configuration (Required)
# Get these from: https://supabase.com/dashboard/project/_/settings/api
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# WhatsApp Integration (Required)
# Public WhatsApp number for client-side redirects (format: +1234567890)
NEXT_PUBLIC_WHATSAPP_NUMBER=+1234567890

# Optional: App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### **How to Get Credentials**

#### **Supabase Setup**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or select existing
3. Go to Settings → API
4. Copy the `Project URL` and `anon/public` key
5. Add them to your `.env.local` file

#### **WhatsApp Number**
- Use the same number that's connected to your WhatsApp bot
- Format: `+[country_code][phone_number]` (e.g., `+917850006956`)
- This enables direct WhatsApp chat links from the website

## 🗄️ **Database Integration**

The frontend connects to **Supabase** for real-time data. The database includes:

- **Schemes Table**: 500+ government schemes with filtering
- **Users Table**: User preferences and interaction history  
- **Analytics Table**: Usage tracking and insights
- **Real-time Updates**: Live data synchronization

> 📖 **For complete database schema**: See [backend README](../backend/README.md)

### **Supabase Setup**
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key
3. Add them to `.env.local`
4. The frontend will automatically connect to your database

## 🌍 **Multilingual Support**

The website supports these languages with native scripts:

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

## 🏗️ **Project Structure**

```
frontend/
├── app/                    # Next.js App Router
│   ├── context/           # React contexts (Language)
│   ├── lib/               # Utilities and configurations
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── not-found.tsx      # 404 page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── Header.tsx        # Navigation header
│   ├── HeroSection.tsx   # Main banner
│   ├── FeaturesSection.tsx # Features showcase
│   ├── LanguagesSection.tsx # Language grid
│   ├── BotContactSection.tsx # Bot contact cards
│   ├── Footer.tsx        # Site footer
│   └── ThemeProvider.tsx # Theme management
├── public/               # Static assets
│   ├── locales/         # Translation files (15+ languages)
│   │   ├── en/common.json
│   │   ├── hi/common.json
│   │   ├── bn/common.json
│   │   └── ... (12+ more languages)
│   └── images/          # Static images
├── .env.example         # Environment template
├── .env.local          # Your environment variables
├── next.config.ts      # Next.js configuration
├── tailwind.config.js  # Tailwind CSS config
├── package.json        # Dependencies and scripts
└── README.md          # This documentation
```

## 🚀 **Deployment**

### **Vercel (Recommended)**
The easiest way to deploy the Next.js frontend:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

**Environment Variables on Vercel:**
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add your environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`

### **Netlify**
Alternative static hosting:

```bash
# Build the project
npm run build

# Deploy to Netlify (drag & drop the 'out' folder)
# Or use Netlify CLI
npm i -g netlify-cli
netlify deploy --prod --dir=out
```

### **Self-Hosted**
For custom server deployment:

```bash
# Build for production
npm run build

# Start production server
npm start
```

### **Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📱 **Progressive Web App (PWA)**

The website is PWA-ready with:
- **Offline Support**: Service worker for caching
- **Install Prompt**: Add to home screen functionality
- **App-like Experience**: Full-screen mode on mobile
- **Push Notifications**: Ready for implementation

To enable PWA features, uncomment the PWA configuration in `next.config.ts`.

## 🎨 **Customization**

### **Adding New Languages**
1. Create translation file in `public/locales/[lang]/common.json`
2. Add language to `app/lib/languages.ts`
3. Update language selector in components
4. Test RTL support if needed

### **Theming**
- Modify `tailwind.config.js` for custom colors
- Update CSS variables in `app/globals.css`
- Customize components in `components/ui/`

### **Components**
- All components are in `components/` directory
- UI components use shadcn/ui library
- Fully customizable with Tailwind CSS

## 🔧 **Development**

### **Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### **Code Quality**
- **TypeScript**: Full type safety
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality checks

### **Testing**
```bash
# Add testing framework (recommended)
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
```

## 🎯 **Government Schemes**

The website showcases comprehensive government schemes:

| Category | Examples |
|----------|----------|
| **Farmers** | PM-KISAN, Fasal Bima Yojana |
| **Students** | National Scholarship Portal |
| **Women** | Beti Bachao Beti Padhao |
| **Business** | MUDRA Yojana, Startup India |
| **Health** | Ayushman Bharat PM-JAY, Jan Aushadhi |
| **Housing** | PM Awas Yojana (Urban & Rural) |
| **Energy** | Ujjwala Yojana |
| **Skills** | PM Kaushal Vikas Yojana |

## 🤝 **Contributing**

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Next.js** - React framework for production
- **Tailwind CSS** - Utility-first CSS framework
- **Supabase** - Backend as a Service
- **shadcn/ui** - Beautiful UI components
- **Vercel** - Deployment platform
- **Government of India** - For providing open data on schemes

---

**Made with ❤️ for Indian Citizens**

> 🌟 **Star this repository** if you find it helpful!  
> 🐛 **Report issues** on [GitHub Issues](https://github.com/tosif121/schemesetu/issues)  
> 💬 **Get support** via [Telegram](https://t.me/schemesetu_bot) or [WhatsApp](https://wa.me/917850006956)