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
                        'You extract 3 to 5 powerful testimonial highlights.',
                        'Return JSON with key "highlights":',
                        '[{ "quote": string, "start": number, "end": number }].',
                        'Use segment timestamps to set start and end in seconds.',
                        'Quotes must be verbatim from the transcript.',
                        'Keep each quote concise (under 20 seconds of speech).'
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
