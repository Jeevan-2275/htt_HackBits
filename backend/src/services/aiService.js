const Groq = require('groq-sdk');
const dotenv = require('dotenv');
const { exec } = require('child_process');

dotenv.config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const AI_MODEL = process.env.GROQ_AI_MODEL || 'llama-3.3-70b-versatile';

// Generate Interview Goal & Intent Map
const analyzePrompt = async (userPromptText) => {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are an expert interviewer. Analyze the user's request and outline an interview strategy. Return JSON with 'goal' (string) and 'intentMap' (array of 3-5 sub-topics/questions)." },
                { role: "user", content: `User Prompt: ${userPromptText}` }
            ],
            model: AI_MODEL,
            response_format: { type: "json_object" }
        });

        return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
        console.error('AI Analysis Error:', error.message);
        throw error;
    }
};

// Generate Next Question
const generateNextQuestion = async (history, intentMap, currentGoal) => {
    try {
        const messages = [
            { role: "system", content: `You are a friendly assistant collecting user feedback in a casual, warm conversation. Goal: ${currentGoal}. Topics to naturally cover: ${intentMap.join(', ')}. Be enthusiastic and conversational like chatting with a friend. Ask follow-up questions based on what the user just said. React positively to their answers ("That's awesome!", "Love that!", "Great to hear!"). Keep questions short and natural. Do not repeat questions or sound robotic.` },
            ...history.map(turn => ({ role: turn.role === 'ai' ? 'assistant' : 'user', content: turn.content })),
        ];

        const completion = await groq.chat.completions.create({
            messages: messages,
            model: AI_MODEL,
            max_tokens: 100
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error('AI Question Gen Error:', error.message);
        throw error;
    }
};

const generateCampaignQuestions = async ({
    companyName,
    productName,
    feedbackType,
    campaignName,
    productDescription,
    questionCount
}) => {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: [
                        'You create customer-facing review prompts for a testimonial recording.',
                        'Questions will be shown directly to the user (first-person prompts like "Tell us...").',
                        'Return JSON with key "questions": [string].',
                        `Generate exactly ${questionCount} questions.`,
                        'Tone: casual and friendly.',
                        'Cover: before/after pain points, product experience, support/service, and results/ROI.',
                        'Questions must be short, specific, and open-ended.',
                        'Avoid yes/no questions. Do not include numbering.'
                    ].join(' ')
                },
                {
                    role: 'user',
                    content: JSON.stringify({
                        companyName,
                        productName,
                        feedbackType,
                        campaignName,
                        productDescription
                    })
                }
            ],
            model: AI_MODEL,
            response_format: { type: 'json_object' }
        });

        return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
        console.error('AI Campaign Questions Error:', error.message);
        throw error;
    }
};

const fs = require('fs');
const path = require('path');

// Generate Speech (TTS) using edge-tts (FREE)
const generateSpeech = async (text) => {
    try {
        const fileName = `speech-${Date.now()}.mp3`;
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        const filePath = path.join(uploadDir, fileName);

        // Use edge-tts CLI to generate speech
        const voice = process.env.TTS_VOICE || 'en-US-AnaNeural';
        const escapedText = text.replace(/"/g, '\\"');

        await new Promise((resolve, reject) => {
            exec(
                `npx edge-tts --voice "${voice}" --text "${escapedText}" --write-media "${filePath}"`,
                { timeout: 30000 },
                (error, stdout, stderr) => {
                    if (error) {
                        console.error('edge-tts error:', error.message);
                        return reject(error);
                    }
                    resolve();
                }
            );
        });

        return filePath;
    } catch (error) {
        console.error('TTS Error:', error.message);
        throw error;
    }
};

module.exports = { analyzePrompt, generateNextQuestion, generateSpeech, generateCampaignQuestions };
