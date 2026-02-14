const InterviewSession = require('../models/InterviewSession');
const VideoAsset = require('../models/VideoAsset');
const ClipAsset = require('../models/ClipAsset');
const { uploadToCloudinary } = require('../config/cloudinary');
const ffmpegService = require('../services/ffmpegService');
const transcriptionService = require('../services/transcriptionService');
const highlightService = require('../services/highlightService');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Helper to download file
const downloadFile = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            // Handle redirects
            if (response.statusCode === 301 || response.statusCode === 302) {
                file.close();
                fs.unlink(dest, () => { });
                return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
            }
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

const formatSrtTimestamp = (seconds) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const secs = String(date.getUTCSeconds()).padStart(2, '0');
    const millis = String(Math.floor((seconds % 1) * 1000)).padStart(3, '0');
    return `${hours}:${minutes}:${secs},${millis}`;
};

const buildSrt = (segments, startTime, endTime) => {
    const filtered = segments.filter(seg => seg.end >= startTime && seg.start <= endTime);
    return filtered
        .map((seg, idx) => {
            const start = Math.max(seg.start, startTime);
            const end = Math.min(seg.end, endTime);
            return [
                String(idx + 1),
                `${formatSrtTimestamp(start)} --> ${formatSrtTimestamp(end)}`,
                seg.text.trim(),
                ''
            ].join('\n');
        })
        .join('\n');
};

const findTimeRangeForQuote = (quote, segments) => {
    const normalizedQuote = quote.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
    const quoteWords = normalizedQuote.split(/\s+/).filter(Boolean);

    let best = null;
    let bestScore = 0;

    for (const seg of segments) {
        const normalizedSeg = seg.text.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
        let score = 0;
        for (const word of quoteWords) {
            if (normalizedSeg.includes(word)) {
                score += 1;
            }
        }
        if (score > bestScore) {
            bestScore = score;
            best = seg;
        }
    }

    if (!best) {
        return { start: 0, end: 10 };
    }

    return { start: best.start, end: best.end };
};

// @desc    Create Job + Upload Video + Auto-Process
// @route   POST /api/jobs/create
exports.createJob = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No video file uploaded' });
        }

        // Create session
        const session = await InterviewSession.create({
            status: 'active'
        });

        // Upload video to Cloudinary
        const uploadResult = await uploadToCloudinary(req.file.path, 'htt_hackbits/raw_videos');

        const videoAsset = await VideoAsset.create({
            sessionId: session._id,
            cloudinaryUrl: uploadResult.secure_url,
            cloudinaryPublicId: uploadResult.public_id,
            format: uploadResult.format,
            duration: uploadResult.duration,
            isRaw: true
        });

        session.videoAssetId = videoAsset._id;
        await session.save();

        // Cleanup uploaded file
        fs.unlinkSync(req.file.path);

        // Trigger automatic processing
        processJobAsync(session._id.toString());

        res.status(201).json({
            success: true,
            jobId: session._id,
            message: 'Job created and processing started'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get Job Status + Results
// @route   GET /api/jobs/:jobId
exports.getJobStatus = async (req, res) => {
    try {
        const { jobId } = req.params;

        const session = await InterviewSession.findById(jobId)
            .populate('videoAssetId')
            .populate('clipAssetIds')
            .populate('reelAssetId');

        if (!session) {
            return res.status(404).json({ success: false, error: 'Job not found' });
        }

        const response = {
            success: true,
            jobId: session._id,
            status: session.status,
            createdAt: session.startTime,
            transcript: session.transcript || null,
            rawVideoUrl: session.videoAssetId ? session.videoAssetId.cloudinaryUrl : null,
            highlights: [],
            clips: [],
            reelUrl: session.reelAssetId ? session.reelAssetId.cloudinaryUrl : null
        };

        // Add clip details
        if (session.clipAssetIds && session.clipAssetIds.length > 0) {
            response.clips = session.clipAssetIds.map(clip => ({
                id: clip._id,
                quote: clip.quote,
                startTime: clip.startTime,
                endTime: clip.endTime,
                url: clip.cloudinaryUrl
            }));

            response.highlights = session.clipAssetIds.map(clip => clip.quote);
        }

        res.json(response);

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Async processing function
const processJobAsync = async (sessionId) => {
    const tempDir = path.join('uploads', `temp_${sessionId}`);
    try {
        const session = await InterviewSession.findById(sessionId);
        if (!session) return;

        session.status = 'processing';
        await session.save();

        const videoAsset = session.videoAssetId
            ? await VideoAsset.findById(session.videoAssetId)
            : await VideoAsset.findOne({ sessionId, isRaw: true }).sort({ createdAt: -1 });

        if (!videoAsset) {
            console.log('No raw video asset to process');
            return;
        }

        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

        console.log(`[JOB ${sessionId}] Step 1: Downloading video...`);
        const localVideoPath = path.join(tempDir, `${videoAsset._id}.mp4`);
        await downloadFile(videoAsset.cloudinaryUrl, localVideoPath);
        console.log(`[JOB ${sessionId}] Step 1 DONE: Video downloaded (${fs.statSync(localVideoPath).size} bytes)`);

        console.log(`[JOB ${sessionId}] Step 2: Extracting audio...`);
        const audioPath = path.join(tempDir, `audio_${sessionId}.wav`);
        await ffmpegService.extractAudio(localVideoPath, audioPath);
        console.log(`[JOB ${sessionId}] Step 2 DONE: Audio extracted`);

        console.log(`[JOB ${sessionId}] Step 3: Transcribing audio (Whisper)...`);
        const transcription = await transcriptionService.transcribeAudioWithTimestamps(audioPath);
        console.log(`[JOB ${sessionId}] Step 3 DONE: Transcript = "${transcription.text.substring(0, 100)}..."`);
        session.transcript = transcription.text;
        session.transcriptSegments = transcription.segments;
        await session.save();

        console.log(`[JOB ${sessionId}] Step 4: Extracting highlights (GPT-4)...`);
        const highlights = await highlightService.extractHighlights(
            transcription.text,
            transcription.segments
        );
        console.log(`[JOB ${sessionId}] Step 4 DONE: Found ${highlights.length} highlights`);

        const createdClips = [];
        for (let i = 0; i < highlights.length; i += 1) {
            console.log(`[JOB ${sessionId}] Step 5: Processing clip ${i + 1}/${highlights.length}...`);
            const highlight = highlights[i];
            const range = (typeof highlight.start === 'number' && typeof highlight.end === 'number')
                ? { start: highlight.start, end: highlight.end }
                : findTimeRangeForQuote(highlight.quote, transcription.segments);

            const clipPath = path.join(tempDir, `clip_${i + 1}.mp4`);
            await ffmpegService.trimClip(localVideoPath, range.start, range.end, clipPath);

            const srtPath = path.join(tempDir, `clip_${i + 1}.srt`);
            const srtContent = buildSrt(transcription.segments, range.start, range.end);
            fs.writeFileSync(srtPath, srtContent || '');

            const subtitledPath = path.join(tempDir, `clip_${i + 1}_subtitled.mp4`);
            await ffmpegService.burnSubtitles(clipPath, srtPath, subtitledPath);

            const uploadResult = await uploadToCloudinary(subtitledPath, 'htt_hackbits/clips');

            const clip = await ClipAsset.create({
                sessionId: session._id,
                quote: highlight.quote,
                startTime: range.start,
                endTime: range.end,
                cloudinaryUrl: uploadResult.secure_url
            });

            createdClips.push(clip._id);
        }

        session.clipAssetIds = createdClips;
        session.status = 'completed';
        await session.save();

        fs.rmSync(tempDir, { recursive: true, force: true });
        console.log(`Job ${sessionId} completed successfully`);

    } catch (err) {
        console.error('Job Processing Failed:', err);
        const session = await InterviewSession.findById(sessionId);
        if (session) {
            session.status = 'failed';
            await session.save();
        }
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    }
};
