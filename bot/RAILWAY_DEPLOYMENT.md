# 🚂 Railway Deployment Guide for SchemeSaathi Bot

This guide will help you deploy both Telegram and WhatsApp bots on Railway.app with Chrome support.

## 📋 Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Account**: Your code should be pushed to GitHub
3. **Bot Credentials**: Have your `.env` values ready

## 🚀 Deployment Steps

### Step 1: Create New Project on Railway

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `schemesetu` repository
5. Select the `bot` directory as the root

### Step 2: Configure Environment Variables

In Railway dashboard, go to **Variables** tab and add:

```env
# Telegram Bot Configuration
BOT_TOKEN=your_telegram_bot_token
BOT_USERNAME=your_bot_username

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Perplexity AI Configuration
PERPLEXITY_API_KEY=your_perplexity_api_key

# Bot Configuration
NODE_ENV=production

# Message Synchronization (Optional)
MESSAGE_SYNC_ENABLED=false
SYNC_ADMIN_TELEGRAM_ID=your_telegram_user_id
SYNC_ADMIN_WHATSAPP_NUMBER=your_whatsapp_number

# Puppeteer Configuration (Important!)
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
```

### Step 3: Configure Build Settings

Railway will automatically detect the Dockerfile. If not:

1. Go to **Settings** tab
2. Under **Build**, select **Dockerfile**
3. Set **Dockerfile Path** to `Dockerfile`
4. Set **Root Directory** to `bot` (if deploying from root)

### Step 4: Deploy

1. Click **"Deploy"** button
2. Wait for build to complete (first build takes 5-10 minutes)
3. Check logs for any errors

### Step 5: Scan WhatsApp QR Code

**Important**: WhatsApp requires QR code scanning on first run.

**Option A: View Logs (Recommended)**
1. Go to **Deployments** tab
2. Click on latest deployment
3. View **Logs**
4. Look for QR code in ASCII format
5. Scan with WhatsApp mobile app

**Option B: Use Railway CLI**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# View logs with QR code
railway logs
```

**Option C: Temporary Local Scan**
```bash
# Run locally first to authenticate
cd bot
npm install
npm start
# Scan QR code
# Session will be saved to .wwebjs_auth/
# Upload this folder to Railway (see below)
```

### Step 6: Persist WhatsApp Session (Important!)

WhatsApp session needs to persist across deployments.

**Option 1: Use Railway Volumes (Recommended)**
1. Go to **Settings** → **Volumes**
2. Add new volume:
   - **Mount Path**: `/app/.wwebjs_auth`
   - **Size**: 1GB
3. Redeploy the service

**Option 2: Use External Storage**
- Modify bot code to use cloud storage (S3, Google Cloud Storage)
- Store session data externally

## 🔍 Troubleshooting

### Bot Crashes After Deployment

**Check logs for:**
```bash
railway logs
```

**Common issues:**

1. **Chrome not found**
   - Ensure `PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable`
   - Check Dockerfile installed Chrome correctly

2. **WhatsApp QR Code Timeout**
   - QR code expires after 60 seconds
   - Scan quickly or use Railway CLI for better visibility

3. **Memory Issues**
   - Upgrade Railway plan if needed
   - WhatsApp + Chrome needs ~512MB-1GB RAM

4. **Session Lost on Redeploy**
   - Add Railway Volume for `.wwebjs_auth`
   - Or use persistent storage solution

### View Real-time Logs

```bash
# Using Railway CLI
railway logs --follow

# Or in Railway dashboard
# Go to Deployments → Latest → Logs
```

### Restart Service

```bash
# Using Railway CLI
railway restart

# Or in Railway dashboard
# Go to Settings → Restart
```

## 📊 Monitoring

### Check Bot Status

1. **Telegram**: Send `/start` to your bot
2. **WhatsApp**: Send "hi" to your WhatsApp number
3. **Logs**: Check Railway logs for activity

### Health Check

Add this to your bot code for health monitoring:

```javascript
// Add HTTP server for health checks
const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is running!');
});
server.listen(3000);
```

## 💰 Railway Pricing

- **Starter Plan**: $5/month (500 hours)
- **Developer Plan**: $20/month (unlimited)
- **First $5 free** for new users

**Estimated costs for this bot:**
- ~$5-10/month depending on usage
- WhatsApp uses more resources than Telegram

## 🔄 Updating the Bot

### Method 1: Git Push (Automatic)
```bash
git add .
git commit -m "Update bot"
git push origin main
# Railway auto-deploys on push
```

### Method 2: Manual Redeploy
1. Go to Railway dashboard
2. Click **"Redeploy"** button

## 🆘 Support

### Railway Support
- [Railway Docs](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)

### Bot Issues
- Check GitHub issues
- Review bot logs
- Test locally first

## ✅ Deployment Checklist

- [ ] Railway account created
- [ ] GitHub repo connected
- [ ] Environment variables configured
- [ ] Dockerfile present in bot directory
- [ ] First deployment successful
- [ ] WhatsApp QR code scanned
- [ ] Telegram bot responding
- [ ] WhatsApp bot responding
- [ ] Volume configured for session persistence
- [ ] Monitoring/logs working

## 🎉 Success!

Once deployed, your bot will:
- ✅ Run 24/7 on Railway
- ✅ Support both Telegram and WhatsApp
- ✅ Auto-restart on failures
- ✅ Scale automatically
- ✅ Share Supabase database with frontend

**Test your bots:**
- Telegram: https://t.me/your_bot_username
- WhatsApp: Send "hi" to your WhatsApp number

---

**Need help?** Check Railway logs or create a GitHub issue.
