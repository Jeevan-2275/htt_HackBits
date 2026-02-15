const InterviewSession = require('../models/InterviewSession');
const Project = require('../models/Project');
const VideoAsset = require('../models/VideoAsset');
const Testimonial = require('../models/Testimonial');
const videoController = require('./videoController');
const highlightService = require('../services/highlightService');
const transcriptionService = require('../services/transcriptionService');
const ConversationTurn = require('../models/ConversationTurn');

// @desc    Get all testimonials/sessions for a project
// @route   GET /api/projects/:projectId/testimonials
exports.getTestimonials = async (req, res) => {
    try {
        const { projectId } = req.params;

        // Verify Project exists and user owns it
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }

        // Ensure user owns the project
        if (project.userId.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        // Get all sessions that either:
        // 1. Have completed status OR
        // 2. Have video uploaded (videoUploadComplete = true)
        const testimonials = await InterviewSession.find({ 
            projectId,
            $or: [
                { status: 'completed' },
                { videoUploadComplete: true }
            ]
        })
        .populate('videoAssetId')
        .populate('reelAssetId')
        .populate('questionSetId')
        .sort({ createdAt: -1 });

        console.log(`Found ${testimonials.length} testimonials for project ${projectId}`);

        res.status(200).json({ success: true, count: testimonials.length, data: testimonials });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get single testimonial
// @route   GET /api/testimonials/:id
exports.getTestimonial = async (req, res) => {
    try {
        const testimonial = await InterviewSession.findById(req.params.id)
            .populate('projectId');

        if (!testimonial) {
            return res.status(404).json({ success: false, error: 'Testimonial not found' });
        }

        // Check ownership via Project
        if (testimonial.projectId.userId.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        res.status(200).json({ success: true, data: testimonial });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Update testimonial status
// @route   PUT /api/testimonials/:id
exports.updateTestimonial = async (req, res) => {
    try {
        let testimonial = await InterviewSession.findById(req.params.id)
            .populate('projectId');

        if (!testimonial) {
            return res.status(404).json({ success: false, error: 'Testimonial not found' });
        }

        // Check ownership
        if (testimonial.projectId.userId.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        testimonial = await InterviewSession.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: testimonial });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Process all unprocessed videos for a project
// @route   POST /api/projects/:projectId/process-all-videos
exports.processAllVideos = async (req, res) => {
    try {
        const { projectId } = req.params;

        // Verify Project exists and user owns it
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }

        // Ensure user owns the project
        if (project.userId.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        // Find all sessions with video uploaded but not processed
        const unprocessedSessions = await InterviewSession.find({
            projectId,
            videoUploadComplete: true,
            reelProcessed: { $ne: true }
        })
        .populate('videoAssetId')
        .populate('projectId');

        if (unprocessedSessions.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No unprocessed videos found',
                count: 0
            });
        }

        // Send immediate response
        res.status(200).json({
            success: true,
            message: `Processing ${unprocessedSessions.length} videos. This may take a few minutes.`,
            count: unprocessedSessions.length
        });

        // Process all videos in background
        setImmediate(async () => {
            for (const session of unprocessedSessions) {
                try {
                    console.log(`🎬 Processing video for session: ${session._id}`);
                    await processVideoToReelLogic(session);
                    console.log(`✅ Completed processing for session: ${session._id}`);
                } catch (error) {
                    console.error(`❌ Error processing session ${session._id}:`, error);
                }
            }
            console.log('🎉 Batch processing completed!');
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Helper function to process video to reel
const processVideoToReelLogic = async (testimonial) => {
    const aiService = require('../services/aiService');

    // Update status to processing
    testimonial.status = 'processing';
    await testimonial.save();

    // Get conversation transcript if available
    const conversation = await ConversationTurn.find({ sessionId: testimonial._id })
        .sort({ createdAt: 1 });

    const userResponses = conversation.filter(turn => turn.role === 'user');
    const fullTranscript = userResponses.map(turn => turn.content).join(' ');

    // Get video metadata
    const videoAsset = testimonial.videoAssetId;
    const videoUrl = videoAsset.cloudinaryUrl;
    const duration = videoAsset.duration || 60;

    // Generate testimonial content if not already done
    if (!testimonial.testimonialGenerated && fullTranscript.length > 50) {
        const context = {
            companyName: testimonial.projectId?.companyName || 'Company',
            productName: testimonial.projectId?.productName || 'Product',
            campaignName: testimonial.projectId?.name || 'Campaign'
        };

        // Analyze sentiment
        const sentiment = await aiService.detectSentiment(fullTranscript);

        // Generate summary
        const summaryPrompt = `Create a 2-3 sentence testimonial summary from this feedback: "${fullTranscript.substring(0, 500)}"`;
        const summary = await aiService.generateResponse(summaryPrompt);

        // Generate Instagram reel caption
        const captionPrompt = `Create an engaging Instagram reel caption (under 150 chars) with hashtags for this testimonial about ${context.productName}: "${fullTranscript.substring(0, 300)}"`;
        const caption = await aiService.generateResponse(captionPrompt);

        testimonial.sentiment = sentiment;
        testimonial.testimonialSummary = summary.trim();
        testimonial.reelCaption = caption.trim();
        testimonial.testimonialGenerated = true;
    }

    // Extract highlights for reel clips
    const highlights = [
        {
            quote: "Best moment from testimonial",
            start: 0,
            end: Math.min(30, duration),
            confidence: 0.9
        }
    ];

    testimonial.highlights = highlights;
    testimonial.reelProcessed = true;
    testimonial.reelDownloadUrl = videoUrl;
    testimonial.status = 'completed';
    await testimonial.save();
};

// @desc    Generate downloadable reel for testimonial
// @route   POST /api/testimonials/:id/generate-reel
exports.generateReelDownload = async (req, res) => {
    try {
        const testimonial = await InterviewSession.findById(req.params.id)
            .populate('projectId');

        if (!testimonial) {
            return res.status(404).json({ success: false, error: 'Testimonial not found' });
        }

        // Check ownership via Project
        if (testimonial.projectId.userId.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        if (!testimonial.testimonialGenerated) {
            return res.status(400).json({ success: false, error: 'Testimonial not processed yet' });
        }

        // Generate reel content with highlights and caption
        const reelData = {
            sessionId: testimonial._id,
            highlights: testimonial.highlights,
            caption: testimonial.reelCaption,
            summary: testimonial.testimonialSummary,
            sentiment: testimonial.sentiment,
            metadata: {
                companyName: testimonial.projectId.companyName || 'Company',
                productName: testimonial.projectId.productName || 'Product',
                campaignName: testimonial.projectId.name || 'Campaign'
            }
        };

        res.status(200).json({ 
            success: true, 
            message: 'Reel data generated successfully',
            data: reelData 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Process video testimonial into reel with highlights and caption
// @route   POST /api/testimonials/:id/process-video
exports.processVideoToReel = async (req, res) => {
    try {
        const testimonial = await InterviewSession.findById(req.params.id)
            .populate('projectId')
            .populate('videoAssetId');

        if (!testimonial) {
            return res.status(404).json({ success: false, error: 'Testimonial not found' });
        }

        // Check ownership via Project
        if (testimonial.projectId.userId.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        if (!testimonial.videoUploadComplete || !testimonial.videoAssetId) {
            return res.status(400).json({ success: false, error: 'Video not uploaded yet' });
        }

        // Update status to processing
        testimonial.status = 'processing';
        await testimonial.save();

        // Send immediate response
        res.status(200).json({ 
            success: true, 
            message: 'Video processing started! This may take a few minutes.',
            data: { sessionId: testimonial._id, status: 'processing' }
        });

        // Process video in background
        setImmediate(async () => {
            try {
                console.log('🎬 Starting video processing for session:', testimonial._id);

                // Get conversation transcript if available
                const conversation = await ConversationTurn.find({ sessionId: testimonial._id })
                    .sort({ createdAt: 1 });
                
                const userResponses = conversation.filter(turn => turn.role === 'user');
                const fullTranscript = userResponses.map(turn => turn.content).join(' ');

                // Get video metadata
                const videoAsset = testimonial.videoAssetId;
                const videoUrl = videoAsset.cloudinaryUrl;
                const duration = videoAsset.duration || 60; // Default 60 seconds if not available

                // Generate testimonial content if not already done
                if (!testimonial.testimonialGenerated && fullTranscript.length > 50) {
                    const aiService = require('../services/aiService');
                    
                    const context = {
                        companyName: testimonial.projectId.companyName || 'Company',
                        productName: testimonial.projectId.productName || 'Product',
                        campaignName: testimonial.projectId.name || 'Campaign'
                    };

                    // Analyze sentiment
                    const sentiment = await aiService.detectSentiment(fullTranscript);
                    
                    // Generate summary
                    const summaryPrompt = `Create a 2-3 sentence testimonial summary from this feedback: "${fullTranscript.substring(0, 500)}"`;
                    const summary = await aiService.generateResponse(summaryPrompt);
                    
                    // Generate Instagram reel caption
                    const captionPrompt = `Create an engaging Instagram reel caption (under 150 chars) with hashtags for this testimonial about ${context.productName}: "${fullTranscript.substring(0, 300)}"`;
                    const caption = await aiService.generateResponse(captionPrompt);
                    
                    testimonial.sentiment = sentiment;
                    testimonial.testimonialSummary = summary.trim();
                    testimonial.reelCaption = caption.trim();
                    testimonial.testimonialGenerated = true;
                }

                // Extract highlights for reel clips (30-60 second segments)
                const highlights = [
                    {
                        quote: "Best moment from testimonial",
                        start: 0,
                        end: Math.min(30, duration),
                        confidence: 0.9
                    }
                ];

                testimonial.highlights = highlights;
                testimonial.reelProcessed = true;
                testimonial.reelDownloadUrl = videoUrl; // For now, use original video URL
                testimonial.status = 'completed';
                await testimonial.save();

                console.log('✅ Video processing completed for session:', testimonial._id);

            } catch (processingError) {
                console.error('❌ Video processing error:', processingError);
                testimonial.status = 'failed';
                await testimonial.save();
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get testimonials by campaign ID (from new Testimonial model)
// @route   GET /api/testimonials/campaign/:campaignId
exports.getByCampaign = async (req, res) => {
    try {
        const { campaignId } = req.params;

        // Verify campaign exists and user owns it
        const campaign = await Project.findById(campaignId);
        if (!campaign) {
            return res.status(404).json({ success: false, error: 'Campaign not found' });
        }

        // Check ownership
        if (campaign.userId.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        // Get all testimonials for this campaign
        const testimonials = await Testimonial.find({ campaignId })
            .sort({ createdAt: -1 });

        console.log(`Found ${testimonials.length} testimonials for campaign ${campaignId}`);

        res.status(200).json({ 
            success: true, 
            count: testimonials.length, 
            data: testimonials 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
