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
