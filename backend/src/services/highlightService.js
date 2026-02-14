const Groq = require('groq-sdk');
const dotenv = require('dotenv');

dotenv.config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const HIGHLIGHT_MODEL = process.env.GROQ_HIGHLIGHT_MODEL || 'llama-3.3-70b-versatile';

const extractHighlights = async (transcriptText, segments) => {
    try {
        const prompt = {
            transcript: transcriptText,
            segments: segments.map(seg => ({
                start: seg.start,
                end: seg.end,
                text: seg.text
            }))
        };

        const completion = await groq.chat.completions.create({
            model: HIGHLIGHT_MODEL,
            response_format: { type: 'json_object' },
            messages: [
                {
                    role: 'system',
                    content: [
                        'You are a testimonial video editor AI.',
                        'Extract the most powerful, emotionally compelling highlights from this testimonial.',
                        'IMPORTANT: Select highlights so their TOTAL duration adds up to approximately 25-35 seconds (target: 30 seconds).',
                        'Pick 2 to 4 highlights. Each highlight can be 6-15 seconds long.',
                        'Prefer segments that: show genuine emotion, mention specific results/numbers, express strong recommendations, or describe transformation.',
                        'Return JSON with key "highlights":',
                        '[{ "quote": string, "start": number, "end": number }].',
                        'Use segment timestamps to set start and end in seconds.',
                        'Quotes must be verbatim from the transcript.',
                        'Order highlights for best storytelling flow (context first, impact last).'
                    ].join(' ')
                },
                {
                    role: 'user',
                    content: JSON.stringify(prompt)
                }
            ]
        });

        const raw = completion.choices[0].message.content;
        const parsed = JSON.parse(raw);

        return Array.isArray(parsed.highlights) ? parsed.highlights : [];
    } catch (error) {
        console.error('Highlight Extraction Error:', error);
        throw error;
    }
};

module.exports = { extractHighlights };
