const path = require('path');
const fs = require('fs');
const InterviewSession = require('../models/InterviewSession');
const Project = require('../models/Project');
const Testimonial = require('../models/Testimonial');
const directorService = require('../services/directorService');
const ffmpegService = require('../services/ffmpegService');

/**
 * @desc Get AI Director & RAG Viral Analysis for a Testimonial/Video
 * @route POST /api/reels/director-analysis
 */
exports.getDirectorAnalysis = async (req, res) => {
  try {
    const { testimonialId, campaignId } = req.body;

    let transcript = req.body.transcript || '';
    let duration = 60;
    let campaignContext = {};

    // 1. Try to fetch from Testimonial or InterviewSession
    if (testimonialId) {
      const testimonial = await Testimonial.findById(testimonialId).populate('campaignId');
      if (testimonial) {
        if (testimonial.campaignId) {
          campaignContext = {
            companyName: testimonial.campaignId.companyName || testimonial.campaignId.name,
            productName: testimonial.campaignId.productName || 'Product',
            feedbackType: testimonial.campaignId.feedbackType || 'Customer Feedback'
          };
        }
        if (testimonial.sessionId) {
          const session = await InterviewSession.findById(testimonial.sessionId);
          if (session) {
            transcript = session.transcript || transcript;
            duration = session.endTime && session.startTime 
              ? Math.round((new Date(session.endTime) - new Date(session.startTime)) / 1000)
              : 60;
          }
        }
      }
    } else if (campaignId) {
      const project = await Project.findById(campaignId);
      if (project) {
        campaignContext = {
          companyName: project.companyName || project.name,
          productName: project.productName || 'Product',
          feedbackType: project.feedbackType || 'Customer Feedback'
        };
      }
    }

    if (!transcript) {
      transcript = 'The platform has been absolutely incredible for our team. Setup took only minutes, customer response rates tripled, and our conversion rates increased dramatically!';
    }

    const analysis = await directorService.analyzeVideoDirector({
      transcript,
      campaignContext,
      duration
    });

    res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Director Analysis Error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate director analysis' });
  }
};

/**
 * @desc Render custom studio reel with aspect ratio and hook settings
 * @route POST /api/reels/render-custom
 */
exports.renderCustomReel = async (req, res) => {
  try {
    const {
      testimonialId,
      startTime = 5,
      endTime = 50,
      aspectRatio = '9:16',
      hookTitle = '🔥 GAME-CHANGING RESULTS',
      watermarkText = 'Feedspace AI'
    } = req.body;

    let videoPath = null;

    let targetTestimonial = null;

    if (testimonialId) {
      targetTestimonial = await Testimonial.findById(testimonialId);
      if (targetTestimonial && targetTestimonial.videoUrl) {
        // Check if local file in uploads with URL decoding
        const decodedUrl = decodeURIComponent(targetTestimonial.videoUrl);
        const relativeUrl = decodedUrl.replace(/^https?:\/\/[^\/]+/, '');
        const localCandidate = path.join(__dirname, '../../', relativeUrl.replace(/^\//, ''));
        if (fs.existsSync(localCandidate)) {
          videoPath = localCandidate;
        }
      }
    }

    // Fallback to sample testimonial video in uploads or root
    if (!videoPath) {
      const candidatePaths = [
        path.join(__dirname, '../../uploads/sample-testimonial.mp4'),
        path.resolve('c:/Users/admin/Desktop/Hack/WhatsApp Video 2026-02-15 at 3.26.30 AM.mp4')
      ];
      for (const p of candidatePaths) {
        if (fs.existsSync(p)) {
          videoPath = p;
          break;
        }
      }
    }

    if (!videoPath) {
      return res.status(404).json({ success: false, error: 'Source video file not found' });
    }

    const reelsDir = path.join(__dirname, '../../uploads/reels');
    if (!fs.existsSync(reelsDir)) {
      fs.mkdirSync(reelsDir, { recursive: true });
    }

    const safeRatio = aspectRatio.replace(':', 'x');
    const filename = `clip-${safeRatio}-${Date.now()}.mp4`;
    const outputPath = path.join(reelsDir, filename);

    console.log(`🎬 Rendering Custom Clip [${aspectRatio}]: ${startTime}s -> ${endTime}s from ${videoPath}`);
    await ffmpegService.renderStudioReel({
      inputPath: videoPath,
      outputPath,
      startTime: Number(startTime),
      endTime: Number(endTime),
      aspectRatio,
      hookTitle,
      watermarkText
    });

    const reelUrl = `http://localhost:5000/uploads/reels/${filename}`;
    const stat = fs.statSync(outputPath);

    // Persist new Clip to MongoDB so it appears in the dashboard immediately
    let newClipId = null;
    if (targetTestimonial) {
      const cleanName = targetTestimonial.userName.replace(/\s*\(.*\)/, '');
      const newTestimonial = await Testimonial.create({
        campaignId: targetTestimonial.campaignId,
        sessionId: targetTestimonial.sessionId,
        videoUrl: reelUrl,
        userName: `${cleanName} (${aspectRatio} AI Reel)`,
        sentiment: targetTestimonial.sentiment || 'positive',
        status: 'published'
      });
      newClipId = newTestimonial._id;
      console.log('✅ Created new Clip Testimonial in DB:', newClipId);
    }

    res.status(200).json({
      success: true,
      message: 'Custom clip rendered and saved successfully!',
      data: {
        reelUrl,
        clipId: newClipId,
        aspectRatio,
        duration: Math.round(endTime - startTime),
        fileSizeMb: Number((stat.size / 1024 / 1024).toFixed(2))
      }
    });
  } catch (error) {
    console.error('Render Custom Reel Error:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to render custom reel' });
  }
};
