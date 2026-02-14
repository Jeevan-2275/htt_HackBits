# Email Configuration Guide for Feedspace

## How to Enable Real Email Sending

Follow these steps to enable real email sending via Gmail:

### Step 1: Set Up Gmail
1. Go to https://myaccount.google.com/
2. Click **Security** in the left sidebar
3. Enable **2-Step Verification** if not already enabled

### Step 2: Generate App Password
1. Go back to **Security** settings
2. Look for **App passwords** (appears only if 2-Step Verification is enabled)
3. Select **Mail** and **Windows Computer** (or your device)
4. Click **Generate**
5. Google will show a 16-character password - copy it

### Step 3: Update `.env.local`
Edit the `.env.local` file in the frontend folder:

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx
```

Replace:
- `your-email@gmail.com` with your actual Gmail address
- `xxxx-xxxx-xxxx-xxxx` with the 16-character App Password from Step 2

### Step 4: Test
1. Create a new campaign
2. Add email addresses
3. Click "Send Links via Email"
4. Emails will be sent to all provided addresses

## Current Status

- **Without Email Credentials**: Emails are sent in MOCK mode (logged to browser console)
- **With Email Credentials**: Real emails are sent via Gmail

## Troubleshooting

### Emails not sending
1. Check `.env.local` file exists and has correct values
2. Verify 2-Step Verification is enabled on Gmail account
3. Verify App Password (not regular password) is being used
4. Check browser console for error messages

### Getting "App passwords" option
- Make sure 2-Step Verification is enabled
- App passwords only appear for accounts with 2-Step Verification

## Email Template

Recipients receive beautifully formatted HTML emails with:
- Campaign name
- Recording link
- Direct link in case button doesn't work
- Professional Feedspace branding

The email encourages users to record their testimonial in just 2 minutes with no editing required.
