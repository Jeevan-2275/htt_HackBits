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

module.exports = { generateReel, processVertical };
