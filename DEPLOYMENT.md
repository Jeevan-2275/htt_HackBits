# 🚀 Feedspace Production Deployment Guide

Deploy the **Feedspace** platform with **Next.js 16 (Vercel)**, **Express Node.js (Render/Railway)**, and **MongoDB Atlas**.

---

## 🏗️ Architecture Overview

```
┌───────────────────────────────┐           ┌───────────────────────────────┐
│     Frontend: Vercel          │           │       Backend: Render         │
│  - Next.js 16 App Router      │ ──API───► │  - Express.js + FFmpeg        │
│  - Optical Glassmorphism UI   │           │  - Neural Edge TTS / STT      │
│  - 9:16 Reel Video Studio     │           │  - AI Video Processing        │
└───────────────────────────────┘           └──────────────┬────────────────┘
                                                           │
                                                           ▼
                                            ┌───────────────────────────────┐
                                            │      Database: Atlas          │
                                            │  - MongoDB M0 Free Cluster    │
                                            └───────────────────────────────┘
```

---

## 📑 Step 1: MongoDB Atlas (Free Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up / log in.
2. Click **"Create a Database"** and select the **M0 (Free)** shared cluster.
3. Under **Security Quickstart**:
   - **Username / Password**: Create a user (e.g. `feedspace_admin` and a secure password).
   - **Network Access**: Add IP Address `0.0.0.0/0` (Allow Access from Anywhere) so Render/Vercel can connect.
4. Click **"Connect"** ➔ **"Drivers"** (Node.js) and copy your connection string:
   ```env
   mongodb+srv://feedspace_admin:<password>@cluster0.xxxxx.mongodb.net/htt_hackbits?retryWrites=true&w=majority
   ```

---

## 🖥️ Step 2: Deploy Backend to Render

1. Push your latest code to your GitHub repository:
   ```bash
   git add .
   git commit -m "feat: production deployment configs"
   git push origin main
   ```
2. Log in to [Render.com](https://render.com) and click **"New +"** ➔ **"Web Service"**.
3. Connect your repository: `https://github.com/Jeevan-2275/htt_HackBits`.
4. Configure the Web Service:
   - **Name**: `feedspace-backend`
   - **Region**: Oregon (US West) or closest to your users
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
5. Click **"Advanced"** ➔ **"Add Environment Variable"**:
   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Production mode |
   | `PORT` | `10000` | Port automatically assigned by Render |
   | `MONGO_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | *(Generate a 32+ char random string)* | Auth signing key |
   | `JWT_EXPIRE` | `30d` | Token expiry |
   | `GROQ_API_KEY` | *(Optional)* | Groq LLaMA 3.3 for question generation |
   | `OPENAI_API_KEY`| *(Optional)* | OpenAI Whisper / GPT-4o for transcripts |
   | `CLOUDINARY_CLOUD_NAME` | *(Optional)* | Cloudinary cloud name |
   | `CLOUDINARY_API_KEY` | *(Optional)* | Cloudinary API key |
   | `CLOUDINARY_API_SECRET` | *(Optional)* | Cloudinary secret |
6. Click **"Create Web Service"**.
7. Once deployed, copy your backend URL (e.g., `https://feedspace-backend.onrender.com`).
   - Test it in your browser: `https://feedspace-backend.onrender.com/api/health` ➔ should return `{"status":"OK"}`.

---

## ⚡ Step 3: Deploy Frontend to Vercel

1. Go to [Vercel.com](https://vercel.com) and log in.
2. Click **"Add New..."** ➔ **"Project"**.
3. Import your GitHub repository: `Jeevan-2275/htt_HackBits`.
4. Configure Project Settings:
   - **Framework Preset**: `Next.js` (automatically detected)
   - **Root Directory**: Click **Edit** and choose `frontend`! *(Important)*
5. Expand **"Environment Variables"** and add:
   | Key | Value |
   | :--- | :--- |
   | `NEXT_PUBLIC_API_URL` | `https://feedspace-backend.onrender.com/api` *(replace with your actual Render URL)* |
   | `EMAIL_USER` | `convohub73@gmail.com` *(optional for email invites)* |
   | `EMAIL_PASSWORD` | *(Gmail App Password)* |
6. Click **"Deploy"**.
7. Vercel will build Next.js 16 with Turbopack in ~60 seconds.
8. Your production app is live at: `https://htt-hackbits.vercel.app` (or custom domain)!

---

## 🧪 Step 4: Verification Checklist

- [ ] Open your live Vercel URL and verify the Optical Glassmorphism landing page.
- [ ] Sign up for a new account at `/signup`.
- [ ] Create a new campaign at `/dashboard/campaigns/create`.
- [ ] Copy the public recording link `/record/:campaignId` and open in a new incognito window.
- [ ] Complete a 30s–60s video recording with the AI host.
- [ ] Visit `/dashboard/testimonials` and click **"AI Reel Studio"** to preview vertical 9:16 format with karaoke subtitles.
