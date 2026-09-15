const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const Project = require('../models/Project');
const InterviewSession = require('../models/InterviewSession');
const Testimonial = require('../models/Testimonial');
const VideoAsset = require('../models/VideoAsset');
const { uploadToCloudinary } = require('../config/cloudinary');

async function testPipeline() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/htt_hackbits');
    console.log('✅ Connected to MongoDB');

    // 1. Create or find a test user
    let user = await User.findOne({ email: 'testuser@example.com' });
    if (!user) {
      user = await User.create({
        name: 'Demo Admin',
        email: 'testuser@example.com',
        password: 'password123',
        companyName: 'Acme AI Innovations'
      });
      console.log('👤 Created test user:', user.email);
    } else {
      console.log('👤 Found existing test user:', user.email);
    }

    // 2. Create or find a Campaign/Project
    let project = await Project.findOne({ userId: user._id, name: 'Video Testimonial Demo Campaign' });
    if (!project) {
      project = await Project.create({
        userId: user._id,
        name: 'Video Testimonial Demo Campaign',
        description: 'Customer video testimonial showcase using real video footage',
        questions: [
          'What was your primary challenge before using our solution?',
          'How did our platform help resolve it?',
          'What measurable results have you achieved?'
        ],
        companyName: 'Acme AI Innovations',
        productName: 'Feedspace AI Engine',
        feedbackType: 'Product Quality & Performance',
        status: 'active'
      });
      console.log('📋 Created campaign:', project.name, `(${project._id})`);
    } else {
      console.log('📋 Found existing campaign:', project.name, `(${project._id})`);
    }

    // 3. Source Video Path
    const sourceVideo = path.resolve('c:/Users/admin/Desktop/Hack/WhatsApp Video 2026-02-15 at 3.26.30 AM.mp4');
    if (!fs.existsSync(sourceVideo)) {
      throw new Error(`Source video not found at: ${sourceVideo}`);
    }
    const stat = fs.statSync(sourceVideo);
    console.log(`📹 Located user video: ${(stat.size / 1024 / 1024).toFixed(2)} MB`);

    // 4. Ingest video into application storage
    console.log('📤 Uploading and registering video...');
    const uploadResult = await uploadToCloudinary(sourceVideo, 'htt_hackbits/testimonials');
    console.log('✅ Video stored with URL:', uploadResult.secure_url);

    // 5. Create InterviewSession
    const session = await InterviewSession.create({
      projectId: project._id,
      status: 'completed',
      startTime: new Date(Date.now() - 300000),
      endTime: new Date(),
      transcript: 'I have been using this platform for our operations and the time saved has been unprecedented. The AI features automate our entire video collection workflow seamlessly!',
      sentiment: 'positive',
      testimonialGenerated: true,
      videoUploadComplete: true,
      testimonialSummary: 'Exceptional experience with instant ROI and intuitive video capture.',
      reelCaption: 'Transforming customer reviews into high-converting video reels with Feedspace! 🚀✨ #Feedspace #AI #Testimonial'
    });

    // 6. Create VideoAsset
    const videoAsset = await VideoAsset.create({
      sessionId: session._id,
      cloudinaryUrl: uploadResult.secure_url,
      cloudinaryPublicId: uploadResult.public_id,
      format: uploadResult.format,
      duration: uploadResult.duration,
      isRaw: false
    });

    session.videoAssetId = videoAsset._id;
    await session.save();

    // 7. Create Testimonial record (for dashboard grid)
    const testimonial = await Testimonial.create({
      campaignId: project._id,
      sessionId: session._id,
      videoUrl: uploadResult.secure_url,
      userName: 'Kiran Sharma (Verified Customer)',
      sentiment: 'positive',
      status: 'published'
    });

    project.testimonialCount = (project.testimonialCount || 0) + 1;
    await project.save();

    console.log('\n=============================================');
    console.log('🎉 TESTIMONIAL VIDEO SUCCESSFULLY GENERATED!');
    console.log('=============================================');
    console.log('Testimonial ID:', testimonial._id.toString());
    console.log('Campaign ID:', project._id.toString());
    console.log('Video Stream URL:', uploadResult.secure_url);
    console.log('Customer Name:', testimonial.userName);
    console.log('Sentiment:', testimonial.sentiment);
    console.log('Status:', testimonial.status);
    console.log('=============================================\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Pipeline test failed:', err);
    process.exit(1);
  }
}

testPipeline();
