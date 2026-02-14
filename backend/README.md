# AutoReel: AI Testimonial Platform Backend

An Autonomous AI Audio/Video Testimonial Collection Platform.

## 🚀 Features
- **AI Interviewer**: Adaptive questioning using GPT-4.
- **Voice Intelligence**: TTS (OpenAI) + STT (Whisper) for natural conversation.
- **Auto-Editing**: FFmpeg pipeline to crop, concatenate, and generate vertical Reels.
- **Cloud Storage**: Cloudinary integration for scalable media hosting.

## 🛠️ Stack
- Node.js & Express
- MongoDB (Mongoose)
- OpenAI (GPT-4, Whisper, TTS)
- Cloudinary
- Fluent-FFmpeg

## ⚙️ Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file from `.env.example` and fill in:
   - `MONGO_URI`
   - `OPENAI_API_KEY`
   - `CLOUDINARY_...`
   - `FFMPEG_PATH` (Path to ffmpeg executable)

3. **Run Server**
   ```bash
   npm run dev
   ```

## 🔌 API Endpoints

### 1. Generate Interview Plan
`POST /api/prompt`
- **Body**: `{ "promptText": "Collect testimonials for my coffee shop" }`
- **Response**: `{ success: true, data: { interviewGoal, intentMap } }`

### 2. Start Session
`POST /api/session/start`
- **Body**: `{ "promptId": "..." }`
- **Response**: `{ sessionId, question: { text, audio } }`

### 3. Next Turn (Speak)
`POST /api/conversation/next`
- **Form-Data**: 
    - `audio`: (File, mp3/wav/webm/mp4)
    - `sessionId`: (String)
- **Response**: `{ transcript, reply: { text, audio } }`

### 4. Create Reel
`POST /api/process/reel`
- **Body**: `{ "sessionId": "..." }`
- **Response**: `{ message: "Reel processing started" }` (Async)

## 🏗️ Folder Structure
- `src/controllers`: Request handlers
- `src/models`: Database schemas
- `src/services`: Business logic (AI, FFmpeg)
- `src/routes`: API definition

## 🧪 Demo Data (Seeding)
To reset/seed the database:
(Coming soon)
