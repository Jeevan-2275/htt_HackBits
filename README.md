# 🎥 AI Video Testimonial Platform - HackBits

> **Powerful AI-driven platform for collecting, managing, and showcasing video testimonials**

A full-stack application that enables businesses to collect authentic video testimonials from customers, automatically process them with AI, and display them beautifully on their websites.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Testimonials System](#-testimonials-system)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)

---

## ✨ Features

### 🎯 Core Features

- **AI-Powered Interview System**: Conducts dynamic video interviews with AI-generated questions
- **Video Recording & Upload**: Browser-based video recording with Cloudinary storage
- **Testimonial Management Dashboard**: Full CRUD operations for managing testimonials
- **Real-time Video Processing**: Automatic transcription, sentiment analysis, and highlight generation
- **Campaign Management**: Create and manage multiple testimonial collection campaigns
- **Responsive UI**: Beautiful, mobile-friendly interface built with Next.js and Tailwind CSS

### 🆕 Testimonials System (Latest Update)

- ✅ **Automatic Testimonial Creation**: Videos automatically appear in dashboard after upload
- ✅ **Grid View Display**: Beautiful 3-column grid layout for testimonials
- ✅ **Campaign-based Filtering**: Filter testimonials by campaign
- ✅ **Video Playback**: Inline video player with controls
- ✅ **Status Tracking**: pending → processed → published workflow
- ✅ **Sentiment Analysis**: Automatic emotion detection (positive/neutral/negative)
- ✅ **User Information**: Display user names and timestamps
- ✅ **Dummy Data Support**: Sample testimonials for testing

### 🤖 AI Features

- GPT-4 Turbo integration for intelligent question generation
- Groq API for fast audio transcription
- Sentiment analysis on testimonials
- Automatic highlight extraction

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 16.1.6 (React 19.2.3)
- **Styling**: Tailwind CSS 4
- **State Management**: React Hooks
- **HTTP Client**: Fetch API
- **Video Recording**: MediaRecorder API

### Backend
- **Runtime**: Node.js
- **Framework**: Express 5.2.1
- **Database**: MongoDB (Mongoose 9.2.1)
- **Authentication**: JWT (jsonwebtoken 9.0.3)
- **File Upload**: Multer 2.0.2
- **Cloud Storage**: Cloudinary 2.9.0
- **AI/ML**: 
  - OpenAI API (GPT-4 Turbo)
  - Groq SDK (Whisper for transcription)
- **Video Processing**: FFmpeg (fluent-ffmpeg 2.1.3)
- **Text-to-Speech**: Edge TTS 1.0.1

### DevOps & Tools
- **Version Control**: Git
- **Package Manager**: npm
- **Environment**: dotenv
- **Security**: Helmet, bcrypt, CORS

---

## 📁 Project Structure

```
htt_HackBits/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── cloudinary.js       # Cloudinary configuration
│   │   │   └── db.js                # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js    # Authentication logic
│   │   │   ├── campaignController.js # Campaign management
│   │   │   ├── testimonialController.js # ⭐ Testimonial CRUD
│   │   │   ├── videoController.js   # Video upload & processing
│   │   │   └── ...
│   │   ├── models/
│   │   │   ├── User.js              # User schema
│   │   │   ├── Project.js           # Campaign schema
│   │   │   ├── Testimonial.js       # ⭐ Testimonial schema (NEW)
│   │   │   ├── InterviewSession.js  # Session schema
│   │   │   └── ...
│   │   ├── routes/
│   │   │   └── api.js               # API routes
│   │   ├── middleware/
│   │   │   └── auth.js              # JWT authentication
│   │   ├── services/
│   │   │   ├── aiService.js         # OpenAI integration
│   │   │   ├── transcriptionService.js # Groq/Whisper
│   │   │   ├── ttsService.js        # Text-to-Speech
│   │   │   └── ...
│   │   ├── app.js                   # Express app setup
│   │   └── server.js                # Server entry point
│   ├── uploads/                     # Temporary file storage
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── dashboard/
│   │   │   │   ├── testimonials/
│   │   │   │   │   └── page.js      # ⭐ Testimonials page (NEW)
│   │   │   │   ├── campaigns/
│   │   │   │   │   └── ...
│   │   │   │   └── page.js
│   │   │   ├── record/
│   │   │   │   └── [campaignId]/
│   │   │   │       └── page.js      # Video recording page
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── components/
│   │   │   ├── VideoRecorder.js     # Video recording component
│   │   │   ├── Navbar.js
│   │   │   └── ...
│   │   ├── context/
│   │   │   └── AuthContext.js       # Authentication context
│   │   ├── lib/
│   │   │   ├── authService.js       # Auth API calls
│   │   │   └── campaignService.js   # Campaign API calls
│   │   └── ...
│   └── package.json
│
├── README.md                        # ⭐ This file (NEW)
└── .gitignore
=======
<p align="center">
  <img src="https://img.shields.io/badge/Feedspace-AI%20Testimonials-blueviolet?style=for-the-badge&logo=openai&logoColor=white" alt="Feedspace Badge"/>
</p>

<h1 align="center">🎬 Feedspace</h1>

<h3 align="center">
  <em>AI-Native Autonomous Video Testimonial Platform</em>
</h3>

<p align="center">
  Automatically collect, interview, process, and generate marketing-ready testimonial reels — powered by AI.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Groq_AI-FF6600?style=flat-square&logo=meta&logoColor=white" />
  <img src="https://img.shields.io/badge/FFmpeg-007808?style=flat-square&logo=ffmpeg&logoColor=white" />
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white" />
</p>

---

## 🚀 What is Feedspace?

**Feedspace** replaces traditional testimonial collection with a fully autonomous AI system. Instead of chasing customers for written reviews, Feedspace:

1. **🎯 Creates AI-Powered Campaigns** — Generates smart interview questions tailored to your product using Llama 3.3 70B
2. **🤖 Conducts Live AI Interviews** — An AI "buddy" interviews your customers via voice, adapting questions based on sentiment analysis
3. **🎥 Records Everything** — Captures video testimonials directly in the browser with real-time transcription
4. **✂️ Auto-Extracts Highlights** — AI identifies the most impactful 30-second clips from raw footage
5. **🎬 Generates Marketing Reels** — Produces vertical (9:16) reels with burned-in subtitles, ready for social media

> **One prompt → Full testimonial pipeline → Marketing-ready content**

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🧠 **AI Interview Engine** | Groq Llama 3.3 70B conducts natural, sentiment-aware conversations |
| 🎙️ **Free Unlimited TTS** | Microsoft Edge TTS with 14+ voices across 7 languages |
| 📝 **Real-time Transcription** | Whisper Large V3 via Groq with chunked long-audio support |
| 🎬 **Auto Reel Generation** | FFmpeg-powered clip extraction, subtitle burning, and concatenation |
| ☁️ **Cloud Storage** | Cloudinary for all video/audio assets |
| 🔐 **JWT Authentication** | Secure user accounts with bcrypt password hashing |
| 📧 **Email Invitations** | Send campaign links to customers via Nodemailer |
| 🌙 **Premium Dark UI** | Glassmorphic design with gradient accents and micro-animations |
| 📱 **Fully Responsive** | Mobile-first design with adaptive sidebar navigation |

---

## 🏗️ Architecture

```
feedspace/
├── backend/                    # Express + Mongoose API Server
│   └── src/
│       ├── config/
│       │   ├── db.js           # MongoDB connection
│       │   └── cloudinary.js   # Cloudinary upload helper
│       ├── controllers/        # 9 route controllers
│       │   ├── authController.js
│       │   ├── campaignController.js
│       │   ├── interviewController.js
│       │   ├── jobController.js
│       │   ├── projectController.js
│       │   ├── promptController.js
│       │   ├── testimonialController.js
│       │   ├── videoController.js
│       │   └── voiceController.js
│       ├── models/             # 9 Mongoose schemas
│       │   ├── User.js
│       │   ├── Project.js
│       │   ├── InterviewSession.js
│       │   ├── ConversationTurn.js
│       │   ├── CampaignQuestionSet.js
│       │   ├── UserPrompt.js
│       │   ├── VideoAsset.js
│       │   ├── ClipAsset.js
│       │   └── ReelAsset.js
│       ├── services/           # 5 AI & media services
│       │   ├── aiService.js        # Groq Llama 3.3 — NLP engine
│       │   ├── ttsService.js       # Edge TTS — speech synthesis
│       │   ├── transcriptionService.js  # Whisper — STT
│       │   ├── highlightService.js # AI highlight extraction
│       │   └── ffmpegService.js    # Video processing
│       ├── middleware/
│       │   └── auth.js         # JWT protect middleware
│       ├── routes/
│       │   └── api.js          # 25+ API endpoints
│       ├── utils/
│       │   └── fileUpload.js   # Multer config (200MB limit)
│       ├── app.js              # Express app setup
│       └── server.js           # Server entry point
│
└── frontend/                   # Next.js 16 + React 19
    └── src/
        ├── app/
        │   ├── page.js                     # Landing page
        │   ├── login/page.js               # Login
        │   ├── signup/page.js              # Registration
        │   ├── dashboard/
        │   │   ├── page.js                 # Dashboard overview
        │   │   ├── campaigns/
        │   │   │   ├── page.js             # Campaign listing
        │   │   │   └── create/page.js      # Campaign creator
        │   │   └── testimonials/
        │   │       ├── page.js             # Testimonial listing
        │   │       └── [id]/page.js        # Testimonial detail
        │   ├── record/
        │   │   └── [campaignId]/page.js    # 🎥 Video recording page
        │   └── api/
        │       └── send-email/route.js     # Email API route
        ├── components/
        │   ├── Navbar.js           # Sticky navigation
        │   ├── Sidebar.js          # Dashboard sidebar
        │   ├── VideoRecorder.js    # Video capture component
        │   ├── DynamicListInput.js # Question list editor
        │   ├── LayoutWrapper.js    # Layout with Navbar + Footer
        │   └── Footer.js          # Site footer
        └── lib/
            └── mockApi.js          # localStorage mock for demo
>>>>>>> 8c4d8d7 (Add README)
```

---

## 🚀 Installation

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- FFmpeg installed on your system
- Cloudinary account
- OpenAI API key
- Groq API key

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd htt_HackBits
```

### Step 2: Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/
OPENAI_API_KEY=your_openai_api_key
OPENAI_HIGHLIGHT_MODEL=gpt-4-turbo

=======
## 🔄 AI Pipeline Flow

```mermaid
flowchart LR
    A["📝 Create Campaign"] --> B["🤖 AI Generates\nInterview Questions"]
    B --> C["📧 Send Link\nto Customer"]
    C --> D["🎥 Customer Records\nVideo Testimonial"]
    D --> E["🎙️ AI Interviews\nwith TTS + STT"]
    E --> F["📝 Whisper Transcribes\nFull Audio"]
    F --> G["✂️ AI Extracts\n30s Highlights"]
    G --> H["🎬 FFmpeg Generates\nVertical Reel"]
    H --> I["☁️ Upload to\nCloudinary"]

    style A fill:#3B82F6,color:#fff
    style B fill:#8B5CF6,color:#fff
    style E fill:#8B5CF6,color:#fff
    style F fill:#8B5CF6,color:#fff
    style G fill:#8B5CF6,color:#fff
    style H fill:#10B981,color:#fff
    style I fill:#06B6D4,color:#fff
```

---

## 📡 API Reference

### 🔐 Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Create new account | Public |
| `POST` | `/api/auth/login` | Login & get JWT token | Public |
| `GET` | `/api/auth/me` | Get current user profile | 🔒 |

### 📁 Projects
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/projects` | List all projects | 🔒 |
| `POST` | `/api/projects` | Create new project | 🔒 |
| `GET` | `/api/projects/:id` | Get project details | 🔒 |
| `PUT` | `/api/projects/:id` | Update project | 🔒 |
| `DELETE` | `/api/projects/:id` | Delete project | 🔒 |

### 🎯 Campaigns & Interviews
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/campaigns/questions` | AI-generate campaign questions | Public |
| `POST` | `/api/prompt` | Analyze prompt & create interview plan | Public |
| `POST` | `/api/session/start` | Start AI interview session | Public |
| `POST` | `/api/conversation/next` | Process response & get next question | Public |

### 🎥 Video Processing
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/video/upload` | Upload raw video | Public |
| `POST` | `/api/process/highlights` | Extract AI highlights & clips | Public |
| `POST` | `/api/process/reel` | Generate final reel | Public |
| `POST` | `/api/jobs/create` | Full auto-process pipeline | Public |
| `GET` | `/api/jobs/:jobId` | Check job status | Public |

### 🎙️ Voice Services
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/voice/tts` | Text-to-Speech | Public |
| `POST` | `/api/voice/tts-batch` | Batch TTS generation | Public |
| `POST` | `/api/voice/stt` | Speech-to-Text | Public |
| `GET` | `/api/voice/voices` | List available TTS voices | Public |
| `GET` | `/api/voice/cache-stats` | TTS cache statistics | Public |
| `DELETE` | `/api/voice/cache` | Clear TTS cache | Public |

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** v18+
- **MongoDB** (local or Atlas)
- **FFmpeg** installed and in PATH
- **Groq API Key** ([console.groq.com](https://console.groq.com))
- **Cloudinary Account** ([cloudinary.com](https://cloudinary.com))

### 1. Clone & Install

```bash
git clone https://github.com/your-org/feedspace.git
cd feedspace
```

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

**Backend** — Create `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/feedspace
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Groq AI (FREE tier available)
GROQ_API_KEY=gsk_your_groq_api_key
GROQ_AI_MODEL=llama-3.3-70b-versatile
GROQ_HIGHLIGHT_MODEL=llama-3.3-70b-versatile

# Cloudinary
>>>>>>> 8c4d8d7 (Add README)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

FFMPEG_PATH=C:\ffmpeg\bin\ffmpeg.exe

JWT_SECRET=your_secret_key_here
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

GROQ_API_KEY=your_groq_api_key
```

### Step 3: Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local` file in `frontend/` directory:

=======
# FFmpeg
FFMPEG_PATH=C:\ffmpeg\bin\ffmpeg.exe
```

**Frontend** — Create `frontend/.env`:
>>>>>>> 8c4d8d7 (Add README)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## ⚙️ Configuration

### Cloudinary Setup

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get your Cloud Name, API Key, and API Secret
3. Add to backend `.env` file

### FFmpeg Installation

**Windows:**
```bash
# Download from https://ffmpeg.org/download.html
# Extract and add to PATH
# Update FFMPEG_PATH in .env
```

**Mac:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt install ffmpeg
```

### MongoDB Setup

**Option 1: MongoDB Atlas (Cloud)**
1. Create account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create cluster
3. Get connection string
4. Add to `MONGO_URI` in `.env`

**Option 2: Local MongoDB**
```bash
# Install MongoDB locally
# Connection string: mongodb://localhost:27017/testimonials
```

---

## 🎯 Usage

### Start Development Servers

**Backend:**
```bash
cd backend
node src/server.js
# Server runs on http://localhost:5000
```

**Frontend:**
```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
```

### Access Application

1. **Homepage**: `http://localhost:3000`
2. **Sign Up**: `http://localhost:3000/signup`
3. **Login**: `http://localhost:3000/login`
4. **Dashboard**: `http://localhost:3000/dashboard`
5. **Testimonials**: `http://localhost:3000/dashboard/testimonials` ⭐ NEW

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
=======
### 3. Run Development Servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev       # Starts on port 5000

# Terminal 2 — Frontend
cd frontend
npm run dev       # Starts on port 3000
```

### 4. Open in Browser

```
http://localhost:3000
>>>>>>> 8c4d8d7 (Add README)
```

---

### Campaign/Project Endpoints

#### Get All Campaigns
```http
GET /projects
Authorization: Bearer <token>
```

#### Create Campaign
```http
POST /projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Product Launch Campaign",
  "description": "Collect testimonials for new product"
}
```

#### Get Public Campaign (For Recording Page)
```http
GET /projects/public/:id
```

---

### Testimonial Endpoints ⭐ NEW

#### Get Testimonials by Campaign
```http
GET /testimonials/campaign/:campaignId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "campaignId": "507f1f77bcf86cd799439012",
      "videoUrl": "https://res.cloudinary.com/...",
      "userName": "Rajesh Kumar",
      "sentiment": "positive",
      "status": "published",
      "createdAt": "2026-02-15T10:30:00.000Z"
    }
  ]
}
```

#### Get All Testimonials for Project
```http
GET /projects/:projectId/testimonials
Authorization: Bearer <token>
```

#### Update Testimonial
```http
PUT /testimonials/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "published",
  "sentiment": "positive"
}
```

---

### Video Upload Endpoints

#### Upload Raw Video
```http
POST /video/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "sessionId": "507f1f77bcf86cd799439011",
  "video": <file>,
  "userName": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "cloudinaryUrl": "https://res.cloudinary.com/...",
    "duration": 45.2
  },
  "message": "Video uploaded successfully! Ready for processing."
}
```

---

### Interview Session Endpoints

#### Start Interview Session
```http
POST /session/start
Content-Type: application/json

{
  "projectId": "507f1f77bcf86cd799439012"
}
```

#### Next Conversation Turn
```http
POST /conversation/next
Content-Type: multipart/form-data

{
  "sessionId": "507f1f77bcf86cd799439011",
  "audio": <file>
}
```

---

## 🎨 Testimonials System

### How It Works

1. **User Records Video** → Video recording page (`/record/:campaignId`)
2. **Video Uploads to Cloudinary** → `POST /video/upload`
3. **Testimonial Created Automatically** → Backend creates entry in DB
4. **Appears in Dashboard** → `/dashboard/testimonials`

### Testimonial Schema

```javascript
{
  campaignId: ObjectId,        // Reference to campaign
  sessionId: ObjectId,          // Reference to interview session
  videoUrl: String,             // Cloudinary secure URL
  userName: String,             // User's name (default: "Anonymous")
  sentiment: String,            // 'positive' | 'neutral' | 'negative'
  status: String,               // 'pending' | 'processed' | 'published'
  createdAt: Date               // Timestamp
}
```

### Testimonials Page Features

✅ **Campaign Selector**: Dropdown to filter by campaign  
✅ **Grid Layout**: Responsive 3-column grid  
✅ **Video Cards**: Each card shows:
  - Video player with controls
  - User name with avatar
  - Creation date & time
  - Status badge
  - Sentiment badge with emoji

✅ **Loading States**: Spinner while fetching  
✅ **Empty State**: Message when no testimonials exist  
✅ **Error Handling**: Fallback to dummy data if API fails  

### Dummy Data for Testing

The testimonials page includes 6 sample videos for testing:
- Rajesh Kumar (positive, published)
- Priya Sharma (positive, processed)
- Amit Patel (neutral, pending)
- Sneha Reddy (positive, published)
- Vikram Singh (negative, pending)
- Ananya Desai (neutral, processed)

---

## 📸 Screenshots

### Dashboard - Testimonials Page
```
┌─────────────────────────────────────────────────────┐
│  Testimonials                                       │
│  View all collected video testimonials (6)         │
│                                                     │
│  Select Campaign: [Product Launch ▼]               │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  Video   │  │  Video   │  │  Video   │        │
│  │  Player  │  │  Player  │  │  Player  │        │
│  │          │  │          │  │          │        │
│  │ Rajesh K │  │ Priya S  │  │ Amit P   │        │
│  │ 😊 Pos   │  │ 😊 Pos   │  │ 😐 Neut  │        │
│  │ Published│  │ Processed│  │ Pending  │        │
│  └──────────┘  └──────────┘  └──────────┘        │
└─────────────────────────────────────────────────────┘
```

---

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- CORS configuration
- Helmet.js security headers
- Input validation
- File upload restrictions

---

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB connection string
- Verify all environment variables are set
- Ensure port 5000 is not in use

### Frontend won't start
- Clear `.next` folder: `rm -rf .next`
- Check API URL in `.env.local`
- Ensure backend is running first

### Videos not uploading
- Verify Cloudinary credentials
- Check file size limits (default: 100MB)
- Ensure FFmpeg is installed correctly

### Testimonials not appearing
- Check if campaign ID is correct
- Verify JWT token is valid
- Check browser console for errors
- Try using dummy data mode

---

## 🚧 Roadmap

- [ ] Email notifications for new testimonials
- [ ] Advanced video editing features
- [ ] Social media sharing
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] White-label solution
- [ ] Embeddable testimonial widgets

=======
## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 16, React 19 | App framework & UI |
| **Styling** | Tailwind CSS 4, PostCSS | Responsive dark-mode UI |
| **Backend** | Express 5, Node.js | REST API server |
| **Database** | MongoDB + Mongoose 9 | Data persistence |
| **AI / NLP** | Groq SDK + Llama 3.3 70B | Question generation, sentiment, follow-ups |
| **Speech** | edge-tts (Microsoft) | Free unlimited text-to-speech |
| **Transcription** | Groq Whisper Large V3 | Audio-to-text with timestamps |
| **Video** | fluent-ffmpeg | Trim, subtitle, concat, reel generation |
| **Storage** | Cloudinary | Video/audio cloud hosting |
| **Auth** | JWT + bcrypt | Secure authentication |
| **Email** | Nodemailer | Campaign invitation emails |
| **Security** | Helmet, CORS | HTTP security headers |

---

## 🧠 AI Models Used

| Model | Provider | Use Case |
|-------|----------|----------|
| **Llama 3.3 70B Versatile** | Groq | Campaign questions, follow-ups, sentiment, closing statements |
| **Whisper Large V3** | Groq | Audio transcription with word-level timestamps |
| **Microsoft Edge TTS** | Microsoft (free) | Neural text-to-speech in 7 languages, 14+ voices |

---

## 🎨 UI Preview

The frontend features a **premium dark glassmorphic design** with:

- 🌈 Gradient background blobs with animated pulses
- 💎 Glassmorphic cards with backdrop blur
- 🎨 Blue → Purple → Pink gradient CTAs
- ✨ Hover micro-animations and scale transforms
- 📱 Fully responsive with mobile sidebar drawer
- 🔤 Inter font (Google Fonts) for clean typography

---

## 📂 Database Schema

```mermaid
erDiagram
    User ||--o{ Project : owns
    Project ||--o{ InterviewSession : has
    InterviewSession ||--o{ ConversationTurn : contains
    InterviewSession ||--o| VideoAsset : "raw video"
    InterviewSession ||--o{ ClipAsset : "highlight clips"
    InterviewSession ||--o| ReelAsset : "final reel"
    CampaignQuestionSet ||--o{ InterviewSession : drives
    UserPrompt ||--o{ InterviewSession : seeds

    User {
        string name
        string email
        string password
        string companyName
    }

    Project {
        ObjectId userId
        string name
        string description
        string status
        object theme
    }

    InterviewSession {
        ObjectId promptId
        ObjectId questionSetId
        ObjectId projectId
        number questionIndex
        string status
        string transcript
        array transcriptSegments
    }

    ConversationTurn {
        ObjectId sessionId
        string role
        string content
        string audioUrl
    }

    CampaignQuestionSet {
        string companyName
        string productName
        string feedbackType
        string campaignName
        array questions
    }

    VideoAsset {
        ObjectId sessionId
        string cloudinaryUrl
        number duration
    }

    ClipAsset {
        ObjectId sessionId
        string quote
        number startTime
        number endTime
        string cloudinaryUrl
    }

    ReelAsset {
        ObjectId sessionId
        string cloudinaryUrl
        array highlights
        number duration
    }
```

>>>>>>> 8c4d8d7 (Add README)
---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the ISC License.

---

## 📧 Contact

For questions or support, please contact:
- **Email**: support@hackbits.com
- **GitHub**: [Your GitHub Profile]

---

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Cloudinary for media storage
- Groq for fast transcription
- Next.js team for amazing framework
- MongoDB for database solution

---

**Built with ❤️ for HackBits 2026**

---

## 📝 Recent Updates

### v1.1.0 (February 15, 2026) - Testimonials System ⭐
- ✅ Added new Testimonial model
- ✅ Automatic testimonial creation on video upload
- ✅ Beautiful testimonials dashboard page
- ✅ Campaign-based filtering
- ✅ Dummy data support for testing
- ✅ Fixed API routes and controller methods
- ✅ Enhanced error handling

### v1.0.0 (Initial Release)
- 🎯 Core video recording functionality
- 🤖 AI-powered interview system
- 📹 Cloudinary video storage
- 🔐 JWT authentication
- 📊 Campaign management
