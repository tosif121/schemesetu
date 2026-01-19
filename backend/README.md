# SchemeSaathi Unified Bot

A comprehensive AI-powered bot for Telegram and WhatsApp that helps users discover and apply for government schemes in India. Built with Node.js, featuring multi-language support, scheme recommendations, and cross-platform synchronization.

## Features

### 🤖 Multi-Platform Support
- **Telegram Bot**: Full-featured bot with inline keyboards and commands
- **WhatsApp Bot**: Interactive messaging with button support
- **Cross-Platform Sync**: Unified user experience across platforms

### 🗄️ Scheme Database
- Integration with Supabase for scheme storage
- Real-time scheme recommendations based on user eligibility
- Categories: Agriculture, Education, Health, Employment, etc.
- Personalized filtering by age, income, occupation, gender

### 🌍 Multi-Language Support
- English, Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi
- Automatic language detection and switching

### 🤖 AI Integration
- Perplexity AI for advanced scheme queries
- Intelligent conversation handling
- Contextual responses

### 📊 Analytics & Logging
- User interaction tracking
- Conversation logging
- Scheme application analytics

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- WhatsApp account for bot
- Telegram Bot Token
- Supabase account
- Perplexity AI API key

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` file:
   ```env
   BOT_TOKEN=your_telegram_bot_token
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   PERPLEXITY_API_KEY=your_perplexity_api_key
   ```

## Configuration

### Telegram Bot Setup
1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Create a new bot and get your token
3. Add the token to `.env` as `BOT_TOKEN`

### WhatsApp Bot Setup
1. The bot uses `whatsapp-web.js` for WhatsApp Web integration
2. On first run, scan the QR code with WhatsApp > Settings > Linked Devices

### Supabase Setup
1. Create a Supabase project
2. Set up the `schemes` table with the required schema
3. Get your project URL and anon key from Settings > API

### Perplexity AI Setup
1. Get an API key from Perplexity AI
2. Add it to `.env` as `PERPLEXITY_API_KEY`

## Running the Bot

### Unified Bot (Recommended)
```bash
npm start
# or
node unified-bot.js
```

### WhatsApp Only Testing
```bash
node test.js
```

## Usage

### Telegram Commands
- `/start` - Initialize the bot and select language
- `/help` - Show available commands
- Browse schemes by category or get personalized recommendations

### WhatsApp Commands
- `menu` or `start` - Show main menu
- `help` - Show help information
- `language` - Change language
- Send eligibility details for personalized recommendations

### Scheme Categories
- Agriculture & Rural Development
- Education & Skill Development
- Health & Nutrition
- Employment & Entrepreneurship
- Women & Child Development
- Senior Citizens
- Persons with Disabilities
- Minority Welfare
- And more...

## File Structure

```
backend/
├── unified-bot.js          # Main unified bot file
├── bot.js                  # Telegram-only bot (legacy)
├── supabase-schemes.js     # Database functions
├── package.json            # Dependencies and scripts
├── .env                    # Environment variables
├── .env.example            # Environment template
└── README.md              # This file
```

## Development

### Adding New Schemes
1. Add scheme data to Supabase `schemes` table
2. Ensure proper categorization and eligibility criteria
3. Update filtering logic in `supabase-schemes.js` if needed

### Language Support
- Add new languages in the `LANGUAGES` object
- Update translation strings in the bot files
- Test language switching functionality

### Custom Commands
- Add new commands in the respective platform handlers
- Update help menus and documentation

## Troubleshooting

### Common Issues

**WhatsApp QR Code Not Appearing**
- Clear the `.wwebjs_auth` folder and restart
- Check internet connection
- Ensure WhatsApp Web is not blocked

**Telegram Bot Not Responding**
- Verify `BOT_TOKEN` in `.env`
- Check bot permissions with @BotFather
- Ensure bot is not banned

**Supabase Connection Failed**
- Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY`
- Check Supabase project status
- Ensure database tables exist

**Perplexity API Errors**
- Verify `PERPLEXITY_API_KEY`
- Check API quota and limits
- Ensure proper prompt formatting

### Logs
- Check console output for error messages
- Bot logs all interactions and errors
- Use `console.log` for debugging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support or questions:
- Check the troubleshooting section
- Review the code comments
- Test with the provided `test.js` file

## Version History

- v3.0.0: Unified Telegram + WhatsApp bot with AI integration
- v2.0.0: Multi-language support and Supabase integration
- v1.0.0: Initial Telegram bot implementation</content>
<parameter name="filePath">/Users/tosif/Desktop/bot/README.md