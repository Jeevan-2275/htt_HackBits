const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Enhanced Text-to-Speech Service using edge-tts
 * Features: 
 * - FREE & UNLIMITED (uses Microsoft Edge TTS)
 * - Audio caching to prevent regenerating same text
 * - Retry logic for reliability
 * - Multiple voice options
 * - Batch processing support
 */

const CACHE_DIR = path.join(process.cwd(), 'uploads/tts_cache');
const SUPPORTED_VOICES = {
    'en-US': ['en-US-AnaNeural', 'en-US-AriaNeural', 'en-US-GuyNeural', 'en-US-JennyNeural'],
    'en-GB': ['en-GB-AmyNeural', 'en-GB-RyanNeural', 'en-GB-SoniaNeural'],
    'en-IN': ['en-IN-NeerjaNeural', 'en-IN-PrabhatNeural'],
    'es-ES': ['es-ES-AlvaroNeural', 'es-ES-ElviraNeural'],
    'fr-FR': ['fr-FR-DeniseNeural', 'fr-FR-HenriNeural'],
    'de-DE': ['de-DE-AmalaNeural', 'de-DE-ConradNeural'],
};

// Initialize cache directory
const initCacheDir = () => {
    if (!fs.existsSync(CACHE_DIR)) {
        fs.mkdirSync(CACHE_DIR, { recursive: true });
        console.log('✓ TTS cache directory initialized');
    }
};

// Generate hash for text (for caching)
const generateTextHash = (text, voice) => {
    return crypto
        .createHash('sha256')
        .update(`${text}-${voice}`)
        .digest('hex');
};

// Get cached audio if exists
const getCachedAudio = (text, voice) => {
    initCacheDir();
    const hash = generateTextHash(text, voice);
    const cachedPath = path.join(CACHE_DIR, `${hash}.mp3`);
    
    if (fs.existsSync(cachedPath)) {
        console.log(`✓ Using cached TTS for: "${text.substring(0, 30)}..."`);
        return cachedPath;
    }
    return null;
};

// Save audio to cache
const saveToCacheAndTemp = (audioPath, text, voice) => {
    initCacheDir();
    const hash = generateTextHash(text, voice);
    const cachedPath = path.join(CACHE_DIR, `${hash}.mp3`);
    
    // Copy to cache
    fs.copyFileSync(audioPath, cachedPath);
    console.log(`✓ Cached TTS audio for: "${text.substring(0, 30)}..."`);
    
    return cachedPath;
};

// Validate voice option
const validateVoice = (voice) => {
    for (const [lang, voices] of Object.entries(SUPPORTED_VOICES)) {
        if (voices.includes(voice)) {
            return voice;
        }
    }
    // Return default if not found
    return 'en-US-AnaNeural';
};

// Retry logic for failed TTS generations
const generateSpeechWithRetry = async (text, filePath, voice, maxRetries = 3) => {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`[TTS] Attempt ${attempt}/${maxRetries}: "${text.substring(0, 40)}..."`);
            
            // Import edge-tts with proper configuration
            const { ttsSave } = await import('edge-tts/out/index.js');
            
            // Use proper options for edge-tts
            const options = {
                voice: voice,
                rate: 1.0,
                pitch: 0
            };
            
            console.log(`[TTS] Calling ttsSave with voice: ${voice}`);
            await ttsSave(text, filePath, options);
            
            if (fs.existsSync(filePath) && fs.statSync(filePath).size > 0) {
                console.log(`[TTS] ✓ Success on attempt ${attempt}`);
                return filePath;
            } else {
                throw new Error('Generated file is empty or does not exist');
            }
        } catch (error) {
            lastError = error;
            console.warn(`[TTS] ⚠️ Attempt ${attempt} failed:`, error.message);
            
            if (attempt < maxRetries) {
                // Wait before retry (exponential backoff)
                const waitTime = 1000 * attempt * 2;
                console.log(`[TTS] Waiting ${waitTime}ms before retry...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }
        }
    }
    
    throw new Error(`TTS generation failed after ${maxRetries} attempts: ${lastError?.message}`);
};

// Main function: Generate speech from text
const generateSpeech = async (text, voiceOption = null) => {
    try {
        console.log('[TTS] 1️⃣ generateSpeech called with text:', text.substring(0, 40));
        
        if (!text || !String(text).trim()) {
            throw new Error('Text is required for TTS generation');
        }

        const trimmedText = String(text).trim();
        console.log('[TTS] 2️⃣ Text trimmed');
        
        // Use provided voice or environment variable or default
        const voice = validateVoice(
            voiceOption || process.env.TTS_VOICE || 'en-US-AnaNeural'
        );
        console.log('[TTS] 3️⃣ Voice selected:', voice);

        // Check cache first
        const cachedPath = getCachedAudio(trimmedText, voice);
        if (cachedPath) {
            console.log('[TTS] 4️⃣ Returning cached audio');
            return cachedPath;
        }
        console.log('[TTS] 4️⃣ Not in cache, generating...');

        // Create temp upload directory
        const uploadDir = path.join(process.cwd(), 'uploads');
        console.log('[TTS] 5️⃣ Upload dir:', uploadDir);
        
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
            console.log('[TTS] 5️⃣ Created upload directory');
        }

        // Generate unique filename
        const fileName = `speech-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.mp3`;
        const filePath = path.join(uploadDir, fileName);
        console.log('[TTS] 6️⃣ File path:', filePath);

        // Generate speech with retry logic
        console.log('[TTS] 7️⃣ Calling generateSpeechWithRetry...');
        await generateSpeechWithRetry(trimmedText, filePath, voice);
        console.log('[TTS] 8️⃣ generateSpeechWithRetry completed');

        // Verify file exists and has size
        if (!fs.existsSync(filePath)) {
            throw new Error(`Generated file not found at ${filePath}`);
        }
        const fileSize = fs.statSync(filePath).size;
        console.log('[TTS] 9️⃣ File created, size:', fileSize, 'bytes');

        // Save to cache
        saveToCacheAndTemp(filePath, trimmedText, voice);
        console.log('[TTS] 🔟 Returned file path');

        return filePath;
    } catch (error) {
        console.error('[TTS] ❌ TTS Error:', error.message);
        console.error('[TTS] Error stack:', error.stack);
        throw new Error(`Text-to-Speech generation failed: ${error.message}`);
    }
};

// Batch generate speeches (for multiple texts)
const generateBatchSpeech = async (textArray, voiceOption = null) => {
    try {
        if (!Array.isArray(textArray) || textArray.length === 0) {
            throw new Error('Text array is required for batch generation');
        }

        console.log(`\n🔄 Starting batch TTS for ${textArray.length} items...`);
        const results = [];
        const voice = validateVoice(
            voiceOption || process.env.TTS_VOICE || 'en-US-AnaNeural'
        );

        for (let i = 0; i < textArray.length; i++) {
            try {
                const text = textArray[i];
                console.log(`[${i + 1}/${textArray.length}] Processing: "${text.substring(0, 40)}..."`);
                
                const audioPath = await generateSpeech(text, voice);
                results.push({
                    success: true,
                    originalText: text,
                    audioPath: audioPath
                });
            } catch (error) {
                console.error(`Failed to generate TTS for item ${i + 1}:`, error.message);
                results.push({
                    success: false,
                    originalText: textArray[i],
                    error: error.message
                });
            }
        }

        console.log(`✓ Batch processing complete\n`);
        return results;
    } catch (error) {
        console.error('Batch TTS Error:', error.message);
        throw error;
    }
};

// Get available voices
const getAvailableVoices = () => {
    return SUPPORTED_VOICES;
};

// Get cache statistics
const getCacheStats = () => {
    initCacheDir();
    try {
        const files = fs.readdirSync(CACHE_DIR);
        const stats = {
            totalCachedAudios: files.length,
            cacheSize: 0,
            cachedItems: files
        };

        files.forEach(file => {
            const filePath = path.join(CACHE_DIR, file);
            const fileStats = fs.statSync(filePath);
            stats.cacheSize += fileStats.size;
        });

        return {
            ...stats,
            cacheSize: `${(stats.cacheSize / 1024 / 1024).toFixed(2)} MB`
        };
    } catch (error) {
        console.error('Error getting cache stats:', error.message);
        return null;
    }
};

// Clear cache (optional)
const clearCache = () => {
    try {
        if (fs.existsSync(CACHE_DIR)) {
            fs.rmSync(CACHE_DIR, { recursive: true, force: true });
            fs.mkdirSync(CACHE_DIR, { recursive: true });
            console.log('✓ TTS cache cleared');
            return { success: true, message: 'Cache cleared successfully' };
        }
    } catch (error) {
        console.error('Error clearing cache:', error.message);
        return { success: false, error: error.message };
    }
};

module.exports = {
    generateSpeech,
    generateBatchSpeech,
    getAvailableVoices,
    getCacheStats,
    clearCache,
    validateVoice
};
