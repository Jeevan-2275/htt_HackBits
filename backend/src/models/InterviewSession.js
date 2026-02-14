const mongoose = require('mongoose');

const InterviewSessionSchema = new mongoose.Schema({
    promptId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserPrompt',
        required: false
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: false
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
    transcriptSegments: {
        type: [
            {
                start: Number,
                end: Number,
                text: String
            }
        ],
        default: []
    },
    clipAssetIds: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ClipAsset'
            }
        ],
        default: []
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
