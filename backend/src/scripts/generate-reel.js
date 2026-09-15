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
const ClipAsset = require('../models/ClipAsset');

async function makeReel() {
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

    const outputReelPath = path.join(reelsDir, 'feedspace-reel-9x16.mp4');
    console.log('🎬 Processing Vertical 9:16 Reel with FFmpeg...');
    console.log('Input:', sourceVideo);
    console.log('Output:', outputReelPath);

    // Trim a vibrant 20-second highlight starting at 5s and crop to 9:16 (1080x1920)
    const startTime = 5;
    const endTime = 25;

    console.log(`⏱️ Trimming highlight clip (${startTime}s to ${endTime}s) & converting to 9:16 vertical...`);
    await ffmpegService.trimClip(sourceVideo, startTime, endTime, outputReelPath);

    const stat = fs.statSync(outputReelPath);
    console.log(`✅ Vertical Reel Created: ${(stat.size / 1024 / 1024).toFixed(2)} MB`);

    const reelUrl = 'http://localhost:5000/uploads/reels/feedspace-reel-9x16.mp4';

    // Find the campaign and session
    const project = await Project.findOne({ name: 'Video Testimonial Demo Campaign' });
    let session = null;
    if (project) {
      session = await InterviewSession.findOne({ projectId: project._id }).sort({ createdAt: -1 });
    }

    if (session) {
      const reelAsset = await ReelAsset.create({
        sessionId: session._id,
        cloudinaryUrl: reelUrl,
        format: 'mp4',
        duration: endTime - startTime,
        highlights: [
          'This platform transformed how we collect customer stories with AI automation.'
        ]
      });

      session.reelAssetId = reelAsset._id;
      session.reelProcessed = true;
      session.reelDownloadUrl = reelUrl;
      session.reelCaption = 'Transforming authentic customer voice into high-converting vertical video reels! 🚀✨ #Feedspace #AI #CustomerSuccess';
      await session.save();
      console.log('📋 Updated InterviewSession with ReelAsset:', reelAsset._id);

      // Also create a published Testimonial specifically for the Reel in the dashboard
      const reelTestimonial = await Testimonial.create({
        campaignId: project._id,
        sessionId: session._id,
        videoUrl: reelUrl,
        userName: 'Kiran Sharma (9:16 Vertical Reel)',
        sentiment: 'positive',
        status: 'published'
      });
      console.log('🌟 Created Reel Testimonial card in Dashboard:', reelTestimonial._id);
    }

    console.log('\n=============================================');
    console.log('🎉 VERTICAL 9:16 REEL READY FOR VIEWING!');
    console.log('=============================================');
    console.log('Reel URL:', reelUrl);
    console.log('Resolution: 1080x1920 (Standard Vertical Reel/Short/Story)');
    console.log('Duration: 20 seconds');
    console.log('File Size:', (stat.size / 1024 / 1024).toFixed(2), 'MB');
    console.log('=============================================\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to make reel:', err);
    process.exit(1);
  }
}

makeReel();
