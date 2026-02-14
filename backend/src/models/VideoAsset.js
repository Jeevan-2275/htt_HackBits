const mongoose = require('mongoose');

const VideoAssetSchema = new mongoose.Schema({
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InterviewSession',
        required: true
    },
    cloudinaryUrl: {
        type: String,
        required: true
    },
    cloudinaryPublicId: String,
    format: String,
    duration: Number,
    isRaw: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('VideoAsset', VideoAssetSchema);
