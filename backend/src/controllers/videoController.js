const VideoAsset = require("../models/VideoAsset");
const ReelAsset = require("../models/ReelAsset");
const InterviewSession = require("../models/InterviewSession");
const ffmpegService = require("../services/ffmpegService");
const highlightService = require("../services/highlightService");
const transcriptionService = require("../services/transcriptionService");
const ClipAsset = require("../models/ClipAsset");
const { uploadToCloudinary } = require("../config/cloudinary");
const fs = require("fs");
const path = require("path");
const https = require("https");

// Helper to download file
const downloadFile = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (response) => {
        response.pipe(file);
        file.on("finish", () => {
          file.close(resolve);
        });
      })
      .on("error", (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
  });
};

const formatSrtTimestamp = (seconds) => {
  const date = new Date(0);
  date.setSeconds(seconds);
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const secs = String(date.getUTCSeconds()).padStart(2, "0");
  const millis = String(Math.floor((seconds % 1) * 1000)).padStart(3, "0");
  return `${hours}:${minutes}:${secs},${millis}`;
};

const buildSrt = (segments, startTime, endTime) => {
  const filtered = segments.filter(
    (seg) => seg.end >= startTime && seg.start <= endTime,
  );
  return filtered
    .map((seg, idx) => {
      const start = Math.max(seg.start, startTime);
      const end = Math.min(seg.end, endTime);
      return [
        String(idx + 1),
        `${formatSrtTimestamp(start)} --> ${formatSrtTimestamp(end)}`,
        seg.text.trim(),
        "",
      ].join("\n");
    })
    .join("\n");
};

const findTimeRangeForQuote = (quote, segments) => {
  const normalizedQuote = quote
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
  const quoteWords = normalizedQuote.split(/\s+/).filter(Boolean);

  if (quoteWords.length === 0 || segments.length === 0)
    return { start: 0, end: 10 };

  let bestRange = { start: 0, end: 10 };
  let maxWordsFound = 0;
  let shortestDuration = Infinity;

  // Use a sliding window to find where the most words from the quote appear together
  // We limit the window to 10 consecutive segments to prevent runaway clips
  const WINDOW_SIZE = 10;

  for (let i = 0; i < segments.length; i++) {
    let wordsFoundInWindow = new Set();
    const windowEnd = Math.min(i + WINDOW_SIZE, segments.length);

    for (let j = i; j < windowEnd; j++) {
      const segText = segments[j].text.toLowerCase();
      quoteWords.forEach((word) => {
        if (segText.includes(word)) wordsFoundInWindow.add(word);
      });

      const currentScore = wordsFoundInWindow.size;
      const currentDuration = segments[j].end - segments[i].start;

      // If we find more words, or the same amount of words in a shorter time, it's a better match
      if (
        currentScore > maxWordsFound ||
        (currentScore === maxWordsFound && currentDuration < shortestDuration)
      ) {
        maxWordsFound = currentScore;
        shortestDuration = currentDuration;
        bestRange = {
          start: segments[i].start,
          end: segments[j].end,
        };
      }
    }
  }

  // Safety: If duration is > 30s for a single highlight, cap it (AI might have picked a huge range)
  if (bestRange.end - bestRange.start > 30) {
    bestRange.end = bestRange.start + 30;
  }

  return bestRange;
};

const isTranscriptTooShort = (durationSeconds, transcription) => {
  if (!durationSeconds || durationSeconds < 60) return false;
  const textLength =
    transcription && transcription.text ? transcription.text.length : 0;
  const segmentCount =
    transcription && Array.isArray(transcription.segments)
      ? transcription.segments.length
      : 0;
  const minChars = Math.floor(durationSeconds * 4);
  const minSegments = Math.max(6, Math.floor(durationSeconds / 15));
  return textLength < minChars || segmentCount < minSegments;
};

// @desc    Upload Raw Video for Session
// @route   POST /api/video/upload
exports.uploadRawVideo = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res
        .status(400)
        .json({ success: false, error: "sessionId is required" });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "No video file uploaded" });
    }

    const session = await InterviewSession.findById(sessionId);
    if (!session) {
      return res
        .status(404)
        .json({ success: false, error: "Session not found" });
    }

    const uploadResult = await uploadToCloudinary(
      req.file.path,
      "htt_hackbits/raw_videos",
    );

    const videoAsset = await VideoAsset.create({
      sessionId: session._id,
      cloudinaryUrl: uploadResult.secure_url,
      cloudinaryPublicId: uploadResult.public_id,
      format: uploadResult.format,
      duration: uploadResult.duration,
      isRaw: true,
    });

    session.videoAssetId = videoAsset._id;
    await session.save();

    fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      data: videoAsset,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Process Highlights + Clips for Session
// @route   POST /api/process/highlights
exports.processHighlightsForSession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await InterviewSession.findById(sessionId);
    if (!session) return res.status(404).json({ error: "Session not found" });

    (async () => {
      const tempDir = path.join("uploads", `temp_${sessionId}`);
      try {
        session.status = "processing";
        await session.save();

        const videoAsset = session.videoAssetId
          ? await VideoAsset.findById(session.videoAssetId)
          : await VideoAsset.findOne({ sessionId, isRaw: true }).sort({
              createdAt: -1,
            });

        if (!videoAsset) {
          console.log("No raw video asset to process");
          return;
        }

        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

        const localVideoPath = path.join(tempDir, `${videoAsset._id}.mp4`);
        await downloadFile(videoAsset.cloudinaryUrl, localVideoPath);

        let videoDuration = 0;
        try {
          videoDuration = await ffmpegService.getMediaDuration(localVideoPath);
          console.log(
            `[SESSION ${sessionId}] Video duration: ${videoDuration.toFixed(1)}s`,
          );
        } catch (err) {
          console.log(`[SESSION ${sessionId}] Video duration unavailable`);
        }

        const audioPath = path.join(tempDir, `audio_${sessionId}.mp3`);
        await ffmpegService.extractAudio(localVideoPath, audioPath);

        try {
          const audioDuration = await ffmpegService.getMediaDuration(audioPath);
          console.log(
            `[SESSION ${sessionId}] Audio duration: ${audioDuration.toFixed(1)}s`,
          );
        } catch (err) {
          console.log(`[SESSION ${sessionId}] Audio duration unavailable`);
        }

        let transcription =
          await transcriptionService.transcribeAudioWithTimestamps(audioPath, {
            durationHint: videoDuration,
            forceChunking: videoDuration >= 60,
          });

        if (isTranscriptTooShort(videoDuration, transcription)) {
          console.log(
            `[SESSION ${sessionId}] Transcript too short for video length, retrying with WAV...`,
          );
          const wavPath = path.join(tempDir, `audio_${sessionId}.wav`);
          await ffmpegService.extractAudioWav(localVideoPath, wavPath);
          transcription =
            await transcriptionService.transcribeAudioWithTimestamps(wavPath, {
              durationHint: videoDuration,
              forceChunking: true,
            });
        }
        session.transcript = transcription.text;
        session.transcriptSegments = transcription.segments;
        await session.save();

        const highlights = await highlightService.extractHighlights(
          transcription.text,
          transcription.segments,
        );

        const createdClips = [];
        const subtitledClipPaths = [];
        for (let i = 0; i < highlights.length; i += 1) {
          const highlight = highlights[i];
          const range =
            typeof highlight.start === "number" &&
            typeof highlight.end === "number"
              ? { start: highlight.start, end: highlight.end }
              : findTimeRangeForQuote(highlight.quote, transcription.segments);

          const clipPath = path.join(tempDir, `clip_${i + 1}.mp4`);
          await ffmpegService.trimClip(
            localVideoPath,
            range.start,
            range.end,
            clipPath,
          );

          const srtPath = path.join(tempDir, `clip_${i + 1}.srt`);
          const srtContent = buildSrt(
            transcription.segments,
            range.start,
            range.end,
          );
          fs.writeFileSync(srtPath, srtContent || "");

          const subtitledPath = path.join(
            tempDir,
            `clip_${i + 1}_subtitled.mp4`,
          );
          await ffmpegService.burnSubtitles(clipPath, srtPath, subtitledPath);
          subtitledClipPaths.push(subtitledPath);

          const uploadResult = await uploadToCloudinary(
            subtitledPath,
            "htt_hackbits/clips",
          );

          const clip = await ClipAsset.create({
            sessionId: session._id,
            quote: highlight.quote,
            startTime: range.start,
            endTime: range.end,
            cloudinaryUrl: uploadResult.secure_url,
          });

          createdClips.push(clip._id);
        }

        // Concatenate all clips into a single ~1 min highlight reel
        const reelPath = path.join(tempDir, `reel_final.mp4`);
        await ffmpegService.concatClips(subtitledClipPaths, reelPath);

        const reelUpload = await uploadToCloudinary(
          reelPath,
          "htt_hackbits/reels",
        );

        const reel = await ReelAsset.create({
          sessionId: session._id,
          cloudinaryUrl: reelUpload.secure_url,
          highlights: highlights.map((h) => h.quote),
          duration: reelUpload.duration,
        });

        session.clipAssetIds = createdClips;
        session.reelAssetId = reel._id;
        session.status = "completed";
        await session.save();

        fs.rmSync(tempDir, { recursive: true, force: true });
        console.log(`Highlights processed for session ${sessionId}`);
      } catch (err) {
        console.error("Highlight Processing Failed:", err);
        session.status = "failed";
        await session.save();
        if (fs.existsSync(tempDir)) {
          fs.rmSync(tempDir, { recursive: true, force: true });
        }
      }
    })();

    res.json({
      success: true,
      message: "Highlight processing started",
      jobId: sessionId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Generate Reel (Async Job Hook)
// @route   POST /api/process/reel
exports.generateReelForSession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await InterviewSession.findById(sessionId);
    if (!session) return res.status(404).json({ error: "Session not found" });

    // Async Processing Start
    // In a real app, this should be a queue (Bull/Redis).
    // Here we just fire and forget the async part, but in Serverless/Lambda this would fail.
    // For a hackathon server running locally/VPS, this works.

    (async () => {
      try {
        session.status = "processing";
        await session.save();

        const videoAssets = await VideoAsset.find({
          sessionId,
          isRaw: true,
        }).sort({ createdAt: 1 });

        if (videoAssets.length === 0) {
          console.log("No video assets to process");
          return;
        }

        // 1. Download all assets
        const downloadDir = path.join("uploads", "temp_" + sessionId);
        if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir);

        const downloadPaths = [];
        for (const asset of videoAssets) {
          const localPath = path.join(downloadDir, `${asset._id}.mp4`); // Assume proper ext
          await downloadFile(asset.cloudinaryUrl, localPath);
          downloadPaths.push(localPath);
        }

        // 2. Concatenate & Crop
        const outputPath = path.join("uploads", `reel_${sessionId}.mp4`);
        await ffmpegService.generateReel(downloadPaths, [], outputPath);

        // 3. Upload Reel
        const uploadResult = await uploadToCloudinary(
          outputPath,
          "htt_hackbits/reels",
        );

        // 4. Save ReelAsset
        const reel = await ReelAsset.create({
          sessionId,
          cloudinaryUrl: uploadResult.secure_url,
          duration: uploadResult.duration,
        });

        // 5. Update Session
        session.status = "completed";
        session.reelAssetId = reel._id;
        await session.save();

        // Cleanup
        fs.rmSync(downloadDir, { recursive: true, force: true });
        fs.unlinkSync(outputPath);
        console.log(`Reel processed for session ${sessionId}`);
      } catch (err) {
        console.error("Reel Processing Failed:", err);
        session.status = "failed";
        await session.save();
      }
    })();

    res.json({
      success: true,
      message: "Reel processing started",
      jobId: sessionId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
