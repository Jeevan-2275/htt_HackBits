const OpenAI = require('openai');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const transcribeAudio = async (filePath) => {
    try {
        const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream(filePath),
            model: "whisper-1",
        });

        return transcription.text;
    } catch (error) {
        console.error('Whisper Transcription Error:', error);
        throw error;
    }
};

module.exports = { transcribeAudio };
