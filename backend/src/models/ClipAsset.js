const mongoose = require('mongoose');

const ClipAssetSchema = new mongoose.Schema({
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InterviewSession',
        required: true
    },
    quote: {
        type: String,
        required: true
    },
    startTime: {
        type: Number,
        required: true
    },
    endTime: {
        type: Number,
        required: true
    },
    cloudinaryUrl: {
        type: String,
        required: true
    },
    subtitleUrl: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ClipAsset', ClipAssetSchema);
