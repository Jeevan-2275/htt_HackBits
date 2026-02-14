const CampaignQuestionSet = require('../models/CampaignQuestionSet');
const aiService = require('../services/aiService');

const normalizeQuestions = (questions, targetCount) => {
    const cleaned = (Array.isArray(questions) ? questions : [])
        .map(q => String(q || '').trim())
        .filter(Boolean);

    const deduped = [];
    const seen = new Set();
    for (const q of cleaned) {
        const key = q.toLowerCase();
        if (!seen.has(key)) {
            seen.add(key);
            deduped.push(q.endsWith('?') ? q : `${q}?`);
        }
    }

    return deduped.slice(0, targetCount);
};

// @desc    Generate and store campaign questions
// @route   POST /api/campaigns/questions
// @access  Public
exports.generateCampaignQuestions = async (req, res) => {
    try {
        const {
            companyName,
            productName,
            feedbackType,
            campaignName,
            productDescription,
            questionCount
        } = req.body;

        if (!companyName || !productName || !feedbackType || !campaignName || !productDescription) {
            return res.status(400).json({
                success: false,
                error: 'companyName, productName, feedbackType, campaignName, and productDescription are required'
            });
        }

        const count = Number.isFinite(questionCount) ? Math.min(Math.max(questionCount, 3), 12) : 10;

        const aiResult = await aiService.generateCampaignQuestions({
            companyName,
            productName,
            feedbackType,
            campaignName,
            productDescription,
            questionCount: count
        });

        const questions = normalizeQuestions(aiResult.questions, count);

        const record = await CampaignQuestionSet.create({
            companyName,
            productName,
            feedbackType,
            campaignName,
            productDescription,
            questions
        });

        res.status(201).json({
            success: true,
            data: {
                id: record._id,
                questions: record.questions
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
