const mongoose = require('mongoose');

const InterviewSessionSchema = new mongoose.Schema({
    promptId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserPrompt',
        required: false
    },
    questionSetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CampaignQuestionSet',
        required: false
    },
    questionIndex: {
        type: Number,
        default: 0
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
    },
    
    // Testimonial processing fields
    testimonialGenerated: {
        type: Boolean,
        default: false
    },
    videoUploadComplete: {
        type: Boolean,
        default: false
    },
    reelProcessed: {
        type: Boolean,
        default: false
    },
    testimonialSummary: {
        type: String,
        default: ''
    },
    reelCaption: {
        type: String,
        default: ''
    },
    reelDownloadUrl: {
        type: String,
        default: ''
    },
    highlights: {
        type: [
            {
                quote: String,
                start: Number,
                end: Number,
                confidence: Number
            }
        ],
        default: []
    },
    sentiment: {
        type: String,
        enum: ['positive', 'neutral', 'negative'],
        default: 'neutral'
    }
});

module.exports = mongoose.model('InterviewSession', InterviewSessionSchema);
