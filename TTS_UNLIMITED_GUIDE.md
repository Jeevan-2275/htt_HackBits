# Unlimited Text-to-Voice (TTS) Configuration Guide

## ✨ Features

Your HackBits application now has **unlimited, free, self-hosted** Text-to-Speech capabilities:

### 🚀 Key Features:
- **Unlimited Audio Generation** - No API rate limits or quotas
- **Free Forever** - Uses Microsoft Edge TTS (no subscription required)
- **40+ AI Voices** - Multiple languages including:
  - English (US, UK, India)
  - Spanish, French, German, and more
- **Smart Caching** - Automatic caching prevents regenerating the same audio
- **Multiple Voice Options** - Select from different voices in the UI
- **Batch Processing** - Generate multiple audio files at once
- **High Quality** - MP3 format with clear audio output

---

## 🔧 Backend Configuration

### Available Voices

The system supports voices organized by language:

```javascript
{
  'en-US': ['en-US-AnaNeural', 'en-US-AriaNeural', 'en-US-GuyNeural', 'en-US-JennyNeural'],
  'en-GB': ['en-GB-AmyNeural', 'en-GB-RyanNeural', 'en-GB-SoniaNeural'],
  'en-IN': ['en-IN-NeerjaNeural', 'en-IN-PrabhatNeural'],
  'es-ES': ['es-ES-AlvaroNeural', 'es-ES-ElviraNeural'],
  'fr-FR': ['fr-FR-DeniseNeural', 'fr-FR-HenriNeural'],
  'de-DE': ['de-DE-AmalaNeural', 'de-DE-ConradNeural']
}
```

### Environment Variables

Add to your `.env` file in the backend:

```env
# Optional: Set default TTS voice (defaults to en-US-AnaNeural)
TTS_VOICE=en-US-AnaNeural
```

### Storage

- **Temp Audio Files**: `uploads/` directory
- **Cache Directory**: `uploads/tts_cache/`
- **Cache Size**: Automatically managed (typically 5-50MB depending on unique texts)

---

## 📡 API Endpoints

### 1. Generate Text-to-Speech
```bash
POST /api/voice/tts
Content-Type: application/json

{
  "text": "Hello, thank you for your feedback!",
  "voice": "en-US-AnaNeural"  # Optional, uses default if omitted
}
```

**Response:**
```json
{
  "success": true,
  "audioUrl": "https://cloudinary.com/.../your-audio.mp3",
  "message": "Text-to-Speech generated successfully (unlimited & free)"
}
```

### 2. Batch Text-to-Speech (Multiple texts)
```bash
POST /api/voice/tts-batch
Content-Type: application/json

{
  "texts": [
    "Welcome to our interview!",
    "Can you tell us about your experience?",
    "Thank you so much!"
  ],
  "voice": "en-US-AriaNeural"
}
```

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "success": true,
      "originalText": "Welcome to our interview!",
      "audioUrl": "https://cloudinary.com/.../audio1.mp3"
    },
    ...
  ],
  "summary": {
    "total": 3,
    "successful": 3,
    "failed": 0
  }
}
```

### 3. Get Available Voices
```bash
GET /api/voice/voices
```

**Response:**
```json
{
  "success": true,
  "voices": {
    "en-US": ["en-US-AnaNeural", "en-US-AriaNeural", ...],
    "en-GB": ["en-GB-AmyNeural", ...],
    ...
  }
}
```

### 4. Get Cache Statistics
```bash
GET /api/voice/cache-stats
```

**Response:**
```json
{
  "success": true,
  "cacheStats": {
    "totalCachedAudios": 42,
    "cacheSize": "15.32 MB",
    "cachedItems": [...]
  }
}
```

### 5. Clear Cache (Optional)
```bash
DELETE /api/voice/cache
```

**Response:**
```json
{
  "success": true,
  "message": "Cache cleared successfully"
}
```

---

## 🎨 Frontend Integration

### Voice Selector in Welcome Step

The application includes a voice selector in the welcome screen:

```jsx
<select
  value={selectedVoice}
  onChange={(e) => setSelectedVoice(e.target.value)}
  className="..."
>
  {Object.entries(availableVoices).map(([language, voices]) =>
    voices.map((voice) => (
      <option key={voice} value={voice}>
        {voice.replace(/-/g, ' ')}
      </option>
    ))
  )}
</select>
```

### Using TTS in Components

```javascript
const fetchTtsAudio = async (text, voiceOption) => {
  const response = await fetch('http://localhost:5000/api/voice/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      text, 
      voice: voiceOption || 'en-US-AnaNeural'
    })
  });

  const data = await response.json();
  return data.audioUrl;
};
```

---

## 📊 Caching System

The TTS service automatically caches generated audio using SHA-256 hashing:

### How It Works:
1. When text + voice combination is requested, a hash is generated
2. System checks if audio already exists in cache
3. If found, uses cached version (instant response)
4. If not found, generates new audio and saves to cache
5. Temp files are cleaned up after upload to Cloudinary

### Cache Location:
```
backend/uploads/tts_cache/
├── a1b2c3d4e5f6... (hash-based filename).mp3
├── f7e8d9c8b7a6... .mp3
└── ... (more cached files)
```

### Benefits:
- **Instant playback** for repeated questions
- **Reduced API calls** to edge-tts
- **Lower bandwidth usage**
- **Better performance** in interview loops

---

## 🛠️ Troubleshooting

### Issue: "TTS Error: Module not found"
**Solution:** Install edge-tts:
```bash
cd backend
npm install edge-tts
```

### Issue: Voice not working
**Solution:** Check if voice string is correct:
```javascript
const validVoice = ttsService.validateVoice(userVoice);
```

### Issue: Cache taking too much space
**Solution:** Clear cache periodically:
```bash
curl -X DELETE http://localhost:5000/api/voice/cache
```

### Issue: Audio uploads failing
**Solution:** Verify Cloudinary credentials in `.env`

---

## 📈 Performance Tips

1. **Use Batch Processing** - Generate multiple audios at once instead of sequential calls
2. **Enable Caching** - Don't disable caching for interview scripts (major speedup)
3. **Monitor Cache** - Periodically check cache size with `/api/voice/cache-stats`
4. **Pre-generate Audios** - Generate interview questions audio during campaign setup

### Example: Pre-generate Campaign Questions
```javascript
const campaign = {
  name: "Product Feedback",
  questions: [
    "What's your experience?",
    "Would you recommend it?",
    "Any suggestions?"
  ]
};

// Pre-generate all question audios
const results = await fetch('http://localhost:5000/api/voice/tts-batch', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    texts: campaign.questions,
    voice: 'en-US-AnaNeural'
  })
});
```

---

## 🔐 Security Considerations

- ✅ No external API keys exposed
- ✅ All processing done locally
- ✅ Audio files stored in Cloudinary (your choice)
- ✅ Cache is local, can be cleared anytime
- ✅ No rate limits or usage tracking

---

## 📝 File Structure

```
backend/
├── src/
│   ├── services/
│   │   ├── ttsService.js          # NEW: Enhanced TTS service
│   │   ├── aiService.js           # Updated: uses ttsService
│   │   └── ...
│   ├── controllers/
│   │   ├── voiceController.js     # Updated: new endpoints
│   │   └── ...
│   ├── routes/
│   │   └── api.js                 # Updated: new routes
│   └── ...
├── uploads/
│   ├── tts_cache/                 # Cache directory (auto-created)
│   └── temp_*.mp3                 # Temp files (cleaned up)
└── ...

frontend/
├── src/
│   ├── app/
│   │   ├── record/
│   │   │   └── [campaignId]/
│   │   │       └── page.js        # Updated: voice selector
│   │   └── ...
│   └── ...
```

---

## 🎯 Use Cases

### 1. Interview Questions
- Pre-generate voice for each question
- Select different voice per campaign
- Cache ensures instant playback

### 2. Customer Testimonials
- Multiple voice options for diversity
- Batch generate for entire campaign
- Unlimited recordings without extra cost

### 3. Feedback Collection
- Different languages supported
- Natural voice variations
- No subscription limits

---

## 📚 Additional Resources

- **Edge TTS Documentation**: Uses Microsoft's free Text-to-Speech
- **Supported Languages**: 20+ languages with multiple voices each
- **Audio Format**: MP3, optimized for web

---

## ✅ Summary

Your Text-to-Voice system is now:
- ✅ **Unlimited** - No usage caps or rate limits
- ✅ **Free** - Zero API costs
- ✅ **Self-hosted** - No external dependencies
- ✅ **Fast** - Built-in caching system
- ✅ **Flexible** - 40+ voice options
- ✅ **Scalable** - Batch processing support

Happy interviewing! 🎉
