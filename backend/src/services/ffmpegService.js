const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs");

// Ensure FFmpeg path is set (from .env or default)
if (process.env.FFMPEG_PATH) {
  ffmpeg.setFfmpegPath(process.env.FFMPEG_PATH);
}

// Create Reel from Assets
const generateReel = async (videoPaths, highlightSegments, outputPath) => {
  const absOutputPath = path.resolve(outputPath);
  return new Promise((resolve, reject) => {
    let command = ffmpeg();

    // Add inputs (video chunks)
    videoPaths.forEach((p) => {
      command = command.input(path.resolve(p));
    });

    // Complex filter graph for vertical crop and concatenation
    // This is a simplified version. Real reel generation needs serious filter magic.
    // We will just concat and crop to 9:16 for now.

    const complexFilter = [
      `[0:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2[v0]`, // Simple scaling to 1080x1920
      // In reality we'd concat multiple inputs. For Hackathon, let's assume we concat first then crop.
    ];

    // If multiple files, we need to concat using filter or mergeToFile
    // fluent-ffmpeg mergeToFile is easier for concatenation

    command
      .videoCodec("libx264")
      .audioCodec("aac")
      .outputOptions(["-pix_fmt yuv420p", "-movflags +faststart"])
      .on("error", (err) => {
        console.error("FFmpeg Error:", err);
        reject(err);
      })
      .on("end", () => {
        console.log("Reel created:", absOutputPath);
        resolve(absOutputPath);
      })
      .save(absOutputPath); // Using .save() for better control over codecs than mergeToFile

    // Note: mergeToFile doesn't easily allow complex filters per input.
    // For a demo, getting them joined is step 1.
  });
};

const processVertical = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .videoFilters("crop=ih*(9/16):ih") // Crop to 9:16 Center
      .on("error", reject)
      .on("end", () => resolve(outputPath))
      .save(outputPath);
  });
};

const extractAudio = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .noVideo()
      .audioCodec("libmp3lame")
      .audioChannels(1)
      .audioFrequency(16000)
      .audioBitrate("64k")
      .format("mp3")
      .on("error", (err) => reject(err))
      .on("end", () => {
        const stats = fs.statSync(outputPath);
        console.log(
          `Audio extracted: ${outputPath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`,
        );
        resolve(outputPath);
      })
      .save(outputPath);
  });
};

const extractAudioWav = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .noVideo()
      .audioCodec("pcm_s16le")
      .audioChannels(1)
      .audioFrequency(16000)
      .format("wav")
      .on("error", (err) => reject(err))
      .on("end", () => {
        const stats = fs.statSync(outputPath);
        console.log(
          `Audio extracted (WAV): ${outputPath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`,
        );
        resolve(outputPath);
      })
      .save(outputPath);
  });
};

const getMediaDuration = (inputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) return reject(err);
      resolve(metadata.format.duration || 0);
    });
  });
};

const getAudioDuration = (inputPath) => getMediaDuration(inputPath);

const splitAudio = (inputPath, startTime, duration, outputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .setStartTime(startTime)
      .setDuration(duration)
      .on("error", (err) => reject(err))
      .on("end", () => resolve(outputPath))
      .save(outputPath);
  });
};

const trimClip = (inputPath, startTime, endTime, outputPath) => {
  const duration = Math.max(0, endTime - startTime);

  return new Promise((resolve, reject) => {
    // We normalize everything to 30fps and 44.1kHz to ensure concat works smoothly
    ffmpeg(inputPath)
      .setStartTime(startTime)
      .setDuration(duration)
      .videoCodec("libx264")
      .audioCodec("aac")
      .outputOptions([
        "-pix_fmt yuv420p",
        "-map_metadata -1",
        "-reset_timestamps 1",
        "-avoid_negative_ts make_zero",
        "-x264opts keyint=30:min-keyint=30:scenecut=-1", // Forced keyframes for stability
      ])
      .videoFilters([
        "fps=30", // Strict Constant Frame Rate
        "setpts=PTS-STARTPTS",
      ])
      .audioFilters([
        "aresample=44100", // Ensure constant sample rate
        "asetpts=PTS-STARTPTS", // Normalize audio timestamps
      ])
      .on("error", (err) => reject(err))
      .on("end", () => resolve(outputPath))
      .save(outputPath);
  });
};

const escapeSubtitlePath = (filePath) => {
  return filePath.replace(/\\/g, "\\\\").replace(/:/g, "\\:");
};

const burnSubtitles = (inputPath, srtPath, outputPath) => {
  const escapedPath = escapeSubtitlePath(srtPath);
  const filter = `subtitles='${escapedPath}'`;

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .videoFilters(filter)
      .on("error", (err) => reject(err))
      .on("end", () => resolve(outputPath))
      .save(outputPath);
  });
};

const concatClips = (clipPaths, outputPath) => {
  return new Promise((resolve, reject) => {
    if (clipPaths.length === 0) return reject(new Error("No clips to concat"));
    if (clipPaths.length === 1) {
      fs.copyFileSync(path.resolve(clipPaths[0]), outputPath);
      return resolve(outputPath);
    }

    const absOutputPath = path.resolve(outputPath);
    let command = ffmpeg();

    // Add all inputs
    clipPaths.forEach((p) => {
      command = command.input(path.resolve(p));
    });

    // Build the concat filter: [0:v][0:a][1:v][1:a]...concat=n=N:v=1:a=1[v][a]
    const n = clipPaths.length;
    let filterString = "";
    for (let i = 0; i < n; i++) {
      // Pre-normalize each input stream just in case
      filterString += `[${i}:v]fps=30,setpts=PTS-STARTPTS[v${i}];`;
      filterString += `[${i}:a]aresample=44100,asetpts=PTS-STARTPTS[a${i}];`;
    }
    for (let i = 0; i < n; i++) {
      filterString += `[v${i}][a${i}]`;
    }
    filterString += `concat=n=${n}:v=1:a=1[v][a]`;

    console.log(
      `[FFMPEG] 🔗 Merging ${n} clips via strictly normalized concat filter...`,
    );

    command
      .complexFilter([filterString], ["v", "a"])
      .videoCodec("libx264")
      .audioCodec("aac")
      .outputOptions([
        "-pix_fmt yuv420p",
        "-movflags +faststart",
        "-vsync cfr", // COMPATIBILITY: Force Constant Frame Rate
        "-x264opts keyint=30:min-keyint=30:scenecut=-1",
      ])
      .on("error", (err) => {
        console.error("[FFMPEG] ❌ Concat Filter Error:", err);
        reject(err);
      })
      .on("end", () => {
        console.log("[FFMPEG] ✅ Ultra-Stable Reel created:", absOutputPath);
        resolve(absOutputPath);
      })
      .save(absOutputPath);
  });
};

module.exports = {
  generateReel,
  processVertical,
  extractAudio,
  extractAudioWav,
  trimClip,
  burnSubtitles,
  concatClips,
  getMediaDuration,
  getAudioDuration,
  splitAudio,
};
