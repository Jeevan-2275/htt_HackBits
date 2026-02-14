const Groq = require('groq-sdk');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const transcribeAudio = async (filePath) => {
    try {
        const transcription = await groq.audio.transcriptions.create({
            file: fs.createReadStream(filePath),
            model: 'whisper-large-v3',
            language: 'en'
        });

        return transcription.text;
    } catch (error) {
        console.error('Groq Whisper Transcription Error:', error);
        throw error;
    }
};

const transcribeAudioWithTimestamps = async (filePath) => {
    try {
        const transcription = await groq.audio.transcriptions.create({
            file: fs.createReadStream(filePath),
            model: 'whisper-large-v3',
            language: 'en',
            response_format: 'verbose_json'
        });

        return {
            text: transcription.text || '',
            segments: Array.isArray(transcription.segments)
                ? transcription.segments.map(seg => ({
                    start: seg.start,
                    end: seg.end,
                    text: seg.text
                }))
                : []
        };
    } catch (error) {
        console.error('Groq Whisper Transcription Error:', error);
        throw error;
    }
};

module.exports = { transcribeAudio, transcribeAudioWithTimestamps };
