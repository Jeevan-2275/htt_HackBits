const UserPrompt = require('../models/UserPrompt');
const aiService = require('../services/aiService');

// @desc    Analyze Prompt and Create Interview Plan
// @route   POST /api/prompt
exports.analyzeUserPrompt = async (req, res) => {
    try {
        const { promptText } = req.body;

        if (!promptText) {
            return res.status(400).json({ success: false, error: 'Prompt text is required' });
        }

        // 1. Call AI Service to analyze
        const analysis = await aiService.analyzePrompt(promptText);

        // 2. Create UserPrompt Record
        const userPrompt = await UserPrompt.create({
            promptText,
            interviewGoal: analysis.goal,
            intentMap: analysis.intentMap
        });

        res.status(201).json({
            success: true,
            data: userPrompt
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
