const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const ffmpegService = require('../services/ffmpegService');
const Project = require('../models/Project');
const InterviewSession = require('../models/InterviewSession');
const Testimonial = require('../models/Testimonial');
const ReelAsset = require('../models/ReelAsset');

async function setSingle45sTestimonial() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/htt_hackbits');
    console.log('✅ Connected to MongoDB');

    const sourceVideo = path.resolve('c:/Users/admin/Desktop/Hack/WhatsApp Video 2026-02-15 at 3.26.30 AM.mp4');
    if (!fs.existsSync(sourceVideo)) {
      throw new Error(`Source video not found at ${sourceVideo}`);
    }

    const reelsDir = path.join(__dirname, '../../uploads/reels');
    if (!fs.existsSync(reelsDir)) {
      fs.mkdirSync(reelsDir, { recursive: true });
    }

    const outputReelPath = path.join(reelsDir, 'feedspace-single-45s-reel.mp4');
    const startTime = 5;
    const endTime = 50; // Exactly 45 seconds (within 30s to 60s range)

    console.log(`🎬 Trimming 45-second clip (${startTime}s to ${endTime}s) & auto-framing to 9:16 vertical...`);
    await ffmpegService.trimClip(sourceVideo, startTime, endTime, outputReelPath);

    const stat = fs.statSync(outputReelPath);
    console.log(`✅ 45-Second Reel Created: ${(stat.size / 1024 / 1024).toFixed(2)} MB`);

    const reelUrl = 'http://localhost:5000/uploads/reels/feedspace-single-45s-reel.mp4';

    // Find all projects
    const projects = await Project.find();
    console.log(`Found ${projects.length} campaigns in database.`);

    for (const project of projects) {
      console.log(`\n🧹 Cleaning up testimonials for campaign "${project.name}" (${project._id})...`);
      
      // Delete all existing testimonials for this campaign so there is strictly ONE
      const deleteResult = await Testimonial.deleteMany({ campaignId: project._id });
      console.log(`🗑️ Deleted ${deleteResult.deletedCount} old testimonials for this campaign.`);

      // Find or link an interview session
      let session = await InterviewSession.findOne({ projectId: project._id }).sort({ createdAt: -1 });
      if (!session) {
        session = await InterviewSession.create({
          projectId: project._id,
          userName: 'Kiran Sharma',
          userEmail: 'kiran.sharma@example.com',
          status: 'completed',
          videoUrl: reelUrl,
          startTime: new Date(Date.now() - 45000),
          endTime: new Date(),
          transcript: 'This platform transformed how we collect customer stories with AI automation. Setting it up took literally five minutes, and our response rates jumped 300%. The vertical video reels make our conversions soar!'
        });
      }

      // Create ReelAsset for 45s
      const reelAsset = await ReelAsset.create({
        sessionId: session._id,
        cloudinaryUrl: reelUrl,
        format: 'mp4',
        duration: 45,
        highlights: [
          'This platform transformed how we collect customer stories with AI automation.'
        ]
      });

      session.reelAssetId = reelAsset._id;
      session.reelProcessed = true;
      session.reelDownloadUrl = reelUrl;
      session.reelCaption = 'Transforming authentic customer voice into high-converting 45s vertical video reels! 🚀✨ #Feedspace #AI #CustomerSuccess';
      await session.save();

      // Create EXACTLY ONE published testimonial for this campaign
      const singleTestimonial = await Testimonial.create({
        campaignId: project._id,
        sessionId: session._id,
        videoUrl: reelUrl,
        userName: 'Kiran Sharma (Verified Customer • 45s Featured Story)',
        userEmail: 'kiran.sharma@example.com',
        sentiment: 'positive',
        status: 'published',
        rating: 5,
        feedbackText: 'Feedspace completely transformed how we collect customer feedback. In less than a week, our video response rates tripled and conversion jumped 34%!',
        metrics: {
          views: 1240,
          likes: 98,
          shares: 34
        }
      });

      console.log(`✨ Created ONLY ONE testimonial in campaign "${project.name}": ID ${singleTestimonial._id}`);

      // Update project testimonial count to exactly 1
      project.testimonialCount = 1;
      await project.save();
    }

    // Double check counts across database
    const totalTestimonials = await Testimonial.countDocuments();
    console.log(`\n=============================================`);
    console.log(`🎉 SUCCESS: Exactly ${totalTestimonials} total testimonial(s) in system now!`);
    console.log(`Single Video Duration: 45 seconds (30s - 60s standard)`);
    console.log(`Video URL: ${reelUrl}`);
    console.log(`File Size: ${(stat.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`=============================================\n`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to set single 45s testimonial:', err);
    process.exit(1);
  }
}

setSingle45sTestimonial();
