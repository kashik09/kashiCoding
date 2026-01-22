# Email & WhatsApp Notifications Setup

Get notified via email and WhatsApp when someone submits a service request.

## Quick Setup (5 minutes)

### 1. Set Up Email Notifications (Resend)

**Why Resend?**
- Free tier: 3,000 emails/month, 100 emails/day
- Easy to set up
- No credit card required for free tier

**Steps:**

1. **Sign up at Resend**
   - Go to https://resend.com
   - Sign up with your email
   - Verify your email address

2. **Get your API Key**
   - Go to https://resend.com/api-keys
   - Click "Create API Key"
   - Name it "Portfolio Notifications"
   - Copy the key (starts with `re_...`)

3. **Add to your .env.local**
   ```bash
   RESEND_API_KEY="re_your_actual_api_key_here"
   NOTIFICATION_EMAIL="your-email@gmail.com"
   ```

4. **Important: Verify Your Domain (Optional but Recommended)**
   - For testing, you can use Resend's test domain
   - From email will be: `noreply@resend.dev`
   - To send from your own domain:
     - Go to Resend → Domains
     - Add your domain
     - Add DNS records they provide
     - Wait for verification

### 2. Set Up WhatsApp Notifications

**How It Works:**
- Generates a WhatsApp Web URL with pre-filled message
- You can manually send it to yourself or configure auto-send

**Steps:**

1. **Get Your WhatsApp Number**
   - Format: Country code + phone number (no spaces, no + sign)
   - Uganda example: `256700123456`
   - USA example: `15551234567`

2. **Add to your .env.local**
   ```bash
   WHATSAPP_NUMBER="256700123456"
   ```

3. **Test It**
   - Submit a test request on your site
   - Check the browser console
   - You'll see a WhatsApp URL generated
   - Click it to send the notification to yourself

### 3. Test Your Setup

1. **Start your dev server**
   ```bash
   npm run dev
   ```

2. **Submit a test request**
   - Go to http://localhost:3000/request
   - Fill out the form
   - Submit

3. **Check your email**
   - You should receive an email notification
   - If not, check Resend dashboard for errors

4. **Check WhatsApp (optional)**
   - If configured, you can send yourself a WhatsApp message

## How Notifications Work

When someone submits a service request:

1. **Request is saved to database** (always happens)
2. **Email is sent** (if RESEND_API_KEY is configured)
3. **WhatsApp URL is generated** (if WHATSAPP_NUMBER is configured)

If email fails, the request is still saved - notifications are optional and won't break the form.

## Customizing Email Template

Edit `app/api/send-notification/route.ts` to customize:

```typescript
html: `
  <h2>New Service Request from ${name}</h2>
  // ... customize your email template here
`
```

## Troubleshooting

### Email not receiving

1. **Check Resend Dashboard**
   - Go to https://resend.com/logs
   - See if email was sent
   - Check for errors

2. **Check spam folder**
   - Resend emails might go to spam initially
   - Mark as "Not Spam" to train your email

3. **Verify API key**
   - Make sure RESEND_API_KEY starts with `re_`
   - No extra spaces or quotes

### WhatsApp not working

1. **Check number format**
   - No + sign, no spaces
   - Just country code + number
   - Example: `256700123456`

2. **WhatsApp must be installed**
   - On mobile: Opens WhatsApp app
   - On desktop: Opens WhatsApp Web

## Production Deployment

When deploying to Vercel/production:

1. **Add environment variables**
   - Go to Vercel → Your Project → Settings → Environment Variables
   - Add:
     - `RESEND_API_KEY`
     - `NOTIFICATION_EMAIL`
     - `WHATSAPP_NUMBER`

2. **Redeploy**
   - Changes to environment variables require a redeploy

## Cost

- **Resend Free Tier**: 3,000 emails/month, 100/day
- **WhatsApp**: Free (no API costs, just generates a link)

Plenty for a personal portfolio!

## Support

If you have issues:
- Resend Docs: https://resend.com/docs
- Check `app/api/send-notification/route.ts` for errors
- Look at browser console for error messages
