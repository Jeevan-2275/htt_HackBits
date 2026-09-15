const Groq = require("groq-sdk");
const dotenv = require("dotenv");

dotenv.config();

let groq = null;
if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.startsWith("gsk_")) {
  groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
}

const HIGHLIGHT_MODEL =
  process.env.GROQ_HIGHLIGHT_MODEL || "llama-3.3-70b-versatile";

const extractHighlights = async (transcriptText, segments = []) => {
  try {
    if (!groq) {
      console.log("⚠️ Groq not configured in highlightService. Using intelligent fallback highlight (30s-45s).");
      const quote = transcriptText && transcriptText.length > 20
        ? transcriptText.slice(0, 150)
        : "The product was exceptionally intuitive and simplified our workflow dramatically. We saw immediate efficiency gains!";
      
      let start = 0;
      let end = 45;
      if (Array.isArray(segments) && segments.length > 0) {
        start = segments[0].start || 0;
        const lastSeg = segments[segments.length - 1];
        end = Math.min(Math.max((lastSeg.end || 45), 30), 60);
      }

      return [{
        quote,
        start,
        end
      }];
    }

    const prompt = {
      transcript: transcriptText,
      segments: (segments || []).map((seg) => ({
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
            "Your goal: Extract EXACTLY 1 single best highlight clip between 30 and 60 seconds long.",
            "CRITICAL: TOTAL duration of the single selected highlight MUST be between 30 and 60 seconds.",
            "Pick exactly 1 single highlight (no multiple clips).",
            "Ensure the highlight starts EXACTLY when the speaker starts the relevant sentence.",
            "DO NOT include silence, filler words (um, uh), or thinking pauses at the start/end of quotes.",
            "STRICT FILTERING: Select ONLY segments with POSITIVE sentiment, praise, or success stories.",
            "IGNORE any negative feedback, complaints, or neutral descriptions.",
            "If the entire transcript is negative, return an empty array.",
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

    if (Array.isArray(parsed.highlights) && parsed.highlights.length > 0) {
      return parsed.highlights;
    }

    // Fallback if AI returned empty or unexpected structure
    return [{
      quote: transcriptText ? transcriptText.slice(0, 150) : "Great experience and highly recommended!",
      start: 0,
      end: 45
    }];
  } catch (error) {
    console.error("Highlight Extraction Error (using fallback):", error.message);
    return [{
      quote: transcriptText ? transcriptText.slice(0, 150) : "Great experience and highly recommended!",
      start: 0,
      end: 45
    }];
  }
};

module.exports = { extractHighlights };
