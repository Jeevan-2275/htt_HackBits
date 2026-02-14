const fs = require('fs');
const { uploadToCloudinary } = require('../config/cloudinary');
const aiService = require('../services/aiService');
const transcriptionService = require('../services/transcriptionService');

// @desc    Text to Speech
// @route   POST /api/voice/tts
// @access  Public
exports.textToSpeech = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || !String(text).trim()) {
            return res.status(400).json({ success: false, error: 'Text is required' });
        }

        const audioPath = await aiService.generateSpeech(String(text).trim());
        const uploadResult = await uploadToCloudinary(audioPath, 'htt_hackbits/tts_audio');

        fs.unlinkSync(audioPath);

        res.status(200).json({
            success: true,
            audioUrl: uploadResult.secure_url
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
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
