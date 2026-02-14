const mongoose = require('mongoose');

const InterviewSessionSchema = new mongoose.Schema({
    promptId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserPrompt',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'processing', 'failed'],
        default: 'active'
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: Date,
    transcript: {
        type: String,
        default: ''
    },
    // Metadata for the video processing pipeline
    videoAssetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VideoAsset'
    },
    reelAssetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ReelAsset'
    }
});

module.exports = mongoose.model('InterviewSession', InterviewSessionSchema);
