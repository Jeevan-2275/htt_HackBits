const mongoose = require('mongoose');

const ReelAssetSchema = new mongoose.Schema({
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InterviewSession',
        required: true
    },
    cloudinaryUrl: {
        type: String,
        required: true
    },
    highlights: [String], // List of highlight tags or segments used
    duration: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ReelAsset', ReelAssetSchema);
