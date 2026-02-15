const Groq = require("groq-sdk");
const dotenv = require("dotenv");

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const HIGHLIGHT_MODEL =
  process.env.GROQ_HIGHLIGHT_MODEL || "llama-3.3-70b-versatile";

const extractHighlights = async (transcriptText, segments) => {
  try {
    const prompt = {
      transcript: transcriptText,
      segments: segments.map((seg) => ({
        start: seg.start,
        end: seg.end,
        text: seg.text,
      })),
    };

    const completion = await groq.chat.completions.create({
      model: HIGHLIGHT_MODEL,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: [
            "You are a high-end testimonial video editor AI.",
            "Your goal: Extract a punchy, professional 30-second highlight reel.",
            "CRITICAL: TOTAL duration of ALL selected highlights combined MUST be between 25 and 32 seconds.",
            "Pick 1 to 3 highlights maximum. Each should be 5-20 seconds long.",
            "Ensure each highlight starts EXACTLY when the speaker starts the relevant sentence.",
            "DO NOT include silence, filler words (um, uh), or thinking pauses at the start/end of quotes.",
            'Return JSON: { "highlights": [{ "quote": string, "start": number, "end": number }] }.',
            "Prioritize the most enthusiastic and informative parts of the testimonial.",
            "Verify verbatim quotes against the transcript segments.",
          ].join(" "),
        },
        {
          role: "user",
          content: JSON.stringify(prompt),
        },
      ],
    });

    const raw = completion.choices[0].message.content;
    const parsed = JSON.parse(raw);

    return Array.isArray(parsed.highlights) ? parsed.highlights : [];
  } catch (error) {
    console.error("Highlight Extraction Error:", error);
    throw error;
  }
};

module.exports = { extractHighlights };
