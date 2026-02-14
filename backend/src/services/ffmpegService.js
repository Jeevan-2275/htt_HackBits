const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

// Ensure FFmpeg path is set (from .env or default)
if (process.env.FFMPEG_PATH) {
    ffmpeg.setFfmpegPath(process.env.FFMPEG_PATH);
}

// Create Reel from Assets
const generateReel = async (videoPaths, highlightSegments, outputPath) => {
    return new Promise((resolve, reject) => {
        let command = ffmpeg();

        // Add inputs (video chunks)
        videoPaths.forEach(p => {
            command = command.input(p);
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
            .on('error', (err) => {
                console.error('FFmpeg Error:', err);
                reject(err);
            })
            .on('end', () => {
                console.log('Reel created');
                resolve(outputPath);
            })
            .mergeToFile(outputPath, path.dirname(outputPath)); // mergeToFile handles concat

        // Note: mergeToFile doesn't easily allow complex filters per input. 
        // For a demo, getting them joined is step 1.
    });
};

const processVertical = (inputPath, outputPath) => {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .videoFilters('crop=ih*(9/16):ih') // Crop to 9:16 Center
            .on('error', reject)
            .on('end', () => resolve(outputPath))
            .save(outputPath);
    });
};

const extractAudio = (inputPath, outputPath) => {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .noVideo()
            .audioCodec('libmp3lame')
            .audioChannels(1)
            .audioFrequency(16000)
            .audioBitrate('64k')
            .format('mp3')
            .on('error', (err) => reject(err))
            .on('end', () => {
                const stats = fs.statSync(outputPath);
                console.log(`Audio extracted: ${outputPath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
                resolve(outputPath);
            })
            .save(outputPath);
    });
};

const extractAudioWav = (inputPath, outputPath) => {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .noVideo()
            .audioCodec('pcm_s16le')
            .audioChannels(1)
            .audioFrequency(16000)
            .format('wav')
            .on('error', (err) => reject(err))
            .on('end', () => {
                const stats = fs.statSync(outputPath);
                console.log(`Audio extracted (WAV): ${outputPath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
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
            .on('error', (err) => reject(err))
            .on('end', () => resolve(outputPath))
            .save(outputPath);
    });
};

const trimClip = (inputPath, startTime, endTime, outputPath) => {
    const duration = Math.max(0, endTime - startTime);

    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .setStartTime(startTime)
            .setDuration(duration)
            .on('error', (err) => reject(err))
            .on('end', () => resolve(outputPath))
            .save(outputPath);
    });
};

const escapeSubtitlePath = (filePath) => {
    return filePath.replace(/\\/g, '\\\\').replace(/:/g, '\\:');
};

const burnSubtitles = (inputPath, srtPath, outputPath) => {
    const escapedPath = escapeSubtitlePath(srtPath);
    const filter = `subtitles='${escapedPath}'`;

    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .videoFilters(filter)
            .on('error', (err) => reject(err))
            .on('end', () => resolve(outputPath))
            .save(outputPath);
    });
};

const concatClips = (clipPaths, outputPath) => {
    return new Promise((resolve, reject) => {
        if (clipPaths.length === 0) return reject(new Error('No clips to concat'));
        if (clipPaths.length === 1) {
            fs.copyFileSync(clipPaths[0], outputPath);
            return resolve(outputPath);
        }

        // Create a concat list file for FFmpeg
        const listPath = outputPath + '.txt';
        const listContent = clipPaths.map(p => `file '${p.replace(/\\/g, '/')}'`).join('\n');
        fs.writeFileSync(listPath, listContent);

        ffmpeg()
            .input(listPath)
            .inputOptions(['-f', 'concat', '-safe', '0'])
            .outputOptions(['-c', 'copy'])
            .on('error', (err) => {
                if (fs.existsSync(listPath)) fs.unlinkSync(listPath);
                reject(err);
            })
            .on('end', () => {
                if (fs.existsSync(listPath)) fs.unlinkSync(listPath);
                resolve(outputPath);
            })
            .save(outputPath);
    });
};

module.exports = { generateReel, processVertical, extractAudio, extractAudioWav, trimClip, burnSubtitles, concatClips, getMediaDuration, getAudioDuration, splitAudio };
