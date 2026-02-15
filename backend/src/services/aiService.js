const Groq = require("groq-sdk");
const dotenv = require("dotenv");
const ttsService = require("./ttsService");

dotenv.config();

// Safe Groq initialization with fallback
let groq = null;
if (process.env.GROQ_API_KEY) {
  groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
} else {
  console.warn("⚠️ GROQ_API_KEY not configured. AI features will use fallback/mock data.");
}

const AI_MODEL = process.env.GROQ_AI_MODEL || "llama-3.3-70b-versatile";

// Fallback questions for when AI is not available
const FALLBACK_QUESTIONS = [
  "What problem were you facing before using this product?",
  "How did you discover our product?",
  "What was your first impression when you started using it?",
  "Can you describe a specific way this product has helped you?",
  "What results have you seen since using our product?",
  "How would you compare this to other solutions you've tried?",
  "What would you tell someone considering this product?",
  "How has this impacted your workflow or daily life?",
  "What's one thing you wish more people knew about this product?",
  "Would you recommend this product to colleagues or friends? Why?"
];

// Generate Interview Goal & Intent Map
const analyzePrompt = async (userPromptText) => {
  try {
    if (!groq) {
      console.log("⚠️ Using fallback for analyzePrompt");
      return {
        goal: "Analyze the user's background and experience",
        intentMap: ["Introduction", "Experience", "Challenges", "Future Goals"]
      };
    }
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an expert interviewer. Analyze the user's request and outline an interview strategy. Return JSON with 'goal' (string) and 'intentMap' (array of 3-5 sub-topics/questions).",
        },
        { role: "user", content: `User Prompt: ${userPromptText}` },
      ],
      model: AI_MODEL,
      response_format: { type: "json_object" },
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error("AI Analysis Error:", error.message);
    return {
      goal: "Analyze the user's background and experience",
      intentMap: ["Introduction", "Experience", "Challenges", "Future Goals"]
    };
  }
};

// Generate Next Question
const generateNextQuestion = async (history, intentMap, currentGoal) => {
  try {
    if (!groq) {
      return "That's really interesting! Can you tell me more about your experience?";
    }
    const messages = [
      {
        role: "system",
        content: `You are a close friend and a "buddy" chatting casually with another friend about their experience. Goal: ${currentGoal}. Topics to naturally cover: ${intentMap.join(", ")}. Talk like you're hanging out - be super warm, excited, and genuinely curious! Use words like "bud", "mate", "friend", "yay". React to what they say with real enthusiasm ("Oh wow, that's amazing!", "No way, that sounds tough!", "Love that, tell me more!", "That's so cool!"). Keep questions SHORT (1 sentence max) and very conversational. Sound like a real person, not an AI. Use casual phrases like "So, check this...", "That's awesome! Anyway...", "Hey bud, quick thing...". NEVER repeat questions. Always build on what they just said.`,
      },
      ...history.map((turn) => ({
        role: turn.role === "ai" ? "assistant" : "user",
        content: turn.content,
      })),
    ];

    const completion = await groq.chat.completions.create({
      messages: messages,
      model: AI_MODEL,
      max_tokens: 150,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("AI Question Gen Error:", error.message);
    return "That's really interesting! Can you tell me more about that?";
  }
};

// Generate Speech (TTS) using enhanced ttsService
const generateSpeech = async (text, voiceOption = null) => {
  return ttsService.generateSpeech(text, voiceOption);
};

// Generate Campaign Questions
const generateCampaignQuestions = async ({
  companyName,
  productName,
  feedbackType,
  campaignName,
  productDescription,
  questionCount,
}) => {
  try {
    if (!groq) {
      console.log("⚠️ Using fallback questions (GROQ not configured)");
      return { questions: FALLBACK_QUESTIONS.slice(0, questionCount || 10) };
    }
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: [
            "You create customer-facing review prompts for a testimonial recording.",
            'Questions will be shown directly to the user (first-person prompts like "Tell us...").',
            'Return JSON with key "questions": [string].',
            `Generate exactly ${questionCount} questions.`,
            "Tone: casual and friendly.",
            "Cover: before/after pain points, product experience, support/service, and results/ROI.",
            "Questions must be strictly and only about the specified product and company.",
            "Do not mention other brands or unrelated topics.",
            "Questions must be short, specific, and open-ended.",
            "Avoid yes/no questions. Do not include numbering.",
          ].join(" "),
        },
        {
          role: "user",
          content: JSON.stringify({
            companyName,
            productName,
            feedbackType,
            campaignName,
            productDescription,
          }),
        },
      ],
      model: AI_MODEL,
      response_format: { type: "json_object" },
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error("AI Campaign Questions Error:", error.message);
    console.log("⚠️ Returning fallback questions");
    return { questions: FALLBACK_QUESTIONS.slice(0, questionCount || 10) };
  }
};

const detectSentiment = async (text) => {
  try {
    if (!groq) {
      // Simple keyword-based sentiment detection
      const lower = text.toLowerCase();
      const positive = ['love', 'great', 'amazing', 'excellent', 'awesome', 'fantastic', 'good', 'happy', 'helpful'];
      const negative = ['hate', 'bad', 'terrible', 'awful', 'poor', 'disappointed', 'frustrated', 'useless'];
      if (positive.some(w => lower.includes(w))) return 'positive';
      if (negative.some(w => lower.includes(w))) return 'negative';
      return 'neutral';
    }
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: [
            "Classify the sentiment of the user response.",
            'Return JSON with key "sentiment": "positive" | "negative" | "neutral".',
            "Only return JSON.",
          ].join(" "),
        },
        { role: "user", content: text },
      ],
      model: AI_MODEL,
      response_format: { type: "json_object" },
    });

    const parsed = JSON.parse(completion.choices[0].message.content);
    const sentiment = String(parsed.sentiment || "").toLowerCase();
    if (["positive", "negative", "neutral"].includes(sentiment))
      return sentiment;
    return "neutral";
  } catch (error) {
    console.error("AI Sentiment Error:", error.message);
    return "neutral";
  }
};

const generateFollowupQuestion = async ({
  baseQuestion,
  lastAnswer,
  sentiment,
  context,
}) => {
  try {
    if (!groq) {
      return baseQuestion || "Can you tell me more about that?";
    }
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: [
            "You are a casual buddy chatting with a friend about their experience with a product/service.",
            "Talk like a real friend would - be super warm, genuine, and very informal.",
            'Use "bud", "mate", "friend". Be empathetic or excited depending on their tone.',
            "Use the base question as a rough guide, but make it sound like a natural follow-up in a chat.",
            'If sentiment is negative: "Oh man, that sucks, I feel you buddy. What happened with..." or "That sounds rough, mate. How did..."',
            'If sentiment is positive: "That\'s so awesome! Love that for you! So tell me..." or "Wow, that is great, bud! What about..."',
            'If neutral: "Gotcha. So, I was wondering..." or "Makes sense! What do you think about..."',
            "Keep it VERY SHORT (1 sentence max). Sound like you're just hanging out.",
            'Return JSON with key "question": string. No formal language, no numbering.',
          ].join(" "),
        },
        {
          role: "user",
          content: JSON.stringify({
            baseQuestion,
            lastAnswer,
            sentiment,
            context,
          }),
        },
      ],
      model: AI_MODEL,
      response_format: { type: "json_object" },
    });

    const parsed = JSON.parse(completion.choices[0].message.content);
    return String(parsed.question || "").trim();
  } catch (error) {
    console.error("AI Followup Error:", error.message);
    throw error;
  }
};

const generateClosingStatement = async (context) => {
  try {
    if (!groq) {
      return "Thanks so much for sharing your thoughts, buddy! You're the best!";
    }
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: [
            "You are a casual buddy. The interview is OVER.",
            "Say a super warm, personalized thank you to the friend for sharing their thoughts.",
            "Mention specific details if provided (like the company or product) but keep it brief.",
            'Use "bud", "mate", etc. Be VERY informal and friendly.',
            "One sentence ONLY.",
            'Return JSON with key "message": string.',
          ].join(" "),
        },
        {
          role: "user",
          content: JSON.stringify(context),
        },
      ],
      model: AI_MODEL,
      response_format: { type: "json_object" },
    });

    const parsed = JSON.parse(completion.choices[0].message.content);
    return String(
      parsed.message ||
      "Thanks so much for sharing your thoughts, mate! Catch you later!",
    ).trim();
  } catch (error) {
    console.error("AI Closing Error:", error.message);
    return "Thanks so much for sharing your thoughts, buddy! You're the best!";
  }
};

// Generic AI response generation
const generateResponse = async (prompt, maxTokens = 300) => {
  try {
    if (!groq) {
      console.warn('⚠️ GROQ API not available, returning default response');
      return 'Thank you for your feedback!';
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      model: AI_MODEL,
      max_tokens: maxTokens
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error("AI Response Generation Error:", error.message);
    return 'Thank you for your feedback!';
  }
};

module.exports = {
  analyzePrompt,
  generateNextQuestion,
  generateSpeech,
  generateCampaignQuestions,
  detectSentiment,
  generateFollowupQuestion,
  generateClosingStatement,
  generateResponse,
};
