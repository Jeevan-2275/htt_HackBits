const fs = require('fs');
const { uploadToCloudinary } = require('../config/cloudinary');
const aiService = require('../services/aiService');
const ttsService = require('../services/ttsService');
const transcriptionService = require('../services/transcriptionService');

// @desc    Text to Speech
// @route   POST /api/voice/tts
// @access  Public
exports.textToSpeech = async (req, res) => {
    try {
        const { text, voice } = req.body;
        console.log('[API] 🎙️ TTS request received');
        console.log('[API] Text:', text?.substring(0, 50));
        console.log('[API] Voice:', voice);

        if (!text || !String(text).trim()) {
            console.log('[API] ❌ Text is empty');
            return res.status(400).json({ success: false, error: 'Text is required' });
        }

        console.log('[API] 🔄 Calling generateSpeech...');
        const audioPath = await ttsService.generateSpeech(String(text).trim(), voice);
        console.log('[API] ✓ Audio generated at:', audioPath);

        console.log('[API] 📤 Uploading to Cloudinary...');
        const uploadResult = await uploadToCloudinary(audioPath, 'htt_hackbits/tts_audio');
        console.log('[API] ✓ Uploaded to:', uploadResult.secure_url);

        // Keep file in cache but remove temp copy
        if (fs.existsSync(audioPath) && !audioPath.includes('tts_cache')) {
            fs.unlinkSync(audioPath);
            console.log('[API] 🗑️ Cleaned up temp file');
        }

        console.log('[API] ✅ TTS Success');
        res.status(200).json({
            success: true,
            audioUrl: uploadResult.secure_url,
            message: 'Text-to-Speech generated successfully (unlimited & free)'
        });
    } catch (error) {
        console.error('[API] ❌ TTS Error:', error);
        console.error('[API] Error message:', error.message);
        console.error('[API] Error stack:', error.stack);
        res.status(500).json({ success: false, error: error.message || 'Server Error' });
    }
};

// @desc    Get Available TTS Voices
// @route   GET /api/voice/voices
// @access  Public
exports.getAvailableVoices = async (req, res) => {
    try {
        const voices = ttsService.getAvailableVoices();
        res.status(200).json({
            success: true,
            voices: voices,
            message: 'Available voices across multiple languages'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to fetch voices' });
    }
};

// @desc    Get TTS Cache Statistics
// @route   GET /api/voice/cache-stats
// @access  Public
exports.getCacheStats = async (req, res) => {
    try {
        const stats = ttsService.getCacheStats();
        res.status(200).json({
            success: true,
            cacheStats: stats,
            message: 'Cache statistics retrieved successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to get cache stats' });
    }
};

// @desc    Clear TTS Cache
// @route   DELETE /api/voice/cache
// @access  Public
exports.clearCache = async (req, res) => {
    try {
        const result = ttsService.clearCache();
        res.status(200).json({
            success: result.success,
            message: result.message || result.error
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to clear cache' });
    }
};

// @desc    Batch Text to Speech (Multiple texts)
// @route   POST /api/voice/tts-batch
// @access  Public
exports.batchTextToSpeech = async (req, res) => {
    try {
        const { texts, voice } = req.body;

        if (!Array.isArray(texts) || texts.length === 0) {
            return res.status(400).json({ success: false, error: 'Text array is required' });
        }

        const results = await ttsService.generateBatchSpeech(texts, voice);
        
        // Upload all generated audio to Cloudinary
        const uploadedResults = await Promise.all(
            results.map(async (result) => {
                if (result.success) {
                    try {
                        const uploadResult = await uploadToCloudinary(result.audioPath, 'htt_hackbits/tts_audio');
                        
                        // Clean up temp file if not cached
                        if (fs.existsSync(result.audioPath) && !result.audioPath.includes('tts_cache')) {
                            fs.unlinkSync(result.audioPath);
                        }
                        
                        return {
                            success: true,
                            originalText: result.originalText,
                            audioUrl: uploadResult.secure_url
                        };
                    } catch (uploadError) {
                        return {
                            success: false,
                            originalText: result.originalText,
                            error: 'Upload failed: ' + uploadError.message
                        };
                    }
                }
                return result;
            })
        );

        const successCount = uploadedResults.filter(r => r.success).length;
        
        res.status(200).json({
            success: true,
            results: uploadedResults,
            summary: {
                total: uploadedResults.length,
                successful: successCount,
                failed: uploadedResults.length - successCount
            },
            message: `Generated ${successCount}/${uploadedResults.length} audio files (unlimited & free)`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message || 'Batch TTS failed' });
    }
};

// @desc    Speech to Text
// @route   POST /api/voice/stt
// @access  Public
exports.speechToText = async (req, res) => {
    try {
        const withTimestamps = String(req.body.withTimestamps || '').toLowerCase() === 'true';

        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No audio file uploaded' });
        }

        const audioUpload = await uploadToCloudinary(req.file.path, 'htt_hackbits/user_audio');

        const transcription = withTimestamps
            ? await transcriptionService.transcribeAudioWithTimestamps(req.file.path)
            : { text: await transcriptionService.transcribeAudio(req.file.path) };

        fs.unlinkSync(req.file.path);

        res.status(200).json({
            success: true,
            audioUrl: audioUpload.secure_url,
            transcript: transcription.text,
            segments: transcription.segments || []
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
