const OpenAI = require('openai');
const dotenv = require('dotenv');

dotenv.config();

let openai;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-')) {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });
} else {
    console.warn('⚠️  OPENAI_API_KEY not configured. AI features will use mock data.');
    openai = null;
}

// Generate Interview Goal & Intent Map
const analyzePrompt = async (userPromptText) => {
    try {
        if (!openai) {
            console.log('⚠️ Using Mock Data for Analyze Prompt (API key not configured)');
            return {
                goal: "Analyze the user's background and experience",
                intentMap: ["Introduction", "Experience", "Challenges", "Future Goals"]
            };
        }
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are an expert interviewer. Analyze the user's request and outline an interview strategy. Return JSON with 'goal' (string) and 'intentMap' (array of 3-5 sub-topics/questions)." },
                { role: "user", content: `User Prompt: ${userPromptText}` }
            ],
            model: "gpt-4-1106-preview", // or gpt-3.5-turbo-1106
            response_format: { type: "json_object" }
        });

        return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
        console.error('AI Analysis Error:', error.message);
        if (error.code === 'invalid_api_key' || error.status === 401) {
            console.log('⚠️ Using Mock Data for Analyze Prompt');
            return {
                goal: "Analyze the user's background and experience",
                intentMap: ["Introduction", "Experience", "Challenges", "Future Goals"]
            };
        }
        throw error;
    }
};

// Generate Next Question
const generateNextQuestion = async (history, intentMap, currentGoal) => {
    try {
        if (!openai) {
            console.log('⚠️ Using Mock Data for Next Question (API key not configured)');
            return "That's interesting! Can you tell me more about that?";
        }
        const messages = [
            { role: "system", content: `You are a friendly assistant collecting user feedback in a casual, warm conversation. Goal: ${currentGoal}. Topics to naturally cover: ${intentMap.join(', ')}. Be enthusiastic and conversational like chatting with a friend. Ask follow-up questions based on what the user just said. React positively to their answers ("That's awesome!", "Love that!", "Great to hear!"). Keep questions short and natural. Do not repeat questions or sound robotic.` },
            ...history.map(turn => ({ role: turn.role === 'ai' ? 'assistant' : 'user', content: turn.content })),
        ];

        const completion = await openai.chat.completions.create({
            messages: messages,
            model: "gpt-4",
            max_tokens: 100
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error('AI Question Gen Error:', error.message);
        if (error.code === 'invalid_api_key' || error.status === 401) {
            console.log('⚠️ Using Mock Data for Next Question');
            return "That's interesting! Can you tell me more about that?";
        }
        throw error;
    }
};

const fs = require('fs');
const path = require('path');

// Generate Speech (TTS)
const generateSpeech = async (text) => {
    try {
        if (!openai) {
            console.log('⚠️ Using Mock Data for TTS (API key not configured)');
            // Create a dummy file
            const uploadDir = 'uploads/';
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir);
            }
            const fileName = `mock-speech-${Date.now()}.mp3`;
            const filePath = path.join(uploadDir, fileName);
            await fs.promises.writeFile(filePath, 'MOCK AUDIO CONTENT');
            return filePath;
        }
        const mp3 = await openai.audio.speech.create({
            model: "tts-1",
            voice: "nova",
            input: text,
        });
        const buffer = Buffer.from(await mp3.arrayBuffer());
        const fileName = `speech-${Date.now()}.mp3`;
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        const filePath = path.join(uploadDir, fileName);
        await fs.promises.writeFile(filePath, buffer);
        return filePath;
    } catch (error) {
        console.error('TTS Error:', error.message);
        if (error.code === 'invalid_api_key' || error.status === 401) {
            console.log('⚠️ Using Mock Data for TTS');
            // Create a dummy file
            const uploadDir = 'uploads/';
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir);
            }
            const fileName = `mock-speech-${Date.now()}.mp3`;
            const filePath = path.join(uploadDir, fileName);
            await fs.promises.writeFile(filePath, 'MOCK AUDIO CONTENT');
            return filePath;
        }
        throw error;
    }
};

module.exports = { analyzePrompt, generateNextQuestion, generateSpeech };
