const Groq = require("groq-sdk");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

let groq = null;
if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.startsWith("gsk_")) {
  groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
}

// Max chunk duration in seconds (Groq Whisper works best with chunks under 2 min)
const MAX_CHUNK_DURATION = 120;
const MIN_LONG_AUDIO_SECONDS = 60;
const MIN_TEXT_CHARS_FOR_LONG_AUDIO = 200;
const MIN_SEGMENTS_FOR_LONG_AUDIO = 5;

const transcribeAudio = async (filePath) => {
  try {
    if (!groq) {
      console.log("⚠️ Groq not configured, returning simulated transcript");
      return "The product was exceptionally intuitive and simplified our workflow dramatically. We saw immediate efficiency gains!";
    }
    const stats = fs.statSync(filePath);
    console.log(
      `Transcribing audio: ${filePath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`,
    );

    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-large-v3",
      language: "en",
    });

    console.log(`Transcription result: ${transcription.text.length} chars`);
    return transcription.text;
  } catch (error) {
    console.error("Groq Whisper Transcription Error:", error);
    return "The product was exceptionally intuitive and simplified our workflow dramatically. We saw immediate efficiency gains!";
  }
};

const transcribeChunk = async (filePath) => {
  if (!groq) {
    return {
      text: "The product was exceptionally intuitive and simplified our workflow dramatically. We saw immediate efficiency gains!",
      segments: [
        {
          start: 0,
          end: 4,
          text: "The product was exceptionally intuitive and simplified our workflow dramatically.",
        },
        {
          start: 4,
          end: 8,
          text: "We saw immediate efficiency gains!",
        },
      ],
    };
  }
  const transcription = await groq.audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model: "whisper-large-v3",
    language: "en",
    response_format: "verbose_json",
  });

  return {
    text: transcription.text || "",
    segments: Array.isArray(transcription.segments)
      ? transcription.segments.map((seg) => ({
          start: seg.start,
          end: seg.end,
          text: seg.text,
        }))
      : [],
  };
};

const transcribeAudioWithTimestamps = async (filePath, options = {}) => {
  try {
    const stats = fs.statSync(filePath);
    console.log(
      `Transcribing audio with timestamps: ${filePath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`,
    );

    const durationHint =
      typeof options.durationHint === "number" ? options.durationHint : 0;
    const forceChunking = options.forceChunking === true;

    // Try to get audio duration using ffmpeg
    let duration = 0;
    try {
      const ffmpegService = require("./ffmpegService");
      duration = await ffmpegService.getMediaDuration(filePath);
      console.log(`Audio duration: ${duration.toFixed(1)}s`);
    } catch (e) {
      console.log("Could not get duration, will transcribe as single file");
    }

    if (
      durationHint > 0 &&
      (duration === 0 || Math.abs(duration - durationHint) > 5)
    ) {
      console.log(`Using duration hint: ${durationHint.toFixed(1)}s`);
      duration = durationHint;
    }

    // If audio is short enough, transcribe in one shot
    if (!forceChunking && (duration <= MAX_CHUNK_DURATION || duration === 0)) {
      console.log("Transcribing as single file...");
      const result = await transcribeChunk(filePath);
      console.log(
        `Got ${result.segments.length} segments, ${result.text.length} chars`,
      );

      if (
        duration > MIN_LONG_AUDIO_SECONDS &&
        (result.text.length < MIN_TEXT_CHARS_FOR_LONG_AUDIO ||
          result.segments.length < MIN_SEGMENTS_FOR_LONG_AUDIO)
      ) {
        console.log(
          "Transcript looks too short for audio length, retrying with chunking...",
        );
        return transcribeAudioWithTimestamps(filePath, {
          durationHint,
          forceChunking: true,
        });
      }
      return result;
    }

    // For longer audio, split into chunks and transcribe each
    console.log(
      `Audio is ${duration.toFixed(1)}s — splitting into ${Math.ceil(duration / MAX_CHUNK_DURATION)} chunks...`,
    );
    const ffmpegService = require("./ffmpegService");
    const dir = path.dirname(filePath);
    const ext = path.extname(filePath);
    const baseName = path.basename(filePath, ext);

    let allText = "";
    let allSegments = [];
    let chunkIndex = 0;
    let offset = 0;

    while (offset < duration) {
      const chunkDuration = Math.min(MAX_CHUNK_DURATION, duration - offset);
      const chunkPath = path.join(dir, `${baseName}_chunk${chunkIndex}${ext}`);

      console.log(
        `[WHISPER] 🎙️ Processing Chunk ${chunkIndex + 1}... (${offset.toFixed(1)}s to ${(offset + chunkDuration).toFixed(1)}s)`,
      );
      await ffmpegService.splitAudio(
        filePath,
        offset,
        chunkDuration,
        chunkPath,
      );

      const chunkResult = await transcribeChunk(chunkPath);
      console.log(
        `[WHISPER] ✅ Chunk ${chunkIndex + 1} Done: ${chunkResult.text.substring(0, 30)}...`,
      );

      // Adjust segment timestamps to account for offset
      const adjustedSegments = chunkResult.segments.map((seg) => ({
        start: seg.start + offset,
        end: seg.end + offset,
        text: seg.text,
      }));

      allText += (allText ? " " : "") + chunkResult.text;
      allSegments = allSegments.concat(adjustedSegments);

      // Cleanup chunk file
      if (fs.existsSync(chunkPath)) fs.unlinkSync(chunkPath);

      console.log(
        `[WHISPER] 🧩 Merged Chunk ${chunkIndex + 1}. Current transcript length: ${allText.length} chars`,
      );

      offset += MAX_CHUNK_DURATION;
      chunkIndex++;
    }

    console.log(
      `[WHISPER] 🏁 TOTAL TRANSCRIPTION COMPLETE: ${allSegments.length} segments, ${allText.length} characters merged.`,
    );
    return { text: allText, segments: allSegments };
  } catch (error) {
    console.error("Groq Whisper Transcription Error:", error);
    throw error;
  }
};

module.exports = { transcribeAudio, transcribeAudioWithTimestamps };
