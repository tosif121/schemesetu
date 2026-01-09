# Telegram Bot Setup Guide

This guide will help you set up the Telegram bot integration for SchemeSaathi.

## Prerequisites

1. A Telegram account
2. Access to create a Telegram bot via BotFather
3. A deployed Next.js application with HTTPS (required for webhooks)

## Step 1: Create a Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Start a conversation with BotFather by sending `/start`
3. Create a new bot by sending `/newbot`
4. Choose a name for your bot (e.g., "SchemeSaathi Bot")
5. Choose a username for your bot (must end with 'bot', e.g., "SchemeSaathiBot")
6. BotFather will provide you with a bot token - save this securely

## Step 2: Configure Bot Settings

1. Set bot description: `/setdescription`
   ```
   🇮🇳 SchemeSaathi - Your AI assistant for Indian government schemes
   
   I help Indian citizens discover government schemes they're eligible for in 15+ Indian languages including Hindi, English, Tamil, Bengali, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, Urdu, Kashmiri, and Maithili.
   
   Just tell me your age, state, occupation, and income to get personalized scheme recommendations!
   ```

2. Set bot about text: `/setabouttext`
   ```
   AI-powered assistant for Indian government schemes supporting 15+ languages with intelligent eligibility matching.
   ```

3. Set bot commands: `/setcommands`
   ```
   start - Start conversation and get welcome message
   help - Get help and usage instructions
   language - Change your preferred language
   ```

4. Set bot profile photo (optional): `/setuserpic`

## Step 3: Environment Variables

Add these environment variables to your `.env.local` file:

```bash
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
TELEGRAM_WEBHOOK_URL=https://yourdomain.com
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=YourBotUsername

# Optional: For development/testing
NODE_ENV=production
```

### Environment Variable Descriptions

- `TELEGRAM_BOT_TOKEN`: The token provided by BotFather when you created the bot
- `TELEGRAM_WEBHOOK_URL`: Your application's base URL (must be HTTPS in production)
- `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME`: Your bot's username (without @)

## Step 4: Webhook Setup

The webhook will be automatically set when your application starts in production mode. The webhook URL will be:
```
https://yourdomain.com/api/telegram/webhook
```

### Manual Webhook Setup (if needed)

If you need to manually set the webhook, you can use this curl command:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://yourdomain.com/api/telegram/webhook"}'
```

## Step 5: Test Your Bot

1. Search for your bot on Telegram using its username
2. Send `/start` to begin the conversation
3. Test different languages and commands
4. Verify that the bot responds correctly

## Bot Features

### Commands
- `/start` - Welcome message and language selection
- `/help` - Usage instructions and examples
- `/language` - Change preferred language

### Interactive Features
- **Inline Keyboards**: Quick action buttons for common tasks
- **Language Selection**: Support for 15+ Indian languages
- **Callback Queries**: Instant responses to button presses
- **Rich Formatting**: HTML formatting for better readability

### Supported Languages
- English, Hindi, Bengali, Tamil, Telugu, Marathi
- Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese
- Urdu, Kashmiri, Maithili

## Development vs Production

### Development Mode
- Uses polling instead of webhooks
- Logs messages to console instead of sending (if token not configured)
- Easier for local testing

### Production Mode
- Uses webhooks for better performance
- Automatic webhook setup
- Full message sending capabilities

## Troubleshooting

### Common Issues

1. **Bot not responding**
   - Check if `TELEGRAM_BOT_TOKEN` is correctly set
   - Verify webhook URL is accessible via HTTPS
   - Check server logs for errors

2. **Webhook errors**
   - Ensure your domain has a valid SSL certificate
   - Verify the webhook URL returns 200 OK
   - Check if the webhook endpoint is accessible

3. **Language issues**
   - Verify translation files are properly loaded
   - Check if the language code is supported
   - Ensure fallback to English works

### Debug Commands

Check webhook status:
```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo"
```

Delete webhook (for development):
```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/deleteWebhook"
```

## Security Considerations

1. **Token Security**: Never commit your bot token to version control
2. **Webhook Validation**: The webhook endpoint validates incoming requests
3. **Rate Limiting**: Telegram has built-in rate limiting
4. **User Privacy**: Conversation data is stored securely in Supabase

## Integration with Existing Features

The Telegram bot integrates seamlessly with existing SchemeSaathi features:

- **Shared AI Processing**: Uses the same Gemini AI for language understanding
- **Unified Database**: Stores user data in the same Supabase database
- **Multilingual Support**: Leverages existing translation system
- **Scheme Matching**: Uses the same eligibility matching logic

## Monitoring and Analytics

The bot automatically tracks:
- User interactions and language preferences
- Scheme recommendations and success rates
- Conversation history for improvement
- Platform-specific analytics (Telegram vs WhatsApp)

## Next Steps

1. Deploy your application with the environment variables
2. Test the bot thoroughly in different languages
3. Monitor usage and user feedback
4. Consider adding more interactive features like inline queries
5. Set up monitoring and alerting for bot health

For more advanced features, refer to the [Telegram Bot API documentation](https://core.telegram.org/bots/api).