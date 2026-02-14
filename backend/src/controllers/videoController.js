const VideoAsset = require('../models/VideoAsset');
const ReelAsset = require('../models/ReelAsset');
const InterviewSession = require('../models/InterviewSession');
const ffmpegService = require('../services/ffmpegService');
const { uploadToCloudinary } = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Helper to download file
const downloadFile = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => { });
            reject(err);
        });
    });
};

// @desc    Generate Reel (Async Job Hook)
// @route   POST /api/process/reel
exports.generateReelForSession = async (req, res) => {
    try {
        const { sessionId } = req.body;

        const session = await InterviewSession.findById(sessionId);
        if (!session) return res.status(404).json({ error: 'Session not found' });

        // Async Processing Start
        // In a real app, this should be a queue (Bull/Redis). 
        // Here we just fire and forget the async part, but in Serverless/Lambda this would fail.
        // For a hackathon server running locally/VPS, this works.

        (async () => {
            try {
                session.status = 'processing';
                await session.save();

                const videoAssets = await VideoAsset.find({ sessionId, isRaw: true }).sort({ createdAt: 1 });

                if (videoAssets.length === 0) {
                    console.log('No video assets to process');
                    return;
                }

                // 1. Download all assets
                const downloadDir = path.join('uploads', 'temp_' + sessionId);
                if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir);

                const downloadPaths = [];
                for (const asset of videoAssets) {
                    const localPath = path.join(downloadDir, `${asset._id}.mp4`); // Assume proper ext
                    await downloadFile(asset.cloudinaryUrl, localPath);
                    downloadPaths.push(localPath);
                }

                // 2. Concatenate & Crop
                const outputPath = path.join('uploads', `reel_${sessionId}.mp4`);
                await ffmpegService.generateReel(downloadPaths, [], outputPath);

                // 3. Upload Reel
                const uploadResult = await uploadToCloudinary(outputPath, 'htt_hackbits/reels');

                // 4. Save ReelAsset
                const reel = await ReelAsset.create({
                    sessionId,
                    cloudinaryUrl: uploadResult.secure_url,
                    duration: uploadResult.duration
                });

                // 5. Update Session
                session.status = 'completed';
                session.reelAssetId = reel._id;
                await session.save();

                // Cleanup
                fs.rmSync(downloadDir, { recursive: true, force: true });
                fs.unlinkSync(outputPath);
                console.log(`Reel processed for session ${sessionId}`);

            } catch (err) {
                console.error('Reel Processing Failed:', err);
                session.status = 'failed';
                await session.save();
            }
        })();

        res.json({ success: true, message: 'Reel processing started', jobId: sessionId });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
