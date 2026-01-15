# 🚀 AWS Free Tier Deployment Guide

Complete guide to deploy SchemeSaathi bot on AWS EC2 Free Tier.

## 🎁 **AWS Free Tier Benefits**

- **EC2 t3.micro**: 750 hours/month FREE (12 months)
- **2 vCPU, 1GB RAM**: Better performance than t2.micro
- **30GB EBS Storage**: FREE
- **15GB Data Transfer**: FREE per month
- **Perfect for**: Telegram + WhatsApp bot

**Why t3.micro?**
- ✅ 2 vCPUs (better than t2.micro's 1 vCPU)
- ✅ Burstable performance
- ✅ Same price as t2.micro in free tier
- ✅ Better for running both bots

## 📋 Prerequisites

1. **AWS Account**: Sign up at [aws.amazon.com](https://aws.amazon.com/free)
2. **Credit/Debit Card**: Required (won't be charged if you stay in free tier)
3. **Bot Credentials**: Telegram token, Supabase keys, Perplexity API key

## 🚀 Step-by-Step Deployment

### Step 1: Launch EC2 Instance

1. **Login to AWS Console**: https://console.aws.amazon.com
2. **Go to EC2**: Search "EC2" in services
3. **Click "Launch Instance"**

**Configure Instance:**
- **Name**: `schemesaathi-bot`
- **AMI**: Ubuntu Server 22.04 LTS (Free tier eligible)
- **Instance Type**: `t3.micro` (Free tier eligible) ⭐ RECOMMENDED
  - Alternative: `t2.micro` (also free tier eligible)
  - t3.micro has 2 vCPUs vs t2.micro's 1 vCPU
- **Key Pair**: Create new key pair
  - Name: `schemesaathi-key`
  - Type: RSA
  - Format: `.pem` (for Mac/Linux) or `.ppk` (for Windows)
  - **Download and save it!**

**Network Settings:**
- **Create security group**: Yes
- **Allow SSH**: From your IP
- **Allow HTTP**: From anywhere (0.0.0.0/0) - Optional
- **Allow HTTPS**: From anywhere (0.0.0.0/0) - Optional

**Storage:**
- **Size**: 30 GB (Free tier limit)
- **Type**: gp3

4. **Click "Launch Instance"**
5. **Wait 2-3 minutes** for instance to start

### Step 2: Connect to Your Instance

**For Mac/Linux:**
```bash
# Set permissions for key file
chmod 400 schemesaathi-key.pem

# Connect via SSH (replace with your instance IP)
ssh -i schemesaathi-key.pem ubuntu@your-instance-public-ip
```

**For Windows:**
- Use PuTTY with your `.ppk` key file
- Or use Windows Terminal with SSH

**Get your instance IP:**
- Go to EC2 Dashboard
- Click on your instance
- Copy "Public IPv4 address"

### Step 3: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Git
sudo apt install -y git
```

### Step 4: Install Chrome (for WhatsApp)

```bash
# Install Chrome dependencies
sudo apt install -y \
    wget \
    gnupg \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    xdg-utils \
    libglib2.0-0

# Install Google Chrome
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google.list
sudo apt update
sudo apt install -y google-chrome-stable

# Verify Chrome installation
google-chrome --version
```

### Step 5: Clone and Setup Bot

```bash
# Clone repository
git clone https://github.com/tosif121/schemesetu.git
cd schemesetu/bot

# Install dependencies
npm install

# Create .env file
nano .env
```

**Add your environment variables:**
```env
# Telegram Bot
BOT_TOKEN=your_telegram_bot_token
BOT_USERNAME=your_bot_username

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key

# Perplexity AI
PERPLEXITY_API_KEY=your_perplexity_key

# Bot Configuration
NODE_ENV=production

# Message Sync (Optional)
MESSAGE_SYNC_ENABLED=false
SYNC_ADMIN_TELEGRAM_ID=your_telegram_id
SYNC_ADMIN_WHATSAPP_NUMBER=your_whatsapp_number

# Puppeteer Configuration
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
```

Save and exit: `Ctrl+X`, then `Y`, then `Enter`

### Step 6: Start Bot with PM2

```bash
# Start bot
pm2 start unified-bot.js --name schemesaathi

# View logs to scan WhatsApp QR code
pm2 logs schemesaathi

# Scan QR code with WhatsApp mobile app
# Press Ctrl+C to exit logs after scanning

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Copy and run the command it shows

# Check status
pm2 status
```

## 🔄 Managing Your Bot

### View Logs
```bash
# Real-time logs
pm2 logs schemesaathi

# Last 100 lines
pm2 logs schemesaathi --lines 100

# Error logs only
pm2 logs schemesaathi --err
```

### Restart Bot
```bash
pm2 restart schemesaathi
```

### Stop Bot
```bash
pm2 stop schemesaathi
```

### Start Bot
```bash
pm2 start schemesaathi
```

### Update Bot
```bash
# Navigate to bot directory
cd ~/schemesetu/bot

# Pull latest changes
git pull origin main

# Install new dependencies (if any)
npm install

# Restart bot
pm2 restart schemesaathi
```

### Monitor Resources
```bash
# PM2 monitoring
pm2 monit

# System resources
htop

# Disk usage
df -h
```

## 🔒 Security Configuration

### 1. Configure Security Group

In AWS Console:
1. Go to EC2 → Security Groups
2. Select your instance's security group
3. Edit Inbound Rules:
   - **SSH (22)**: Your IP only
   - **HTTP (80)**: Optional, if needed
   - **HTTPS (443)**: Optional, if needed

### 2. Setup Firewall (UFW)

```bash
# Install UFW
sudo apt install ufw -y

# Allow SSH
sudo ufw allow 22/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### 3. Keep System Updated

```bash
# Enable automatic security updates
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure -plow unattended-upgrades
```

## 💾 Backup WhatsApp Session

### Create Backup
```bash
# Create backup directory
mkdir -p ~/backups

# Backup WhatsApp session
cp -r ~/schemesetu/bot/.wwebjs_auth ~/backups/wwebjs_auth_$(date +%Y%m%d)

# Backup to S3 (optional, uses free tier)
# Install AWS CLI first
sudo apt install awscli -y
aws configure
aws s3 cp ~/backups/wwebjs_auth_$(date +%Y%m%d) s3://your-bucket/backups/ --recursive
```

### Restore Backup
```bash
# Restore from local backup
cp -r ~/backups/wwebjs_auth_20260114 ~/schemesetu/bot/.wwebjs_auth

# Restart bot
pm2 restart schemesaathi
```

## 📊 Monitoring with CloudWatch (FREE)

AWS CloudWatch is included in free tier!

### Enable CloudWatch Monitoring

```bash
# Install CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb

# Configure CloudWatch
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard
```

### View Metrics in AWS Console
1. Go to CloudWatch
2. Select Metrics
3. View EC2 metrics (CPU, Network, Disk)

## 💰 Cost Management

### Stay Within Free Tier

**Free Tier Limits:**
- ✅ 750 hours/month EC2 (t3.micro or t2.micro)
- ✅ Enough for 24/7 operation (744 hours/month)
- ✅ 30GB EBS storage
- ✅ 15GB data transfer out

**After Free Tier (12 months):**
- t3.micro: ~$0.0112/hour = ~$8/month
- t2.micro: ~$0.0116/hour = ~$8.50/month
- Still very affordable!

**Tips to Stay Free:**
1. Use only 1 t3.micro or t2.micro instance
2. Don't exceed 30GB storage
3. Monitor data transfer
4. Stop instance when not needed (optional)

### Monitor Costs
1. Go to AWS Billing Dashboard
2. Enable "Free Tier Usage Alerts"
3. Set up billing alerts

### Stop Instance (to save hours)
```bash
# From AWS Console:
# EC2 → Instances → Select instance → Instance State → Stop

# To start again:
# Instance State → Start
```

## 🆘 Troubleshooting

### Issue: Can't Connect via SSH
**Solution:**
```bash
# Check security group allows SSH from your IP
# Verify key file permissions: chmod 400 schemesaathi-key.pem
# Check instance is running in AWS Console
```

### Issue: WhatsApp QR Code Not Showing
**Solution:**
```bash
# Check Chrome is installed
google-chrome --version

# Check logs
pm2 logs schemesaathi

# Restart bot
pm2 restart schemesaathi
```

### Issue: Bot Crashes
**Solution:**
```bash
# Check logs for errors
pm2 logs schemesaathi --err

# Check memory usage
free -h

# Restart bot
pm2 restart schemesaathi
```

### Issue: Out of Memory
**Solution:**
```bash
# Add swap space (virtual memory)
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## 🔄 Auto-Restart on Reboot

PM2 automatically handles this if you ran `pm2 startup` and `pm2 save`.

**Verify:**
```bash
# Check PM2 startup script
pm2 startup

# Save current process list
pm2 save

# Test by rebooting
sudo reboot

# After reboot, check if bot is running
pm2 status
```

## 📈 Performance Optimization

### Optimize Node.js Memory
```bash
# Edit PM2 config
pm2 delete schemesaathi

# Start with memory limit
pm2 start unified-bot.js --name schemesaathi --max-memory-restart 800M

# Save configuration
pm2 save
```

### Clean Up Disk Space
```bash
# Remove old logs
pm2 flush

# Clean npm cache
npm cache clean --force

# Remove old packages
sudo apt autoremove -y
```

## ✅ Deployment Checklist

- [ ] AWS account created
- [ ] EC2 t2.micro instance launched
- [ ] SSH key downloaded and saved
- [ ] Connected to instance via SSH
- [ ] Node.js and dependencies installed
- [ ] Chrome installed for WhatsApp
- [ ] Repository cloned
- [ ] Environment variables configured
- [ ] Bot started with PM2
- [ ] WhatsApp QR code scanned
- [ ] Telegram bot responding
- [ ] WhatsApp bot responding
- [ ] PM2 startup configured
- [ ] Security group configured
- [ ] Firewall enabled
- [ ] Billing alerts set up

## 🎉 Success!

Your bot is now running 24/7 on AWS Free Tier!

**Test your bots:**
- Telegram: https://t.me/your_bot_username
- WhatsApp: Send "hi" to +91 78500 06956

**Monitor:**
```bash
pm2 status
pm2 logs schemesaathi
pm2 monit
```

**Your bot will run FREE for 12 months!**

---

**Need help?** Check PM2 logs: `pm2 logs schemesaathi`
