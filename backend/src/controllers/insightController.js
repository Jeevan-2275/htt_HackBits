const InterviewSession = require('../models/InterviewSession');
const aiService = require('../services/aiService');

// @desc    Generate AI insights for a testimonial
// @route   POST /api/testimonials/:id/insights
// @access  Public (for embedding)
exports.generateInsights = async (req, res) => {
    try {
        const testimonial = await InterviewSession.findById(req.params.id).populate('projectId');

        if (!testimonial) {
            return res.status(404).json({
                success: false,
                error: 'Testimonial not found'
            });
        }

        // Use transcript as source
        const source = testimonial.transcript || 'No content available';

        if (!source || source.length < 50) {
            return res.status(400).json({
                success: false,
                error: 'Insufficient testimonial content for analysis'
            });
        }

        console.log('🧠 Analyzing testimonial:', testimonial._id);

        // Get project details for context
        const projectName = testimonial.projectId?.name || 'Our Product';
        const productName = testimonial.projectId?.productName || projectName;

        // Generate insights using AI
        const insights = await aiService.generateTestimonialInsights({
            transcript: source,
            customerName: 'Customer', // Generic customer name
            productName: productName
        });

        // Save insights to testimonial
        testimonial.insights = {
            summary: insights.summary,
            emotions: insights.emotions,
            trustScore: insights.trustScore,
            keyPoints: insights.keyPoints,
            generatedAt: new Date()
        };

        await testimonial.save();

        res.status(200).json({
            success: true,
            data: testimonial.insights
        });
    } catch (error) {
        console.error('❌ Insight generation error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to generate insights'
        });
    }
};

// @desc    Get testimonial with insights
// @route   GET /api/testimonials/:id/insights
// @access  Public (for embedding)
exports.getInsights = async (req, res) => {
    try {
        const testimonial = await InterviewSession.findById(req.params.id).populate('projectId');

        if (!testimonial) {
            return res.status(404).json({
                success: false,
                error: 'Testimonial not found'
            });
        }

        // If insights don't exist, generate them
        if (!testimonial.insights) {
            const source = testimonial.transcript || '';
            
            if (source.length < 50) {
                return res.status(200).json({
                    success: true,
                    data: {
                        _id: testimonial._id,
                        insights: {
                            summary: 'Testimonial too short to analyze',
                            emotions: [],
                            trustScore: 0,
                            keyPoints: [],
                            generatedAt: null
                        },
                        transcript: testimonial.transcript
                    }
                });
            }

            const projectName = testimonial.projectId?.name || 'Our Product';
            const productName = testimonial.projectId?.productName || projectName;

            const insights = await aiService.generateTestimonialInsights({
                transcript: source,
                customerName: 'Customer',
                productName: productName
            });

            testimonial.insights = {
                summary: insights.summary,
                emotions: insights.emotions,
                trustScore: insights.trustScore,
                keyPoints: insights.keyPoints,
                generatedAt: new Date()
            };

            await testimonial.save();
        }

        res.status(200).json({
            success: true,
            data: {
                _id: testimonial._id,
                productName: testimonial.projectId?.productName || testimonial.projectId?.name,
                insights: testimonial.insights,
                transcript: testimonial.transcript
            }
        });
    } catch (error) {
        console.error('❌ Get insights error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to get insights'
        });
    }
};
